import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, ExternalLink } from 'lucide-react';
import { useAdmin } from '../admin/AdminContext';
import Newsletter from '../components/Newsletter';

const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
const statusIcons = { pending: Clock, processing: Package, shipped: Truck, delivered: CheckCircle };
const statusLabels = { pending: 'Order Placed', processing: 'Preparing', shipped: 'In Transit', delivered: 'Delivered' };

export default function OrderTrackingPage() {
  const { orders } = useAdmin();
  const [query, setQuery] = useState('');
  const [foundOrder, setFoundOrder] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
    setFoundOrder(null);
    if (!query.trim()) { setError('Please enter an order ID or tracking number'); return; }
    const order = orders.find(o =>
      o.id.toLowerCase() === query.trim().toLowerCase() ||
      (o.trackingNumber && o.trackingNumber.toLowerCase() === query.trim().toLowerCase())
    );
    if (order) { setFoundOrder(order); }
    else { setError('No order found. Please check your order ID or tracking number.'); }
  };

  const currentStepIndex = foundOrder ? statusSteps.indexOf(foundOrder.status) : 0;

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="relative h-[35vh] min-h-[280px] overflow-hidden flex items-center">
        <img src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1920&q=80&fit=crop" alt="Track Order" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-gold-light text-xs tracking-[4px] uppercase mb-3">Order Tracking</p>
            <h1 className="font-playfair text-4xl md:text-5xl text-white font-light mb-6">Track Your Order</h1>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Enter order ID (e.g. ORD-001) or tracking number"
                className="w-full pl-12 pr-4 py-4 border border-light-gray bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
              />
            </div>
            <button type="submit" className="btn-luxury px-8">Track</button>
          </form>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>
      </section>

      {/* Results */}
      {foundOrder && (
        <section className="pb-16">
          <div className="max-w-3xl mx-auto px-4 md:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-light-gray overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b border-light-gray">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-playfair text-xl text-charcoal">{foundOrder.id}</h2>
                    <p className="text-sm text-medium-gray">Placed on {foundOrder.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-cormorant text-2xl text-charcoal">${foundOrder.total.toLocaleString()}</p>
                    {foundOrder.trackingNumber && (
                      <a href="#" className="text-xs text-gold hover:text-gold-dark flex items-center gap-1 justify-end mt-1">
                        Track on carrier site <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Steps */}
              <div className="p-6 border-b border-light-gray">
                <div className="flex items-center justify-between relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-0 right-0 h-[2px] bg-gray-200" />
                  <div className="absolute top-5 left-0 h-[2px] bg-gold transition-all duration-700" style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }} />

                  {statusSteps.map((step, i) => {
                    const Icon = statusIcons[step];
                    const isCompleted = i <= currentStepIndex;
                    const isCurrent = i === currentStepIndex;
                    return (
                      <div key={step} className="relative flex flex-col items-center z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                          isCurrent ? 'bg-gold text-white ring-4 ring-gold/20' : isCompleted ? 'bg-gold text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          <Icon size={18} />
                        </div>
                        <p className={`text-xs mt-2 font-medium ${isCurrent ? 'text-gold' : isCompleted ? 'text-charcoal' : 'text-gray-400'}`}>
                          {statusLabels[step]}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Details */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-cream rounded-lg">
                  <p className="text-[10px] text-medium-gray uppercase tracking-wider mb-1">Shipping To</p>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-gold mt-0.5 shrink-0" />
                    <p className="text-sm text-charcoal">{foundOrder.address}</p>
                  </div>
                </div>
                {foundOrder.trackingNumber && (
                  <div className="p-4 bg-cream rounded-lg">
                    <p className="text-[10px] text-medium-gray uppercase tracking-wider mb-1">Tracking</p>
                    <p className="text-sm font-mono text-charcoal">{foundOrder.trackingNumber}</p>
                    <p className="text-xs text-medium-gray mt-1">{foundOrder.carrier} · ETA: {foundOrder.estimatedDelivery || 'Calculating...'}</p>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="p-6 border-t border-light-gray">
                <p className="text-xs text-medium-gray uppercase tracking-wider mb-3">Items Ordered</p>
                {foundOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-light-gray/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-charcoal">{item.name}</p>
                      <p className="text-xs text-medium-gray">Qty: {item.qty}</p>
                    </div>
                    <p className="font-cormorant text-lg text-charcoal">${(item.price * item.qty).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              {foundOrder.statusHistory && foundOrder.statusHistory.length > 0 && (
                <div className="p-6 border-t border-light-gray">
                  <p className="text-xs text-medium-gray uppercase tracking-wider mb-4">Tracking History</p>
                  <div className="space-y-3">
                    {[...foundOrder.statusHistory].reverse().map((entry, i) => {
                      const sCfg = statusIcons[entry.status];
                      return (
                        <div key={i} className="flex gap-3 items-start">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${i === 0 ? 'bg-gold text-white' : 'bg-gray-100 text-gray-400'}`}>
                            {(() => { const I = statusIcons[entry.status]; return <I size={14} />; })()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-charcoal">{statusLabels[entry.status]}</p>
                            <p className="text-xs text-medium-gray">{new Date(entry.date).toLocaleString()}</p>
                            {entry.note && <p className="text-xs text-medium-gray/70 mt-0.5">{entry.note}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      <Newsletter />
    </div>
  );
}
