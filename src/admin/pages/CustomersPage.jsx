import { useState } from 'react';
import { Search, Mail, ShoppingBag, Users } from 'lucide-react';
import { useAdmin } from '../AdminContext';

export default function CustomersPage() {
  const { customers } = useAdmin();
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => b.totalSpent - a.totalSpent);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        <p className="text-sm text-gray-500">{customers.length} registered customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Customers</p>
          <p className="text-2xl font-semibold text-gray-900">{customers.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Avg. Lifetime Value</p>
          <p className="text-2xl font-semibold text-gray-900">${customers.length > 0 ? Math.round(customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length).toLocaleString() : 0}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Avg. Orders per Customer</p>
          <p className="text-2xl font-semibold text-gray-900">{customers.length > 0 ? (customers.reduce((s, c) => s + c.orders, 0) / customers.length).toFixed(1) : '0.0'}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
        />
      </div>

      {/* Customers — cards on mobile, table on desktop */}
      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 text-center py-16">
            <Users size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">{customers.length === 0 ? 'No customers yet' : 'No customers match your search'}</p>
            <p className="text-gray-400 text-sm mt-1">{customers.length === 0 ? 'Customer records are created automatically when orders are placed.' : 'Try a different name or email.'}</p>
          </div>
        ) : filtered.map(customer => (
          <div key={customer.id} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-medium text-sm shrink-0">
                {customer.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{customer.name}</p>
                <p className="text-xs text-gray-500 truncate">{customer.email}</p>
              </div>
              <a href={`mailto:${customer.email}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-blue-600 shrink-0">
                <Mail size={16} />
              </a>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-50 text-center">
              <div>
                <p className="text-sm font-semibold text-gray-900">{customer.orders}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Orders</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">${customer.totalSpent.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Spent</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{customer.joined}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Joined</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Orders</th>
                <th className="px-5 py-3 font-medium">Total Spent</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <Users size={36} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">{customers.length === 0 ? 'No customers yet' : 'No customers match your search'}</p>
                    <p className="text-gray-400 text-sm mt-1">{customers.length === 0 ? 'Customer records are created automatically when orders are placed.' : 'Try a different name or email.'}</p>
                  </td>
                </tr>
              ) : filtered.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-gold font-medium text-sm">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">{customer.orders}</td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">${customer.totalSpent.toLocaleString()}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{customer.joined}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <a href={`mailto:${customer.email}`} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-blue-600">
                        <Mail size={16} />
                      </a>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                        <ShoppingBag size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
