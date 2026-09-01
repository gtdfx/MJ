import { createContext, useContext, useState, useCallback } from 'react';
import { products as seedProducts } from '../data/products';

const AdminContext = createContext();

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};

const seedOrders = [
  { id: 'ORD-001', customer: 'Victoria Sterling', email: 'victoria@example.com', phone: '+1 212-555-0101', items: [{ productId: 1, name: 'Celestial Diamond Ring', qty: 1, price: 4850 }], total: 4850, status: 'delivered', date: '2026-08-28', address: '142 Park Ave, New York, NY 10016', trackingNumber: '1Z999AA10123456784', carrier: 'UPS', estimatedDelivery: '2026-08-31', notes: 'Gift wrapped per request', statusHistory: [
    { status: 'pending', date: '2026-08-28T09:00:00', note: 'Order placed' },
    { status: 'processing', date: '2026-08-28T14:30:00', note: 'Payment confirmed, preparing order' },
    { status: 'shipped', date: '2026-08-29T10:00:00', note: 'Shipped via UPS' },
    { status: 'delivered', date: '2026-08-31T15:22:00', note: 'Delivered to front door' },
  ]},
  { id: 'ORD-002', customer: 'Alexander Chen', email: 'alex@example.com', phone: '+1 415-555-0202', items: [{ productId: 2, name: 'Rose Eternity Necklace', qty: 1, price: 6200 }], total: 6200, status: 'shipped', date: '2026-08-29', address: '88 Mission St, San Francisco, CA 94105', trackingNumber: '9400111899223100001', carrier: 'USPS', estimatedDelivery: '2026-09-02', notes: '', statusHistory: [
    { status: 'pending', date: '2026-08-29T11:00:00', note: 'Order placed' },
    { status: 'processing', date: '2026-08-29T15:00:00', note: 'Quality check completed' },
    { status: 'shipped', date: '2026-08-30T09:15:00', note: 'Shipped via USPS Priority' },
  ]},
  { id: 'ORD-003', customer: 'Isabella Romano', email: 'isabella@example.com', phone: '+39 02-555-0303', items: [{ productId: 3, name: 'Imperial Sapphire Earrings', qty: 1, price: 8900 }, { productId: 6, name: 'Versailles Pearl Earrings', qty: 1, price: 2800 }], total: 11700, status: 'processing', date: '2026-08-30', address: '55 Via Montenapoleone, Milan 20121', trackingNumber: '', carrier: 'DHL', estimatedDelivery: '2026-09-05', notes: 'International shipment — customs docs attached', statusHistory: [
    { status: 'pending', date: '2026-08-30T08:30:00', note: 'Order placed' },
    { status: 'processing', date: '2026-08-30T16:00:00', note: 'Items being prepared for international shipment' },
  ]},
  { id: 'ORD-004', customer: 'James Wright', email: 'james@example.com', phone: '+44 20-555-0404', items: [{ productId: 5, name: 'Noir Diamond Pendant', qty: 1, price: 5600 }], total: 5600, status: 'pending', date: '2026-08-30', address: '10 Downing St, London SW1A 2AA', trackingNumber: '', carrier: '', estimatedDelivery: '', notes: 'Rush order requested', statusHistory: [
    { status: 'pending', date: '2026-08-30T20:15:00', note: 'Order placed — awaiting payment confirmation' },
  ]},
  { id: 'ORD-005', customer: 'Sophie Laurent', email: 'sophie@example.com', phone: '+33 1-555-0505', items: [{ productId: 7, name: 'Aura Emerald Ring', qty: 1, price: 7200 }], total: 7200, status: 'delivered', date: '2026-08-25', address: '15 Rue du Faubourg Saint-Honoré, Paris 75008', trackingNumber: 'RR123456789FR', carrier: 'La Poste', estimatedDelivery: '2026-08-28', notes: '', statusHistory: [
    { status: 'pending', date: '2026-08-25T10:00:00', note: 'Order placed' },
    { status: 'processing', date: '2026-08-25T14:00:00', note: 'Payment verified' },
    { status: 'shipped', date: '2026-08-26T09:00:00', note: 'Shipped via La Poste' },
    { status: 'delivered', date: '2026-08-28T11:30:00', note: 'Delivered — signed by recipient' },
  ]},
  { id: 'ORD-006', customer: 'Marcus Lee', email: 'marcus@example.com', phone: '+65 555-0606', items: [{ productId: 8, name: 'Seraphina Tennis Bracelet', qty: 1, price: 9500 }], total: 9500, status: 'shipped', date: '2026-08-27', address: '200 Marina Bay, Singapore 018956', trackingNumber: 'SG1234567890', carrier: 'FedEx', estimatedDelivery: '2026-09-01', notes: 'Insured shipment — high value', statusHistory: [
    { status: 'pending', date: '2026-08-27T12:00:00', note: 'Order placed' },
    { status: 'processing', date: '2026-08-27T16:30:00', note: 'Secure packaging prepared' },
    { status: 'shipped', date: '2026-08-28T08:00:00', note: 'Shipped via FedEx International' },
  ]},
  { id: 'ORD-007', customer: 'Elena Volkov', email: 'elena@example.com', phone: '+7 495-555-0707', items: [{ productId: 4, name: 'Maison Gold Bracelet', qty: 2, price: 3400 }], total: 6800, status: 'processing', date: '2026-08-31', address: '42 Tverskaya St, Moscow 125009', trackingNumber: '', carrier: 'DHL', estimatedDelivery: '2026-09-08', notes: '2 units — verify matching finish', statusHistory: [
    { status: 'pending', date: '2026-08-31T07:00:00', note: 'Order placed' },
    { status: 'processing', date: '2026-08-31T13:00:00', note: 'Items being verified for matching finish' },
  ]},
  { id: 'ORD-008', customer: 'David Nakamura', email: 'david@example.com', phone: '+81 3-555-0808', items: [{ productId: 9, name: 'Luna Crescent Necklace', qty: 1, price: 4100 }], total: 4100, status: 'pending', date: '2026-08-31', address: '3-1-2 Ginza, Chuo-ku, Tokyo 104-0061', trackingNumber: '', carrier: '', estimatedDelivery: '', notes: '', statusHistory: [
    { status: 'pending', date: '2026-08-31T22:00:00', note: 'Order placed — pending stock confirmation' },
  ]},
];

const seedCustomers = [
  { id: 1, name: 'Victoria Sterling', email: 'victoria@example.com', phone: '+1 212-555-0101', orders: 3, totalSpent: 14550, joined: '2024-03-15' },
  { id: 2, name: 'Alexander Chen', email: 'alex@example.com', phone: '+1 415-555-0202', orders: 2, totalSpent: 12400, joined: '2024-06-22' },
  { id: 3, name: 'Isabella Romano', email: 'isabella@example.com', phone: '+39 02-555-0303', orders: 5, totalSpent: 28900, joined: '2023-11-08' },
  { id: 4, name: 'James Wright', email: 'james@example.com', phone: '+44 20-555-0404', orders: 1, totalSpent: 5600, joined: '2026-08-30' },
  { id: 5, name: 'Sophie Laurent', email: 'sophie@example.com', phone: '+33 1-555-0505', orders: 4, totalSpent: 22100, joined: '2024-01-12' },
  { id: 6, name: 'Marcus Lee', email: 'marcus@example.com', phone: '+65 555-0606', orders: 2, totalSpent: 19000, joined: '2025-04-18' },
];

export function AdminProvider({ children }) {
  const [products, setProducts] = useState(seedProducts);
  const [orders, setOrders] = useState(seedOrders);
  const [customers] = useState(seedCustomers);
  const [inventoryLog, setInventoryLog] = useState([]);

  // Product CRUD
  const addProduct = useCallback((product) => {
    setProducts(prev => [...prev, { ...product, id: Date.now(), stock: product.stock || 0, lowStockThreshold: product.lowStockThreshold || 3, sku: product.sku || `MJ-${Date.now()}` }]);
  }, []);

  const updateProduct = useCallback((id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  // Inventory management
  const updateStock = useCallback((productId, quantity, reason) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newStock = p.stock + quantity;
        setInventoryLog(log => [...log, {
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

  // Order management
  const updateOrderStatus = useCallback((orderId, status, note = '') => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const newEntry = { status, date: new Date().toISOString(), note: note || `Status updated to ${status}` };
        return { ...o, status, statusHistory: [...(o.statusHistory || []), newEntry] };
      }
      return o;
    }));
  }, []);

  const updateOrderTracking = useCallback((orderId, trackingNumber, carrier, estimatedDelivery) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, trackingNumber, carrier, estimatedDelivery } : o));
  }, []);

  const updateOrderNotes = useCallback((orderId, notes) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, notes } : o));
  }, []);

  // Inventory stats
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStockItems = products.filter(p => p.stock <= (p.lowStockThreshold || 3) && p.stock > 0);
  const outOfStockItems = products.filter(p => p.stock === 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.stock || 0) * p.price, 0);

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
      products, addProduct, updateProduct, deleteProduct,
      orders, updateOrderStatus, updateOrderTracking, updateOrderNotes,
      customers,
      inventoryLog, updateStock,
      stats: { totalRevenue, totalOrders, pendingOrders, processingOrders, shippedOrders, deliveredOrders, avgOrderValue, totalCustomers: customers.length, totalStock, lowStockItems: lowStockItems.length, outOfStockItems: outOfStockItems.length, totalInventoryValue }
    }}>
      {children}
    </AdminContext.Provider>
  );
}
