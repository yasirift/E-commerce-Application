import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectOrderById } from "../../features/orders/orderSlice";
import type { RootState } from "../../app/store";

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const order = useAppSelector((state: RootState) =>
    id ? selectOrderById(state, Number(id)) : undefined,
  );

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="text-gray-600">
          We couldn't find that order — it may have been placed in a different
          browser or the local order data was cleared.
        </p>
        <Link
          to="/orders"
          className="mt-3 inline-block text-blue-600 hover:underline"
        >
          Back to your orders
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/orders" className="text-sm text-blue-600 hover:underline">
        ← Back to orders
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Order #{order.id}
        </h1>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
          {order.status}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Placed on{" "}
        {new Date(order.date).toLocaleDateString(undefined, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">
            Customer Information
          </h2>
          <p className="text-sm text-gray-600">
            {order.customer.firstName} {order.customer.lastName}
          </p>
          <p className="text-sm text-gray-600">{order.customer.email}</p>
          <p className="text-sm text-gray-600">{order.customer.phone}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">
            Shipping Address
          </h2>
          <p className="text-sm text-gray-600">{order.customer.address}</p>
          <p className="text-sm text-gray-600">
            {order.customer.city}, {order.customer.postalCode}
          </p>
          <p className="text-sm text-gray-600">{order.customer.country}</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Products</h2>
        <ul className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-3">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-12 w-12 rounded object-contain"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500">
                  ${item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-3 space-y-1 border-t border-gray-200 pt-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span className="text-green-600">
              -${order.discount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${order.shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-1.5 text-base font-bold text-gray-900">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
