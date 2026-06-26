import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useUserAuth } from '@/context/UserAuthContext';

// Storefront pages
import HomePage from '@/pages/storefront/HomePage';
import ProductsPage from '@/pages/storefront/ProductsPage';
import ProductDetailPage from '@/pages/storefront/ProductDetailPage';
import CartPage from '@/pages/storefront/CartPage';
import CheckoutPage from '@/pages/storefront/CheckoutPage';
import OrderConfirmationPage from '@/pages/storefront/OrderConfirmationPage';
import LoginPage from '@/pages/storefront/LoginPage';
import RegisterPage from '@/pages/storefront/RegisterPage';

// Admin pages
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardPage from '@/pages/admin/DashboardPage';
import ProductsListPage from '@/pages/admin/ProductsListPage';
import ProductCreatePage from '@/pages/admin/ProductCreatePage';
import ProductEditPage from '@/pages/admin/ProductEditPage';
import OrdersListPage from '@/pages/admin/OrdersListPage';
import OrderDetailPage from '@/pages/admin/OrderDetailPage';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/admin/login" replace />;
}

function CustomerRoute({ children }) {
  const { user } = useUserAuth();
  const location = useLocation();
  return user ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Storefront - public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Storefront - protected */}
      <Route path="/" element={<CustomerRoute><HomePage /></CustomerRoute>} />
      <Route path="/products" element={<CustomerRoute><ProductsPage /></CustomerRoute>} />
      <Route path="/products/:id" element={<CustomerRoute><ProductDetailPage /></CustomerRoute>} />
      <Route path="/cart" element={<CustomerRoute><CartPage /></CustomerRoute>} />
      <Route path="/checkout" element={<CustomerRoute><CheckoutPage /></CustomerRoute>} />
      <Route path="/order-confirmation/:orderId" element={<CustomerRoute><OrderConfirmationPage /></CustomerRoute>} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsListPage />} />
        <Route path="products/new" element={<ProductCreatePage />} />
        <Route path="products/:id/edit" element={<ProductEditPage />} />
        <Route path="orders" element={<OrdersListPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
