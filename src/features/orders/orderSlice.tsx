import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { RootState } from "../../app/store";
import type { CartItem, Order, ShippingInfo } from "../../types";

export const ORDERS_STORAGE_KEY = "ecommerce-orders:list";
export const ORDER_NUMBER_STORAGE_KEY = "ecommerce-orders:next-number";

interface OrdersState {
  orders: Order[];
  nextOrderNumber: number;
  hydrated: boolean;
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError: string | null;
}

const initialState: OrdersState = {
  orders: [],
  nextOrderNumber: 1001,
  hydrated: false,
  createStatus: "idle",
  createError: null,
};

function persist(orders: Order[], nextOrderNumber: number) {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    localStorage.setItem(ORDER_NUMBER_STORAGE_KEY, String(nextOrderNumber));
  } catch {}
}

export const createOrder = createAsyncThunk<
  Order,
  {
    customer: ShippingInfo;
    items: CartItem[];
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
  },
  { state: RootState; rejectValue: string }
>("orders/createOrder", async (payload, { getState, rejectWithValue }) => {
  const userId = getState().auth.user?.id;

  try {
    await api.post("/carts/add", {
      userId: userId ?? 1,
      products: payload.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
    });
  } catch (err) {
    const apiErr = err as { apiError?: { message?: string } };
    return rejectWithValue(
      apiErr.apiError?.message || "Could not place order. Please try again.",
    );
  }

  const { nextOrderNumber } = getState().orders;
  const order: Order = {
    id: nextOrderNumber,
    date: new Date().toISOString(),
    status: "Processing",
    customer: payload.customer,
    items: payload.items.map((item) => ({
      id: item.id,
      title: item.title,
      thumbnail: item.thumbnail,
      price: item.price,
      discountPercentage: item.discountPercentage,
      quantity: item.quantity,
    })),
    subtotal: payload.subtotal,
    discount: payload.discount,
    shipping: payload.shipping,
    total: payload.total,
  };

  return order;
});

export const fetchOrders = createAsyncThunk<{
  orders: Order[];
  nextOrderNumber: number;
}>("orders/fetchOrders", async () => {
  try {
    const rawOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    const rawNext = localStorage.getItem(ORDER_NUMBER_STORAGE_KEY);
    return {
      orders: rawOrders ? (JSON.parse(rawOrders) as Order[]) : [],
      nextOrderNumber: rawNext ? Number(rawNext) : 1001,
    };
  } catch {
    return { orders: [], nextOrderNumber: 1001 };
  }
});

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearCreateError(state) {
      state.createError = null;
      state.createStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.nextOrderNumber = action.payload.nextOrderNumber;
        state.hydrated = true;
      })
      .addCase(createOrder.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.orders.unshift(action.payload);
        state.nextOrderNumber += 1;
        persist(state.orders, state.nextOrderNumber);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload ?? "Could not place order.";
      });
  },
});

export const { clearCreateError } = ordersSlice.actions;
export default ordersSlice.reducer;

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectOrderById = (state: RootState, id: number) =>
  state.orders.orders.find((o) => o.id === id);
export const selectCreateOrderStatus = (state: RootState) =>
  state.orders.createStatus;
export const selectCreateOrderError = (state: RootState) =>
  state.orders.createError;
