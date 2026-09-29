import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectMyOrders } from "../../features/orders/orderSlice";
import StatusMessage from "../../components/StatusMessage";

const STATUS_COLORS: Record<string, string> = {
  Processing: "bg-amber-100 text-amber-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function Orders() {
  const orders = useAppSelector(selectMyOrders);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Your Orders</h1>

      {orders.length === 0 ? (
        <StatusMessage
          type="empty"
          message="You haven't placed any orders yet."
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
            >
              <div>
                <p className="font-semibold text-gray-900">Order #{order.id}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.date).toLocaleDateString(undefined, {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-900">
                  ${order.total.toFixed(2)}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
                <Link
                  to={`/orders/${order.id}`}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
