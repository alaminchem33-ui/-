import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { BackupPayload, BazarDayRecord, CalculatedSummary, ChefRule, MemberRecord } from '../types/mess';
import { fmt, fmtSmart } from './calculations';

export function downloadVectorPDF(
  calc: CalculatedSummary,
  bazar: BazarDayRecord[],
  monthEn: string
): void {
  const safeSlug = monthEn.replace(/[^a-zA-Z0-9]/g, '_') || 'Ledger';
  const fileName = `Mess_Meal_Report_${safeSlug}.pdf`;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text(`Mess Meal & Bazar Report - ${monthEn}`, 14, 14);

  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Total Deposit: ${fmt(calc.totalDeposit, 2)}   |   Total Bazar: ${fmt(calc.totalBazar, 2)}   |   Remained Cash: ${fmt(calc.remainedCash, 2)}   |   Total Meals: ${fmt(calc.totalAllMeals, 1)}   |   Meal Rate: ${fmt(calc.mealRate, 2)}`,
    14,
    20.5
  );

  const head = [
    [
      '#',
      'Name',
      'Prev. Bal',
      'Deposit',
      'Total',
      'Meals',
      'Rate',
      'Cost/Meal',
      'Chef Cost',
      'Feast',
      'Total Cost',
      'Net Balance',
    ],
  ];

  const body = calc.rows.map((r, idx) => [
    String(idx + 1),
    r.name + (r.isChef ? ' (Chef)' : ''),
    fmtSmart(r.prev),
    fmt(r.deposit, 0),
    fmtSmart(r.total),
    fmt(r.mealQty, 1),
    r.mealQty > 0 ? fmt(r.mealRate, 2) : '-',
    r.displayCostMeal > 0 ? fmt(r.displayCostMeal, 2) : '-',
    r.chefShare > 0 ? fmt(r.chefShare, 2) : '-',
    r.feastCost > 0 ? fmt(r.feastCost, 2) : '-',
    r.totalCost > 0 ? fmt(r.totalCost, 2) : '-',
    fmt(r.netBalance, 2),
  ]);

  body.push([
    '',
    'TOTAL',
    fmt(calc.totalPrev, 2),
    fmt(calc.totalDeposit, 2),
    fmt(calc.totalFund, 2),
    fmt(calc.totalAllMeals, 1),
    fmt(calc.mealRate, 2),
    fmt(calc.sumCostMeal, 2),
    fmt(calc.sumChefCost, 2),
    fmt(calc.sumFeastCost, 2),
    fmt(calc.sumTotalCost, 2),
    fmt(calc.sumNetBalance, 2),
  ]);

  autoTable(doc, {
    head,
    body,
    startY: 25,
    margin: { left: 10, right: 10 },
    styles: { fontSize: 7.5, cellPadding: 1.4, halign: 'right' },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { halign: 'left', cellWidth: 36 },
    },
    headStyles: { fillColor: [30, 58, 138], textColor: 255, halign: 'center' },
    theme: 'grid',
    didParseCell: (data) => {
      if (data.section === 'body' && data.row.index === body.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [226, 232, 240];
      }
    },
  });

  // Add Page 2 for Daily Bazar Log
  doc.addPage('a4', 'portrait');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(`Daily Bazar Expense Log - ${monthEn}`, 14, 15);

  const bazarHead = [['Day', 'Date', 'Shopper / Items Note', 'Cost']];
  const bazarBody = bazar.map((b) => [
    String(b.day),
    b.date,
    b.note || '-',
    b.cost > 0 ? fmt(b.cost, 2) : '-',
  ]);
  bazarBody.push(['', 'Total Bazar', '', fmt(calc.totalBazar, 2)]);

  autoTable(doc, {
    head: bazarHead,
    body: bazarBody,
    startY: 21,
    styles: { fontSize: 8.5, cellPadding: 1.8 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 16 },
      1: { halign: 'left', cellWidth: 32 },
      2: { halign: 'left' },
      3: { halign: 'right', cellWidth: 32 },
    },
    headStyles: { fillColor: [15, 23, 42], textColor: [251, 191, 36] },
    theme: 'grid',
  });

  doc.save(fileName);
}

export function exportExcelWorkbook(
  calc: CalculatedSummary,
  bazar: BazarDayRecord[],
  members: MemberRecord[],
  monthEn: string,
  daysCount: number
): void {
  const safeSlug = monthEn.replace(/[^a-zA-Z0-9]/g, '_') || 'Ledger';
  const fileName = `Mess_Meal_Hisab_${safeSlug}.xlsx`;

  const wb = XLSX.utils.book_new();

  // Sheet 1: Main Account Sheet
  const mainSheetData: (string | number)[][] = [
    [`Mess Meal & Bazar Report - ${monthEn}`],
    [],
    [
      'SL',
      'Name',
      'Previous Balance',
      'Deposit',
      'Total',
      'Meal QTY',
      'Meal Rate',
      'Cost/Meal',
      'Chef Meal Cost',
      'Feast Meal Cost',
      'Total Cost',
      'Net Balance',
    ],
  ];

  calc.rows.forEach((r, idx) => {
    mainSheetData.push([
      idx + 1,
      r.name + (r.isChef ? ' (Chef)' : ''),
      Number(r.prev.toFixed(3)),
      Number(r.deposit.toFixed(2)),
      Number(r.total.toFixed(3)),
      Number(r.mealQty.toFixed(2)),
      Number(r.mealRate.toFixed(2)),
      Number(r.displayCostMeal.toFixed(2)),
      Number(r.chefShare.toFixed(2)),
      Number(r.feastCost.toFixed(2)),
      Number(r.totalCost.toFixed(2)),
      Number(r.netBalance.toFixed(2)),
    ]);
  });

  mainSheetData.push([
    '',
    'Total',
    Number(calc.totalPrev.toFixed(2)),
    Number(calc.totalDeposit.toFixed(2)),
    Number(calc.totalFund.toFixed(2)),
    Number(calc.totalAllMeals.toFixed(2)),
    Number(calc.mealRate.toFixed(2)),
    Number(calc.sumCostMeal.toFixed(2)),
    Number(calc.sumChefCost.toFixed(2)),
    Number(calc.sumFeastCost.toFixed(2)),
    Number(calc.sumTotalCost.toFixed(2)),
    Number(calc.sumNetBalance.toFixed(2)),
  ]);

  mainSheetData.push([]);
  mainSheetData.push(['Summary', 'Amount']);
  mainSheetData.push(['Remained Cash', Number(calc.remainedCash.toFixed(2))]);
  mainSheetData.push(['Total Deposit', Number(calc.totalDeposit.toFixed(2))]);
  mainSheetData.push(['Total Bazar', Number(calc.totalBazar.toFixed(2))]);
  mainSheetData.push(['Meal Rate', Number(calc.mealRate.toFixed(2))]);

  const ws1 = XLSX.utils.aoa_to_sheet(mainSheetData);
  XLSX.utils.book_append_sheet(wb, ws1, 'Meal_Balance_Sheet');

  // Sheet 2: Daily Bazar
  const bazarSheetData: (string | number)[][] = [['Day', 'Date', 'Cost', 'Shopper / Note']];
  bazar.forEach((b) => {
    bazarSheetData.push([b.day, b.date, Number((Number(b.cost) || 0).toFixed(2)), b.note || '']);
  });
  bazarSheetData.push(['', 'Total Bazar', Number(calc.totalBazar.toFixed(2)), '']);
  const ws2 = XLSX.utils.aoa_to_sheet(bazarSheetData);
  XLSX.utils.book_append_sheet(wb, ws2, 'Daily_Bazar');

  // Sheet 3: Daily Meal Chart
  const mealHeader = ['Name'];
  for (let d = 1; d <= daysCount; d++) mealHeader.push(`Day ${d}`);
  mealHeader.push('Total Meals');

  const mealSheetData: (string | number)[][] = [mealHeader];
  [...members]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .forEach((m) => {
      const arr = Array.from({ length: daysCount }, (_, i) => Number(m.dailyMeals[i]) || 0);
      const sum = arr.reduce((a, b) => a + b, 0);
      mealSheetData.push([m.name, ...arr, Number(sum.toFixed(2))]);
    });
  const ws3 = XLSX.utils.aoa_to_sheet(mealSheetData);
  XLSX.utils.book_append_sheet(wb, ws3, 'Daily_Meal_Chart');

  XLSX.writeFile(wb, fileName);
}

export function downloadJsonBackup(payload: BackupPayload): void {
  const safeSlug = payload.monthEn.replace(/[^a-zA-Z0-9]/g, '_') || 'Backup';
  const dataStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Mess_Backup_${safeSlug}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function validateBackupPayload(raw: unknown): BackupPayload | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  if (!Array.isArray(obj.members) || !Array.isArray(obj.bazar)) return null;

  const chefRule: ChefRule = obj.chefRule === 'proportional' ? 'proportional' : 'equal';
  const daysCount =
    typeof obj.daysCount === 'number' && obj.daysCount >= 28 && obj.daysCount <= 31
      ? Math.round(obj.daysCount)
      : Math.min(31, Math.max(28, obj.bazar.length || 30));

  const members: MemberRecord[] = obj.members
    .filter((m): m is Record<string, unknown> => Boolean(m && typeof m === 'object'))
    .slice(0, 200)
    .map((m, idx) => {
      const dailyMealsRaw = Array.isArray(m.dailyMeals) ? m.dailyMeals : [];
      const dailyMeals = Array.from({ length: daysCount }, (_, d) => {
        const val = Number(dailyMealsRaw[d]);
        return Number.isFinite(val) && val >= 0 ? val : 0;
      });
      return {
        id: typeof m.id === 'string' && /^[a-zA-Z0-9_-]+$/.test(m.id) ? m.id : `m-${idx + 1}`,
        name: String(m.name || `Member ${idx + 1}`).slice(0, 80),
        prev: Number.isFinite(Number(m.prev)) ? Number(m.prev) : 0,
        deposit: Math.max(0, Number(m.deposit) || 0),
        mealQty: Math.max(0, Number(m.mealQty) || 0),
        feastCost: Math.max(0, Number(m.feastCost) || 0),
        isChef: Boolean(m.isChef),
        sortOrder: typeof m.sortOrder === 'number' ? Math.round(m.sortOrder) : idx + 1,
        dailyMeals,
      };
    });

  const bazar: BazarDayRecord[] = obj.bazar
    .filter((b): b is Record<string, unknown> => Boolean(b && typeof b === 'object'))
    .slice(0, 31)
    .map((b, idx) => {
      const dayNum = typeof b.day === 'number' && b.day >= 1 && b.day <= 31 ? Math.round(b.day) : idx + 1;
      return {
        id: `day-${String(dayNum).padStart(2, '0')}`,
        day: dayNum,
        date: String(b.date || `${String(dayNum).padStart(2, '0')}/11/2026`).slice(0, 20),
        cost: Math.max(0, Number(b.cost) || 0),
        note: String(b.note || '').slice(0, 200),
      };
    });

  return {
    version: 1,
    monthBn: String(obj.monthBn || 'নভেম্বর, ২০২৬').slice(0, 64),
    monthEn: String(obj.monthEn || 'Nov, 2026').slice(0, 64),
    chefRule,
    globalFeastTotal: Math.max(0, Number(obj.globalFeastTotal) || 0),
    daysCount,
    members,
    bazar,
  };
}
