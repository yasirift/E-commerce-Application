import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import StatusMessage from "./StatusMessage";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, isEmpty, clear } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  function handleCheckout() {
    onClose();
    navigate("/checkout");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
      onClick={onClose}
    >
      <div
        className="flex h-full w-85 max-w-[90vw] flex-col overflow-y-auto bg-white p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Your Cart</h2>
          <button
            onClick={onClose}
            aria-label="Close Cart"
            className="text-lg hover:text-gray-500"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isEmpty ? (
            <StatusMessage type="empty" message="Your cart is empty" />
          ) : (
            items.map((item) => <CartItem key={item.id} item={item} />)
          )}
        </div>

        {!isEmpty && (
          <>
            <CartSummary />
            <div className="mt-4 flex gap-2">
              <button
                onClick={clear}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
