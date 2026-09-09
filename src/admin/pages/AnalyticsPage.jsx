import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, BarChart3, ShoppingCart, Eye, CreditCard,
  CheckCircle, Users, DollarSign, ShoppingBag, Activity,
  Smartphone, Monitor, Tablet, Globe, Package, AlertCircle,
} from 'lucide-react';
import { useAdmin } from '../AdminContext';
import useAnalytics from '../../analytics/useAnalytics';

const RANGES = [
  { key: 1, label: 'Today' },
  { key: 7, label: '7 Days' },
  { key: 30, label: '30 Days' },
  { key: 90, label: '90 Days' },
];

const deviceIcons = { mobile: Smartphone, desktop: Monitor, tablet: Tablet };

// ---------- Small chart components ----------

function FunnelBar({ label, value, total, color, icon: Icon, sub }) {
  const pct = total > 0 ? Math.max((value / total) * 100, value > 0 ? 4 : 0) : 0;
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Icon size={15} className="text-gray-400" />
          {label}
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold text-gray-900">{value.toLocaleString()}</span>
          {sub && <span className="text-xs text-gray-400 ml-2">{sub}</span>}
        </div>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function AreaChart({ data, dataKey, color = '#C9A96E', height = 160 }) {
  const max = Math.max(...data.map(d => d[dataKey]), 1);
  const w = 100; // use viewBox percentage space
  const points = data.map((d, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * w;
    const y = 100 - (d[dataKey] / max) * 90;
    return `${x},${y}`;
  });
  const path = `M${points.join(' L')}`;
  const area = `${path} L${w},100 L0,100 Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${w} 100`} preserveAspectRatio="none" style={{ width: '100%', height }}>
        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          d={area}
          fill={color}
          opacity="0.15"
        />
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

function BarSeries({ data, dataKey, color = '#C9A96E', height = 120 }) {
  const max = Math.max(...data.map(d => d[dataKey]), 1);
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
          <div className="absolute -top-6 hidden group-hover:block bg-charcoal text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap z-10">
            {d[dataKey]}
          </div>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${Math.max((d[dataKey] / max) * 100, d[dataKey] > 0 ? 4 : 1)}%` }}
            transition={{ duration: 0.5, delay: i * 0.02 }}
            className="w-full rounded-t"
            style={{ backgroundColor: color }}
          />
          <span className="text-[9px] text-gray-400 mt-1">{d.label.split(' ')[1] || d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ---------- Main page ----------

export default function AnalyticsPage() {
  const { orders, stats } = useAdmin();
  const [range, setRange] = useState(30);
  const a = useAnalytics(range);

  const money = (n) => `$${(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const pct = (n) => `${(n || 0).toFixed(1)}%`;

  const noData = a.totalEvents === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500">Live visitor and sales data — every number is real</p>
        </div>
        <div className="flex gap-2">
          {RANGES.map(r => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${range === r.key ? 'bg-charcoal text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {noData && (
        <div className="bg-gold/5 border border-gold/20 rounded-xl p-5 flex items-start gap-3">
          <AlertCircle size={20} className="text-gold shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-gray-900">No visitor data yet for this period</p>
            <p className="text-gray-500 mt-1">
              Analytics start recording as soon as customers browse the store (with cookie consent).
              Open the storefront, browse a product, add to cart, and check out — then come back to see the full funnel.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards — Shopify style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Gross Sales', value: money(a.revenue), icon: DollarSign, sub: `${a.purchaseCount} ${a.purchaseCount === 1 ? 'order' : 'orders'}`, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Sessions', value: a.funnel.sessions.toLocaleString(), icon: Users, sub: 'unique visits', color: 'text-blue-600 bg-blue-50' },
          { label: 'Conversion Rate', value: pct(a.funnel.sessions ? (a.funnel.purchases / a.funnel.sessions) * 100 : 0), icon: TrendingUp, sub: 'session → order', color: 'text-gold bg-gold/10' },
          { label: 'Avg. Order Value', value: money(a.aov), icon: ShoppingCart, sub: 'per order', color: 'text-purple-600 bg-purple-50' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${kpi.color}`}>
                <kpi.icon size={18} />
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{kpi.value}</p>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-sm text-gray-500">{kpi.label}</p>
              <p className="text-xs text-gray-400">{kpi.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Funnel + Sales Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Conversion Funnel</h3>
            <Activity size={16} className="text-gray-400" />
          </div>
          <FunnelBar label="Sessions" value={a.funnel.sessions} total={a.funnel.sessions} color="#6B7280" icon={Users} />
          <FunnelBar label="Product Views" value={a.funnel.productViews} total={Math.max(a.funnel.sessions, a.funnel.productViews)} color="#3B82F6" icon={Eye} />
          <FunnelBar label="Added to Cart" value={a.funnel.addToCarts} total={Math.max(a.funnel.sessions, a.funnel.addToCarts)} color="#8B5CF6" icon={ShoppingBag} sub={a.funnel.viewToCartRate > 0 && a.funnel.viewToCartRate <= 100 ? pct(a.funnel.viewToCartRate) + ' of viewers' : ''} />
          <FunnelBar label="Checkouts Initiated" value={a.funnel.checkoutsInitiated} total={Math.max(a.funnel.sessions, a.funnel.checkoutsInitiated)} color="#F59E0B" icon={CreditCard} sub={a.funnel.cartToCheckoutRate > 0 && a.funnel.cartToCheckoutRate <= 100 ? pct(a.funnel.cartToCheckoutRate) + ' of carts' : ''} />
          <FunnelBar label="Purchased" value={a.funnel.purchases} total={Math.max(a.funnel.sessions, a.funnel.purchases)} color="#10B981" icon={CheckCircle} sub={a.funnel.checkoutToPurchaseRate > 0 && a.funnel.checkoutToPurchaseRate <= 100 ? pct(a.funnel.checkoutToPurchaseRate) + ' of checkouts' : ''} />
        </div>

        {/* Sales Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Sales Over Time</h3>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">{money(a.revenue)}</p>
              <p className="text-xs text-gray-400">{a.purchaseCount} orders in period</p>
            </div>
          </div>
          <AreaChart data={a.daily} dataKey="revenue" color="#B8944F" height={150} />
          <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Orders / Day (peak)</p>
              <p className="text-lg font-semibold text-gray-900">{Math.max(...a.daily.map(d => d.orders), 0)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Product Views</p>
              <p className="text-lg font-semibold text-gray-900">{a.funnel.productViews.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Carts Created</p>
              <p className="text-lg font-semibold text-gray-900">{a.funnel.addToCarts.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Abandonment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="font-medium text-gray-900 mb-1">Cart Abandonment</h3>
          <p className="text-xs text-gray-400 mb-4">Checkouts started but not completed</p>
          <div className="flex items-end gap-4">
            <p className="font-playfair text-5xl text-charcoal">{pct(a.abandonmentRate)}</p>
            <div className="pb-1.5">
              <p className="text-sm text-gray-600">{a.abandonedCount} abandoned</p>
              <p className="text-sm text-amber-600 font-medium">{money(a.abandonedValue)} left in carts</p>
            </div>
          </div>
          <div className="mt-4 h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${a.abandonmentRate}%` }}
              transition={{ duration: 0.7 }}
              className="h-full bg-amber-400 rounded-full"
            />
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Traffic Sources</h3>
            <Globe size={16} className="text-gray-400" />
          </div>
          {a.sources.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">No sessions recorded yet</p>
          ) : (
            <div className="space-y-2.5">
              {a.sources.slice(0, 5).map(s => (
                <div key={s.source} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="capitalize text-gray-600">{s.source}</span>
                    {s.purchases > 0 && (
                      <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                        {s.purchases} sale{s.purchases > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-900 font-medium">{s.sessions} session{s.sessions > 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Devices */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Devices</h3>
            <Smartphone size={16} className="text-gray-400" />
          </div>
          {a.devices.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">No sessions recorded yet</p>
          ) : (
            <div className="space-y-3">
              {a.devices.map(d => {
                const Icon = deviceIcons[d.device] || Monitor;
                const share = a.funnel.sessions ? (d.sessions / a.funnel.sessions) * 100 : 0;
                return (
                  <div key={d.device}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <div className="flex items-center gap-2 text-gray-600 capitalize">
                        <Icon size={14} className="text-gray-400" /> {d.device}
                      </div>
                      <span className="text-gray-900 font-medium">{pct(share)}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gold rounded-full" style={{ width: `${share}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Products + Daily Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Products */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Product Performance</h3>
            <Package size={16} className="text-gray-400" />
          </div>
          {a.topProducts.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">Product views appear here as customers browse</p>
          ) : (
            <div className="space-y-3">
              {a.topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-400 w-5">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name || `Product #${p.productId}`}</p>
                    <p className="text-xs text-gray-400">
                      {p.views} view{p.views !== 1 ? 's' : ''} · {p.addToCarts} cart add{p.addToCarts !== 1 ? 's' : ''}
                      {p.purchases > 0 && ` · ${p.purchases} sold`}
                    </p>
                  </div>
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden shrink-0">
                    <div className="h-full bg-gold rounded-full" style={{ width: `${(p.views / a.topProducts[0].views) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Daily Orders */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Orders & Sessions by Day</h3>
            <BarChart3 size={16} className="text-gray-400" />
          </div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-2">Orders</p>
          <BarSeries data={a.daily} dataKey="orders" color="#B8944F" height={70} />
          <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-4 mb-2">Sessions</p>
          <BarSeries data={a.daily} dataKey="sessions" color="#6B7280" height={70} />
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Live Activity
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Most recent real customer events</p>
          </div>
          <span className="text-xs text-gray-400">{a.totalEvents} events in period</span>
        </div>
        <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
          {a.recentActivity.length === 0 ? (
            <div className="text-center py-10 text-sm text-gray-400">No activity yet — events appear here in real time</div>
          ) : (
            a.recentActivity.map(ev => {
              const meta = {
                page_view: { label: 'Viewed page', color: 'bg-gray-100 text-gray-600' },
                product_view: { label: 'Viewed product', color: 'bg-blue-50 text-blue-600' },
                add_to_cart: { label: 'Added to cart', color: 'bg-purple-50 text-purple-600' },
                view_cart: { label: 'Viewed cart', color: 'bg-purple-50 text-purple-600' },
                begin_checkout: { label: 'Started checkout', color: 'bg-amber-50 text-amber-600' },
                checkout_shipping: { label: 'Filled shipping', color: 'bg-amber-50 text-amber-600' },
                checkout_payment: { label: 'Reached payment', color: 'bg-orange-50 text-orange-600' },
                purchase: { label: 'Purchased', color: 'bg-emerald-50 text-emerald-600' },
              }[ev.type] || { label: ev.type, color: 'bg-gray-100 text-gray-600' };
              return (
                <div key={ev.id} className="px-5 py-2.5 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${meta.color}`}>{meta.label}</span>
                    <span className="text-gray-600">{ev.productName || ev.page || `${ev.items || ''} ${ev.items ? 'item(s)' : ''}`}</span>
                    {ev.value > 0 && <span className="text-gray-900 font-medium">{money(ev.value)}</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="capitalize">{ev.device}</span>
                    <span className="capitalize">{ev.referrer}</span>
                    <span>{new Date(ev.at).toLocaleTimeString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Order-based summary (financial truth) */}
      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h3 className="font-medium text-gray-900 mb-4">Order Summary (from Orders)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xl font-semibold text-gray-900">{stats.totalOrders}</p>
            <p className="text-xs text-gray-500">Total Orders</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xl font-semibold text-emerald-600">${stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Gross Sales</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xl font-semibold text-amber-600">{stats.pendingOrders}</p>
            <p className="text-xs text-gray-500">Awaiting Fulfillment</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xl font-semibold text-gray-900">{money(stats.avgOrderValue)}</p>
            <p className="text-xs text-gray-500">Avg. Order Value</p>
          </div>
        </div>
      </div>
    </div>
  );
}
