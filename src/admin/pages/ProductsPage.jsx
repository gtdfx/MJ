import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, Eye } from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { Link } from 'react-router-dom';

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: '', category: 'Rings', collection: '', description: '', material: '', stone: '', image: '', badge: ''
  });

  const categories = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'];

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.collection.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const openAdd = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', category: 'Rings', collection: '', description: '', material: '', stone: '', image: '', badge: '' });
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      collection: product.collection,
      description: product.description || '',
      material: product.material || '',
      stone: product.stone || '',
      image: product.image || '',
      badge: product.badge || '',
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData, price: parseInt(formData.price) || 0 };
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
          <p className="text-sm text-gray-500">{products.length} products in your store</p>
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
        <div className="flex gap-2">
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

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Collection</th>
                <th className="px-5 py-3 font-medium">Price</th>
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
                      <span className="text-sm font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">{product.category}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{product.collection}</td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">${product.price.toLocaleString()}</td>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="font-medium text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                    <input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold">
                      {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Collection</label>
                    <input type="text" value={formData.collection} onChange={e => setFormData({ ...formData, collection: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="e.g. Celestial" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
                    <input type="text" value={formData.badge} onChange={e => setFormData({ ...formData, badge: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="e.g. Bestseller" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                    <input type="text" value={formData.material} onChange={e => setFormData({ ...formData, material: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="e.g. 18K White Gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stone</label>
                    <input type="text" value={formData.stone} onChange={e => setFormData({ ...formData, stone: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="e.g. Diamond" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input type="url" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2.5 bg-gold hover:bg-gold-dark text-white rounded-lg text-sm font-medium transition-colors">{editingProduct ? 'Update Product' : 'Add Product'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
