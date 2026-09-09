import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

/* Brand glyphs — lucide removed brand icons, so draw them in the same stroke style */
const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TelegramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white pt-16 md:pt-20 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <Link to="/" aria-label="Ethio-Can Gemstones — Home" className="inline-flex items-center gap-3 mb-4 md:mb-6">
              <img src="/images/logo-white.png" alt="Ethio-Can Gemstones logo" className="w-11 h-11 object-contain" />
              <span className="flex flex-col leading-none">
                <span className="font-brand text-xl md:text-2xl tracking-[2px] uppercase">Ethio-Can</span>
                <span aria-hidden="true" className="flex justify-between uppercase text-[9px] md:text-[10px] text-gold mt-1">
                  {'Gemstones'.split('').map((ch, i) => <span key={i}>{ch}</span>)}
                </span>
              </span>
            </Link>
            <p className="text-white/50 font-light text-sm leading-relaxed mb-5 md:mb-6">
              Ethiopian Welo opals straight from the source — rough, crystal,
              and polished. Sorted by hand, sold by gram & carat since 2012.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2.5 border border-white/20 hover:border-gold hover:text-gold transition-all duration-300">
                <InstagramIcon />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2.5 border border-white/20 hover:border-gold hover:text-gold transition-all duration-300">
                <FacebookIcon />
              </a>
              <a href="https://t.me" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="p-2.5 border border-white/20 hover:border-gold hover:text-gold transition-all duration-300">
                <TelegramIcon />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-gold text-[10px] md:text-xs tracking-[2px] md:tracking-[3px] uppercase mb-4 md:mb-6">
              Shop
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {[
                { name: 'Rough Opal', category: 'Rough Opal' },
                { name: 'Crystal Opal', category: 'Crystal Opal' },
                { name: 'Polished Opal', category: 'Polished Opal' },
              ].map(({ name, category }) => (
                <li key={name}>
                  <Link to={`/shop?category=${encodeURIComponent(category)}`} className="text-white/50 text-xs md:text-sm font-light hover:text-gold transition-colors duration-300">
                    {name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/shop" className="text-white/50 text-xs md:text-sm font-light hover:text-gold transition-colors duration-300">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-gold text-[10px] md:text-xs tracking-[2px] md:tracking-[3px] uppercase mb-4 md:mb-6">
              Company
            </h4>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <Link to="/about" className="text-white/50 text-xs md:text-sm font-light hover:text-gold transition-colors duration-300">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-white/50 text-xs md:text-sm font-light hover:text-gold transition-colors duration-300">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/50 text-xs md:text-sm font-light hover:text-gold transition-colors duration-300">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gold text-[10px] md:text-xs tracking-[2px] md:tracking-[3px] uppercase mb-4 md:mb-6">
              Contact
            </h4>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-gold flex-shrink-0" />
                <span className="text-white/50 text-xs md:text-sm font-light">
                  +1 647-719-3169
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-gold flex-shrink-0" />
                <span className="text-white/50 text-xs md:text-sm font-light">
                  ethiocan_gemstone@yahoo.com
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={16} className="text-gold flex-shrink-0" />
                <span className="text-white/50 text-xs md:text-sm font-light">
                  Toronto, Ontario, Canada
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
            <p className="text-white/30 text-xs md:text-sm font-light">
              © {currentYear} Ethio-Can Gemstones. All rights reserved.
            </p>
            <div className="flex gap-4 md:gap-6">
              <Link to="/admin" className="text-white/30 text-xs md:text-sm hover:text-gold transition-colors duration-300">
                Admin
              </Link>
              <Link to="/privacy" className="text-white/30 text-xs md:text-sm hover:text-gold transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-white/30 text-xs md:text-sm hover:text-gold transition-colors duration-300">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
