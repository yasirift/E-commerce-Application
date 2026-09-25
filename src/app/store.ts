import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productsReducer from "../features/products/productSlice";
import cartReducer, { CART_STORAGE_KEY } from "../features/cart/cartSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

let previousCartItems = store.getState().cart.items;

store.subscribe(() => {
  const currentCartItems = store.getState().cart.items;
  if (currentCartItems !== previousCartItems) {
    previousCartItems = currentCartItems;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentCartItems));
    } catch {}
  }
});
