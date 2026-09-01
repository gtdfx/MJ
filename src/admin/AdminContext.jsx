import { createContext, useContext, useState, useCallback } from 'react';
import { products as seedProducts } from '../data/products';

const AdminContext = createContext();

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};

// Seed orders data
const seedOrders = [
  { id: 'ORD-001', customer: 'Victoria Sterling', email: 'victoria@example.com', items: [{ productId: 1, name: 'Celestial Diamond Ring', qty: 1, price: 4850 }], total: 4850, status: 'delivered', date: '2026-08-28', address: '142 Park Ave, New York' },
  { id: 'ORD-002', customer: 'Alexander Chen', email: 'alex@example.com', items: [{ productId: 2, name: 'Rose Eternity Necklace', qty: 1, price: 6200 }], total: 6200, status: 'shipped', date: '2026-08-29', address: '88 Mission St, San Francisco' },
  { id: 'ORD-003', customer: 'Isabella Romano', email: 'isabella@example.com', items: [{ productId: 3, name: 'Imperial Sapphire Earrings', qty: 1, price: 8900 }, { productId: 6, name: 'Versailles Pearl Earrings', qty: 1, price: 2800 }], total: 11700, status: 'processing', date: '2026-08-30', address: '55 Via Montenapoleone, Milan' },
  { id: 'ORD-004', customer: 'James Wright', email: 'james@example.com', items: [{ productId: 5, name: 'Noir Diamond Pendant', qty: 1, price: 5600 }], total: 5600, status: 'pending', date: '2026-08-30', address: '10 Downing St, London' },
  { id: 'ORD-005', customer: 'Sophie Laurent', email: 'sophie@example.com', items: [{ productId: 7, name: 'Aura Emerald Ring', qty: 1, price: 7200 }], total: 7200, status: 'delivered', date: '2026-08-25', address: '15 Rue du Faubourg, Paris' },
  { id: 'ORD-006', customer: 'Marcus Lee', email: 'marcus@example.com', items: [{ productId: 8, name: 'Seraphina Tennis Bracelet', qty: 1, price: 9500 }], total: 9500, status: 'shipped', date: '2026-08-27', address: '200 Marina Bay, Singapore' },
  { id: 'ORD-007', customer: 'Elena Volkov', email: 'elena@example.com', items: [{ productId: 4, name: 'Maison Gold Bracelet', qty: 2, price: 3400 }], total: 6800, status: 'processing', date: '2026-08-31', address: '42 Tverskaya St, Moscow' },
  { id: 'ORD-008', customer: 'David Nakamura', email: 'david@example.com', items: [{ productId: 9, name: 'Luna Crescent Necklace', qty: 1, price: 4100 }], total: 4100, status: 'pending', date: '2026-08-31', address: '3-1-2 Ginza, Tokyo' },
];

const seedCustomers = [
  { id: 1, name: 'Victoria Sterling', email: 'victoria@example.com', orders: 3, totalSpent: 14550, joined: '2024-03-15' },
  { id: 2, name: 'Alexander Chen', email: 'alex@example.com', orders: 2, totalSpent: 12400, joined: '2024-06-22' },
  { id: 3, name: 'Isabella Romano', email: 'isabella@example.com', orders: 5, totalSpent: 28900, joined: '2023-11-08' },
  { id: 4, name: 'James Wright', email: 'james@example.com', orders: 1, totalSpent: 5600, joined: '2026-08-30' },
  { id: 5, name: 'Sophie Laurent', email: 'sophie@example.com', orders: 4, totalSpent: 22100, joined: '2024-01-12' },
  { id: 6, name: 'Marcus Lee', email: 'marcus@example.com', orders: 2, totalSpent: 19000, joined: '2025-04-18' },
];

export function AdminProvider({ children }) {
  const [products, setProducts] = useState(seedProducts);
  const [orders, setOrders] = useState(seedOrders);
  const [customers] = useState(seedCustomers);

  const addProduct = useCallback((product) => {
    setProducts(prev => [...prev, { ...product, id: Date.now() }]);
  }, []);

  const updateProduct = useCallback((id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  }, []);

  // Stats
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
      orders, updateOrderStatus,
      customers,
      stats: { totalRevenue, totalOrders, pendingOrders, processingOrders, shippedOrders, deliveredOrders, avgOrderValue, totalCustomers: customers.length }
    }}>
      {children}
    </AdminContext.Provider>
  );
}
