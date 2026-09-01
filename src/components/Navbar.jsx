import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, ShoppingBag, Diamond } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

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
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          navScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-black/5'
            : 'bg-transparent'
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
              Free shipping on orders over $1,000 · Complimentary gift wrapping
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 -ml-2 transition-colors duration-300 ${
                navScrolled ? 'text-charcoal' : 'text-white'
              }`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Nav Links - Left (desktop only) */}
            <div className="hidden lg:flex items-center gap-10 flex-1">
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

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
              <Diamond
                size={22}
                className={`transition-all duration-500 group-hover:rotate-12 ${
                  navScrolled ? 'text-gold' : 'text-gold-light'
                }`}
              />
              <span className={`font-playfair text-lg md:text-2xl lg:text-3xl tracking-[3px] md:tracking-[4px] uppercase transition-colors duration-500 ${
                navScrolled ? 'text-charcoal' : 'text-white'
              }`}>
                MJ
              </span>
            </Link>

            {/* Nav Links - Right (desktop only) */}
            <div className="hidden lg:flex items-center gap-10 flex-1 justify-end">
              {rightLinks.map((link) => (
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

            {/* Icons */}
            <div className="flex items-center gap-3 md:gap-5">
              <button
                className={`hidden md:block p-2 transition-colors duration-300 hover:text-gold ${
                  navScrolled ? 'text-charcoal' : 'text-white'
                }`}
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setIsOpen(true)}
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

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute top-0 left-0 h-full w-80 bg-white transform transition-transform duration-500 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="pt-24 px-8">
            <div className="flex items-center gap-3 mb-12">
              <Diamond size={24} className="text-gold" />
              <span className="font-playfair text-2xl tracking-[3px] uppercase text-charcoal">
                MJ
              </span>
            </div>
            {[...leftLinks, ...rightLinks].map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-4 text-sm tracking-[2px] uppercase text-charcoal hover:text-gold transition-colors duration-300 border-b border-light-gray/50"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
