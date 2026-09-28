import { useMemo } from "react";
import { Link } from "react-router-dom";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import { useAppSelector } from "../../app/hooks";
import { selectOrders } from "../../features/orders/orderSlice";
import { useFetch } from "../../hooks/useFetch";
import StatCard from "../../components/StatCard";
import Card from "../../components/Card";
import DashboardCharts from "../../components/DashboardCharts";

interface CountResponse {
  total: number;
}

export default function AdminDashboard() {
  const orders = useAppSelector(selectOrders);
  const { data: usersData } = useFetch<CountResponse>("/users?limit=0");
  const { data: productsData } = useFetch<CountResponse>("/products?limit=0");

  const totalSales = useMemo(
    () => orders.reduce((sum, o) => sum + o.total, 0),
    [orders],
  );

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  const topProducts = useMemo(() => {
    const counts = new Map<string, number>();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        counts.set(item.title, (counts.get(item.title) ?? 0) + item.quantity);
      });
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [orders]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Sales" value={`$${totalSales.toFixed(2)}`} icon={DollarSign} />
        <StatCard label="Orders" value={orders.length} icon={ShoppingCart} />
        <StatCard label="Customers" value={usersData?.total ?? "…"} icon={Users} />
        <StatCard label="Products" value={productsData?.total ?? "…"} icon={Package} />
      </div>

      <div className="mt-6">
        <DashboardCharts orders={orders} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Recent Orders">
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400">No orders yet</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between py-2 text-sm">
                  <Link to={`/orders/${order.id}`} className="text-blue-600 hover:underline">
                    Order #{order.id}
                  </Link>
                  <span className="text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </span>
                  <span className="font-medium text-gray-900">
                    ${order.total.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Top Products">
          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-400">No orders yet</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {topProducts.map(([title, qty]) => (
                <li key={title} className="flex items-center justify-between py-2 text-sm">
                  <span className="line-clamp-1 text-gray-700">{title}</span>
                  <span className="font-medium text-gray-900">{qty} sold</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
