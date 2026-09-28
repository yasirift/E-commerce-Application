import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import AuthLayout from "../layouts/AuthLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/customer/DashboardPage";
import ProductListing from "../pages/customer/ProductListing";
import ProductDetails from "../pages/customer/ProductDetails";
import Checkout from "../pages/customer/Checkout";
import OrderDetails from "../pages/customer/OrderDetails";
import AdminProductAdd from "../pages/admin/AdminProductAdd";
import AdminProductEdit from "../pages/admin/AdminProductEdit";
import Loader from "../components/ui/Loader";

const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("../pages/admin/AdminProducts"));
const Orders = lazy(() => import("../pages/customer/Orders"));

function LazyFallback() {
  return (
    <div className="flex justify-center py-16">
      <Loader size="lg" label="Loading..." />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/login"
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
      />
      <Route
        path="/register"
        element={
          <AuthLayout>
            <RegisterPage />
          </AuthLayout>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<CustomerLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/orders"
            element={
              <Suspense fallback={<LazyFallback />}>
                <Orders />
              </Suspense>
            }
          />
          <Route path="/orders/:id" element={<OrderDetails />} />
        </Route>

        <Route element={<RoleRoute allow={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route
              path="/admin"
              element={
                <Suspense fallback={<LazyFallback />}>
                  <AdminDashboard />
                </Suspense>
              }
            />
            <Route
              path="/admin/products"
              element={
                <Suspense fallback={<LazyFallback />}>
                  <AdminProducts />
                </Suspense>
              }
            />
            <Route path="/admin/products/add" element={<AdminProductAdd />} />
            <Route path="/admin/products/:id/edit" element={<AdminProductEdit />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
