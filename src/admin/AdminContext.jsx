import { createContext, useContext, useState, useCallback } from 'react';
import { products as defaultProducts } from '../data/products';

const AdminContext = createContext();

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};

// Load persisted admin data from localStorage (falls back to defaults)
const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable — ignore
  }
};

export function AdminProvider({ children }) {
  const [products, setProducts] = useState(() => load('mj-products', defaultProducts));
  const [orders, setOrders] = useState(() => load('mj-orders', []));
  const [customers, setCustomers] = useState(() => load('mj-customers', []));
  const [inventoryLog, setInventoryLog] = useState(() => load('mj-inventory-log', []));
  const [reviews, setReviews] = useState(() => load('mj-reviews', []));
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('mj-admin-auth') === 'true';
  });

  // Persist on every change
  const persist = (key, value) => save(key, value);

  const setProductsP = (updater) => setProducts(prev => {
    const next = typeof updater === 'function' ? updater(prev) : updater;
    persist('mj-products', next);
    return next;
  });
  const setOrdersP = (updater) => setOrders(prev => {
    const next = typeof updater === 'function' ? updater(prev) : updater;
    persist('mj-orders', next);
    return next;
  });
  const setCustomersP = (updater) => setCustomers(prev => {
    const next = typeof updater === 'function' ? updater(prev) : updater;
    persist('mj-customers', next);
    return next;
  });
  const setInventoryLogP = (updater) => setInventoryLog(prev => {
    const next = typeof updater === 'function' ? updater(prev) : updater;
    persist('mj-inventory-log', next);
    return next;
  });
  const setReviewsP = (updater) => setReviews(prev => {
    const next = typeof updater === 'function' ? updater(prev) : updater;
    persist('mj-reviews', next);
    return next;
  });

  // Authentication
  const login = useCallback((email, password) => {
    if (email.trim().toLowerCase() === 'mesfin@mj.com' && password === 'Mesfin@1080') {
      sessionStorage.setItem('mj-admin-auth', 'true');
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password. Please try again.' };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('mj-admin-auth');
    setIsAuthenticated(false);
  }, []);

  // Product CRUD
  const addProduct = useCallback((product) => {
    setProductsP(prev => [...prev, { ...product, id: Date.now(), stock: product.stock || 0, lowStockThreshold: product.lowStockThreshold || 3, sku: product.sku || `MJ-${Date.now()}` }]);
  }, []);

  const updateProduct = useCallback((id, updates) => {
    setProductsP(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProduct = useCallback((id) => {
    setProductsP(prev => prev.filter(p => p.id !== id));
  }, []);

  // Inventory management
  const updateStock = useCallback((productId, quantity, reason) => {
    setProductsP(prev => prev.map(p => {
      if (p.id === productId) {
        const newStock = p.stock + quantity;
        setInventoryLogP(log => [...log, {
          id: Date.now(),
          productId,
          productName: p.name,
          change: quantity,
          previousStock: p.stock,
          newStock,
          reason,
          date: new Date().toISOString(),
        }]);
        return { ...p, stock: Math.max(0, newStock) };
      }
      return p;
    }));
  }, []);

  // Order creation — called by checkout when a customer places an order
  const addOrder = useCallback((order) => {
    const id = `ORD-${String(Date.now()).slice(-6)}`;
    const now = new Date();
    const newOrder = {
      id,
      customer: order.customer,
      email: order.email,
      phone: order.phone || '',
      items: order.items,
      total: order.total,
      status: 'pending',
      date: now.toISOString().split('T')[0],
      address: order.address,
      trackingNumber: '',
      carrier: '',
      estimatedDelivery: '',
      notes: order.notes || '',
      statusHistory: [
        { status: 'pending', date: now.toISOString(), note: 'Order placed' },
      ],
    };
    setOrdersP(prev => [newOrder, ...prev]);

    // Decrement stock for each item
    order.items.forEach(item => {
      if (item.productId) {
        setProductsP(prev => prev.map(p =>
          p.id === item.productId ? { ...p, stock: Math.max(0, p.stock - item.qty) } : p
        ));
      }
    });

    // Upsert customer record
    setCustomersP(prev => {
      const existing = prev.find(c => c.email.toLowerCase() === order.email.toLowerCase());
      if (existing) {
        return prev.map(c =>
          c.email.toLowerCase() === order.email.toLowerCase()
            ? { ...c, orders: c.orders + 1, totalSpent: c.totalSpent + order.total }
            : c
        );
      }
      return [...prev, {
        id: Date.now(),
        name: order.customer,
        email: order.email,
        phone: order.phone || '',
        orders: 1,
        totalSpent: order.total,
        joined: now.toISOString().split('T')[0],
      }];
    });

    return newOrder;
  }, []);

  // Order management
  const updateOrderStatus = useCallback((orderId, status, note = '') => {
    setOrdersP(prev => prev.map(o => {
      if (o.id === orderId) {
        const newEntry = { status, date: new Date().toISOString(), note: note || `Status updated to ${status}` };
        return { ...o, status, statusHistory: [...(o.statusHistory || []), newEntry] };
      }
      return o;
    }));
  }, []);

  const updateOrderTracking = useCallback((orderId, trackingNumber, carrier, estimatedDelivery) => {
    setOrdersP(prev => prev.map(o => o.id === orderId ? { ...o, trackingNumber, carrier, estimatedDelivery } : o));
  }, []);

  const updateOrderNotes = useCallback((orderId, notes) => {
    setOrdersP(prev => prev.map(o => o.id === orderId ? { ...o, notes } : o));
  }, []);

  // Review management
  const addReview = useCallback((review) => {
    setReviewsP(prev => [{ ...review, id: Date.now(), date: new Date().toISOString().split('T')[0], helpful: 0 }, ...prev]);
  }, []);

  const deleteReview = useCallback((reviewId) => {
    setReviewsP(prev => prev.filter(r => r.id !== reviewId));
  }, []);

  const toggleHelpful = useCallback((reviewId) => {
    setReviewsP(prev => prev.map(r => r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r));
  }, []);

  const getProductReviews = useCallback((productId) => {
    return reviews.filter(r => r.productId === productId);
  }, [reviews]);

  const getReviewStats = useCallback((productId) => {
    const productReviews = reviews.filter(r => r.productId === productId);
    const count = productReviews.length;
    const avg = count > 0 ? productReviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
    const distribution = [0, 0, 0, 0, 0];
    productReviews.forEach(r => { distribution[r.rating - 1]++; });
    return { count, avg: Math.round(avg * 10) / 10, distribution };
  }, [reviews]);

  // Inventory stats
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStockItems = products.filter(p => p.stock <= (p.lowStockThreshold || 3) && p.stock > 0);
  const outOfStockItems = products.filter(p => p.stock === 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.stock || 0) * (p.pricePerUnit || p.price || 0), 0);

  // Order stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <AdminContext.Provider value={{
      isAuthenticated, login, logout,
      products, addProduct, updateProduct, deleteProduct,
      orders, addOrder, updateOrderStatus, updateOrderTracking, updateOrderNotes,
      customers,
      reviews, addReview, deleteReview, toggleHelpful, getProductReviews, getReviewStats,
      inventoryLog, updateStock,
      stats: { totalRevenue, totalOrders, pendingOrders, processingOrders, shippedOrders, deliveredOrders, avgOrderValue, totalCustomers: customers.length, totalStock, lowStockItems: lowStockItems.length, outOfStockItems: outOfStockItems.length, totalInventoryValue }
    }}>
      {children}
    </AdminContext.Provider>
  );
}
