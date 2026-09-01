import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Copy, Trash2, Edit2, X, Tag, Percent, DollarSign, Calendar, Check, Truck } from 'lucide-react';
import { useAdmin } from '../AdminContext';

const seedCoupons = [
  { id: 1, code: 'WELCOME10', type: 'percentage', value: 10, minOrder: 500, maxUses: 100, usedCount: 23, active: true, expiresAt: '2026-12-31', description: 'Welcome discount for new customers' },
  { id: 2, code: 'LUXURY500', type: 'fixed', value: 500, minOrder: 3000, maxUses: 50, usedCount: 12, active: true, expiresAt: '2026-09-30', description: '$500 off orders over $3,000' },
  { id: 3, code: 'SUMMER20', type: 'percentage', value: 20, minOrder: 1000, maxUses: 200, usedCount: 89, active: false, expiresAt: '2026-08-31', description: 'Summer sale — 20% off' },
  { id: 4, code: 'FREESHIP', type: 'shipping', value: 0, minOrder: 0, maxUses: 999, usedCount: 156, active: true, expiresAt: '2026-12-31', description: 'Free shipping on all orders' },
];

export default function DiscountsPage() {
  const [coupons, setCoupons] = useState(seedCoupons);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [copied, setCopied] = useState(null);
  const [form, setForm] = useState({ code: '', type: 'percentage', value: '', minOrder: '', maxUses: '', expiresAt: '', description: '' });

  const openAdd = () => {
    setEditing(null);
    setForm({ code: '', type: 'percentage', value: '', minOrder: '', maxUses: '', expiresAt: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (coupon) => {
    setEditing(coupon);
    setForm({ code: coupon.code, type: coupon.type, value: coupon.value.toString(), minOrder: coupon.minOrder.toString(), maxUses: coupon.maxUses.toString(), expiresAt: coupon.expiresAt, description: coupon.description });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, value: parseFloat(form.value) || 0, minOrder: parseFloat(form.minOrder) || 0, maxUses: parseInt(form.maxUses) || 999 };
    if (editing) {
      setCoupons(prev => prev.map(c => c.id === editing.id ? { ...c, ...data } : c));
    } else {
      setCoupons(prev => [...prev, { ...data, id: Date.now(), usedCount: 0, active: true }]);
    }
    setShowModal(false);
  };

  const toggleActive = (id) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const deleteCoupon = (id) => {
    if (confirm('Delete this coupon?')) setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Discounts & Coupons</h1>
          <p className="text-sm text-gray-500">{coupons.length} coupons · {coupons.filter(c => c.active).length} active</p>
        </div>
        <button onClick={openAdd} className="bg-gold hover:bg-gold-dark text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <Tag size={18} className="text-gold mb-2" />
          <p className="text-2xl font-semibold text-gray-900">{coupons.length}</p>
          <p className="text-xs text-gray-500">Total Coupons</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-semibold text-emerald-600">{coupons.filter(c => c.active).length}</p>
          <p className="text-xs text-gray-500">Active</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-semibold text-gray-900">{coupons.reduce((s, c) => s + c.usedCount, 0)}</p>
          <p className="text-xs text-gray-500">Total Redemptions</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-semibold text-gray-900">${(coupons.filter(c => c.type === 'fixed').reduce((s, c) => s + c.value * c.usedCount, 0)).toLocaleString()}</p>
          <p className="text-xs text-gray-500">Discount Given</p>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Code</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Value</th>
                <th className="px-5 py-3 font-medium">Min. Order</th>
                <th className="px-5 py-3 font-medium">Usage</th>
                <th className="px-5 py-3 font-medium">Expires</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons.map(coupon => (
                <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-gray-900">{coupon.code}</span>
                      <button onClick={() => copyCode(coupon.code)} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                        {copied === coupon.code ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{coupon.description}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize flex items-center gap-1 w-fit">
                      {coupon.type === 'percentage' ? <Percent size={10} /> : coupon.type === 'fixed' ? <DollarSign size={10} /> : <Truck size={10} />}
                      {coupon.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">
                    {coupon.type === 'percentage' ? `${coupon.value}%` : coupon.type === 'fixed' ? `$${coupon.value}` : 'Free'}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">
                    {coupon.minOrder > 0 ? `$${coupon.minOrder.toLocaleString()}` : '—'}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">
                    {coupon.usedCount} / {coupon.maxUses}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">{coupon.expiresAt}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => toggleActive(coupon.id)} className={`relative w-10 h-5 rounded-full transition-colors ${coupon.active ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${coupon.active ? 'translate-x-5' : ''}`} />
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(coupon)} className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600"><Edit2 size={14} /></button>
                      <button onClick={() => deleteCoupon(coupon.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-xl w-full max-w-md p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-medium text-gray-900">{editing ? 'Edit Coupon' : 'Create Coupon'}</h3>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                  <input type="text" required value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="e.g. SUMMER20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold">
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                      <option value="shipping">Free Shipping</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                    <input type="number" required value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder={form.type === 'percentage' ? '10' : '500'} disabled={form.type === 'shipping'} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min. Order ($)</label>
                    <input type="number" value={form.minOrder} onChange={e => setForm({ ...form, minOrder: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
                    <input type="number" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="999" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expires</label>
                  <input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="Short description" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2.5 bg-gold hover:bg-gold-dark text-white rounded-lg text-sm font-medium transition-colors">{editing ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
