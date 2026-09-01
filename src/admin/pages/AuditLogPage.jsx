import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Package, ShoppingCart, Users, Settings, Tag, Warehouse, UserPlus, Edit2, Trash2, Plus, ArrowUpDown } from 'lucide-react';

const actionIcons = {
  product: Package, order: ShoppingCart, customer: Users, settings: Settings,
  discount: Tag, inventory: Warehouse, auth: UserPlus,
};
const actionColors = {
  create: 'text-emerald-600 bg-emerald-50', update: 'text-blue-600 bg-blue-50',
  delete: 'text-red-600 bg-red-50', status: 'text-purple-600 bg-purple-50',
};
const actionLabels = { create: 'Created', update: 'Updated', delete: 'Deleted', status: 'Status Changed' };

// Seed audit log
const seedLog = [
  { id: 1, action: 'status', entity: 'order', entityId: 'ORD-008', description: 'Order status updated to pending', user: 'Admin', timestamp: '2026-08-31T22:00:00' },
  { id: 2, action: 'create', entity: 'order', entityId: 'ORD-007', description: 'New order created — $6,800', user: 'System', timestamp: '2026-08-31T07:00:00' },
  { id: 3, action: 'update', entity: 'inventory', entityId: 'MJ-RNG-007', description: 'Stock adjusted: -1 (Sale)', user: 'Admin', timestamp: '2026-08-30T16:00:00' },
  { id: 4, action: 'create', entity: 'order', entityId: 'ORD-006', description: 'New order created — $9,500', user: 'System', timestamp: '2026-08-27T12:00:00' },
  { id: 5, action: 'update', entity: 'order', entityId: 'ORD-005', description: 'Order status updated to delivered', user: 'Admin', timestamp: '2026-08-28T11:30:00' },
  { id: 6, action: 'create', entity: 'discount', entityId: 'WELCOME10', description: 'New coupon created: 10% off', user: 'Admin', timestamp: '2026-08-25T10:00:00' },
  { id: 7, action: 'update', entity: 'product', entityId: 'MJ-RNG-001', description: 'Product price updated to $4,850', user: 'Admin', timestamp: '2026-08-24T14:00:00' },
  { id: 8, action: 'delete', entity: 'product', entityId: 'MJ-NCK-010', description: 'Product deleted: Old Pendant', user: 'Admin', timestamp: '2026-08-23T09:00:00' },
  { id: 9, action: 'update', entity: 'settings', entityId: 'store', description: 'Store email updated', user: 'Admin', timestamp: '2026-08-22T15:00:00' },
  { id: 10, action: 'create', entity: 'customer', entityId: '6', description: 'New customer registered: Marcus Lee', user: 'System', timestamp: '2026-08-20T11:00:00' },
  { id: 11, action: 'update', entity: 'inventory', entityId: 'MJ-EAR-003', description: 'Stock adjusted: +5 (Restock)', user: 'Admin', timestamp: '2026-08-19T10:00:00' },
  { id: 12, action: 'status', entity: 'order', entityId: 'ORD-004', description: 'Order status updated to processing', user: 'Admin', timestamp: '2026-08-18T14:00:00' },
];

export default function AuditLogPage() {
  const [log] = useState(seedLog);
  const [search, setSearch] = useState('');
  const [filterEntity, setFilterEntity] = useState('all');

  const filtered = log.filter(entry => {
    const matchSearch = entry.description.toLowerCase().includes(search.toLowerCase()) || entry.entityId.toLowerCase().includes(search.toLowerCase());
    const matchEntity = filterEntity === 'all' || entry.entity === filterEntity;
    return matchSearch && matchEntity;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Audit Log</h1>
        <p className="text-sm text-gray-500">{log.length} actions recorded</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search log entries..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[{ k: 'all', l: 'All' }, { k: 'product', l: 'Products' }, { k: 'order', l: 'Orders' }, { k: 'inventory', l: 'Inventory' }, { k: 'discount', l: 'Discounts' }, { k: 'customer', l: 'Customers' }, { k: 'settings', l: 'Settings' }].map(f => (
            <button key={f.k} onClick={() => setFilterEntity(f.k)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterEntity === f.k ? 'bg-charcoal text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{f.l}</button>
          ))}
        </div>
      </div>

      {/* Log Entries */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Action</th>
                <th className="px-5 py-3 font-medium">Entity</th>
                <th className="px-5 py-3 font-medium">Description</th>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(entry => {
                const Icon = actionIcons[entry.entity] || Package;
                const colorClass = actionColors[entry.action] || 'text-gray-600 bg-gray-50';
                return (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
                        <Icon size={16} />
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">{entry.entity}</span>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm text-gray-900">{entry.description}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{entry.entityId}</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">{entry.user}</td>
                    <td className="px-5 py-3 text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No log entries found</div>}
      </div>
    </div>
  );
}
