import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} from "../features/cart/cartSlice";
import {
  selectCartItems,
  selectCartItemCount,
  selectCartSubtotal,
  selectCartDiscount,
  selectCartShipping,
  selectCartTotal,
} from "../features/cart/cartSelectors";
import type { Product } from "../types";

export function useCart() {
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartItemCount);
  const subtotal = useAppSelector(selectCartSubtotal);
  const discount = useAppSelector(selectCartDiscount);
  const shipping = useAppSelector(selectCartShipping);
  const total = useAppSelector(selectCartTotal);

  const add = useCallback(
    (product: Product, quantity = 1) =>
      dispatch(addToCart({ product, quantity })),
    [dispatch],
  );

  const remove = useCallback(
    (productId: number) => dispatch(removeFromCart(productId)),
    [dispatch],
  );

  const increment = useCallback(
    (productId: number) => dispatch(incrementQuantity(productId)),
    [dispatch],
  );

  const decrement = useCallback(
    (productId: number) => dispatch(decrementQuantity(productId)),
    [dispatch],
  );

  const clear = useCallback(() => dispatch(clearCart()), [dispatch]);

  return {
    items,
    itemCount,
    subtotal,
    discount,
    shipping,
    total,
    isEmpty: items.length === 0,
    add,
    remove,
    increment,
    decrement,
    clear,
  };
}
