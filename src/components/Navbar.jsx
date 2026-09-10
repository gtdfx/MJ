import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = ({ onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const leftLinks = [
    { name: 'Collections', href: '/shop' },
    { name: 'Shop', href: '/shop' },
  ];
  const rightLinks = [
    { name: 'About', href: '/about' },
    { name: 'Track Order', href: '/track-order' },
    { name: 'Contact', href: '/contact' },
  ];

  const navScrolled = isScrolled || !isHome;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        navScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-black/5'
          : 'bg-black/30 backdrop-blur-sm'
      }`}
    >
      {/* Top Bar - hidden on mobile */}
      <div className={`border-b transition-all duration-500 hidden md:block ${
        navScrolled
          ? 'border-light-gray/50 h-0 overflow-hidden opacity-0'
          : 'border-gold/20 h-9 opacity-100'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-center">
          <p className={`text-xs tracking-[3px] uppercase transition-colors duration-500 ${
            navScrolled ? 'text-charcoal' : 'text-white/80'
          }`}>
            Free shipping on orders over $100 · Insured worldwide delivery
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-3 items-center h-16 md:h-20">
          {/* Nav Links - Left (desktop only) */}
          <div className="hidden lg:flex items-center gap-8">
            {leftLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm tracking-[1.5px] uppercase font-light transition-all duration-300 hover:text-gold relative group ${
                  navScrolled ? 'text-charcoal' : 'text-white'
                }`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Logo — centered but nudged left for visual balance */}
          <Link to="/" aria-label="Ethio-Can Gemstones — Home" className="flex items-center justify-center pl-4 gap-2 md:gap-3 group">
            <img
              src={navScrolled ? '/images/logo-black.png' : '/images/logo-white.png'}
              alt="Ethio-Can Gemstones logo"
              className="w-9 h-9 md:w-11 md:h-11 object-contain transition-all duration-500 group-hover:scale-105"
            />
            <span className="flex flex-col leading-none">
              <span className={`font-brand text-xl md:text-2xl lg:text-[1.5rem] tracking-[2px] md:tracking-[3px] uppercase whitespace-nowrap transition-colors duration-500 ${
                navScrolled ? 'text-charcoal' : 'text-white'
              }`}>
                Ethio-Can
              </span>
              <span aria-hidden="true" className={`flex justify-between uppercase font-light text-[8px] md:text-[9px] lg:text-[10px] mt-1 transition-colors duration-500 ${
                navScrolled ? 'text-gold' : 'text-gold-light'
              }`}>
                {'Gemstones'.split('').map((ch, i) => <span key={i}>{ch}</span>)}
              </span>
            </span>
          </Link>

          {/* Nav Links - Right (desktop) + Icons (all devices) */}
          <div className="flex items-center justify-end gap-2 md:gap-5">
            <div className="hidden lg:flex items-center gap-6">
              {rightLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-sm tracking-[1.5px] uppercase font-light whitespace-nowrap transition-all duration-300 hover:text-gold relative group ${
                    navScrolled ? 'text-charcoal' : 'text-white'
                  }`}
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Desktop search — mobile uses the bottom-nav search button */}
            <button
              onClick={onOpenSearch}
              aria-label="Search products"
              className={`hidden md:block p-2 transition-colors duration-300 hover:text-gold ${
                navScrolled ? 'text-charcoal' : 'text-white'
              }`}
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setIsOpen(true)}
              aria-label={`Cart, ${totalItems} items`}
              className={`relative p-2 -mr-2 md:mr-0 transition-colors duration-300 hover:text-gold ${
                navScrolled ? 'text-charcoal' : 'text-white'
              }`}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
