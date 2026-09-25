import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export const SHIPPING_FEE = 20;

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartItemCount = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
);

export const selectCartSubtotal = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0),
);

export const selectCartDiscount = createSelector([selectCartItems], (items) =>
  items.reduce(
    (sum, item) =>
      sum + (item.price * item.quantity * item.discountPercentage) / 100,
    0,
  ),
);

export const selectCartShipping = createSelector([selectCartItems], (items) =>
  items.length > 0 ? SHIPPING_FEE : 0,
);

export const selectCartTotal = createSelector(
  [selectCartSubtotal, selectCartDiscount, selectCartShipping],
  (subtotal, discount, shipping) => subtotal - discount + shipping,
);
