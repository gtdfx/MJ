import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, Eye } from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { Link } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';

const emptyForm = {
  name: '',
  type: 'Rough Opal',
  category: 'Opal Stones',
  soldBy: 'gram',
  pricePerUnit: '',
  availableWeights: '1,2,5,10,20',
  origin: 'Welo, Ethiopia',
  grade: '',
  image: '',
  badge: '',
  description: '',
  stock: '',
  lowStockThreshold: '',
  active: true,
};

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const categories = ['All', ...new Set(products.map(p => p.type))];

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.type || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'All' || p.type === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const openAdd = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      type: product.type || 'Rough Opal',
      category: product.category || 'Opal Stones',
      soldBy: product.soldBy || 'gram',
      pricePerUnit: product.pricePerUnit != null ? product.pricePerUnit.toString() : '',
      availableWeights: (product.availableWeights || []).join(', '),
      origin: product.origin || 'Welo, Ethiopia',
      grade: product.grade || '',
      image: product.image || '',
      badge: product.badge || '',
      description: product.description || '',
      stock: product.stock != null ? product.stock.toString() : '',
      lowStockThreshold: product.lowStockThreshold != null ? product.lowStockThreshold.toString() : '',
      active: product.active !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      pricePerUnit: parseFloat(formData.pricePerUnit) || 0,
      availableWeights: formData.availableWeights.split(',').map(w => parseInt(w.trim())).filter(w => !isNaN(w) && w > 0),
      stock: parseInt(formData.stock) || 0,
      lowStockThreshold: parseInt(formData.lowStockThreshold) || 3,
      active: formData.active,
    };
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct(data);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this product?')) deleteProduct(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{products.length} opal products in your store</p>
        </div>
        <button onClick={openAdd} className="bg-gold hover:bg-gold-dark text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterCategory === cat ? 'bg-charcoal text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products — table on desktop, cards on mobile */}
      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map(product => (
          <div key={product.id} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex gap-3">
              <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                  {product.active === false && <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase shrink-0">Hidden</span>}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{product.type}</p>
                <div className="flex items-center gap-3 mt-1.5 text-sm">
                  <span className="font-semibold text-gray-900">${product.pricePerUnit}<span className="text-gray-400 font-normal text-xs"> /{product.soldBy}</span></span>
                  <span className={`text-xs font-medium ${product.stock <= (product.lowStockThreshold || 3) ? 'text-amber-600' : 'text-gray-500'}`}>{product.stock} {product.soldBy === 'gram' ? 'g' : 'ct'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
              {product.badge && <span className="text-[10px] font-medium bg-gold/10 text-gold px-2 py-1 rounded-full">{product.badge}</span>}
              <div className="flex items-center gap-1 ml-auto">
                <Link to={`/product/${product.id}`} target="_blank" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"><Eye size={16} /></Link>
                <button onClick={() => openEdit(product)} className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-gray-400 hover:text-blue-600"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 text-center py-12 text-gray-400">No products found</div>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Badge</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">{product.name}</span>
                        {product.active === false && <span className="ml-2 text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase">Hidden</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">{product.type}</td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">
                    ${product.pricePerUnit} <span className="text-gray-400 font-normal">/ {product.soldBy}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">{product.stock} {product.soldBy === 'gram' ? 'g' : 'ct'}</td>
                  <td className="px-5 py-3">
                    {product.badge && (
                      <span className="text-xs font-medium bg-gold/10 text-gold px-2 py-1 rounded-full">{product.badge}</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/product/${product.id}`} target="_blank" className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                        <Eye size={16} />
                      </Link>
                      <button onClick={() => openEdit(product)} className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors text-gray-400 hover:text-blue-600">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">No products found</div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="relative bg-white w-full sm:max-w-lg sm:rounded-xl rounded-t-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                <h3 className="font-medium text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <button onClick={() => setShowModal(false)} className="p-2 -mr-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 pb-24">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold">
                      <option>Rough Opal</option>
                      <option>Crystal Opal</option>
                      <option>Polished Opal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sold By</label>
                    <select value={formData.soldBy} onChange={e => setFormData({ ...formData, soldBy: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold">
                      <option value="gram">Gram</option>
                      <option value="carat">Carat</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Per {formData.soldBy} *</label>
                    <input type="number" step="0.01" min="0" required value={formData.pricePerUnit} onChange={e => setFormData({ ...formData, pricePerUnit: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="25" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Weights</label>
                    <input type="text" value={formData.availableWeights} onChange={e => setFormData({ ...formData, availableWeights: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="1, 2, 5, 10, 20" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                    <input type="text" value={formData.origin} onChange={e => setFormData({ ...formData, origin: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="Welo, Ethiopia" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                    <input type="text" value={formData.grade} onChange={e => setFormData({ ...formData, grade: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="AA — Premium" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
                    <input type="text" value={formData.badge} onChange={e => setFormData({ ...formData, badge: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="e.g. Bestseller" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="Opal Stones" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                    <input type="number" min="0" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert At</label>
                    <input type="number" min="0" value={formData.lowStockThreshold} onChange={e => setFormData({ ...formData, lowStockThreshold: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="3" />
                  </div>
                </div>
                <ImageUpload
                  label="Product Image"
                  value={formData.image}
                  onChange={img => setFormData({ ...formData, image: img })}
                />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Visible on storefront</p>
                    <p className="text-xs text-gray-500">Hidden products don't appear in the shop</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, active: !formData.active })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${formData.active ? 'bg-emerald-500' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${formData.active ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold resize-none" />
                </div>
                {/* Sticky action bar — thumb-reachable on mobile */}
                <div className="fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-0 sm:left-auto sm:right-0 w-full sm:w-auto bg-white border-t border-gray-100 p-4 sm:p-3 flex gap-3 sm:rounded-b-xl sm:justify-end">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 sm:flex-none px-6 py-2.5 bg-gold hover:bg-gold-dark text-white rounded-lg text-sm font-medium transition-colors">{editingProduct ? 'Update Product' : 'Add Product'}</button>
                </div>
                <div className="hidden sm:block h-2" />
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}