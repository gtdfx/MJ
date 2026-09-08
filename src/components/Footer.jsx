import { Link } from 'react-router-dom';
import { Diamond, Globe, Heart, Share2, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white pt-16 md:pt-20 pb-6 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 md:mb-6">
              <Diamond size={22} className="text-gold" />
              <span className="font-playfair text-xl md:text-2xl tracking-[2px] md:tracking-[3px] uppercase">
                MJ
              </span>
            </Link>
            <p className="text-white/50 font-light text-sm leading-relaxed mb-5 md:mb-6">
              Crafting timeless elegance since 1874. Every piece tells a story
              of unparalleled artistry and dedication to perfection.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="p-2.5 border border-white/20 hover:border-gold hover:text-gold transition-all duration-300">
                <Heart size={16} />
              </a>
              <a href="#" aria-label="Facebook" className="p-2.5 border border-white/20 hover:border-gold hover:text-gold transition-all duration-300">
                <Globe size={16} />
              </a>
              <a href="#" aria-label="Twitter" className="p-2.5 border border-white/20 hover:border-gold hover:text-gold transition-all duration-300">
                <Share2 size={16} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-gold text-[10px] md:text-xs tracking-[2px] md:tracking-[3px] uppercase mb-4 md:mb-6">
              Shop
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {['Rings', 'Necklaces', 'Earrings', 'Bracelets'].map((item) => (
                <li key={item}>
                  <Link to="/shop" className="text-white/50 text-xs md:text-sm font-light hover:text-gold transition-colors duration-300">
                    {item}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/shop" className="text-white/50 text-xs md:text-sm font-light hover:text-gold transition-colors duration-300">
                  Collections
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
              {['Craftsmanship', 'Sustainability', 'Press'].map((item) => (
                <li key={item}>
                  <Link to="/about" className="text-white/50 text-xs md:text-sm font-light hover:text-gold transition-colors duration-300">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gold text-[10px] md:text-xs tracking-[2px] md:tracking-[3px] uppercase mb-4 md:mb-6">
              Contact
            </h4>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-gold mt-0.5 flex-shrink-0" />
                <span className="text-white/50 text-xs md:text-sm font-light">
                  1504-25 Richview Rd<br />Etobicoke, ON M9A 4Y3
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-gold flex-shrink-0" />
                <span className="text-white/50 text-xs md:text-sm font-light">
                  +1 647-719-3169
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-gold flex-shrink-0" />
                <span className="text-white/50 text-xs md:text-sm font-light">
                  mesfinkibret@yahoo.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
            <p className="text-white/30 text-xs md:text-sm font-light">
              © {currentYear} MJ. All rights reserved.
            </p>
            <div className="flex gap-4 md:gap-6">
              <Link to="/admin" className="text-white/30 text-xs md:text-sm hover:text-gold transition-colors duration-300">
                Admin
              </Link>
              <a href="#" className="text-white/30 text-xs md:text-sm hover:text-gold transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-white/30 text-xs md:text-sm hover:text-gold transition-colors duration-300">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
