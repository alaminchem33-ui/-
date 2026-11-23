import { User } from 'firebase/auth';
import { LogIn, LogOut, Utensils } from 'lucide-react';
import { TranslationStrings } from '../data/i18n';
import { TabKey } from '../types/mess';

interface TopBarProps {
  t: TranslationStrings;
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  user: User | null;
  authLoading: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}

export function TopBar({
  t,
  activeTab,
  onSelectTab,
  user,
  authLoading,
  onSignIn,
  onSignOut,
}: TopBarProps) {
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'main', label: t.tabMain },
    { key: 'bazar', label: t.tabBazar },
    { key: 'dailyMeal', label: t.tabDailyMeal },
    { key: 'settings', label: t.tabSettings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 no-print">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('main')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
        >
          <Utensils className="w-5 h-5 text-blue-400 shrink-0" />
          <span className="text-base sm:text-lg font-bold tracking-tight text-white">
            {t.brandTitle}
          </span>
        </button>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onSelectTab(tab.key)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Account / Cloud Sync Action */}
        <div className="flex items-center shrink-0">
          {authLoading ? (
            <span className="text-xs text-slate-400 whitespace-nowrap">...</span>
          ) : user ? (
            <button
              type="button"
              onClick={onSignOut}
              title={user.displayName || 'Account'}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span className="max-w-[110px] truncate">{user.displayName || 'Account'}</span>
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSignIn}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{t.signInSync}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Strip */}
      <nav className="md:hidden border-t border-slate-800 px-3 flex items-center gap-4 overflow-x-auto bg-slate-900">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelectTab(tab.key)}
              className={`py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-100'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
