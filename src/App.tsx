import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { DailyBazarView } from './components/DailyBazarView';
import { DailyMealChartView } from './components/DailyMealChartView';
import { KpiStrip } from './components/KpiStrip';
import { MainSheetView } from './components/MainSheetView';
import { AddMemberModal, NewMonthModal, ResetModal } from './components/Modals';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PrintReportTemplate } from './components/PrintReportTemplate';
import { SettingsView } from './components/SettingsView';
import { TopBar } from './components/TopBar';
import { WorkspaceToolbar } from './components/WorkspaceToolbar';
import { I18N } from './data/i18n';
import {
  DEFAULT_MONTH_BN,
  DEFAULT_MONTH_EN,
  INITIAL_NOV_2026_BAZAR,
  INITIAL_NOV_2026_MEMBERS,
} from './data/initialNov2026';
import { OperationType, auth, db, googleProvider, handleFirestoreError } from './firebase';
import {
  addMemberDoc,
  batchUpdateMembers,
  createCarryForwardMonthLedger,
  deleteMemberDoc,
  fetchUserLedgers,
  resetLedgerToOriginalNov2026,
  seedDefaultNov2026Ledger,
  seedLedgerBatch,
  updateBazarDayDoc,
  updateLedgerMeta,
  updateMemberDoc,
  upsertUserProfile,
} from './services/ledgerService';
import {
  BazarDayRecord,
  ChefRule,
  Language,
  LedgerMeta,
  MemberRecord,
  TabKey,
} from './types/mess';
import { calculateLedger } from './utils/calculations';
import {
  downloadJsonBackup,
  downloadVectorPDF,
  exportExcelWorkbook,
  validateBackupPayload,
} from './utils/exporters';

const LOCAL_STORAGE_KEY = 'mess_manager_nov_2026_v1';

interface LocalSnapshot {
  lang: Language;
  monthBn: string;
  monthEn: string;
  chefRule: ChefRule;
  globalFeastTotal: number;
  daysCount: number;
  members: MemberRecord[];
  bazar: BazarDayRecord[];
}

function loadLocalSnapshot(): LocalSnapshot {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LocalSnapshot>;
      if (Array.isArray(parsed.members) && Array.isArray(parsed.bazar)) {
        return {
          lang: parsed.lang === 'en' ? 'en' : 'bn',
          monthBn: parsed.monthBn || DEFAULT_MONTH_BN,
          monthEn: parsed.monthEn || DEFAULT_MONTH_EN,
          chefRule: parsed.chefRule === 'proportional' ? 'proportional' : 'equal',
          globalFeastTotal: Number(parsed.globalFeastTotal) || 0,
          daysCount: Number(parsed.daysCount) || 30,
          members: parsed.members,
          bazar: parsed.bazar,
        };
      }
    }
  } catch {
    // Fallback to initial Nov 2026 dataset
  }
  return {
    lang: 'bn',
    monthBn: DEFAULT_MONTH_BN,
    monthEn: DEFAULT_MONTH_EN,
    chefRule: 'equal',
    globalFeastTotal: 0,
    daysCount: 30,
    members: INITIAL_NOV_2026_MEMBERS,
    bazar: INITIAL_NOV_2026_BAZAR,
  };
}

export default function App() {
  const initialLocal = useMemo(() => loadLocalSnapshot(), []);

  const [lang, setLang] = useState<Language>(initialLocal.lang);
  const [activeTab, setActiveTab] = useState<TabKey>('main');

  // Auth & Firestore sync state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cloudLoading, setCloudLoading] = useState(false);
  const [ledgers, setLedgers] = useState<LedgerMeta[]>([]);
  const [activeLedgerId, setActiveLedgerId] = useState<string>('');

  // Active Ledger State (hydrated from localStorage when signed out, or Firestore when signed in)
  const [monthBn, setMonthBn] = useState<string>(initialLocal.monthBn);
  const [monthEn, setMonthEn] = useState<string>(initialLocal.monthEn);
  const [chefRule, setChefRule] = useState<ChefRule>(initialLocal.chefRule);
  const [globalFeastTotal, setGlobalFeastTotal] = useState<number>(initialLocal.globalFeastTotal);
  const [daysCount, setDaysCount] = useState<number>(initialLocal.daysCount);
  const [members, setMembers] = useState<MemberRecord[]>(initialLocal.members);
  const [bazar, setBazar] = useState<BazarDayRecord[]>(initialLocal.bazar);

  // Modals & Toast
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [newMonthOpen, setNewMonthOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; isError: boolean } | null>(null);

  const t = I18N[lang];
  const monthLabel = lang === 'bn' ? monthBn : monthEn;

  const showToast = useCallback((msg: string, isError = false) => {
    setToast({ msg, isError });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // Persist local mode edits cleanly to localStorage
  useEffect(() => {
    if (user) return;
    try {
      const snap: LocalSnapshot = {
        lang,
        monthBn,
        monthEn,
        chefRule,
        globalFeastTotal,
        daysCount,
        members,
        bazar,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(snap));
    } catch {
      // Ignore storage quota issues
    }
  }, [user, lang, monthBn, monthEn, chefRule, globalFeastTotal, daysCount, members, bazar]);

  // Keep document lang synchronized
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Auth listener & initial cloud ledger bootstrap
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);

      if (!nextUser) {
        setLedgers([]);
        setActiveLedgerId('');
        const local = loadLocalSnapshot();
        setMonthBn(local.monthBn);
        setMonthEn(local.monthEn);
        setChefRule(local.chefRule);
        setGlobalFeastTotal(local.globalFeastTotal);
        setDaysCount(local.daysCount);
        setMembers(local.members);
        setBazar(local.bazar);
        return;
      }

      setCloudLoading(true);
      try {
        await upsertUserProfile(nextUser);
        let userLedgers = await fetchUserLedgers(nextUser.uid);
        if (userLedgers.length === 0) {
          await seedDefaultNov2026Ledger(nextUser.uid);
          userLedgers = await fetchUserLedgers(nextUser.uid);
        }
        setLedgers(userLedgers);
        if (userLedgers.length > 0) {
          setActiveLedgerId((prev) =>
            userLedgers.some((l) => l.id === prev) ? prev : userLedgers[0].id
          );
        }
      } finally {
        setCloudLoading(false);
      }
    });

    return () => unsub();
  }, []);

  // Real-time Firestore listeners for active ledger, members, and bazarDays
  useEffect(() => {
    if (!user || !activeLedgerId) return;

    const ledgerPath = `ledgers/${activeLedgerId}`;
    const membersPath = `ledgers/${activeLedgerId}/members`;
    const bazarPath = `ledgers/${activeLedgerId}/bazarDays`;

    const unsubLedger = onSnapshot(
      doc(db, 'ledgers', activeLedgerId),
      (snap) => {
        if (!snap.exists()) return;
        const data = snap.data();
        setMonthBn(String(data.monthBn || DEFAULT_MONTH_BN));
        setMonthEn(String(data.monthEn || DEFAULT_MONTH_EN));
        setChefRule(data.chefRule === 'proportional' ? 'proportional' : 'equal');
        setGlobalFeastTotal(Number(data.globalFeastTotal) || 0);
        setDaysCount(Number(data.daysCount) || 30);
      },
      (error) => handleFirestoreError(error, OperationType.GET, ledgerPath)
    );

    const membersQuery = query(
      collection(db, 'ledgers', activeLedgerId, 'members'),
      where('ownerId', '==', user.uid)
    );
    const unsubMembers = onSnapshot(
      membersQuery,
      (snap) => {
        const nextMembers: MemberRecord[] = snap.docs
          .map((d) => {
            const data = d.data();
            const rawDaily = Array.isArray(data.dailyMeals) ? data.dailyMeals : [];
            return {
              id: d.id,
              name: String(data.name || ''),
              prev: Number(data.prev) || 0,
              deposit: Number(data.deposit) || 0,
              mealQty: Number(data.mealQty) || 0,
              feastCost: Number(data.feastCost) || 0,
              isChef: Boolean(data.isChef),
              sortOrder: Number(data.sortOrder) || 0,
              dailyMeals: rawDaily.map((v: unknown) => Number(v) || 0),
            };
          })
          .sort((a, b) => a.sortOrder - b.sortOrder);
        setMembers(nextMembers);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, membersPath)
    );

    const bazarQuery = query(
      collection(db, 'ledgers', activeLedgerId, 'bazarDays'),
      where('ownerId', '==', user.uid)
    );
    const unsubBazar = onSnapshot(
      bazarQuery,
      (snap) => {
        const nextBazar: BazarDayRecord[] = snap.docs
          .map((d) => {
            const data = d.data();
            return {
              id: d.id,
              day: Number(data.day) || 1,
              date: String(data.date || ''),
              cost: Number(data.cost) || 0,
              note: String(data.note || ''),
            };
          })
          .sort((a, b) => a.day - b.day);
        setBazar(nextBazar);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, bazarPath)
    );

    return () => {
      unsubLedger();
      unsubMembers();
      unsubBazar();
    };
  }, [user, activeLedgerId]);

  const calc = useMemo(
    () => calculateLedger(members, bazar, chefRule),
    [members, bazar, chefRule]
  );

  // ==================== HANDLERS ====================

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign-in failed.';
      showToast(message, true);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleUpdateMember = async (
    memberId: string,
    updates: Partial<Omit<MemberRecord, 'id'>>
  ) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, ...updates } : m))
    );
    if (user && activeLedgerId) {
      await updateMemberDoc(activeLedgerId, memberId, updates);
    }
  };

  const handleAddMember = async (data: {
    name: string;
    prev: number;
    deposit: number;
    isChef: boolean;
  }) => {
    const maxOrder = members.reduce((max, m) => Math.max(max, m.sortOrder), 0);
    const newMember: MemberRecord = {
      id: `m-${Date.now().toString(36)}`,
      name: data.name,
      prev: data.prev,
      deposit: data.deposit,
      mealQty: 0,
      feastCost: 0,
      isChef: data.isChef,
      sortOrder: maxOrder + 1,
      dailyMeals: Array.from({ length: daysCount }, () => 0),
    };
    setMembers((prev) => [...prev, newMember]);
    if (user && activeLedgerId) {
      await addMemberDoc(user.uid, activeLedgerId, newMember);
    }
    showToast(t.toastSaved);
  };

  const handleDeleteMember = async (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    if (user && activeLedgerId) {
      await deleteMemberDoc(activeLedgerId, memberId);
    }
    showToast(t.toastSaved);
  };

  const handleUpdateBazar = async (
    dayId: string,
    updates: Partial<Pick<BazarDayRecord, 'cost' | 'note'>>
  ) => {
    setBazar((prev) => prev.map((b) => (b.id === dayId ? { ...b, ...updates } : b)));
    if (user && activeLedgerId) {
      await updateBazarDayDoc(activeLedgerId, dayId, updates);
    }
  };

  const handleApplyGlobalFeast = async (total: number) => {
    const cleanTotal = Math.max(0, total);
    setGlobalFeastTotal(cleanTotal);
    const nonChef = members.filter((m) => !m.isChef);
    const active = nonChef.filter((m) => m.mealQty > 0);
    const targets = active.length > 0 ? active : nonChef;
    const perMember = targets.length > 0 ? cleanTotal / targets.length : 0;
    const targetIds = new Set(targets.map((m) => m.id));

    const updatedMembers = members.map((m) => ({
      ...m,
      feastCost: targetIds.has(m.id) ? Number(perMember.toFixed(2)) : 0,
    }));
    setMembers(updatedMembers);

    if (user && activeLedgerId) {
      await updateLedgerMeta(activeLedgerId, { globalFeastTotal: cleanTotal });
      await batchUpdateMembers(
        activeLedgerId,
        updatedMembers.map((m) => ({ id: m.id, fields: { feastCost: m.feastCost } }))
      );
    }
    showToast(t.toastFeastApplied);
  };

  const handleUpdateDayMeal = async (memberId: string, dayIndex: number, value: number) => {
    const clean = Math.max(0, value);
    const targetMember = members.find((m) => m.id === memberId);
    if (!targetMember) return;
    const nextDailyMeals = Array.from(
      { length: daysCount },
      (_, i) => Number(targetMember.dailyMeals[i]) || 0
    );
    nextDailyMeals[dayIndex] = clean;

    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, dailyMeals: nextDailyMeals } : m))
    );
    if (user && activeLedgerId) {
      await updateMemberDoc(activeLedgerId, memberId, { dailyMeals: nextDailyMeals });
    }
  };

  const handleFillSampleMeals = async () => {
    const updated = members.map((m, mIdx) => {
      const sample = Array.from({ length: daysCount }, (_, dIdx) => {
        if (m.isChef) return 2;
        if (dIdx >= 20) return 0;
        return (mIdx + dIdx) % 5 === 0 ? 1 : 2;
      });
      return { ...m, dailyMeals: sample };
    });
    setMembers(updated);
    if (user && activeLedgerId) {
      await batchUpdateMembers(
        activeLedgerId,
        updated.map((m) => ({ id: m.id, fields: { dailyMeals: m.dailyMeals } }))
      );
    }
    showToast(t.toastSampleFilled);
  };

  const handleSyncMealsToMain = async () => {
    const updated = members.map((m) => {
      const sum = Array.from({ length: daysCount }, (_, i) => Number(m.dailyMeals[i]) || 0).reduce(
        (a, b) => a + b,
        0
      );
      return { ...m, mealQty: Number(sum.toFixed(2)) };
    });
    setMembers(updated);
    if (user && activeLedgerId) {
      await batchUpdateMembers(
        activeLedgerId,
        updated.map((m) => ({ id: m.id, fields: { mealQty: m.mealQty } }))
      );
    }
    setActiveTab('main');
    showToast(t.toastMealsSynced);
  };

  const handleUpdateSettings = async (updates: {
    monthBn?: string;
    monthEn?: string;
    chefRule?: ChefRule;
  }) => {
    if (updates.monthBn !== undefined) setMonthBn(updates.monthBn);
    if (updates.monthEn !== undefined) setMonthEn(updates.monthEn);
    if (updates.chefRule !== undefined) setChefRule(updates.chefRule);

    if (user && activeLedgerId) {
      await updateLedgerMeta(activeLedgerId, updates);
      setLedgers((prev) =>
        prev.map((l) => (l.id === activeLedgerId ? { ...l, ...updates } : l))
      );
    }
    showToast(t.toastSaved);
  };

  const handleResetToOriginal = async () => {
    setMonthBn(DEFAULT_MONTH_BN);
    setMonthEn(DEFAULT_MONTH_EN);
    setChefRule('equal');
    setGlobalFeastTotal(0);
    setDaysCount(30);
    setMembers(INITIAL_NOV_2026_MEMBERS);
    setBazar(INITIAL_NOV_2026_BAZAR);

    if (user && activeLedgerId) {
      await resetLedgerToOriginalNov2026(user.uid, activeLedgerId);
    }
    showToast(t.toastResetDone);
  };

  const handleCreateNewMonth = async (data: {
    monthBn: string;
    monthEn: string;
    monthNum: number;
    yearNum: number;
    daysCount: number;
  }) => {
    if (!user) return;
    setCloudLoading(true);
    try {
      const newId = await createCarryForwardMonthLedger(
        user.uid,
        data.monthBn,
        data.monthEn,
        data.monthNum,
        data.yearNum,
        data.daysCount,
        calc.rows,
        chefRule
      );
      const updatedLedgers = await fetchUserLedgers(user.uid);
      setLedgers(updatedLedgers);
      setActiveLedgerId(newId);
      setActiveTab('main');
      showToast(t.toastNewMonthCreated);
    } finally {
      setCloudLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    downloadVectorPDF(calc, bazar, monthEn);
    showToast(t.toastPdfDone);
  };

  const handleExportExcel = () => {
    exportExcelWorkbook(calc, bazar, members, monthEn, daysCount);
    showToast(t.toastExcelDone);
  };

  const handleDownloadBackup = () => {
    downloadJsonBackup({
      version: 1,
      monthBn,
      monthEn,
      chefRule,
      globalFeastTotal,
      daysCount,
      members,
      bazar,
    });
    showToast(t.toastBackupDone);
  };

  const handleRestoreBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const parsed = JSON.parse(String(e.target?.result || ''));
        const validated = validateBackupPayload(parsed);
        if (!validated) {
          showToast(t.toastRestoreError, true);
          return;
        }
        setMonthBn(validated.monthBn);
        setMonthEn(validated.monthEn);
        setChefRule(validated.chefRule);
        setGlobalFeastTotal(validated.globalFeastTotal);
        setDaysCount(validated.daysCount);
        setMembers(validated.members);
        setBazar(validated.bazar);

        if (user && activeLedgerId) {
          await seedLedgerBatch(
            user.uid,
            activeLedgerId,
            {
              monthBn: validated.monthBn,
              monthEn: validated.monthEn,
              chefRule: validated.chefRule,
              globalFeastTotal: validated.globalFeastTotal,
              daysCount: validated.daysCount,
            },
            validated.members,
            validated.bazar
          );
        }
        showToast(t.toastRestoreDone);
      } catch {
        showToast(t.toastRestoreError, true);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <div id="app-shell" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <TopBar
          t={t}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          user={user}
          authLoading={authLoading}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
        />

        <WorkspaceToolbar
          t={t}
          lang={lang}
          monthLabel={monthLabel}
          ledgers={ledgers}
          activeLedgerId={activeLedgerId}
          isCloudSynced={Boolean(user)}
          onSelectLedger={setActiveLedgerId}
          onOpenNewMonth={() => setNewMonthOpen(true)}
          onToggleLanguage={() => setLang((prev) => (prev === 'bn' ? 'en' : 'bn'))}
          onDownloadPdf={handleDownloadPdf}
          onExportExcel={handleExportExcel}
          onPrint={() => window.print()}
          onOpenReset={() => setResetOpen(true)}
        />

        <KpiStrip t={t} calc={calc} />

        <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-4 flex-1">
          {cloudLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-12 bg-slate-900 border border-slate-800 rounded-xl" />
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                <div className="xl:col-span-9 h-[520px] bg-slate-900 border border-slate-800 rounded-xl" />
                <div className="xl:col-span-3 h-[520px] bg-slate-900 border border-slate-800 rounded-xl" />
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'main' && (
                <MainSheetView
                  t={t}
                  calc={calc}
                  bazar={bazar}
                  globalFeastTotal={globalFeastTotal}
                  monthLabel={monthLabel}
                  onUpdateMember={handleUpdateMember}
                  onDeleteMember={handleDeleteMember}
                  onOpenAddMember={() => setAddMemberOpen(true)}
                  onUpdateBazarCost={(dayId, cost) => handleUpdateBazar(dayId, { cost })}
                  onApplyGlobalFeast={handleApplyGlobalFeast}
                  onViewAllBazar={() => setActiveTab('bazar')}
                />
              )}

              {activeTab === 'bazar' && (
                <DailyBazarView
                  t={t}
                  monthLabel={monthLabel}
                  bazar={bazar}
                  totalBazar={calc.totalBazar}
                  onUpdateBazar={handleUpdateBazar}
                />
              )}

              {activeTab === 'dailyMeal' && (
                <DailyMealChartView
                  t={t}
                  members={members}
                  daysCount={daysCount}
                  onUpdateDayMeal={handleUpdateDayMeal}
                  onFillSampleMeals={handleFillSampleMeals}
                  onSyncMealsToMain={handleSyncMealsToMain}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView
                  t={t}
                  monthBn={monthBn}
                  monthEn={monthEn}
                  chefRule={chefRule}
                  globalFeastTotal={globalFeastTotal}
                  onUpdateSettings={handleUpdateSettings}
                  onApplyGlobalFeast={handleApplyGlobalFeast}
                  onDownloadBackup={handleDownloadBackup}
                  onRestoreBackup={handleRestoreBackup}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Print-Only White Paper A4 Report */}
      <PrintReportTemplate
        t={t}
        lang={lang}
        monthLabel={monthLabel}
        calc={calc}
        bazar={bazar}
      />

      {/* Modals */}
      <AddMemberModal
        t={t}
        open={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        onConfirm={handleAddMember}
      />

      <ResetModal
        t={t}
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={handleResetToOriginal}
      />

      <NewMonthModal
        t={t}
        open={newMonthOpen}
        onClose={() => setNewMonthOpen(false)}
        onConfirm={handleCreateNewMonth}
      />

      <OfflineIndicator lang={lang} />

      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl flex items-center gap-2.5 text-sm shadow-xl no-print"
        >
          {toast.isError ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}
    </>
  );
}
