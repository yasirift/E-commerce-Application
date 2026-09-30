import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productsReducer from "../features/products/productSlice";
import ordersReducer from "../features/orders/orderSlice";
import cartReducer, { getCartStorageKey } from "../features/cart/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

let previousCartItems = store.getState().cart.items;

store.subscribe(() => {
  const currentCartItems = store.getState().cart.items;
  if (currentCartItems !== previousCartItems) {
    previousCartItems = currentCartItems;
    const userId = store.getState().auth.user?.id;
    if (userId === undefined) return;
    try {
      localStorage.setItem(
        getCartStorageKey(userId),
        JSON.stringify(currentCartItems),
      );
    } catch {}
  }
});
