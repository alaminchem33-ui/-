import { useEffect, useState } from 'react';
import { TranslationStrings } from '../data/i18n';
import { BazarDayRecord } from '../types/mess';
import { fmt } from '../utils/calculations';
import { NumericCell } from './MainSheetView';

interface NoteCellProps {
  value: string;
  placeholder: string;
  onCommit: (note: string) => void;
}

function NoteCell({ value, placeholder, onCommit }: NoteCellProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  return (
    <input
      type="text"
      maxLength={200}
      value={draft}
      placeholder={placeholder}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        const clean = draft.trim().slice(0, 200);
        if (clean !== value) {
          onCommit(clean);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          (e.target as HTMLInputElement).blur();
        }
      }}
      className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
    />
  );
}

interface DailyBazarViewProps {
  t: TranslationStrings;
  monthLabel: string;
  bazar: BazarDayRecord[];
  totalBazar: number;
  onUpdateBazar: (dayId: string, updates: Partial<Pick<BazarDayRecord, 'cost' | 'note'>>) => void;
}

export function DailyBazarView({
  t,
  monthLabel,
  bazar,
  totalBazar,
  onUpdateBazar,
}: DailyBazarViewProps) {
  const sorted = [...bazar].sort((a, b) => a.day - b.day);

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white">
            {t.bazarHeader} · {monthLabel}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.bazarSub}</p>
        </div>

        <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-right">
          <div className="text-[11px] text-slate-400">{t.totalBazarLabel}</div>
          <div className="text-lg font-bold text-amber-400 font-mono-num">
            {fmt(totalBazar, 2)}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-800 text-slate-200 border-b border-slate-700">
                <th className="py-3 px-4 text-left w-14">#</th>
                <th className="py-3 px-4 text-left w-40">{t.colDate}</th>
                <th className="py-3 px-4 text-left min-w-[260px]">{t.colShopper}</th>
                <th className="py-3 px-4 text-right w-44">{t.colBazarAmount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sorted.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40">
                  <td className="py-2 px-4 font-mono-num text-slate-500">{item.day}</td>
                  <td className="py-2 px-4 font-mono-num text-slate-200">{item.date}</td>
                  <td className="py-2 px-4">
                    <NoteCell
                      value={item.note}
                      placeholder={t.shopperPlaceholder}
                      onCommit={(note) => onUpdateBazar(item.id, { note })}
                    />
                  </td>
                  <td className="py-2 px-4 text-right">
                    <NumericCell
                      value={item.cost}
                      className={`text-sm font-semibold border border-slate-800 bg-slate-950/60 py-1.5 px-3 ${
                        item.cost > 0 ? 'text-amber-300' : 'text-slate-400'
                      }`}
                      onCommit={(cost) => onUpdateBazar(item.id, { cost })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-800 border-t border-slate-600 font-bold text-emerald-400">
              <tr>
                <td colSpan={3} className="py-3 px-4 text-left">
                  {t.totalBazarLabel}
                </td>
                <td className="py-3 px-4 text-right font-mono-num text-base">
                  {fmt(totalBazar, 2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
