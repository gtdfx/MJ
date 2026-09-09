import { NavLink, Outlet, useLocation, Navigate, Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, ChevronLeft, LogOut, Bell, Search, Warehouse, BarChart3, Tag, Star, BellRing, ClipboardList, ExternalLink, Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/inventory', icon: Warehouse, label: 'Inventory' },
  { to: '/admin/customers', icon: Users, label: 'Customers' },
  { to: '/admin/discounts', icon: Tag, label: 'Discounts' },
  { to: '/admin/reviews', icon: Star, label: 'Reviews' },
  { to: '/admin/notifications', icon: BellRing, label: 'Notifications' },
  { to: '/admin/audit-log', icon: ClipboardList, label: 'Audit Log' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // off-canvas drawer
  const location = useLocation();
  const { isAuthenticated, logout } = useAdmin();

  // Close the mobile drawer whenever the route changes (must precede early return)
  React.useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Guard: redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const pageTitle = (() => {
    const match = navItems.find(n => n.to === location.pathname);
    return match ? match.label : 'Dashboard';
  })();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — collapses on desktop, off-canvas drawer on mobile */}
      <aside className={`${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-charcoal text-white transition-transform duration-300 flex flex-col shrink-0
      lg:static lg:translate-x-0 lg:z-auto ${sidebarOpen ? 'lg:w-64' : 'lg:w-20'} lg:transition-all`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10">
          <img src="/images/logo-white.png" alt="Ethio-Can Gemstones logo" className="w-8 h-8 object-contain shrink-0" />
          <span className="font-playfair text-base tracking-[2px] uppercase whitespace-nowrap hidden lg:inline">Ethio-Can <span className="text-gold">Admin</span></span>
          <span className="font-playfair text-base tracking-[2px] uppercase whitespace-nowrap lg:hidden">Ethio-Can <span className="text-gold">Admin</span></span>
          {/* Mobile close */}
          <button onClick={() => setMobileOpen(false)} className="ml-auto text-white/50 hover:text-white transition-colors lg:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
          {/* Desktop collapse */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-auto text-white/50 hover:text-white transition-colors hidden lg:block">
            <ChevronLeft size={18} className={`transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-gold/20 text-gold'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={20} strokeWidth={1.5} className="shrink-0" />
              <span className="text-sm tracking-wide">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-white/50 hover:bg-white/5 hover:text-white transition-all"
          >
            <ExternalLink size={18} strokeWidth={1.5} className="shrink-0" />
            <span className="text-sm">Back to Store</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut size={18} strokeWidth={1.5} className="shrink-0" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} className="text-gray-600" />
            </button>
            <h2 className="font-playfair text-lg text-charcoal">{pageTitle}</h2>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
              <Search size={16} className="text-gray-400" />
              <input type="text" placeholder="Search..." className="bg-transparent text-sm outline-none w-48" />
            </div>
            <Link to="/admin/notifications" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} className="text-gray-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full" />
            </Link>
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white text-sm font-medium">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
