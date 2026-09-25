import { useCart } from "../hooks/useCart";
import type { CartItem as CartItemType } from "../types";

interface CartItemProps {
  item: CartItemType;
}

function CartItem({ item }: CartItemProps) {
  const { increment, decrement, remove } = useCart();
  const lineSubtotal = item.price * item.quantity;
  const hasDiscount = item.discountPercentage > 0;
  const atMaxStock = item.quantity >= item.stock;

  return (
    <div className="flex items-start gap-3 border-b border-gray-100 py-3 last:border-b-0">
      <img
        src={item.thumbnail}
        alt={item.title}
        className="h-14 w-14 rounded-md object-contain"
      />
      <div className="flex-1">
        <p className="line-clamp-1 text-sm font-semibold text-gray-900">
          {item.title}
        </p>
        <p className="mb-1.5 text-xs text-gray-500">
          ${item.price.toFixed(2)} each
          {hasDiscount && (
            <span className="ml-1 text-green-600">
              (-{item.discountPercentage.toFixed(0)}%)
            </span>
          )}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => decrement(item.id)}
            disabled={item.quantity <= 1}
            className={`h-6 w-6 rounded border border-gray-300 text-sm leading-none ${
              item.quantity <= 1
                ? "cursor-not-allowed opacity-40"
                : "hover:bg-gray-50"
            }`}
          >
            -
          </button>
          <span className="min-w-4 text-center text-sm">{item.quantity}</span>
          <button
            onClick={() => increment(item.id)}
            disabled={atMaxStock}
            className={`h-6 w-6 rounded border border-gray-300 text-sm leading-none ${
              atMaxStock ? "cursor-not-allowed opacity-40" : "hover:bg-gray-50"
            }`}
          >
            +
          </button>
        </div>
        {atMaxStock && (
          <p className="mt-1 text-[11px] text-red-600">Maximum stock reached</p>
        )}
      </div>

      <div className="flex flex-col items-end justify-between self-stretch">
        <p className="text-sm font-bold">${lineSubtotal.toFixed(2)}</p>
        <button
          onClick={() => remove(item.id)}
          className="text-[11px] text-red-600 hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;