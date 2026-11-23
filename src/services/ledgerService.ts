import { User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  DEFAULT_MONTH_BN,
  DEFAULT_MONTH_EN,
  INITIAL_NOV_2026_BAZAR,
  INITIAL_NOV_2026_MEMBERS,
} from '../data/initialNov2026';
import { OperationType, db, handleFirestoreError } from '../firebase';
import {
  BazarDayRecord,
  CalculatedMemberRow,
  ChefRule,
  LedgerMeta,
  MemberRecord,
} from '../types/mess';

function sanitizeId(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 120) || 'item';
}

export async function upsertUserProfile(user: User): Promise<void> {
  const path = `users/${user.uid}`;
  try {
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    const displayName = (user.displayName || 'Mess Manager').slice(0, 80);
    const photoURL = user.photoURL ? user.photoURL.slice(0, 500) : undefined;

    if (!snap.exists()) {
      const payload: Record<string, unknown> = {
        displayName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      if (photoURL) payload.photoURL = photoURL;
      await setDoc(ref, payload);
    } else {
      const payload: Record<string, unknown> = {
        displayName,
        updatedAt: serverTimestamp(),
      };
      if (photoURL) payload.photoURL = photoURL;
      await updateDoc(ref, payload);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchUserLedgers(uid: string): Promise<LedgerMeta[]> {
  const path = 'ledgers';
  try {
    const q = query(collection(db, 'ledgers'), where('ownerId', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ownerId: String(data.ownerId || uid),
        monthBn: String(data.monthBn || DEFAULT_MONTH_BN),
        monthEn: String(data.monthEn || DEFAULT_MONTH_EN),
        chefRule: data.chefRule === 'proportional' ? 'proportional' : 'equal',
        globalFeastTotal: Number(data.globalFeastTotal) || 0,
        daysCount: Number(data.daysCount) || 30,
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function seedLedgerBatch(
  uid: string,
  ledgerId: string,
  meta: {
    monthBn: string;
    monthEn: string;
    chefRule: ChefRule;
    globalFeastTotal: number;
    daysCount: number;
  },
  members: MemberRecord[],
  bazar: BazarDayRecord[]
): Promise<void> {
  const safeLedgerId = sanitizeId(ledgerId);
  const path = `ledgers/${safeLedgerId}`;
  try {
    const batch = writeBatch(db);
    const ledgerRef = doc(db, 'ledgers', safeLedgerId);

    batch.set(ledgerRef, {
      ownerId: uid,
      monthBn: meta.monthBn.slice(0, 64),
      monthEn: meta.monthEn.slice(0, 64),
      chefRule: meta.chefRule,
      globalFeastTotal: Math.max(0, Number(meta.globalFeastTotal) || 0),
      daysCount: Math.min(31, Math.max(28, Math.round(meta.daysCount || 30))),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    members.forEach((m, index) => {
      const mId = sanitizeId(m.id);
      const memberRef = doc(db, 'ledgers', safeLedgerId, 'members', mId);
      const boundedDailyMeals = Array.from({ length: meta.daysCount }, (_, d) => {
        const val = Number(m.dailyMeals[d]);
        return Number.isFinite(val) && val >= 0 ? val : 0;
      });
      batch.set(memberRef, {
        ownerId: uid,
        ledgerId: safeLedgerId,
        name: (m.name || `Member ${index + 1}`).slice(0, 80),
        prev: Number.isFinite(m.prev) ? Number(m.prev) : 0,
        deposit: Math.max(0, Number(m.deposit) || 0),
        mealQty: Math.max(0, Number(m.mealQty) || 0),
        feastCost: Math.max(0, Number(m.feastCost) || 0),
        isChef: Boolean(m.isChef),
        sortOrder: Number.isInteger(m.sortOrder) ? m.sortOrder : index + 1,
        dailyMeals: boundedDailyMeals,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });

    bazar.forEach((b, index) => {
      const dayNum = Math.min(31, Math.max(1, Math.round(b.day || index + 1)));
      const dId = sanitizeId(b.id || `day-${String(dayNum).padStart(2, '0')}`);
      const bazarRef = doc(db, 'ledgers', safeLedgerId, 'bazarDays', dId);
      batch.set(bazarRef, {
        ownerId: uid,
        ledgerId: safeLedgerId,
        day: dayNum,
        date: (b.date || `${String(dayNum).padStart(2, '0')}/11/2026`).slice(0, 20),
        cost: Math.max(0, Number(b.cost) || 0),
        note: (b.note || '').slice(0, 200),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function seedDefaultNov2026Ledger(uid: string): Promise<string> {
  const ledgerId = `nov-2026-${uid.slice(0, 10)}`;
  await seedLedgerBatch(
    uid,
    ledgerId,
    {
      monthBn: DEFAULT_MONTH_BN,
      monthEn: DEFAULT_MONTH_EN,
      chefRule: 'equal',
      globalFeastTotal: 0,
      daysCount: 30,
    },
    INITIAL_NOV_2026_MEMBERS,
    INITIAL_NOV_2026_BAZAR
  );
  return ledgerId;
}

export async function resetLedgerToOriginalNov2026(uid: string, ledgerId: string): Promise<void> {
  const path = `ledgers/${ledgerId}`;
  try {
    const existingMembers = await getDocs(
      query(collection(db, 'ledgers', ledgerId, 'members'), where('ownerId', '==', uid))
    );
    const existingBazar = await getDocs(
      query(collection(db, 'ledgers', ledgerId, 'bazarDays'), where('ownerId', '==', uid))
    );

    const batch = writeBatch(db);
    existingMembers.docs.forEach((d) => batch.delete(d.ref));
    existingBazar.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();

    await seedLedgerBatch(
      uid,
      ledgerId,
      {
        monthBn: DEFAULT_MONTH_BN,
        monthEn: DEFAULT_MONTH_EN,
        chefRule: 'equal',
        globalFeastTotal: 0,
        daysCount: 30,
      },
      INITIAL_NOV_2026_MEMBERS,
      INITIAL_NOV_2026_BAZAR
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateLedgerMeta(
  ledgerId: string,
  updates: Partial<Pick<LedgerMeta, 'monthBn' | 'monthEn' | 'chefRule' | 'globalFeastTotal' | 'daysCount'>>
): Promise<void> {
  const path = `ledgers/${ledgerId}`;
  try {
    const payload: Record<string, unknown> = { updatedAt: serverTimestamp() };
    if (updates.monthBn !== undefined) payload.monthBn = updates.monthBn.slice(0, 64) || DEFAULT_MONTH_BN;
    if (updates.monthEn !== undefined) payload.monthEn = updates.monthEn.slice(0, 64) || DEFAULT_MONTH_EN;
    if (updates.chefRule !== undefined) payload.chefRule = updates.chefRule;
    if (updates.globalFeastTotal !== undefined) {
      payload.globalFeastTotal = Math.max(0, Number(updates.globalFeastTotal) || 0);
    }
    if (updates.daysCount !== undefined) {
      payload.daysCount = Math.min(31, Math.max(28, Math.round(updates.daysCount)));
    }
    await updateDoc(doc(db, 'ledgers', ledgerId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function updateMemberDoc(
  ledgerId: string,
  memberId: string,
  updates: Partial<Omit<MemberRecord, 'id'>>
): Promise<void> {
  const path = `ledgers/${ledgerId}/members/${memberId}`;
  try {
    const payload: Record<string, unknown> = { updatedAt: serverTimestamp() };
    if (updates.name !== undefined) payload.name = (updates.name.trim() || 'Member').slice(0, 80);
    if (updates.prev !== undefined) payload.prev = Number.isFinite(updates.prev) ? updates.prev : 0;
    if (updates.deposit !== undefined) payload.deposit = Math.max(0, Number(updates.deposit) || 0);
    if (updates.mealQty !== undefined) payload.mealQty = Math.max(0, Number(updates.mealQty) || 0);
    if (updates.feastCost !== undefined) payload.feastCost = Math.max(0, Number(updates.feastCost) || 0);
    if (updates.isChef !== undefined) payload.isChef = Boolean(updates.isChef);
    if (updates.sortOrder !== undefined) payload.sortOrder = Math.round(updates.sortOrder);
    if (updates.dailyMeals !== undefined) {
      payload.dailyMeals = updates.dailyMeals
        .slice(0, 31)
        .map((v) => (Number.isFinite(v) && v >= 0 ? v : 0));
    }
    await updateDoc(doc(db, 'ledgers', ledgerId, 'members', memberId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function addMemberDoc(
  uid: string,
  ledgerId: string,
  member: MemberRecord
): Promise<void> {
  const mId = sanitizeId(member.id);
  const path = `ledgers/${ledgerId}/members/${mId}`;
  try {
    await setDoc(doc(db, 'ledgers', ledgerId, 'members', mId), {
      ownerId: uid,
      ledgerId,
      name: (member.name.trim() || 'Member').slice(0, 80),
      prev: Number.isFinite(member.prev) ? member.prev : 0,
      deposit: Math.max(0, Number(member.deposit) || 0),
      mealQty: Math.max(0, Number(member.mealQty) || 0),
      feastCost: Math.max(0, Number(member.feastCost) || 0),
      isChef: Boolean(member.isChef),
      sortOrder: Math.round(member.sortOrder),
      dailyMeals: member.dailyMeals.slice(0, 31).map((v) => (Number.isFinite(v) && v >= 0 ? v : 0)),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteMemberDoc(ledgerId: string, memberId: string): Promise<void> {
  const path = `ledgers/${ledgerId}/members/${memberId}`;
  try {
    await deleteDoc(doc(db, 'ledgers', ledgerId, 'members', memberId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function updateBazarDayDoc(
  ledgerId: string,
  dayId: string,
  updates: Partial<Pick<BazarDayRecord, 'date' | 'cost' | 'note'>>
): Promise<void> {
  const path = `ledgers/${ledgerId}/bazarDays/${dayId}`;
  try {
    const payload: Record<string, unknown> = { updatedAt: serverTimestamp() };
    if (updates.date !== undefined) payload.date = updates.date.slice(0, 20);
    if (updates.cost !== undefined) payload.cost = Math.max(0, Number(updates.cost) || 0);
    if (updates.note !== undefined) payload.note = updates.note.slice(0, 200);
    await updateDoc(doc(db, 'ledgers', ledgerId, 'bazarDays', dayId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function batchUpdateMembers(
  ledgerId: string,
  updates: Array<{ id: string; fields: Partial<Omit<MemberRecord, 'id'>> }>
): Promise<void> {
  const path = `ledgers/${ledgerId}/members`;
  try {
    const batch = writeBatch(db);
    updates.forEach(({ id, fields }) => {
      const payload: Record<string, unknown> = { updatedAt: serverTimestamp() };
      if (fields.mealQty !== undefined) payload.mealQty = Math.max(0, Number(fields.mealQty) || 0);
      if (fields.feastCost !== undefined) payload.feastCost = Math.max(0, Number(fields.feastCost) || 0);
      if (fields.dailyMeals !== undefined) {
        payload.dailyMeals = fields.dailyMeals
          .slice(0, 31)
          .map((v) => (Number.isFinite(v) && v >= 0 ? v : 0));
      }
      batch.update(doc(db, 'ledgers', ledgerId, 'members', id), payload);
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function createCarryForwardMonthLedger(
  uid: string,
  newMonthBn: string,
  newMonthEn: string,
  monthNum: number,
  yearNum: number,
  daysCount: number,
  currentRows: CalculatedMemberRow[],
  chefRule: ChefRule
): Promise<string> {
  const ledgerId = `ledger-${yearNum}-${String(monthNum).padStart(2, '0')}-${Date.now().toString(36)}`;
  const emptyMeals = () => Array.from({ length: daysCount }, () => 0);

  const nextMembers: MemberRecord[] = currentRows.map((r, idx) => ({
    id: r.id,
    name: r.name,
    prev: Number(r.netBalance.toFixed(2)),
    deposit: 0,
    mealQty: 0,
    feastCost: 0,
    isChef: r.isChef,
    sortOrder: r.sortOrder || idx + 1,
    dailyMeals: emptyMeals(),
  }));

  const nextBazar: BazarDayRecord[] = Array.from({ length: daysCount }, (_, i) => {
    const day = i + 1;
    return {
      id: `day-${String(day).padStart(2, '0')}`,
      day,
      date: `${String(day).padStart(2, '0')}/${String(monthNum).padStart(2, '0')}/${yearNum}`,
      cost: 0,
      note: '',
    };
  });

  await seedLedgerBatch(
    uid,
    ledgerId,
    {
      monthBn: newMonthBn,
      monthEn: newMonthEn,
      chefRule,
      globalFeastTotal: 0,
      daysCount,
    },
    nextMembers,
    nextBazar
  );

  return ledgerId;
}
