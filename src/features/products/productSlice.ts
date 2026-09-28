import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { Product, ProductsResponse } from "../../types";
import type { ProductFormValues } from "../../schemas/productSchema";
import type { RootState } from "../../app/store";

export type SortOption = "" | "price-asc" | "price-desc" | "rating-desc";

interface AdminProductsState {
  items: Product[];
  total: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string;
  mutationStatus: "idle" | "loading" | "succeeded" | "failed";
  mutationError: string | null;
}

interface ProductsState {
  items: Product[];
  total: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string;
  search: string;
  category: string;
  sort: SortOption;
  categories: string[];
  admin: AdminProductsState;
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
  admin: {
    items: [],
    total: 0,
    status: "idle",
    error: "",
    mutationStatus: "idle",
    mutationError: null,
  },
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
>("products/fetchProducts", async ({ page, limit }, { getState, rejectWithValue }) => {
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
    return rejectWithValue(apiErr.apiError?.message || "Failed to load products.");
  }
});

export const fetchCategories = createAsyncThunk<string[]>(
  "products/fetchCategories",
  async () => {
    const { data } = await api.get<string[]>("/products/category-list");
    return data;
  },
);

export const fetchAdminProducts = createAsyncThunk<
  ProductsResponse,
  FetchProductsArgs,
  { rejectValue: string }
>("products/fetchAdminProducts", async ({ page, limit }, { rejectWithValue }) => {
  try {
    const { data } = await api.get<ProductsResponse>("/products", {
      params: { limit, skip: (page - 1) * limit },
    });
    return data;
  } catch (err) {
    const apiErr = err as { apiError?: { message?: string } };
    return rejectWithValue(apiErr.apiError?.message || "Failed to load products.");
  }
});

function toProduct(id: number, values: ProductFormValues): Product {
  return {
    id,
    title: values.title,
    description: values.description,
    category: values.category,
    brand: values.brand,
    price: values.price,
    stock: values.stock,
    discountPercentage: values.discountPercentage ?? 0,
    thumbnail: values.thumbnail,
    images: [values.thumbnail],
    rating: 0,
  };
}

export const addProduct = createAsyncThunk<
  Product,
  ProductFormValues,
  { rejectValue: string }
>("products/addProduct", async (values, { rejectWithValue }) => {
  try {
    const { data } = await api.post<{ id: number }>("/products/add", values);
    return toProduct(data.id, values);
  } catch (err) {
    const apiErr = err as { apiError?: { message?: string } };
    return rejectWithValue(apiErr.apiError?.message || "Failed to add product.");
  }
});

export const updateProduct = createAsyncThunk<
  Product,
  { id: number; values: ProductFormValues },
  { rejectValue: string }
>("products/updateProduct", async ({ id, values }, { rejectWithValue }) => {
  try {
    await api.put(`/products/${id}`, values);
    return toProduct(id, values);
  } catch (err) {
    const apiErr = err as { apiError?: { message?: string } };
    return rejectWithValue(apiErr.apiError?.message || "Failed to update product.");
  }
});

export const deleteProduct = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("products/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/products/${id}`);
    return id;
  } catch (err) {
    const apiErr = err as { apiError?: { message?: string } };
    return rejectWithValue(apiErr.apiError?.message || "Failed to delete product.");
  }
});

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
    clearMutationError(state) {
      state.admin.mutationError = null;
      state.admin.mutationStatus = "idle";
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
      })
      .addCase(fetchAdminProducts.pending, (state) => {
        state.admin.status = "loading";
        state.admin.error = "";
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.admin.status = "succeeded";
        state.admin.items = action.payload.products;
        state.admin.total = action.payload.total;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.admin.status = "failed";
        state.admin.error = action.payload ?? "Failed to load products.";
      })
      .addCase(addProduct.pending, (state) => {
        state.admin.mutationStatus = "loading";
        state.admin.mutationError = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.admin.mutationStatus = "succeeded";
        state.admin.items.unshift(action.payload);
        state.admin.total += 1;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.admin.mutationStatus = "failed";
        state.admin.mutationError = action.payload ?? "Failed to add product.";
      })
      .addCase(updateProduct.pending, (state) => {
        state.admin.mutationStatus = "loading";
        state.admin.mutationError = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.admin.mutationStatus = "succeeded";
        const index = state.admin.items.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) state.admin.items[index] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.admin.mutationStatus = "failed";
        state.admin.mutationError = action.payload ?? "Failed to update product.";
      })
      .addCase(deleteProduct.pending, (state) => {
        state.admin.mutationStatus = "loading";
        state.admin.mutationError = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.admin.mutationStatus = "succeeded";
        state.admin.items = state.admin.items.filter(
          (p) => p.id !== action.payload,
        );
        state.admin.total -= 1;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.admin.mutationStatus = "failed";
        state.admin.mutationError = action.payload ?? "Failed to delete product.";
      });
  },
});

export const { setSearch, setCategory, setSort, clearMutationError } =
  productsSlice.actions;
export default productsSlice.reducer;

export const selectProducts = (state: RootState) => state.products.items;
export const selectProductsStatus = (state: RootState) => state.products.status;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectTotal = (state: RootState) => state.products.total;
export const selectSearch = (state: RootState) => state.products.search;
export const selectCategory = (state: RootState) => state.products.category;
export const selectSort = (state: RootState) => state.products.sort;
export const selectCategories = (state: RootState) => state.products.categories;

export const selectAdminProducts = (state: RootState) => state.products.admin.items;
export const selectAdminTotal = (state: RootState) => state.products.admin.total;
export const selectAdminStatus = (state: RootState) => state.products.admin.status;
export const selectAdminError = (state: RootState) => state.products.admin.error;
export const selectMutationStatus = (state: RootState) =>
  state.products.admin.mutationStatus;
export const selectMutationError = (state: RootState) =>
  state.products.admin.mutationError;
