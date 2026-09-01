import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './admin/AdminContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminLayout from './admin/components/AdminLayout';
import DashboardPage from './admin/pages/DashboardPage';
import ProductsPage from './admin/pages/ProductsPage';
import OrdersPage from './admin/pages/OrdersPage';
import InventoryPage from './admin/pages/InventoryPage';
import CustomersPage from './admin/pages/CustomersPage';
import SettingsPage from './admin/pages/SettingsPage';
import OrderTrackingPage from './pages/OrderTrackingPage';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AdminProvider>
          <ScrollToTop />
          <Routes>
            {/* Admin Routes — no store navbar/footer */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Store Routes — with navbar/footer */}
            <Route path="*" element={
              <div className="min-h-screen bg-cream flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/track-order" element={<OrderTrackingPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                  </Routes>
                </main>
                <Footer />
                <CartSidebar />
              </div>
            } />
          </Routes>
        </AdminProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
