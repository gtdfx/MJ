import { useState } from 'react';
import { Search, Mail, ShoppingBag } from 'lucide-react';
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
          <p className="text-2xl font-semibold text-gray-900">${Math.round(customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Avg. Orders per Customer</p>
          <p className="text-2xl font-semibold text-gray-900">{(customers.reduce((s, c) => s + c.orders, 0) / customers.length).toFixed(1)}</p>
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

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
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
              {filtered.map(customer => (
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
