import { useAppSelector } from "../app/hooks";
import { selectCartItemCount } from "../features/cart/cartSelectors";
import { ShoppingCart } from "lucide-react";

interface CartIconProps {
  onClick: () => void;
}

function CartIcon({ onClick }: CartIconProps) {
  const itemCount = useAppSelector(selectCartItemCount);

  return (
    <button
      onClick={onClick}
      aria-label="Open Cart"
      className="relative rounded-md p-2 text-2xl hover:bg-gray-200"
    >
      <ShoppingCart />
      {itemCount > 0 && (
        <span className="absolute top-0 right-0 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">
          {itemCount}
        </span>
      )}
    </button>
  );
}

export default CartIcon;
