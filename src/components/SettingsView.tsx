import { useEffect, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { TranslationStrings } from '../data/i18n';
import { ChefRule } from '../types/mess';

interface SettingsViewProps {
  t: TranslationStrings;
  monthBn: string;
  monthEn: string;
  chefRule: ChefRule;
  globalFeastTotal: number;
  onUpdateSettings: (updates: { monthBn?: string; monthEn?: string; chefRule?: ChefRule }) => void;
  onApplyGlobalFeast: (total: number) => void;
  onDownloadBackup: () => void;
  onRestoreBackup: (file: File) => void;
}

export function SettingsView({
  t,
  monthBn,
  monthEn,
  chefRule,
  globalFeastTotal,
  onUpdateSettings,
  onApplyGlobalFeast,
  onDownloadBackup,
  onRestoreBackup,
}: SettingsViewProps) {
  const [bnDraft, setBnDraft] = useState(monthBn);
  const [enDraft, setEnDraft] = useState(monthEn);
  const [feastInput, setFeastInput] = useState(String(globalFeastTotal || ''));

  useEffect(() => {
    setBnDraft(monthBn);
  }, [monthBn]);

  useEffect(() => {
    setEnDraft(monthEn);
  }, [monthEn]);

  useEffect(() => {
    setFeastInput(globalFeastTotal ? String(globalFeastTotal) : '');
  }, [globalFeastTotal]);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
          {t.settingsTitle}
        </h2>

        {/* Month Labels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              {t.setMonthLabel}
            </label>
            <input
              type="text"
              maxLength={64}
              value={bnDraft}
              onChange={(e) => setBnDraft(e.target.value)}
              onBlur={() => {
                if (bnDraft.trim() && bnDraft !== monthBn) {
                  onUpdateSettings({ monthBn: bnDraft.trim() });
                }
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              {t.setMonthEnLabel}
            </label>
            <input
              type="text"
              maxLength={64}
              value={enDraft}
              onChange={(e) => setEnDraft(e.target.value)}
              onBlur={() => {
                if (enDraft.trim() && enDraft !== monthEn) {
                  onUpdateSettings({ monthEn: enDraft.trim() });
                }
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Chef Meal Rule */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <label className="block text-sm font-semibold text-white">{t.chefRuleLabel}</label>
          <p className="text-xs text-slate-400">{t.chefRuleDesc}</p>
          <select
            value={chefRule}
            onChange={(e) =>
              onUpdateSettings({
                chefRule: e.target.value === 'proportional' ? 'proportional' : 'equal',
              })
            }
            className="w-full sm:w-auto bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 mt-1"
          >
            <option value="equal">{t.chefRuleEqual}</option>
            <option value="proportional">{t.chefRuleProp}</option>
          </select>
        </div>

        {/* Feast Cost Distributor */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <label className="block text-sm font-semibold text-white">{t.feastRuleLabel}</label>
          <p className="text-xs text-slate-400">{t.feastRuleDesc}</p>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="number"
              min="0"
              step="any"
              value={feastInput}
              onChange={(e) => setFeastInput(e.target.value)}
              placeholder="5600"
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono-num w-48 focus:outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={() => onApplyGlobalFeast(Math.max(0, Number.parseFloat(feastInput) || 0))}
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              {t.applyFeastBtn}
            </button>
          </div>
        </div>

        {/* JSON Backup & Restore */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="text-sm font-semibold text-white">{t.backupTitle}</div>
          <p className="text-xs text-slate-400">{t.backupDesc}</p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onDownloadBackup}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t.backupDownloadBtn}</span>
            </button>
            <label className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{t.backupRestoreBtn}</span>
              <input
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onRestoreBackup(file);
                    e.target.value = '';
                  }
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
