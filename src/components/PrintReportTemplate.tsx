import { TranslationStrings } from '../data/i18n';
import { BazarDayRecord, CalculatedSummary, Language } from '../types/mess';
import { fmt, fmtSmart } from '../utils/calculations';

interface PrintReportTemplateProps {
  t: TranslationStrings;
  lang: Language;
  monthLabel: string;
  calc: CalculatedSummary;
  bazar: BazarDayRecord[];
}

export function PrintReportTemplate({
  t,
  lang,
  monthLabel,
  calc,
  bazar,
}: PrintReportTemplateProps) {
  const sortedBazar = [...bazar].sort((a, b) => a.day - b.day);

  return (
    <div id="pdf-print-report" className="hidden bg-white text-black p-4">
      <div className="border-b-2 border-slate-800 pb-2 mb-3 flex justify-between items-end">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            {lang === 'bn'
              ? `মেস মিল ও বাজার হিসাব রিপোর্ট — ${monthLabel}`
              : `Mess Meal & Bazar Report — ${monthLabel}`}
          </h1>
          <p className="text-[11px] text-slate-600">
            Generated: {new Date().toLocaleDateString('en-GB')}
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-800 border border-slate-300 px-2.5 py-1 rounded">
          {t.kpiMealRate}: {fmt(calc.mealRate, 2)}
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        <div className="border border-slate-300 p-2 rounded">
          <div className="text-[10px] text-slate-600 font-semibold">{t.kpiTotalDeposit}</div>
          <div className="text-sm font-bold font-mono-num text-slate-900">
            {fmt(calc.totalDeposit, 2)}
          </div>
        </div>
        <div className="border border-slate-300 p-2 rounded">
          <div className="text-[10px] text-slate-600 font-semibold">{t.kpiTotalBazar}</div>
          <div className="text-sm font-bold font-mono-num text-amber-700">
            {fmt(calc.totalBazar, 2)}
          </div>
        </div>
        <div className="border border-slate-300 p-2 rounded">
          <div className="text-[10px] text-slate-600 font-semibold">{t.kpiRemained}</div>
          <div className="text-sm font-bold font-mono-num text-emerald-700">
            {fmt(calc.remainedCash, 2)}
          </div>
        </div>
        <div className="border border-slate-300 p-2 rounded">
          <div className="text-[10px] text-slate-600 font-semibold">{t.kpiTotalMeals}</div>
          <div className="text-sm font-bold font-mono-num text-blue-700">
            {fmt(calc.totalAllMeals, 1)}
          </div>
        </div>
        <div className="border border-slate-300 p-2 rounded">
          <div className="text-[10px] text-slate-600 font-semibold">{t.kpiMealRate}</div>
          <div className="text-sm font-bold font-mono-num text-blue-900">
            {fmt(calc.mealRate, 2)}
          </div>
        </div>
      </div>

      <div className="flex gap-3 items-start">
        <div className="flex-[3]">
          <table className="w-full border-collapse text-[10px] text-right font-mono-num">
            <thead>
              <tr className="bg-slate-800 text-white text-center font-sans">
                <th className="border border-slate-400 p-1">#</th>
                <th className="border border-slate-400 p-1 text-left">Name</th>
                <th className="border border-slate-400 p-1">Prev. Bal</th>
                <th className="border border-slate-400 p-1">Deposit</th>
                <th className="border border-slate-400 p-1">Total</th>
                <th className="border border-slate-400 p-1">Meals</th>
                <th className="border border-slate-400 p-1">Rate</th>
                <th className="border border-slate-400 p-1">Cost/Meal</th>
                <th className="border border-slate-400 p-1">Chef Cost</th>
                <th className="border border-slate-400 p-1">Feast</th>
                <th className="border border-slate-400 p-1">Total Cost</th>
                <th className="border border-slate-400 p-1">Net Balance</th>
              </tr>
            </thead>
            <tbody>
              {calc.rows.map((r, idx) => (
                <tr key={r.id} className={idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                  <td className="border border-slate-300 p-1 text-center">{idx + 1}</td>
                  <td className="border border-slate-300 p-1 text-left font-sans font-semibold">
                    {r.name}
                    {r.isChef ? ' (Chef)' : ''}
                  </td>
                  <td className="border border-slate-300 p-1">{fmtSmart(r.prev)}</td>
                  <td className="border border-slate-300 p-1">{fmt(r.deposit, 0)}</td>
                  <td className="border border-slate-300 p-1 font-semibold">{fmtSmart(r.total)}</td>
                  <td className="border border-slate-300 p-1">{fmt(r.mealQty, 1)}</td>
                  <td className="border border-slate-300 p-1">
                    {r.mealQty > 0 ? fmt(r.mealRate, 2) : '-'}
                  </td>
                  <td className="border border-slate-300 p-1">
                    {r.displayCostMeal > 0 ? fmt(r.displayCostMeal, 2) : '-'}
                  </td>
                  <td className="border border-slate-300 p-1">
                    {r.chefShare > 0 ? fmt(r.chefShare, 2) : '-'}
                  </td>
                  <td className="border border-slate-300 p-1">
                    {r.feastCost > 0 ? fmt(r.feastCost, 2) : '-'}
                  </td>
                  <td className="border border-slate-300 p-1 font-semibold">
                    {r.totalCost > 0 ? fmt(r.totalCost, 2) : '-'}
                  </td>
                  <td
                    className={`border border-slate-300 p-1 font-bold ${
                      r.netBalance < -0.005
                        ? 'text-red-700'
                        : r.netBalance > 0.005
                        ? 'text-emerald-700'
                        : 'text-slate-700'
                    }`}
                  >
                    {fmt(r.netBalance, 2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-200 font-bold">
              <tr>
                <td colSpan={2} className="border border-slate-400 p-1 text-left font-sans">
                  Total
                </td>
                <td className="border border-slate-400 p-1">{fmt(calc.totalPrev, 2)}</td>
                <td className="border border-slate-400 p-1">{fmt(calc.totalDeposit, 2)}</td>
                <td className="border border-slate-400 p-1">{fmt(calc.totalFund, 2)}</td>
                <td className="border border-slate-400 p-1">{fmt(calc.totalAllMeals, 1)}</td>
                <td className="border border-slate-400 p-1">{fmt(calc.mealRate, 2)}</td>
                <td className="border border-slate-400 p-1">{fmt(calc.sumCostMeal, 2)}</td>
                <td className="border border-slate-400 p-1">{fmt(calc.sumChefCost, 2)}</td>
                <td className="border border-slate-400 p-1">{fmt(calc.sumFeastCost, 2)}</td>
                <td className="border border-slate-400 p-1">{fmt(calc.sumTotalCost, 2)}</td>
                <td className="border border-slate-400 p-1">{fmt(calc.sumNetBalance, 2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="flex-1">
          <table className="w-full border-collapse text-[10px] font-mono-num">
            <thead>
              <tr className="bg-slate-900 text-amber-300 font-sans">
                <th className="border border-slate-400 p-1 text-left">Date</th>
                <th className="border border-slate-400 p-1 text-right">Bazar Cost</th>
              </tr>
            </thead>
            <tbody>
              {sortedBazar
                .filter((b, idx) => b.cost > 0 || idx < 20)
                .map((b) => (
                  <tr key={b.id}>
                    <td className="border border-slate-300 p-1">{b.date}</td>
                    <td className="border border-slate-300 p-1 text-right font-semibold">
                      {b.cost > 0 ? fmt(b.cost, 2) : '-'}
                    </td>
                  </tr>
                ))}
            </tbody>
            <tfoot className="bg-emerald-100 font-bold text-emerald-900">
              <tr>
                <td className="border border-slate-400 p-1 font-sans">Total Bazar</td>
                <td className="border border-slate-400 p-1 text-right">
                  {fmt(calc.totalBazar, 2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
