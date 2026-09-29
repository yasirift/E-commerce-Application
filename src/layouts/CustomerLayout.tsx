import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import CartIcon from "../components/CartIcon";
import CartDrawer from "../components/CartDrawer";

export default function CustomerLayout() {
  const { user, logout, isAdmin } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium ${isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}`;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-lg font-bold">
            ShopStop
          </Link>
          <nav className="flex items-center gap-4">
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>
            <NavLink to="/orders" className={navLinkClass}>
              Orders
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClass}>
                Admin Panel
              </NavLink>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-gray-500">{user.firstName}</span>
          )}
          <CartIcon onClick={() => setIsCartOpen(true)} />
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Log out
          </button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
