import {
  CalendarPlus,
  FileSpreadsheet,
  FileText,
  Languages,
  Printer,
  RotateCcw,
} from 'lucide-react';
import { TranslationStrings } from '../data/i18n';
import { Language, LedgerMeta } from '../types/mess';
import { PWAInstallButton } from './PWAInstallButton';

interface WorkspaceToolbarProps {
  t: TranslationStrings;
  lang: Language;
  monthLabel: string;
  ledgers: LedgerMeta[];
  activeLedgerId: string;
  isCloudSynced: boolean;
  onSelectLedger: (id: string) => void;
  onOpenNewMonth: () => void;
  onToggleLanguage: () => void;
  onDownloadPdf: () => void;
  onExportExcel: () => void;
  onPrint: () => void;
  onOpenReset: () => void;
}

export function WorkspaceToolbar({
  t,
  lang,
  monthLabel,
  ledgers,
  activeLedgerId,
  isCloudSynced,
  onSelectLedger,
  onOpenNewMonth,
  onToggleLanguage,
  onDownloadPdf,
  onExportExcel,
  onPrint,
  onOpenReset,
}: WorkspaceToolbarProps) {
  return (
    <section className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 pt-4 no-print">
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Active Month Metadata & Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {ledgers.length > 1 ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400">{t.monthSelectorLabel}</span>
              <select
                value={activeLedgerId}
                onChange={(e) => onSelectLedger(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-white focus:outline-none focus:border-blue-500"
              >
                {ledgers.map((l) => (
                  <option key={l.id} value={l.id}>
                    {lang === 'bn' ? l.monthBn : l.monthEn}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {monthLabel}
            </h1>
          )}

          <span aria-hidden="true" className="text-slate-600">
            ·
          </span>
          <span className="text-xs text-slate-400">
            {isCloudSynced ? t.cloudSynced : t.localMode}
          </span>

          {isCloudSynced && (
            <button
              type="button"
              onClick={onOpenNewMonth}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.newMonthBtn}</span>
            </button>
          )}
        </div>

        {/* Right: Language, Install App & Export Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <PWAInstallButton lang={lang} />

          <button
            type="button"
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Languages className="w-4 h-4 text-blue-400" />
            <span>{t.langBtn}</span>
          </button>

          <button
            type="button"
            onClick={onDownloadPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>{t.downloadPdf}</span>
          </button>

          <button
            type="button"
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{t.exportExcel}</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t.print}</span>
          </button>

          <button
            type="button"
            onClick={onOpenReset}
            title={t.resetData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetData}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
