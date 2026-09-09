import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { useAdmin } from '../AdminContext';

// Simple bar chart component
function BarChart({ data, height = 200 }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const allZero = data.every(d => d.value === 0);
  if (allZero) {
    return (
      <div className="flex items-center justify-center text-sm text-gray-400" style={{ height }}>
        No data for this period yet
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px] text-gray-500 font-medium">${d.value >= 1000 ? `${(d.value / 1000).toFixed(0)}k` : d.value}</span>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(d.value / max) * 100}%` }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            className="w-full rounded-t-md"
            style={{ backgroundColor: d.color || '#C9A96E', minHeight: 4 }}
          />
          <span className="text-[10px] text-gray-400 mt-1">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// Donut chart using CSS
function DonutChart({ segments, size = 160 }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let cumulative = 0;
  const gradientParts = [];

  segments.forEach((seg, i) => {
    const start = (cumulative / total) * 360;
    cumulative += seg.value;
    const end = (cumulative / total) * 360;
    gradientParts.push(`${seg.color} ${start}deg ${end}deg`);
  });

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="w-full h-full rounded-full"
        style={{ background: `conic-gradient(${gradientParts.join(', ')})` }}
      />
      <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">{total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { orders, products, stats } = useAdmin();
  const [period, setPeriod] = useState('30d');

  // Revenue by month — computed from real orders (last 6 months)
  const monthlyRevenue = (() => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const label = d.toLocaleString('en-US', { month: 'short' });
      const value = orders
        .filter(o => { const od = new Date(o.date); return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth(); })
        .reduce((s, o) => s + o.total, 0);
      months.push({ label, value, color: i === 5 ? '#B8944F' : '#C9A96E' });
    }
    return months;
  })();

  // Revenue by category
  const categoryRevenue = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      const cat = product?.type || product?.category || 'Other';
      categoryRevenue[cat] = (categoryRevenue[cat] || 0) + item.price * item.qty;
    });
  });

  const categorySegments = Object.entries(categoryRevenue).map(([name, value], i) => ({
    name,
    value,
    color: ['#C9A96E', '#B76E79', '#6B6B6B', '#E8D5A3'][i % 4],
  }));

  // Top performing products
  const productPerformance = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      if (!productPerformance[item.productId]) {
        productPerformance[item.productId] = { name: item.name, revenue: 0, units: 0 };
      }
      productPerformance[item.productId].revenue += item.price * item.qty;
      productPerformance[item.productId].units += item.qty;
    });
  });

  const topProducts = Object.values(productPerformance)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Orders per day — computed from real orders (last 7 days)
  const dailyOrders = (() => {
    const days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const value = orders.filter(o => o.date === d.toISOString().split('T')[0]).length;
      days.push({ label: d.toLocaleString('en-US', { weekday: 'short' }), value, color: '#C9A96E' });
    }
    return days;
  })();

  // Empty-store check
  const noData = orders.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500">Store performance and insights</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d', '1y'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${period === p ? 'bg-charcoal text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : p === '90d' ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}` },
          { label: 'Orders', value: stats.totalOrders },
          { label: 'Avg. Order', value: `$${Math.round(stats.avgOrderValue).toLocaleString()}` },
          { label: 'Products', value: products.length },
        ].map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-xl p-5 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">{m.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{m.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-medium text-gray-900">Revenue Trend</h3>
            <BarChart3 size={18} className="text-gray-400" />
          </div>
          <BarChart data={monthlyRevenue} height={180} />
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-medium text-gray-900">By Category</h3>
            <PieChart size={18} className="text-gray-400" />
          </div>
          <div className="flex justify-center mb-5">
            {categorySegments.length > 0 ? <DonutChart segments={categorySegments} /> : (
              <div className="w-[160px] h-[160px] rounded-full bg-gray-100 flex items-center justify-center">
                <p className="text-xs text-gray-400 text-center px-6">No sales data yet</p>
              </div>
            )}
          </div>
          {categorySegments.length === 0 && (
            <p className="text-center text-xs text-gray-400">Category revenue appears once orders come in.</p>
          )}
          <div className="space-y-2">
            {categorySegments.map(seg => (
              <div key={seg.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                  <span className="text-gray-600">{seg.name}</span>
                </div>
                <span className="font-medium text-gray-900">${seg.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Products */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="font-medium text-gray-900 mb-4">Top Products</h3>
          {topProducts.length === 0 ? (
            <div className="text-center py-10">
              <BarChart3 size={32} className="text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Top sellers appear once orders come in.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-400 w-5">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.units} units sold</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">${p.revenue.toLocaleString()}</p>
                  <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gold rounded-full" style={{ width: `${(p.revenue / topProducts[0].revenue) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Traffic & Sessions */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="font-medium text-gray-900 mb-4">Website Traffic</h3>
          {noData ? (
            <div className="text-center py-10">
              <TrendingUp size={32} className="text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Visitor data appears once Google Analytics is connected and orders come in.</p>
            </div>
          ) : (
            <>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Orders This Week</h4>
              <BarChart data={dailyOrders} height={120} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
