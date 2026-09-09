import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Truck, Package, Clock, CheckCircle, MapPin, Edit3, Save, X } from 'lucide-react';
import { useAdmin } from '../AdminContext';

const statusConfig = {
  pending: { color: 'bg-amber-100 text-amber-700', icon: Clock, label: 'Pending' },
  processing: { color: 'bg-blue-100 text-blue-700', icon: Package, label: 'Processing' },
  shipped: { color: 'bg-purple-100 text-purple-700', icon: Truck, label: 'Shipped' },
  delivered: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, label: 'Delivered' },
};

const statuses = ['pending', 'processing', 'shipped', 'delivered'];
const carriers = ['UPS', 'USPS', 'FedEx', 'DHL', 'La Poste', 'Other'];

export default function OrdersPage() {
  const { orders, updateOrderStatus, updateOrderTracking, updateOrderNotes } = useAdmin();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [editingTracking, setEditingTracking] = useState(null);
  const [trackingForm, setTrackingForm] = useState({ trackingNumber: '', carrier: '', estimatedDelivery: '' });
  const [editingNotes, setEditingNotes] = useState(null);
  const [notesText, setNotesText] = useState('');

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()) || (o.trackingNumber && o.trackingNumber.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const startEditTracking = (order) => {
    setEditingTracking(order.id);
    setTrackingForm({ trackingNumber: order.trackingNumber || '', carrier: order.carrier || '', estimatedDelivery: order.estimatedDelivery || '' });
  };

  const saveTracking = (orderId) => {
    updateOrderTracking(orderId, trackingForm.trackingNumber, trackingForm.carrier, trackingForm.estimatedDelivery);
    setEditingTracking(null);
  };

  const startEditNotes = (order) => {
    setEditingNotes(order.id);
    setNotesText(order.notes || '');
  };

  const saveNotes = (orderId) => {
    updateOrderNotes(orderId, notesText);
    setEditingNotes(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500">{orders.length} total orders</p>
      </div>

      {/* Status Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statuses.map(status => {
          const cfg = statusConfig[status];
          const count = orders.filter(o => o.status === status).length;
          return (
            <button key={status} onClick={() => setFilterStatus(filterStatus === status ? 'all' : status)} className={`p-4 rounded-xl text-center transition-all border ${filterStatus === status ? 'border-gold bg-gold/5 ring-1 ring-gold/20' : 'border-gray-100 bg-white hover:bg-gray-50'}`}>
              <cfg.icon size={20} className={`${cfg.color.split(' ')[1]} mx-auto mb-2`} />
              <p className="text-2xl font-semibold text-gray-900">{count}</p>
              <p className="text-xs text-gray-500">{cfg.label}</p>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search by order ID, customer, or tracking number..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {filtered.map(order => {
          const cfg = statusConfig[order.status];
          const isExpanded = expandedOrder === order.id;
          return (
            <motion.div key={order.id} layout className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {/* Order Header */}
              <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                    {order.trackingNumber && <span className="text-xs text-gray-400 font-mono hidden sm:inline">📦 {order.trackingNumber}</span>}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{order.customer} · {order.date} · {order.items.length} item(s)</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">${order.total.toLocaleString()}</p>
                <ChevronDown size={18} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </div>

              {/* Expanded */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-gray-100">
                    <div className="p-5 space-y-5">
                      {/* Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Customer</p>
                          <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                          <p className="text-xs text-gray-500">{order.email}</p>
                          {order.phone && <p className="text-xs text-gray-500">{order.phone}</p>}
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Shipping Address</p>
                          <div className="flex items-start gap-2">
                            <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
                            <p className="text-sm text-gray-900">{order.address}</p>
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Tracking</p>
                          {editingTracking === order.id ? (
                            <div className="space-y-2">
                              <input type="text" value={trackingForm.trackingNumber} onChange={e => setTrackingForm({ ...trackingForm, trackingNumber: e.target.value })} placeholder="Tracking number" className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-gold" />
                              <select value={trackingForm.carrier} onChange={e => setTrackingForm({ ...trackingForm, carrier: e.target.value })} className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none">
                                <option value="">Carrier</option>
                                {carriers.map(c => <option key={c}>{c}</option>)}
                              </select>
                              <input type="date" value={trackingForm.estimatedDelivery} onChange={e => setTrackingForm({ ...trackingForm, estimatedDelivery: e.target.value })} className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none" />
                              <div className="flex gap-1">
                                <button onClick={() => saveTracking(order.id)} className="flex-1 px-2 py-1 bg-gold text-white rounded text-xs font-medium"><Save size={12} className="inline mr-1" />Save</button>
                                <button onClick={() => setEditingTracking(null)} className="px-2 py-1 border border-gray-200 rounded text-xs"><X size={12} /></button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div>
                                {order.trackingNumber ? (
                                  <>
                                    <p className="text-xs font-mono text-gray-900">{order.trackingNumber}</p>
                                    <p className="text-xs text-gray-500">{order.carrier} · ETA: {order.estimatedDelivery || '—'}</p>
                                  </>
                                ) : (
                                  <p className="text-xs text-gray-400 italic">No tracking info</p>
                                )}
                              </div>
                              <button onClick={() => startEditTracking(order)} className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"><Edit3 size={14} /></button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Items + Totals */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Items</p>
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                              <div><p className="text-sm text-gray-900">{item.name}</p><p className="text-xs text-gray-500">Qty: {item.qty}</p></div>
                              <p className="text-sm font-medium text-gray-900">${(item.price * item.qty).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Totals</p>
                          <div className="p-3 bg-gray-50 rounded-lg space-y-1.5 text-sm">
                            {order.subtotal != null ? (
                              <>
                                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="text-gray-900">${order.subtotal.toFixed(2)}</span></div>
                                {order.discount > 0 && (
                                  <div className="flex justify-between text-emerald-600"><span>Discount {order.couponCode && `(${order.couponCode})`}</span><span>−${order.discount.toFixed(2)}</span></div>
                                )}
                                <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="text-gray-900">{order.shipping === 0 ? 'Free' : `$${(order.shipping || 0).toFixed(2)}`}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Tax</span><span className="text-gray-900">${(order.tax || 0).toFixed(2)}</span></div>
                                <div className="flex justify-between pt-1.5 border-t border-gray-200 font-medium"><span className="text-gray-900">Total</span><span className="text-gray-900">${order.total.toFixed(2)}</span></div>
                              </>
                            ) : (
                              <div className="flex justify-between font-medium"><span className="text-gray-900">Total</span><span className="text-gray-900">${order.total.toFixed(2)}</span></div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status Timeline */}
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Status Timeline</p>
                        <div className="flex flex-col gap-0 relative">
                          <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-gray-200" />
                          {(order.statusHistory || []).map((entry, i) => {
                            const sCfg = statusConfig[entry.status];
                            return (
                              <div key={i} className="flex gap-3 relative">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${i === (order.statusHistory || []).length - 1 ? sCfg.color.split(' ')[0] : 'bg-gray-200'}`}>
                                  <sCfg.icon size={12} className={i === (order.statusHistory || []).length - 1 ? 'text-white' : 'text-gray-500'} />
                                </div>
                                <div className="pb-4">
                                  <p className="text-sm font-medium text-gray-900">{sCfg.label}</p>
                                  <p className="text-xs text-gray-500">{new Date(entry.date).toLocaleString()}</p>
                                  {entry.note && <p className="text-xs text-gray-400 mt-0.5">{entry.note}</p>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Notes</p>
                          {editingNotes !== order.id && <button onClick={() => startEditNotes(order)} className="text-xs text-gold hover:text-gold-dark"><Edit3 size={12} className="inline mr-1" />Edit</button>}
                        </div>
                        {editingNotes === order.id ? (
                          <div className="flex gap-2">
                            <input type="text" value={notesText} onChange={e => setNotesText(e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gold" placeholder="Add a note..." />
                            <button onClick={() => saveNotes(order.id)} className="px-3 py-2 bg-gold text-white rounded-lg text-sm"><Save size={14} /></button>
                            <button onClick={() => setEditingNotes(null)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm"><X size={14} /></button>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600">{order.notes || <span className="text-gray-400 italic">No notes</span>}</p>
                        )}
                      </div>

                      {/* Status Update Buttons */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mr-2">Update Status:</p>
                        {statuses.map(status => (
                          <button key={status} onClick={() => updateOrderStatus(order.id, status)} className={`text-xs font-medium px-3 py-1.5 rounded-lg capitalize transition-colors ${order.status === status ? 'bg-charcoal text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            {statusConfig[status].label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No orders found</div>}
      </div>
    </div>
  );
}
