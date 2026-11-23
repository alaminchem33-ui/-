import { useState } from 'react';
import { Check, Copy, Download, ExternalLink, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types/mess';

interface PWAInstallButtonProps {
  lang: Language;
}

export function PWAInstallButton({ lang }: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (isInstalled) {
    return null;
  }

  const isBn = lang === 'bn';
  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const capacitorCommands = `npm install @capacitor/core @capacitor/cli @capacitor/android\nnpx cap init "Mess Ledger" "com.messmanager.ledger" --web-dir=dist\nnpx cap add android && npm run build && npx cap sync\nnpx cap open android`;

  const handleClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) return;
    }
    setModalOpen(true);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopiedUrl(true);
      window.setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // Clipboard fallback ignored
    }
  };

  const handleCopyCmd = async () => {
    try {
      await navigator.clipboard.writeText(capacitorCommands);
      setCopiedCmd(true);
      window.setTimeout(() => setCopiedCmd(false), 2000);
    } catch {
      // Clipboard fallback ignored
    }
  };

  const handleDownloadCapacitorConfig = () => {
    const config = {
      appId: 'com.messmanager.ledger',
      appName: 'Mess Ledger',
      webDir: 'dist',
      server: {
        androidScheme: 'https',
      },
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'capacitor.config.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Smartphone className="w-4 h-4" />
        <span>{isBn ? 'অ্যাপ ইনস্টল / APK' : 'Download App'}</span>
      </button>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-5 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  {isBn
                    ? 'মোবাইল অ্যাপ ইনস্টল ও Android APK ডাউনলোড'
                    : 'Install Mobile App & Android APK Guide'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: Instant Android / iOS App Installation (PWA) */}
            <div className="space-y-2.5">
              <h4 className="text-sm font-semibold text-emerald-400">
                {isBn
                  ? '১. ফোনে সরাসরি অ্যাপ ইনস্টল করুন (৩০ সেকেন্ডে, APK ছাড়াই)'
                  : '1. Install Directly on Your Phone (30s, No APK Needed)'}
              </h4>

              {isIOS ? (
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isBn
                    ? 'iPhone/iPad-এ Safari ব্রাউজার থেকে এই লিংকটি ওপেন করে নিচের Share বাটনে ট্যাপ করুন, তারপর "Add to Home Screen" সিলেক্ট করুন।'
                    : 'In Safari on iPhone/iPad, tap the Share button and select "Add to Home Screen".'}
                </p>
              ) : (
                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>
                    {isBn
                      ? 'প্রিভিউ ফ্রেমের বাইরে সরাসরি Google Chrome-এ খুলতে নিচের "অ্যাপ লিংক কপি করুন" ক্লিক করে Chrome-এ পেস্ট করুন (অথবা নতুন ট্যাবে খুলুন)।'
                      : 'Copy the App URL below and open it directly in Google Chrome (outside the preview frame).'}
                  </li>
                  <li>
                    {isBn
                      ? 'Chrome-এর উপরে ডানদিকের ⋮ (৩ ডট মেনু) ট্যাপ করে "Install app" বা "Add to Home screen" সিলেক্ট করুন।'
                      : 'Tap Chrome menu (⋮) and choose "Install app" or "Add to Home screen".'}
                  </li>
                  <li>
                    {isBn
                      ? 'অ্যাপটি আপনার ফোনের হোম স্ক্রিনে আইকনসহ ইনস্টল হবে এবং অফলাইনেও কাজ করবে।'
                      : 'The app installs on your home screen with offline support and Google Sync.'}
                  </li>
                </ol>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={appUrl || '/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isBn ? 'সরাসরি ব্রাউজারে ওপেন করুন' : 'Open App in New Tab'}</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  {copiedUrl ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>
                    {copiedUrl
                      ? isBn
                        ? 'লিংক কপি হয়েছে'
                        : 'Link Copied'
                      : isBn
                      ? 'অ্যাপ লিংক কপি করুন'
                      : 'Copy App URL'}
                  </span>
                </button>
              </div>
            </div>

            {/* Section 2: Standalone .APK Export via GitHub Actions or Capacitor */}
            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <h4 className="text-sm font-semibold text-amber-300">
                {isBn
                  ? '২. পিসি/SDK ছাড়াই .APK ফাইল ডাউনলোড (GitHub Auto-Build)'
                  : '2. Build .APK Without Installing Android Studio (GitHub Actions)'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isBn
                  ? 'এই প্রজেক্টে ইতিমধ্যেই .github/workflows/build-apk.yml ও capacitor.config.json যুক্ত করা হয়েছে। AI Studio থেকে প্রজেক্টটি GitHub-এ সেভ/পুশ করলে GitHub-এর Actions ট্যাব থেকে সরাসরি তৈরি হওয়া app-debug.apk ডাউনলোড করতে পারবেন।'
                  : 'This project already includes .github/workflows/build-apk.yml and capacitor.config.json. Push this project to GitHub from AI Studio and download app-debug.apk from the repository Actions tab.'}
              </p>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono-num text-[11px] text-slate-300 overflow-x-auto whitespace-pre">
                {capacitorCommands}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadCapacitorConfig}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>
                    {isBn ? 'capacitor.config.json ডাউনলোড' : 'Download capacitor.config.json'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyCmd}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  {copiedCmd ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>{copiedCmd ? (isBn ? 'কপি হয়েছে' : 'Copied') : isBn ? 'কমান্ড কপি' : 'Copy Commands'}</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium cursor-pointer"
              >
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
