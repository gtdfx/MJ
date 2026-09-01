import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, Clock, Truck, CheckCircle } from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { stats, orders, products } = useAdmin();

  const statCards = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-emerald-500', change: '+12.5%' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-blue-500', change: '+8.2%' },
    { label: 'Products', value: products.length, icon: Package, color: 'bg-purple-500', change: '+2 new' },
    { label: 'Customers', value: stats.totalCustomers, icon: Users, color: 'bg-gold', change: '+5.1%' },
  ];

  const orderStats = [
    { label: 'Pending', value: stats.pendingOrders, icon: Clock, color: 'text-amber-500' },
    { label: 'Processing', value: stats.processingOrders, icon: Package, color: 'text-blue-500' },
    { label: 'Shipped', value: stats.shippedOrders, icon: Truck, color: 'text-purple-500' },
    { label: 'Delivered', value: stats.deliveredOrders, icon: CheckCircle, color: 'text-emerald-500' },
  ];

  const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${card.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                <card.icon size={20} className="text-white" />
              </div>
              <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">{card.change}</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Order Status + Avg Order */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="font-medium text-gray-900 mb-4">Order Status Overview</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {orderStats.map(os => (
              <div key={os.label} className="text-center p-3 rounded-lg bg-gray-50">
                <os.icon size={24} className={`${os.color} mx-auto mb-2`} />
                <p className="text-2xl font-semibold text-gray-900">{os.value}</p>
                <p className="text-xs text-gray-500">{os.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="font-medium text-gray-900 mb-4">Performance</h3>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-gray-50">
              <p className="text-xs text-gray-500 mb-1">Avg. Order Value</p>
              <p className="text-xl font-semibold text-gray-900">${Math.round(stats.avgOrderValue).toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
              <p className="text-xs text-gray-500 mb-1">Revenue This Month</p>
              <p className="text-xl font-semibold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <TrendingUp size={16} />
              <span>12.5% vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-medium text-gray-900">Recent Orders</h3>
          <Link to="/admin/orders" className="text-sm text-gold hover:text-gold-dark transition-colors">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{order.customer}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{order.date}</td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">${order.total.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-medium text-gray-900">Top Products</h3>
          <Link to="/admin/products" className="text-sm text-gold hover:text-gold-dark transition-colors">View All →</Link>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.slice(0, 6).map(product => (
            <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                <p className="text-xs text-gray-500">{product.collection}</p>
              </div>
              <p className="text-sm font-medium text-gray-900 ml-auto whitespace-nowrap">${product.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
