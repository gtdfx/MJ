import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, AlertTriangle, XCircle, Plus, Minus, History, X, ArrowUpDown } from 'lucide-react';
import { useAdmin } from '../AdminContext';

export default function InventoryPage() {
  const { products, updateStock, inventoryLog, stats } = useAdmin();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [showLog, setShowLog] = useState(false);
  const [sortBy, setSortBy] = useState('name');

  const getStockStatus = (p) => {
    if (p.stock === 0) return 'out';
    if (p.stock <= (p.lowStockThreshold || 3)) return 'low';
    return 'ok';
  };

  const filtered = products
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
      const matchFilter = filterStatus === 'all' ||
        (filterStatus === 'low' && getStockStatus(p) === 'low') ||
        (filterStatus === 'out' && getStockStatus(p) === 'out') ||
        (filterStatus === 'in' && getStockStatus(p) === 'ok');
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'stock-asc') return a.stock - b.stock;
      if (sortBy === 'stock-desc') return b.stock - a.stock;
      if (sortBy === 'value') return (b.stock * (b.pricePerUnit || 0)) - (a.stock * (a.pricePerUnit || 0));
      return a.name.localeCompare(b.name);
    });

  const openAdjust = (product) => {
    setSelectedProduct(product);
    setAdjustQty('');
    setAdjustReason('');
    setShowAdjustModal(true);
  };

  const handleAdjust = () => {
    const qty = parseInt(adjustQty);
    if (!qty || !adjustReason || !selectedProduct) return;
    updateStock(selectedProduct.id, qty, adjustReason);
    setShowAdjustModal(false);
  };

  const stockBar = (p) => {
    const max = 20;
    const pct = Math.min((p.stock / max) * 100, 100);
    const color = p.stock === 0 ? 'bg-red-400' : p.stock <= (p.lowStockThreshold || 3) ? 'bg-amber-400' : 'bg-emerald-400';
    return (
      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500">{products.length} products · {stats.totalStock} total units</p>
        </div>
        <button onClick={() => setShowLog(!showLog)} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <History size={16} /> Stock Log
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <Package size={20} className="text-blue-500 mb-2" />
          <p className="text-2xl font-semibold text-gray-900">{stats.totalStock}</p>
          <p className="text-xs text-gray-500">Total Units</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <AlertTriangle size={20} className="text-amber-500 mb-2" />
          <p className="text-2xl font-semibold text-gray-900">{stats.lowStockItems}</p>
          <p className="text-xs text-gray-500">Low Stock</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <XCircle size={20} className="text-red-500 mb-2" />
          <p className="text-2xl font-semibold text-gray-900">{stats.outOfStockItems}</p>
          <p className="text-xs text-gray-500">Out of Stock</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-semibold text-gray-900">${stats.totalInventoryValue.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Inventory Value</p>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {(stats.lowStockItems > 0 || stats.outOfStockItems > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-amber-600" />
            <h3 className="text-sm font-medium text-amber-800">Stock Alerts</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {products.filter(p => p.stock === 0).map(p => (
              <span key={p.id} className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-medium">{p.name} — Out of Stock</span>
            ))}
            {products.filter(p => p.stock > 0 && p.stock <= (p.lowStockThreshold || 3)).map(p => (
              <span key={p.id} className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">{p.name} — {p.stock} left</span>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name or SKU..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
        </div>
        <div className="flex gap-2">
          {[{ k: 'all', l: 'All' }, { k: 'in', l: 'In Stock' }, { k: 'low', l: 'Low' }, { k: 'out', l: 'Out' }].map(f => (
            <button key={f.k} onClick={() => setFilterStatus(f.k)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === f.k ? 'bg-charcoal text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{f.l}</button>
          ))}
        </div>
        <button onClick={() => setSortBy(sortBy === 'stock-asc' ? 'stock-desc' : sortBy === 'stock-desc' ? 'value' : 'stock-asc')} className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <ArrowUpDown size={14} /> Sort
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">SKU</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium hidden sm:table-cell">Level</th>
                <th className="px-5 py-3 font-medium">Value</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(product => {
                const status = getStockStatus(product);
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.type} · {product.origin || 'Welo, Ethiopia'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500 font-mono">{product.sku}</td>
                    <td className="px-5 py-3">
                      <span className={`text-sm font-semibold ${status === 'out' ? 'text-red-600' : status === 'low' ? 'text-amber-600' : 'text-gray-900'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">{stockBar(product)}</td>
                    <td className="px-5 py-3 text-sm text-gray-900">${(product.stock * (product.pricePerUnit || 0)).toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { updateStock(product.id, -1, 'Manual adjustment'); }} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors" title="Decrease stock">
                          <Minus size={14} />
                        </button>
                        <button onClick={() => { updateStock(product.id, 1, 'Manual adjustment'); }} className="p-1.5 hover:bg-emerald-50 rounded-lg text-gray-400 hover:text-emerald-600 transition-colors" title="Increase stock">
                          <Plus size={14} />
                        </button>
                        <button onClick={() => openAdjust(product)} className="px-3 py-1.5 bg-gold/10 text-gold rounded-lg text-xs font-medium hover:bg-gold/20 transition-colors">
                          Adjust
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No products found</div>}
      </div>

      {/* Stock Log Panel */}
      <AnimatePresence>
        {showLog && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-medium text-gray-900">Stock Adjustment Log</h3>
              <button onClick={() => setShowLog(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {inventoryLog.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">No stock adjustments yet</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {[...inventoryLog].reverse().map(log => (
                    <div key={log.id} className="px-5 py-3 flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium text-gray-900">{log.productName}</span>
                        <span className="text-gray-500 mx-2">—</span>
                        <span className={log.change > 0 ? 'text-emerald-600' : 'text-red-600'}>
                          {log.change > 0 ? '+' : ''}{log.change} units
                        </span>
                        <span className="text-gray-400 ml-2">({log.reason})</span>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(log.date).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Adjust Stock Modal */}
      <AnimatePresence>
        {showAdjustModal && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40" onClick={() => setShowAdjustModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-xl w-full max-w-md p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-medium text-gray-900">Adjust Stock</h3>
                <button onClick={() => setShowAdjustModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                <img src={selectedProduct.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedProduct.name}</p>
                  <p className="text-xs text-gray-500">Current stock: <span className="font-semibold">{selectedProduct.stock}</span></p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adjustment (use negative to decrease)</label>
                  <input type="number" value={adjustQty} onChange={e => setAdjustQty(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="e.g. 5 or -3" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <select value={adjustReason} onChange={e => setAdjustReason(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold">
                    <option value="">Select reason...</option>
                    <option value="Restock">Restock</option>
                    <option value="Sale">Sale</option>
                    <option value="Return">Return</option>
                    <option value="Damaged">Damaged / Write-off</option>
                    <option value="Manual adjustment">Manual adjustment</option>
                    <option value="Inventory count">Inventory count correction</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAdjustModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={handleAdjust} disabled={!adjustQty || !adjustReason} className="flex-1 px-4 py-2.5 bg-gold hover:bg-gold-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">Apply Adjustment</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
