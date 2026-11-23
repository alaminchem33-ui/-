import { RefreshCw, Wand2 } from 'lucide-react';
import { TranslationStrings } from '../data/i18n';
import { MemberRecord } from '../types/mess';
import { fmt } from '../utils/calculations';
import { NumericCell } from './MainSheetView';

interface DailyMealChartViewProps {
  t: TranslationStrings;
  members: MemberRecord[];
  daysCount: number;
  onUpdateDayMeal: (memberId: string, dayIndex: number, value: number) => void;
  onFillSampleMeals: () => void;
  onSyncMealsToMain: () => void;
}

export function DailyMealChartView({
  t,
  members,
  daysCount,
  onUpdateDayMeal,
  onFillSampleMeals,
  onSyncMealsToMain,
}: DailyMealChartViewProps) {
  const sorted = [...members].sort((a, b) => a.sortOrder - b.sortOrder);
  const days = Array.from({ length: daysCount }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white">{t.dailyMealHeader}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.dailyMealSub}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onFillSampleMeals}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Wand2 className="w-4 h-4 text-amber-400" />
            <span>{t.fillSampleMeals}</span>
          </button>
          <button
            type="button"
            onClick={onSyncMealsToMain}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t.syncMealsBtn}</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto max-h-[650px]">
          <table className="w-full text-xs border-collapse">
            <thead className="sticky top-0 z-20 bg-slate-800 text-slate-200 border-b border-slate-700">
              <tr>
                <th className="sticky left-0 z-30 bg-slate-800 py-2.5 px-3 text-left min-w-[160px] border-r border-slate-700">
                  {t.colName}
                </th>
                {days.map((d) => (
                  <th
                    key={d}
                    className="py-2.5 px-1.5 text-center min-w-[46px] font-mono-num border-r border-slate-700/60"
                  >
                    {d}
                  </th>
                ))}
                <th className="sticky right-0 z-30 bg-slate-800 py-2.5 px-3 text-right min-w-[74px] border-l border-slate-700">
                  {t.colTotal}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sorted.map((m) => {
                const meals = Array.from({ length: daysCount }, (_, i) => Number(m.dailyMeals[i]) || 0);
                const rowSum = meals.reduce((a, b) => a + b, 0);

                return (
                  <tr key={m.id} className="hover:bg-slate-800/40">
                    <td className="sticky left-0 z-10 bg-slate-900 py-1.5 px-3 font-medium text-slate-100 border-r border-slate-800">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="truncate max-w-[125px]">{m.name}</span>
                        {m.isChef && (
                          <span className="text-[10px] text-amber-400 shrink-0">{t.chefTag}</span>
                        )}
                      </div>
                    </td>
                    {meals.map((val, dIdx) => (
                      <td key={dIdx} className="p-0.5 border-r border-slate-800/60">
                        <NumericCell
                          value={val}
                          className={`text-center px-1 py-1 text-xs ${
                            val > 0 ? 'text-blue-300 font-semibold' : 'text-slate-500'
                          }`}
                          onCommit={(nextVal) => onUpdateDayMeal(m.id, dIdx, nextVal)}
                        />
                      </td>
                    ))}
                    <td className="sticky right-0 z-10 bg-slate-900 py-1.5 px-3 text-right font-mono-num font-bold text-emerald-400 border-l border-slate-800">
                      {fmt(rowSum, 1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
