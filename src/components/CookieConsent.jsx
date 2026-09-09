import { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('mj-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('ecg-cookie-consent', 'accepted');
    localStorage.setItem('mj-cookie-consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('ecg-cookie-consent', 'declined');
    localStorage.setItem('mj-cookie-consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-0 left-0 right-0 z-40 p-4 md:p-6">
      <div className="max-w-3xl mx-auto bg-charcoal text-white border border-gold/30 shadow-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
        <div className="flex items-start gap-3 flex-1">
          <Cookie size={24} className="text-gold shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-light leading-relaxed">
              We use cookies to enhance your browsing experience, analyze site traffic,
              and personalize content. By continuing to browse, you agree to our use of cookies.
            </p>
            <Link
              to="/privacy"
              onClick={accept}
              className="text-gold text-xs tracking-wider uppercase hover:text-gold-light transition-colors mt-1 inline-block"
            >
              Learn More
            </Link>
          </div>
        </div>
        <div className="flex gap-3 shrink-0 w-full sm:w-auto">
          <button
            onClick={decline}
            className="flex-1 sm:flex-none px-5 py-2.5 border border-white/30 text-white text-xs tracking-[2px] uppercase hover:border-white transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-gold text-charcoal text-xs tracking-[2px] uppercase font-medium hover:bg-gold-light transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;