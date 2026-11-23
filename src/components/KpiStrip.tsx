import { TranslationStrings } from '../data/i18n';
import { CalculatedSummary } from '../types/mess';
import { fmt } from '../utils/calculations';

interface KpiStripProps {
  t: TranslationStrings;
  calc: CalculatedSummary;
}

export function KpiStrip({ t, calc }: KpiStripProps) {
  const items = [
    {
      label: t.kpiTotalDeposit,
      value: fmt(calc.totalDeposit, 2),
      sub: t.kpiCurrentMonth,
      valueClass: 'text-white',
    },
    {
      label: t.kpiTotalBazar,
      value: fmt(calc.totalBazar, 2),
      sub: t.kpiBazarSub,
      valueClass: 'text-amber-400',
    },
    {
      label: t.kpiRemained,
      value: fmt(calc.remainedCash, 2),
      sub: t.kpiRemainedSub,
      valueClass: calc.remainedCash >= 0 ? 'text-emerald-400' : 'text-rose-400',
    },
    {
      label: t.kpiTotalMeals,
      value: fmt(calc.totalAllMeals, 1),
      sub: t.kpiMealsSub,
      valueClass: 'text-slate-100',
    },
    {
      label: t.kpiMealRate,
      value: fmt(calc.mealRate, 2),
      sub: t.kpiRateSub,
      valueClass: 'text-blue-400',
    },
    {
      label: t.kpiNetBalance,
      value: fmt(calc.sumNetBalance, 2),
      sub: t.kpiNetSub,
      valueClass: calc.sumNetBalance >= 0 ? 'text-emerald-400' : 'text-rose-400',
    },
  ];

  return (
    <section className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 pt-4 no-print">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4"
          >
            <div className="text-xs font-medium text-slate-400 truncate">{item.label}</div>
            <div className={`text-lg sm:text-xl font-bold font-mono-num mt-1 ${item.valueClass}`}>
              {item.value}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 truncate">{item.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
