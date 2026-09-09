import { NavLink, useLocation } from 'react-router-dom';
import { Home, Gem, Search, Package, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const tabs = [
  { name: 'Home', to: '/', icon: Home, end: true },
  { name: 'Shop', to: '/shop', icon: Gem },
  { name: 'Search', to: null, icon: Search, action: true },
  { name: 'Track', to: '/track-order', icon: Package },
  { name: 'Cart', to: null, icon: ShoppingBag, cart: true },
];

/**
 * Mobile-only bottom navigation bar (hidden md: and up).
 * Fixed to the viewport bottom with a frosted background.
 */
const BottomNav = ({ onSearch }) => {
  const { totalItems, setIsOpen } = useCart();
  const location = useLocation();

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-light-gray bg-white/95 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-5 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          // Center search button — opens the search overlay
          if (tab.action) {
            return (
              <button
                key={tab.name}
                onClick={onSearch}
                aria-label="Search products"
                className="flex flex-col items-center justify-center gap-1 text-medium-gray active:text-gold transition-colors"
              >
                <span className="flex items-center justify-center w-11 h-11 -mt-4 rounded-full bg-gradient-to-br from-gold to-gold-light text-white shadow-lg shadow-gold/40 ring-4 ring-cream">
                  <Search size={20} strokeWidth={1.75} />
                </span>
                <span className="sr-only">Search</span>
              </button>
            );
          }

          const isCart = tab.cart;
          const isActive = tab.end
            ? location.pathname === '/'
            : !isCart && tab.to && location.pathname.startsWith(tab.to);

          // Cart — opens the cart drawer, no navigation
          if (isCart) {
            return (
              <button
                key={tab.name}
                onClick={() => setIsOpen(true)}
                aria-label={`Cart, ${totalItems} items`}
                className={`relative flex flex-col items-center justify-center gap-1 transition-colors ${
                  totalItems > 0 ? 'text-gold-dark' : 'text-medium-gray'
                }`}
              >
                <span className="relative">
                  <ShoppingBag size={20} strokeWidth={totalItems > 0 ? 2 : 1.5} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-gold text-white text-[9px] font-semibold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </span>
                <span className="text-[9px] tracking-[1px] uppercase font-medium">Cart</span>
              </button>
            );
          }

          return (
            <NavLink
              key={tab.name}
              to={tab.to}
              aria-label={tab.name}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? 'text-gold-dark' : 'text-medium-gray'
              }`}
            >
              <span className="relative">
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              </span>
              <span className="text-[9px] tracking-[1px] uppercase font-medium">{tab.name}</span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-gold" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
