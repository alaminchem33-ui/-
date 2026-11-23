import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { TranslationStrings } from '../data/i18n';

interface AddMemberModalProps {
  t: TranslationStrings;
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { name: string; prev: number; deposit: number; isChef: boolean }) => void;
}

export function AddMemberModal({ t, open, onClose, onConfirm }: AddMemberModalProps) {
  const [name, setName] = useState('');
  const [prev, setPrev] = useState('0');
  const [deposit, setDeposit] = useState('0');
  const [isChef, setIsChef] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;
    onConfirm({
      name: cleanName,
      prev: Number.parseFloat(prev) || 0,
      deposit: Math.max(0, Number.parseFloat(deposit) || 0),
      isChef,
    });
    setName('');
    setPrev('0');
    setDeposit('0');
    setIsChef(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-5 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white">{t.modalAddTitle}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t.colName}</label>
            <input
              type="text"
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tanvir Ahmed"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">{t.colPrev}</label>
              <input
                type="number"
                step="any"
                value={prev}
                onChange={(e) => setPrev(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono-num focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">{t.colDeposit}</label>
              <input
                type="number"
                step="any"
                min="0"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono-num focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isChef}
              onChange={(e) => setIsChef(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-blue-600"
            />
            <span>{t.isChefLabel}</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium cursor-pointer"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold cursor-pointer"
          >
            {t.save}
          </button>
        </div>
      </form>
    </div>
  );
}

interface ResetModalProps {
  t: TranslationStrings;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetModal({ t, open, onClose, onConfirm }: ResetModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-5 space-y-4">
        <div className="flex items-center gap-3 text-rose-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <h3 className="text-base font-bold text-white">{t.resetModalTitle}</h3>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{t.resetModalDesc}</p>
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium cursor-pointer"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold cursor-pointer"
          >
            {t.confirmReset}
          </button>
        </div>
      </div>
    </div>
  );
}

interface NewMonthModalProps {
  t: TranslationStrings;
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    monthBn: string;
    monthEn: string;
    monthNum: number;
    yearNum: number;
    daysCount: number;
  }) => void;
}

export function NewMonthModal({ t, open, onClose, onConfirm }: NewMonthModalProps) {
  const [monthBn, setMonthBn] = useState('ডিসেম্বর, ২০২৬');
  const [monthEn, setMonthEn] = useState('Dec, 2026');
  const [monthNum, setMonthNum] = useState('12');
  const [yearNum, setYearNum] = useState('2026');
  const [daysCount, setDaysCount] = useState('31');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      monthBn: monthBn.trim() || 'ডিসেম্বর, ২০২৬',
      monthEn: monthEn.trim() || 'Dec, 2026',
      monthNum: Math.min(12, Math.max(1, Number.parseInt(monthNum, 10) || 12)),
      yearNum: Math.min(2100, Math.max(2020, Number.parseInt(yearNum, 10) || 2026)),
      daysCount: Math.min(31, Math.max(28, Number.parseInt(daysCount, 10) || 30)),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-5 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white">{t.newMonthModalTitle}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">{t.newMonthModalDesc}</p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t.setMonthLabel}</label>
            <input
              type="text"
              required
              maxLength={64}
              value={monthBn}
              onChange={(e) => setMonthBn(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t.setMonthEnLabel}</label>
            <input
              type="text"
              required
              maxLength={64}
              value={monthEn}
              onChange={(e) => setMonthEn(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Month (1–12)</label>
            <input
              type="number"
              min="1"
              max="12"
              value={monthNum}
              onChange={(e) => setMonthNum(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono-num"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Year</label>
            <input
              type="number"
              min="2020"
              max="2100"
              value={yearNum}
              onChange={(e) => setYearNum(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono-num"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Days (28–31)</label>
            <input
              type="number"
              min="28"
              max="31"
              value={daysCount}
              onChange={(e) => setDaysCount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono-num"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium cursor-pointer"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold cursor-pointer"
          >
            {t.createNewMonth}
          </button>
        </div>
      </form>
    </div>
  );
}
