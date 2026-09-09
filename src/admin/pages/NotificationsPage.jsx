import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ShoppingCart, AlertTriangle, Star, Package, Trash2, Check, CheckCheck } from 'lucide-react';
import { useAdmin } from '../AdminContext';

const typeConfig = {
  order: { icon: ShoppingCart, color: 'text-blue-500 bg-blue-50' },
  inventory: { icon: AlertTriangle, color: 'text-amber-500 bg-amber-50' },
  review: { icon: Star, color: 'text-gold bg-gold/10' },
  product: { icon: Package, color: 'text-purple-500 bg-purple-50' },
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification, clearNotifications } = useAdmin();
  const [filter, setFilter] = useState('all');

  const filtered = notifications.filter(n => filter === 'all' || (filter === 'unread' && !n.read) || n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => markNotificationRead(id);
  const markAllRead = () => markAllNotificationsRead();
  const removeNotification = (id) => deleteNotification(id);
  const clearAll = () => clearNotifications();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500">{unreadCount} unread · {notifications.length} total</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <CheckCheck size={16} /> Mark all read
            </button>
          )}
          <button onClick={clearAll} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Trash2 size={16} /> Clear all
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[{ k: 'all', l: 'All' }, { k: 'unread', l: 'Unread' }, { k: 'order', l: 'Orders' }, { k: 'inventory', l: 'Inventory' }, { k: 'review', l: 'Reviews' }, { k: 'customer', l: 'Customers' }].map(f => (
          <button key={f.k} onClick={() => setFilter(f.k)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f.k ? 'bg-charcoal text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {f.l}
            {f.k === 'unread' && unreadCount > 0 && <span className="ml-1.5 bg-gold text-white text-[10px] w-4 h-4 rounded-full inline-flex items-center justify-center">{unreadCount}</span>}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.map(n => {
            const cfg = typeConfig[n.type] || typeConfig.order;
            const Icon = cfg.icon;
            const timeStr = n.time?.includes('T') || n.time?.includes(':')
              ? new Date(n.time).toLocaleString()
              : n.time;
            return (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`bg-white rounded-xl border p-4 flex items-start gap-4 transition-colors ${!n.read ? 'border-gold/20 bg-gold/5' : 'border-gray-100'}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${cfg.color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-900">{n.title}</h3>
                    {!n.read && <span className="w-2 h-2 bg-gold rounded-full shrink-0" />}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{timeStr}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!n.read && (
                    <button onClick={() => markAsRead(n.id)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600" title="Mark as read">
                      <Check size={14} />
                    </button>
                  )}
                  <button onClick={() => removeNotification(n.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No notifications</div>}
      </div>
    </div>
  );
}
