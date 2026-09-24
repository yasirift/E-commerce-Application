import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { Product, ProductsResponse } from "../../types";
import type { RootState } from "../../app/store";

export type SortOption = "" | "price-asc" | "price-desc" | "rating-desc";

interface ProductsState {
  items: Product[];
  total: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string;
  search: string;
  category: string;
  sort: SortOption;
  categories: string[];
}

const initialState: ProductsState = {
  items: [],
  total: 0,
  status: "idle",
  error: "",
  search: "",
  category: "All",
  sort: "",
  categories: [],
};

function sortParams(sort: SortOption): { sortBy?: string; order?: string } {
  switch (sort) {
    case "price-asc":
      return { sortBy: "price", order: "asc" };
    case "price-desc":
      return { sortBy: "price", order: "desc" };
    case "rating-desc":
      return { sortBy: "rating", order: "desc" };
    default:
      return {};
  }
}

interface FetchProductsArgs {
  page: number;
  limit: number;
}

export const fetchProducts = createAsyncThunk<
  ProductsResponse,
  FetchProductsArgs,
  { state: RootState; rejectValue: string }
>(
  "products/fetchProducts",
  async ({ page, limit }, { getState, rejectWithValue }) => {
    const { search, category, sort } = getState().products;
    const skip = (page - 1) * limit;
    const params: Record<string, string | number> = {
      limit,
      skip,
      ...sortParams(sort),
    };

    let url = "/products";
    if (search.trim()) {
      url = "/products/search";
      params.q = search.trim();
    } else if (category !== "All") {
      url = `/products/category/${encodeURIComponent(category)}`;
    }

    try {
      const { data } = await api.get<ProductsResponse>(url, { params });
      return data;
    } catch (err) {
      const apiErr = err as { apiError?: { message?: string } };
      return rejectWithValue(
        apiErr.apiError?.message || "Failed to load products.",
      );
    }
  },
);

export const fetchCategories = createAsyncThunk<string[]>(
  "products/fetchCategories",
  async () => {
    const { data } = await api.get<string[]>("/products/category-list");
    return data;
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      if (action.payload.trim()) state.category = "All";
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
      state.search = "";
    },
    setSort(state, action: PayloadAction<SortOption>) {
      state.sort = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to load products.";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { setSearch, setCategory, setSort } = productsSlice.actions;
export default productsSlice.reducer;

export const selectProducts = (state: RootState) => state.products.items;
export const selectProductsStatus = (state: RootState) => state.products.status;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectTotal = (state: RootState) => state.products.total;
export const selectSearch = (state: RootState) => state.products.search;
export const selectCategory = (state: RootState) => state.products.category;
export const selectSort = (state: RootState) => state.products.sort;
export const selectCategories = (state: RootState) => state.products.categories;
