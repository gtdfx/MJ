import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, ChevronDown } from 'lucide-react';
import { useAdmin } from '../AdminContext';

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
};

const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered'];

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useAdmin();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const filtered = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500">{orders.length} total orders</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statuses.filter(s => s !== 'all').map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(filterStatus === status ? 'all' : status)}
            className={`p-3 rounded-lg text-center transition-all border ${
              filterStatus === status ? 'border-gold bg-gold/5' : 'border-gray-100 bg-white hover:bg-gray-50'
            }`}
          >
            <p className="text-lg font-semibold text-gray-900 capitalize">{orders.filter(o => o.status === status).length}</p>
            <p className="text-xs text-gray-500 capitalize">{status}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by order ID or customer..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filtered.map(order => (
          <motion.div
            key={order.id}
            layout
            className="bg-white rounded-xl border border-gray-100 overflow-hidden"
          >
            <div
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-gray-900">{order.id}</p>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{order.customer} · {order.date}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">${order.total.toLocaleString()}</p>
              <ChevronDown size={18} className={`text-gray-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
            </div>

            {/* Expanded Details */}
            {expandedOrder === order.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="border-t border-gray-100 p-4 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Customer</p>
                    <p className="text-sm text-gray-900">{order.customer}</p>
                    <p className="text-sm text-gray-500">{order.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Shipping Address</p>
                    <p className="text-sm text-gray-900">{order.address}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Items</p>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">${(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Update Status:</p>
                  {statuses.filter(s => s !== 'all').map(status => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(order.id, status)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg capitalize transition-colors ${
                        order.status === status ? 'bg-charcoal text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">No orders found</div>
        )}
      </div>
    </div>
  );
}
