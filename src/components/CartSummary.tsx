import { useCart } from "../hooks/useCart";

function CartSummary() {
  const { itemCount, subtotal, shipping, discount, total } = useCart();

  return (
    <div className="mt-3 border-t border-gray-200 pt-3">
      <div className="flex justify-between py-1 text-sm text-gray-600">
        <span>Items</span>
        <span>{itemCount}</span>
      </div>
      <div className="flex justify-between py-1 text-sm text-gray-600">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between py-1 text-sm text-gray-600">
        <span>Discount</span>
        <span className="text-green-600">-${discount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between py-1 text-sm text-gray-600">
        <span>Shipping</span>
        <span>${shipping.toFixed(2)}</span>
      </div>
      <div className="mt-1.5 flex justify-between border-t border-gray-200 pt-1.5 text-base font-bold text-gray-900">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default CartSummary;