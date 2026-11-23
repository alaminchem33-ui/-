import { useEffect, useState } from 'react';
import { Search, Trash2, UserPlus } from 'lucide-react';
import { TranslationStrings } from '../data/i18n';
import { BazarDayRecord, CalculatedSummary, MemberRecord } from '../types/mess';
import { fmt, fmtSmart } from '../utils/calculations';

interface NumericCellProps {
  value: number;
  allowNegative?: boolean;
  className?: string;
  onCommit: (val: number) => void;
}

export function NumericCell({
  value,
  allowNegative = false,
  className = '',
  onCommit,
}: NumericCellProps) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    if (!focused) {
      setDraft(String(value));
    }
  }, [value, focused]);

  const commitValue = () => {
    setFocused(false);
    const parsed = Number.parseFloat(draft);
    const clean = Number.isFinite(parsed)
      ? allowNegative
        ? parsed
        : Math.max(0, parsed)
      : 0;
    setDraft(String(clean));
    if (clean !== value) {
      onCommit(clean);
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      value={focused ? draft : String(value)}
      onFocus={(e) => {
        setFocused(true);
        setDraft(value === 0 ? '' : String(value));
        e.target.select();
      }}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commitValue}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          (e.target as HTMLInputElement).blur();
        } else if (e.key === 'Escape') {
          setDraft(String(value));
          setFocused(false);
          (e.target as HTMLInputElement).blur();
        }
      }}
      className={`w-full bg-transparent text-right font-mono-num px-1.5 py-1 rounded border border-transparent hover:border-slate-700 focus:bg-slate-950 focus:border-blue-500 focus:outline-none transition-colors ${className}`}
    />
  );
}

interface MainSheetViewProps {
  t: TranslationStrings;
  calc: CalculatedSummary;
  bazar: BazarDayRecord[];
  globalFeastTotal: number;
  monthLabel: string;
  onUpdateMember: (memberId: string, updates: Partial<Omit<MemberRecord, 'id'>>) => void;
  onDeleteMember: (memberId: string) => void;
  onOpenAddMember: () => void;
  onUpdateBazarCost: (dayId: string, cost: number) => void;
  onApplyGlobalFeast: (total: number) => void;
  onViewAllBazar: () => void;
}

export function MainSheetView({
  t,
  calc,
  bazar,
  globalFeastTotal,
  monthLabel,
  onUpdateMember,
  onDeleteMember,
  onOpenAddMember,
  onUpdateBazarCost,
  onApplyGlobalFeast,
  onViewAllBazar,
}: MainSheetViewProps) {
  const [search, setSearch] = useState('');
  const [feastDraft, setFeastDraft] = useState(String(globalFeastTotal));

  useEffect(() => {
    setFeastDraft(String(globalFeastTotal));
  }, [globalFeastTotal]);

  const queryText = search.trim().toLowerCase();
  const filteredRows = queryText
    ? calc.rows.filter((r) => r.name.toLowerCase().includes(queryText))
    : calc.rows;

  const sortedBazar = [...bazar].sort((a, b) => a.day - b.day);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 w-48 sm:w-60"
            />
          </div>

          <button
            type="button"
            onClick={onOpenAddMember}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t.addMember}</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <label htmlFor="quick-feast-input" className="text-slate-400">
              {t.quickFeastLabel}
            </label>
            <input
              id="quick-feast-input"
              type="number"
              min="0"
              step="any"
              value={feastDraft}
              onChange={(e) => setFeastDraft(e.target.value)}
              onBlur={() => {
                const val = Math.max(0, Number.parseFloat(feastDraft) || 0);
                setFeastDraft(String(val));
                onApplyGlobalFeast(val);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  (e.target as HTMLInputElement).blur();
                }
              }}
              className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-right text-amber-300 font-semibold font-mono-num focus:outline-none focus:border-amber-500"
            />
          </div>

          <span className="text-slate-400 hidden xl:inline">{t.editHint}</span>
        </div>
      </div>

      {/* Main 12-Col Grid: Member Ledger (9 cols) + Daily Bazar Quick Panel (3 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        <div className="xl:col-span-9 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {filteredRows.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <h3 className="text-base font-semibold text-white">{t.emptyMembersTitle}</h3>
              <p className="text-sm text-slate-400">{t.emptyMembersDesc}</p>
              <button
                type="button"
                onClick={onOpenAddMember}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold cursor-pointer"
              >
                {t.addMember}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-800/90 text-slate-200 border-b border-slate-700 text-right font-semibold">
                    <th className="py-2.5 px-2 text-center border-r border-slate-700/70 w-10">#</th>
                    <th className="py-2.5 px-3 text-left border-r border-slate-700/70 min-w-[165px]">
                      <div>{t.colName}</div>
                      <div className="text-[10px] font-normal text-slate-400">{t.colNameSub}</div>
                    </th>
                    <th className="py-2.5 px-2 border-r border-slate-700/70 min-w-[96px]">
                      <div>{t.colPrev}</div>
                      <div className="text-[10px] font-normal text-slate-400">{t.colPrevSub}</div>
                    </th>
                    <th className="py-2.5 px-2 border-r border-slate-700/70 min-w-[90px]">
                      <div>{t.colDeposit}</div>
                      <div className="text-[10px] font-normal text-slate-400">{t.colDepositSub}</div>
                    </th>
                    <th className="py-2.5 px-2 border-r border-slate-700/70 min-w-[96px] bg-slate-800">
                      <div>{t.colTotal}</div>
                      <div className="text-[10px] font-normal text-slate-400">{t.colTotalSub}</div>
                    </th>
                    <th className="py-2.5 px-2 border-r border-slate-700/70 min-w-[78px]">
                      <div>{t.colMealQty}</div>
                      <div className="text-[10px] font-normal text-slate-400">{t.colMealQtySub}</div>
                    </th>
                    <th className="py-2.5 px-2 border-r border-slate-700/70 min-w-[74px]">
                      <div>{t.colMealRate}</div>
                      <div className="text-[10px] font-normal text-slate-400">{t.colMealRateSub}</div>
                    </th>
                    <th className="py-2.5 px-2 border-r border-slate-700/70 min-w-[84px]">
                      <div>{t.colCostMeal}</div>
                      <div className="text-[10px] font-normal text-slate-400">{t.colCostMealSub}</div>
                    </th>
                    <th className="py-2.5 px-2 border-r border-slate-700/70 min-w-[80px]">
                      <div>{t.colChefCost}</div>
                      <div className="text-[10px] font-normal text-slate-400">{t.colChefCostSub}</div>
                    </th>
                    <th className="py-2.5 px-2 border-r border-slate-700/70 min-w-[80px]">
                      <div>{t.colFeastCost}</div>
                      <div className="text-[10px] font-normal text-slate-400">{t.colFeastCostSub}</div>
                    </th>
                    <th className="py-2.5 px-2 border-r border-slate-700/70 min-w-[88px] bg-slate-800">
                      <div>{t.colTotalCost}</div>
                      <div className="text-[10px] font-normal text-slate-400">{t.colTotalCostSub}</div>
                    </th>
                    <th className="py-2.5 px-2.5 border-r border-slate-700/70 min-w-[116px] bg-slate-800">
                      <div>{t.colNetBalance}</div>
                      <div className="text-[10px] font-normal text-slate-400">{t.colNetBalanceSub}</div>
                    </th>
                    <th className="py-2.5 px-2 w-10" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredRows.map((row, idx) => {
                    const isReceivable = row.netBalance > 0.005;
                    const isDue = row.netBalance < -0.005;
                    const netClass = isDue
                      ? 'text-rose-400'
                      : isReceivable
                      ? 'text-emerald-400'
                      : 'text-slate-300';
                    const statusText = isDue
                      ? t.statusDue
                      : isReceivable
                      ? t.statusReceivable
                      : t.statusSettled;

                    return (
                      <tr
                        key={row.id}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          row.isChef ? 'bg-slate-800/20' : ''
                        }`}
                      >
                        <td className="py-1.5 px-2 text-center text-slate-500 font-mono-num border-r border-slate-800/70">
                          {idx + 1}
                        </td>
                        <td className="py-1.5 px-3 border-r border-slate-800/70">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="font-medium text-slate-100 truncate max-w-[130px]">
                              {row.name}
                            </span>
                            {row.isChef && (
                              <span className="text-[11px] font-medium text-amber-400 shrink-0">
                                {t.chefTag}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-1 px-1 border-r border-slate-800/70">
                          <NumericCell
                            value={row.prev}
                            allowNegative
                            className={row.prev < 0 ? 'text-rose-300' : 'text-slate-200'}
                            onCommit={(val) => onUpdateMember(row.id, { prev: val })}
                          />
                        </td>
                        <td className="py-1 px-1 border-r border-slate-800/70">
                          <NumericCell
                            value={row.deposit}
                            className="text-blue-300 font-medium"
                            onCommit={(val) => onUpdateMember(row.id, { deposit: val })}
                          />
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono-num font-semibold text-slate-100 bg-slate-800/30 border-r border-slate-800/70">
                          {fmtSmart(row.total)}
                        </td>
                        <td className="py-1 px-1 border-r border-slate-800/70">
                          <NumericCell
                            value={row.mealQty}
                            className="text-slate-100"
                            onCommit={(val) => onUpdateMember(row.id, { mealQty: val })}
                          />
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono-num text-slate-400 border-r border-slate-800/70">
                          {row.mealQty > 0 ? fmt(row.mealRate, 2) : '-'}
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono-num text-slate-200 border-r border-slate-800/70">
                          {row.displayCostMeal > 0 ? fmt(row.displayCostMeal, 2) : '-'}
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono-num text-slate-300 border-r border-slate-800/70">
                          {row.chefShare > 0 ? fmt(row.chefShare, 2) : '-'}
                        </td>
                        <td className="py-1 px-1 border-r border-slate-800/70">
                          <NumericCell
                            value={row.feastCost}
                            className="text-amber-300"
                            onCommit={(val) => onUpdateMember(row.id, { feastCost: val })}
                          />
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono-num font-semibold text-slate-100 bg-slate-800/30 border-r border-slate-800/70">
                          {row.totalCost > 0 ? fmt(row.totalCost, 2) : '-'}
                        </td>
                        <td className="py-1.5 px-2.5 text-right font-mono-num border-r border-slate-800/70 bg-slate-800/20">
                          <div className={`font-bold ${netClass}`}>{fmt(row.netBalance, 2)}</div>
                          <div className="text-[10px] font-sans text-slate-500">{statusText}</div>
                        </td>
                        <td className="py-1 px-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => onDeleteMember(row.id)}
                            title={t.deleteConfirm}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-800 font-bold text-white border-t border-slate-600 font-mono-num text-right">
                  <tr>
                    <td colSpan={2} className="py-2.5 px-3 text-left font-sans border-r border-slate-700">
                      {t.totalRowLabel}
                    </td>
                    <td className="py-2.5 px-2 border-r border-slate-700">{fmt(calc.totalPrev, 2)}</td>
                    <td className="py-2.5 px-2 border-r border-slate-700 text-blue-300">
                      {fmt(calc.totalDeposit, 2)}
                    </td>
                    <td className="py-2.5 px-2 border-r border-slate-700">{fmt(calc.totalFund, 2)}</td>
                    <td className="py-2.5 px-2 border-r border-slate-700">
                      {fmt(calc.totalAllMeals, 1)}
                    </td>
                    <td className="py-2.5 px-2 border-r border-slate-700 text-blue-300">
                      {fmt(calc.mealRate, 2)}
                    </td>
                    <td className="py-2.5 px-2 border-r border-slate-700">
                      {fmt(calc.sumCostMeal, 2)}
                    </td>
                    <td className="py-2.5 px-2 border-r border-slate-700">
                      {fmt(calc.sumChefCost, 2)}
                    </td>
                    <td className="py-2.5 px-2 border-r border-slate-700 text-amber-300">
                      {fmt(calc.sumFeastCost, 2)}
                    </td>
                    <td className="py-2.5 px-2 border-r border-slate-700">
                      {fmt(calc.sumTotalCost, 2)}
                    </td>
                    <td
                      className={`py-2.5 px-2.5 border-r border-slate-700 ${
                        calc.sumNetBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {fmt(calc.sumNetBalance, 2)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Right 3 Cols: Daily Bazar Quick Panel */}
        <div className="xl:col-span-3 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="bg-slate-800 px-3.5 py-2.5 border-b border-slate-700 flex items-center justify-between">
            <span className="font-semibold text-sm text-white">{t.sideBazarTitle}</span>
            <button
              type="button"
              onClick={onViewAllBazar}
              className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              {t.viewAll}
            </button>
          </div>
          <div className="max-h-[760px] overflow-y-auto">
            <table className="w-full text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-900 text-slate-300 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3 text-left font-semibold">{t.colDate}</th>
                  <th className="py-2 px-3 text-right font-semibold">{t.colCost}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {sortedBazar.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40">
                    <td className="py-1 px-3 font-mono-num text-slate-300">{b.date}</td>
                    <td className="py-1 px-2 text-right">
                      <NumericCell
                        value={b.cost}
                        className={b.cost > 0 ? 'text-amber-300 font-medium' : 'text-slate-500'}
                        onCommit={(val) => onUpdateBazarCost(b.id, val)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="sticky bottom-0 bg-slate-800 border-t border-slate-600 font-bold text-emerald-400">
                <tr>
                  <td className="py-2.5 px-3">{t.totalBazarLabel}</td>
                  <td className="py-2.5 px-3 text-right font-mono-num text-sm">
                    {fmt(calc.totalBazar, 2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Summary Box & Accounting Formulas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300">
              {t.summaryBoxTitle} · {monthLabel}
            </span>
          </div>
          <table className="w-full text-sm divide-y divide-slate-800">
            <tbody>
              <tr>
                <td className="py-2.5 px-4 text-slate-300">{t.sumRemained}</td>
                <td
                  className={`py-2.5 px-4 text-right font-bold font-mono-num ${
                    calc.remainedCash >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {fmt(calc.remainedCash, 2)}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 text-slate-300">{t.sumTotalDeposit}</td>
                <td className="py-2.5 px-4 text-right font-bold font-mono-num text-white">
                  {fmt(calc.totalDeposit, 2)}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 text-slate-300">{t.sumPrevBalance}</td>
                <td className="py-2.5 px-4 text-right font-bold font-mono-num text-slate-200">
                  {fmt(calc.totalPrev, 2)}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 text-slate-300">{t.sumNetBalance}</td>
                <td
                  className={`py-2.5 px-4 text-right font-bold font-mono-num ${
                    calc.sumNetBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {fmt(calc.sumNetBalance, 2)}
                </td>
              </tr>
              <tr className="bg-slate-800/40">
                <td className="py-2.5 px-4 font-semibold text-amber-300">{t.sumTotalBazar}</td>
                <td className="py-2.5 px-4 text-right font-bold font-mono-num text-amber-300">
                  {fmt(calc.totalBazar, 2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2.5">
          <h3 className="text-sm font-bold text-white">{t.formulaTitle}</h3>
          <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside leading-relaxed">
            <li>{t.formula1}</li>
            <li>{t.formula2}</li>
            <li>{t.formula3}</li>
            <li>{t.formula4}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
