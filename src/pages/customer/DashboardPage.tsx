import { useMemo } from "react";
import { Link } from "react-router-dom";
import { PackageCheck, Wallet, ShoppingCart, ShoppingBag } from "lucide-react";
import { useAppSelector } from "../../app/hooks";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { selectMyOrders } from "../../features/orders/orderSlice";
import StatCard from "../../components/StatCard";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import type { OrderStatus } from "../../types";

const STATUS_VARIANT: Record<
  OrderStatus,
  "warning" | "info" | "success" | "danger"
> = {
  Processing: "warning",
  Shipped: "info",
  Delivered: "success",
  Cancelled: "danger",
};

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const { items, itemCount, total, isEmpty } = useCart();
  const orders = useAppSelector(selectMyOrders);

  const recentOrders = useMemo(() => orders.slice(0, 3), [orders]);

  const totalSpent = useMemo(
    () =>
      orders
        .filter((o) => o.status !== "Cancelled")
        .reduce((sum, o) => sum + o.total, 0),
    [orders],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back{user ? `, ${user.firstName}` : ""}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's a quick look at your account.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/products"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Browse products
          </Link>
          <Link
            to="/orders"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View orders
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Orders placed" value={orders.length} icon={PackageCheck} />
        <StatCard
          label="Total spent"
          value={`$${totalSpent.toFixed(2)}`}
          icon={Wallet}
        />
        <StatCard label="Items in cart" value={itemCount} icon={ShoppingCart} />
        <StatCard
          label="Cart total"
          value={`$${total.toFixed(2)}`}
          icon={ShoppingBag}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card title="Recent orders" className="lg:col-span-2">
          {recentOrders.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-sm text-gray-500">
                You haven't placed any orders yet.
              </p>
              <Link
                to="/products"
                className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <li
                    key={order.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
                  >
                    <div>
                      <Link
                        to={`/orders/${order.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Order #{order.id}
                      </Link>
                      <p className="text-xs text-gray-500">
                        {new Date(order.date).toLocaleDateString(undefined, {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={STATUS_VARIANT[order.status]}>
                        {order.status}
                      </Badge>
                      <span className="font-semibold text-gray-900">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                to="/orders"
                className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                View all orders
              </Link>
            </>
          )}
        </Card>

        <div className="space-y-6">
          <Card title="Your cart">
            {isEmpty ? (
              <div>
                <p className="text-sm text-gray-500">Your cart is empty.</p>
                <Link
                  to="/products"
                  className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
                >
                  Browse products
                </Link>
              </div>
            ) : (
              <div>
                <ul className="space-y-1 text-sm text-gray-600">
                  {items.slice(0, 3).map((item) => (
                    <li key={item.id} className="flex justify-between gap-2">
                      <span className="line-clamp-1">{item.title}</span>
                      <span className="shrink-0 text-gray-500">
                        × {item.quantity}
                      </span>
                    </li>
                  ))}
                  {items.length > 3 && (
                    <li className="text-xs text-gray-400">
                      + {items.length - 3} more
                    </li>
                  )}
                </ul>
                <div className="mt-3 flex justify-between border-t border-gray-100 pt-3 text-sm font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Link
                  to="/checkout"
                  className="mt-3 block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                >
                  Checkout
                </Link>
              </div>
            )}
          </Card>

          <Card title="Account">
            {user ? (
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-xs text-gray-500">Name</dt>
                  <dd className="text-gray-900">
                    {user.firstName} {user.lastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Email</dt>
                  <dd className="break-all text-gray-900">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Username</dt>
                  <dd className="text-gray-900">{user.username}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-gray-500">Loading account…</p>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                Go to Admin Panel
              </Link>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
