import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Trash2, Check, CheckCheck } from 'lucide-react';

// Notifications start empty — real alerts (new orders, low stock, new reviews) will appear as they happen.
const seedNotifications = [];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(seedNotifications);
  const [filter, setFilter] = useState('all');

  const filtered = notifications.filter(n => filter === 'all' || (filter === 'unread' && !n.read) || n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

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
          {filtered.map(n => (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={`bg-white rounded-xl border p-4 flex items-start gap-4 transition-colors ${!n.read ? 'border-gold/20 bg-gold/5' : 'border-gray-100'}`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${n.color}`}>
                <n.icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-gray-900">{n.title}</h3>
                  {!n.read && <span className="w-2 h-2 bg-gold rounded-full shrink-0" />}
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {!n.read && (
                  <button onClick={() => markAsRead(n.id)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600" title="Mark as read">
                    <Check size={14} />
                  </button>
                )}
                <button onClick={() => deleteNotification(n.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No notifications</div>}
      </div>
    </div>
  );
}
