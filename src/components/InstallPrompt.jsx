import { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare } from 'lucide-react';

const DISMISS_KEY = 'ecg-install-dismissed';
const DISMISS_DAYS = 7;

/**
 * Install prompt for the PWA.
 * - Android/Chrome: surfaces the native install dialog via beforeinstallprompt
 * - iOS Safari: shows an "Add to Home Screen" hint (no native API exists)
 * - Desktop Chrome/Edge: uses the native dialog too
 */
const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    let dismissedAt = 0;
    try {
      dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    } catch {
      // storage unavailable — always show
    }
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000) {
      return;
    }
    // Already installed to the home screen? Don't nag.
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      return;
    }

    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    // iOS Safari never fires beforeinstallprompt — detect it separately
    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    if (isIos) {
      const timer = setTimeout(() => setShowIosHint(true), 4000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore
    }
    setDeferredPrompt(null);
    setShowIosHint(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice.catch(() => {});
    setDeferredPrompt(null);
  };

  if (!deferredPrompt && !showIosHint) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 md:left-auto md:right-6 md:bottom-6 md:max-w-sm">
      <div className="bg-charcoal text-white border border-gold/40 shadow-2xl p-4 flex items-start gap-3">
        <img src="/icons/icon-192.png" alt="" className="w-11 h-11 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-brand text-sm tracking-[2px] uppercase text-white">Etho-Can</p>
          {deferredPrompt ? (
            <>
              <p className="text-white/60 text-xs font-light mt-1 leading-relaxed">
                Install the store on your device — one tap access, works offline.
              </p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={install}
                  className="flex items-center gap-2 bg-gold text-charcoal text-[11px] tracking-[2px] uppercase font-medium px-4 py-2 hover:bg-gold-light transition-colors"
                >
                  <Download size={13} />
                  Install
                </button>
                <button
                  onClick={dismiss}
                  className="text-white/40 text-[11px] tracking-[2px] uppercase hover:text-white transition-colors px-2"
                >
                  Later
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-white/60 text-xs font-light mt-1 leading-relaxed flex flex-wrap items-center gap-1">
                Add this store to your home screen: tap
                <Share size={12} className="text-gold inline" /> then
                <PlusSquare size={12} className="text-gold inline" />
                <span className="whitespace-nowrap">“Add to Home Screen”.</span>
              </p>
              <button
                onClick={dismiss}
                className="text-white/40 text-[11px] tracking-[2px] uppercase hover:text-white transition-colors mt-2 px-0"
              >
                Got it
              </button>
            </>
          )}
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="text-white/40 hover:text-white transition-colors shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
