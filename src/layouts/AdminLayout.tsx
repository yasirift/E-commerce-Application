import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Menu, X, UserCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Dropdown from "../components/Dropdown";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package, end: false },
];

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex-1 px-4">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            [
              "mb-1.5 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
              isActive
                ? "bg-blue-50 font-medium text-blue-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            ].join(" ")
          }
        >
          <Icon size={18} strokeWidth={2} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : "";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-gray-200 bg-white pt-5 md:flex">
        <div className="px-6 pb-6 text-lg font-bold text-gray-900">Admin</div>
        <NavItems />
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative flex h-full w-64 flex-col bg-white">
            <div className="flex items-center justify-between px-6 py-6">
              <span className="text-lg font-bold text-gray-900">Admin</span>
              <button
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close menu"
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
            <NavItems onNavigate={() => setMobileNavOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-5 sm:px-8">
          <button
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 md:hidden"
          >
            <Menu size={20} />
          </button>

          <Dropdown
            trigger={
              <span className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <UserCircle size={20} className="text-gray-400" />
                {displayName || "Admin"}
              </span>
            }
            items={[
              { label: "Back to store", onSelect: () => navigate("/products") },
              { label: "Log out", onSelect: handleLogout, danger: true },
            ]}
          />
        </header>

        <main className="flex-1 px-4 py-8 sm:px-8 sm:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
