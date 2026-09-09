import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { products as defaultProducts, collections as defaultCollections } from '../data/products';

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

const DEFAULT_SETTINGS = {
  storeName: 'Etho-Can Gemstones',
  tagline: 'Ethiopian Welo Opals — Sold by Gram & Carat',
  email: 'ethiocan_gemstone@yahoo.com',
  phone: '+1 647-719-3169',
  address: 'Toronto, Ontario, Canada',
  currency: 'USD',
  freeShippingThreshold: 100,
};

export function AdminProvider({ children }) {
  const [products, setProducts] = useState(() => load('ecg-products', null) || defaultProducts);
  const [collections] = useState(defaultCollections);
  const [orders, setOrders] = useState(() => load('ecg-orders', []));
  const [customers, setCustomers] = useState(() => load('ecg-customers', []));
  const [inventoryLog, setInventoryLog] = useState(() => load('ecg-inventory-log', []));
  const [reviews, setReviews] = useState(() => load('ecg-reviews', []));
  const [notifications, setNotifications] = useState(() => load('ecg-notifications', []));
  const [auditLog, setAuditLog] = useState(() => load('ecg-audit-log', []));
  const [coupons, setCoupons] = useState(() => load('ecg-coupons', []));
  const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS, ...load('ecg-settings', {}) }));
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('ecg-admin-auth') === 'true';
  });

  // Persisted state setters
  const makePersisted = (key, setter) => (updater) => setter(prev => {
    const next = typeof updater === 'function' ? updater(prev) : updater;
    save(key, next);
    return next;
  });
  const setProductsP = useMemo(() => makePersisted('ecg-products', setProducts), []);
  const setOrdersP = useMemo(() => makePersisted('ecg-orders', setOrders), []);
  const setCustomersP = useMemo(() => makePersisted('ecg-customers', setCustomers), []);
  const setInventoryLogP = useMemo(() => makePersisted('ecg-inventory-log', setInventoryLog), []);
  const setReviewsP = useMemo(() => makePersisted('ecg-reviews', setReviews), []);
  const setNotificationsP = useMemo(() => makePersisted('ecg-notifications', setNotifications), []);
  const setAuditLogP = useMemo(() => makePersisted('ecg-audit-log', setAuditLog), []);
  const setCouponsP = useMemo(() => makePersisted('ecg-coupons', setCoupons), []);
  const setSettingsP = useMemo(() => makePersisted('ecg-settings', setSettings), []);

  // Internal helpers — record an audit entry and a notification
  const pushAudit = useCallback((action, entity, entityId, description) => {
    setAuditLogP(prev => [{
      id: Date.now() + Math.random(),
      action, entity, entityId,
      description,
      user: 'Admin',
      timestamp: new Date().toISOString(),
    }, ...prev].slice(0, 500));
  }, [setAuditLogP]);

  const pushNotification = useCallback((type, title, message) => {
    setNotificationsP(prev => [{
      id: Date.now() + Math.random(),
      type,
      title,
      message,
      time: new Date().toISOString(),
      read: false,
    }, ...prev].slice(0, 100));
  }, [setNotificationsP]);

  // Authentication
  const login = useCallback((email, password) => {
    if (email.trim().toLowerCase() === 'mesfin@mj.com' && password === 'Mesfin@1080') {
      sessionStorage.setItem('ecg-admin-auth', 'true');
      setIsAuthenticated(true);
      pushAudit('auth', 'auth', 'admin', 'Admin signed in');
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password. Please try again.' };
  }, [pushAudit]);

  const logout = useCallback(() => {
    sessionStorage.removeItem('ecg-admin-auth');
    setIsAuthenticated(false);
  }, []);

  // Product CRUD — changes reflect instantly on the storefront
  const addProduct = useCallback((product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      stock: product.stock || 0,
      lowStockThreshold: product.lowStockThreshold || 3,
      sku: product.sku || `ECG-${Date.now()}`,
      active: product.active !== false,
    };
    setProductsP(prev => [...prev, newProduct]);
    pushAudit('create', 'product', newProduct.sku, `Product created: ${newProduct.name}`);
    pushNotification('product', 'Product added', `${newProduct.name} is now live on the storefront`);
    return newProduct;
  }, [setProductsP, pushAudit, pushNotification]);

  const updateProduct = useCallback((id, updates) => {
    let updatedName = '';
    setProductsP(prev => prev.map(p => {
      if (p.id !== id) return p;
      updatedName = updates.name || p.name;
      return { ...p, ...updates };
    }));
    pushAudit('update', 'product', id, `Product updated: ${updatedName || id}`);
  }, [setProductsP, pushAudit]);

  const deleteProduct = useCallback((id) => {
    let deleted = null;
    setProductsP(prev => {
      deleted = prev.find(p => p.id === id);
      return prev.filter(p => p.id !== id);
    });
    pushAudit('delete', 'product', id, `Product deleted: ${deleted?.name || id}`);
  }, [setProductsP, pushAudit]);

  // Inventory management
  const updateStock = useCallback((productId, quantity, reason) => {
    setProductsP(prev => prev.map(p => {
      if (p.id === productId) {
        const newStock = p.stock + quantity;
        setInventoryLogP(log => [{
          id: Date.now() + Math.random(),
          productId,
          productName: p.name,
          change: quantity,
          previousStock: p.stock,
          newStock,
          reason,
          date: new Date().toISOString(),
        }, ...log]);
        const threshold = p.lowStockThreshold || 3;
        if (newStock > 0 && newStock <= threshold) {
          pushNotification('inventory', 'Low stock alert', `${p.name} — only ${newStock} left`);
        } else if (newStock === 0) {
          pushNotification('inventory', 'Out of stock', `${p.name} is now out of stock`);
        }
        return { ...p, stock: Math.max(0, newStock) };
      }
      return p;
    }));
  }, [setProductsP, setInventoryLogP, pushNotification]);

  // Order creation — called by checkout
  const addOrder = useCallback((order) => {
    const id = `ORD-${String(Date.now()).slice(-6)}`;
    const now = new Date();
    const newOrder = {
      id,
      customer: order.customer,
      email: order.email,
      phone: order.phone || '',
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount || 0,
      couponCode: order.couponCode || null,
      shipping: order.shipping || 0,
      tax: order.tax || 0,
      total: order.total,
      status: 'pending',
      // Payment lifecycle (Stripe-ready): checkout creates 'pending';
      // markOrderPaid flips it once Stripe payment succeeds/webhook arrives.
      paymentStatus: order.paymentStatus || 'pending',
      paymentMethod: order.paymentMethod || 'card',
      paymentId: order.paymentId || null,
      paidAt: order.paidAt || null,
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

    // Decrement stock + raise low-stock alerts
    order.items.forEach(item => {
      if (item.productId) {
        updateStock(item.productId, -item.qty, `Sale — ${id}`);
      }
    });

    // Upsert customer record
    setCustomersP(prev => {
      const existing = prev.find(c => c.email.toLowerCase() === order.email.toLowerCase());
      if (existing) {
        return prev.map(c =>
          c.email.toLowerCase() === order.email.toLowerCase()
            ? { ...c, name: order.customer, phone: order.phone || c.phone, orders: c.orders + 1, totalSpent: c.totalSpent + order.total, lastOrder: now.toISOString().split('T')[0] }
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
        lastOrder: now.toISOString().split('T')[0],
      }];
    });

    pushNotification('order', 'New order received', `${id} — ${order.customer} · $${order.total.toFixed(2)}`);
    pushAudit('create', 'order', id, `New order — $${order.total.toFixed(2)} from ${order.customer}`);
    return newOrder;
  }, [setOrdersP, setCustomersP, updateStock, pushNotification, pushAudit]);

  // Payment management (Stripe-ready): call from a Stripe success page or webhook handler
  const markOrderPaid = useCallback((orderId, paymentId = null) => {
    setOrdersP(prev => prev.map(o => o.id === orderId
      ? { ...o, paymentStatus: 'paid', paymentId: paymentId || o.paymentId, paidAt: new Date().toISOString() }
      : o
    ));
    pushAudit('status', 'order', orderId, 'Payment marked as paid');
  }, [setOrdersP, pushAudit]);

  const markOrderUnpaid = useCallback((orderId) => {
    setOrdersP(prev => prev.map(o => o.id === orderId
      ? { ...o, paymentStatus: 'pending', paymentId: null, paidAt: null }
      : o
    ));
    pushAudit('status', 'order', orderId, 'Payment marked as unpaid');
  }, [setOrdersP, pushAudit]);

  // Order management
  const updateOrderStatus = useCallback((orderId, status, note = '') => {
    setOrdersP(prev => prev.map(o => {
      if (o.id === orderId) {
        const newEntry = { status, date: new Date().toISOString(), note: note || `Status updated to ${status}` };
        return { ...o, status, statusHistory: [...(o.statusHistory || []), newEntry] };
      }
      return o;
    }));
    pushAudit('status', 'order', orderId, `Order status updated to ${status}`);
  }, [setOrdersP, pushAudit]);

  const updateOrderTracking = useCallback((orderId, trackingNumber, carrier, estimatedDelivery) => {
    setOrdersP(prev => prev.map(o => o.id === orderId ? { ...o, trackingNumber, carrier, estimatedDelivery } : o));
    pushAudit('update', 'order', orderId, `Tracking updated: ${trackingNumber || '—'} (${carrier || 'no carrier'})`);
  }, [setOrdersP, pushAudit]);

  const updateOrderNotes = useCallback((orderId, notes) => {
    setOrdersP(prev => prev.map(o => o.id === orderId ? { ...o, notes } : o));
  }, [setOrdersP]);

  // Coupon management — coupons are validated at checkout
  const addCoupon = useCallback((coupon) => {
    const normalized = { ...coupon, code: coupon.code.toUpperCase().trim(), usedCount: 0, active: true };
    setCouponsP(prev => [...prev, { ...normalized, id: Date.now() }]);
    pushAudit('create', 'discount', normalized.code, `Coupon created: ${normalized.code}`);
    return normalized;
  }, [setCouponsP, pushAudit]);

  const updateCoupon = useCallback((id, updates) => {
    setCouponsP(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    pushAudit('update', 'discount', id, 'Coupon updated');
  }, [setCouponsP, pushAudit]);

  const deleteCoupon = useCallback((id) => {
    setCouponsP(prev => prev.filter(c => c.id !== id));
    pushAudit('delete', 'discount', id, 'Coupon deleted');
  }, [setCouponsP, pushAudit]);

  // Coupon validation for checkout — returns { valid, discount, error, freeShipping }
  const validateCoupon = useCallback((code, subtotal) => {
    const coupon = coupons.find(c => c.code === code.toUpperCase().trim());
    if (!coupon) return { valid: false, error: 'Invalid coupon code.' };
    if (!coupon.active) return { valid: false, error: 'This coupon is no longer active.' };
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date(new Date().toDateString())) {
      return { valid: false, error: 'This coupon has expired.' };
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return { valid: false, error: 'This coupon has reached its usage limit.' };
    }
    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return { valid: false, error: `Minimum order of $${coupon.minOrder} required for this coupon.` };
    }
    if (coupon.type === 'percentage') {
      return { valid: true, coupon, discount: Math.round(subtotal * coupon.value) / 100, freeShipping: false };
    }
    if (coupon.type === 'fixed') {
      return { valid: true, coupon, discount: Math.min(coupon.value, subtotal), freeShipping: false };
    }
    // shipping type
    return { valid: true, coupon, discount: 0, freeShipping: true };
  }, [coupons]);

  const recordCouponUse = useCallback((couponId) => {
    setCouponsP(prev => prev.map(c => c.id === couponId ? { ...c, usedCount: (c.usedCount || 0) + 1 } : c));
  }, [setCouponsP]);

  // Review management
  // Reviews are restricted to real buyers: the reviewer must give the email
  // used on a delivered/shipped/processing order that contains the product.
  const REVIEW_ELIGIBLE_STATUSES = ['delivered', 'shipped', 'processing'];
  const findVerifyingOrder = useCallback((productId, email) => {
    const normalized = (email || '').trim().toLowerCase();
    if (!normalized) return null;
    return orders.find(o =>
      REVIEW_ELIGIBLE_STATUSES.includes(o.status) &&
      (o.email || '').toLowerCase() === normalized &&
      (o.items || []).some(item => String(item.productId) === String(productId))
    ) || null;
  }, [orders]);

  // Public storefront helper: 'eligible' | 'already-reviewed' | 'not-buyer'
  const getPurchaseStatus = useCallback((productId, email) => {
    const normalized = (email || '').trim().toLowerCase();
    if (!normalized) return 'not-buyer';
    const already = reviews.some(r =>
      r.productId === productId &&
      (r.reviewerEmail || '').toLowerCase() === normalized &&
      r.status !== 'rejected'
    );
    if (already) return 'already-reviewed';
    return findVerifyingOrder(productId, email) ? 'eligible' : 'not-buyer';
  }, [reviews, findVerifyingOrder]);

  const addReview = useCallback((review) => {
    // Server-side style guard: silently reject if not a verified purchase
    const status = getPurchaseStatus(review.productId, review.reviewerEmail);
    if (status !== 'eligible') return { success: false, reason: status };
    setReviewsP(prev => [{
      ...review,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      status: 'pending',
      verified: true, // real buyer — auto-tagged Verified Buyer
    }, ...prev]);
    pushNotification('review', 'New verified buyer review', `"${review.title}" — awaiting approval`);
    return { success: true };
  }, [setReviewsP, pushNotification, getPurchaseStatus]);

  const approveReview = useCallback((reviewId) => {
    setReviewsP(prev => prev.map(r => r.id === reviewId ? { ...r, status: 'approved' } : r));
    pushAudit('status', 'review', reviewId, 'Review approved');
  }, [setReviewsP, pushAudit]);

  const rejectReview = useCallback((reviewId) => {
    setReviewsP(prev => prev.map(r => r.id === reviewId ? { ...r, status: 'rejected' } : r));
    pushAudit('status', 'review', reviewId, 'Review rejected');
  }, [setReviewsP, pushAudit]);

  const deleteReview = useCallback((reviewId) => {
    setReviewsP(prev => prev.filter(r => r.id !== reviewId));
    pushAudit('delete', 'review', reviewId, 'Review deleted');
  }, [setReviewsP, pushAudit]);

  const toggleHelpful = useCallback((reviewId) => {
    setReviewsP(prev => prev.map(r => r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r));
  }, [setReviewsP]);

  // Public storefront helpers — only approved (or legacy unflagged) reviews show
  const getProductReviews = useCallback((productId) => {
    return reviews.filter(r => r.productId === productId && r.status !== 'rejected' && r.status !== 'pending');
  }, [reviews]);

  const getReviewStats = useCallback((productId) => {
    const productReviews = reviews.filter(r => r.productId === productId && r.status !== 'rejected' && r.status !== 'pending');
    const count = productReviews.length;
    const avg = count > 0 ? productReviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
    const distribution = [0, 0, 0, 0, 0];
    productReviews.forEach(r => { distribution[r.rating - 1]++; });
    return { count, avg: Math.round(avg * 10) / 10, distribution };
  }, [reviews]);

  // Settings
  const updateSettings = useCallback((updates) => {
    setSettingsP(prev => ({ ...prev, ...updates }));
    pushAudit('update', 'settings', 'store', 'Store settings updated');
  }, [setSettingsP, pushAudit]);

  // Notification management
  const markNotificationRead = useCallback((id) => {
    setNotificationsP(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, [setNotificationsP]);
  const markAllNotificationsRead = useCallback(() => {
    setNotificationsP(prev => prev.map(n => ({ ...n, read: true })));
  }, [setNotificationsP]);
  const deleteNotification = useCallback((id) => {
    setNotificationsP(prev => prev.filter(n => n.id !== id));
  }, [setNotificationsP]);
  const clearNotifications = useCallback(() => {
    setNotificationsP([]);
  }, [setNotificationsP]);

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
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;

  return (
    <AdminContext.Provider value={{
      isAuthenticated, login, logout,
      products, addProduct, updateProduct, deleteProduct,
      collections,
      orders, addOrder, updateOrderStatus, updateOrderTracking, updateOrderNotes, markOrderPaid, markOrderUnpaid,
      customers,
      coupons, addCoupon, updateCoupon, deleteCoupon, validateCoupon, recordCouponUse,
      reviews, addReview, approveReview, rejectReview, deleteReview, toggleHelpful, getProductReviews, getReviewStats, getPurchaseStatus,
      inventoryLog, updateStock,
      notifications, markNotificationRead, markAllNotificationsRead, deleteNotification, clearNotifications, unreadNotifications, pendingReviews,
      auditLog,
      settings, updateSettings,
      stats: { totalRevenue, totalOrders, pendingOrders, processingOrders, shippedOrders, deliveredOrders, avgOrderValue, totalCustomers: customers.length, totalStock, lowStockItems: lowStockItems.length, outOfStockItems: outOfStockItems.length, totalInventoryValue }
    }}>
      {children}
    </AdminContext.Provider>
  );
}
