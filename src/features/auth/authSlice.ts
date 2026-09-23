import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { tokenStorage } from "../../utils/tokenStorage";
import type {
  AuthState,
  AuthUser,
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  Role,
} from "./types";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
  initialized: false,
  registerStatus: "idle",
  registerError: null,
};

function toAuthUser(u: {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
  role?: string;
}): AuthUser {
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    gender: u.gender,
    image: u.image,
    role: (u.role as Role) || "customer",
  };
}

function getErrorMessage(err: unknown, fallback: string): string {
  const apiErr = err as { apiError?: { message?: string } };
  return apiErr.apiError?.message || fallback;
}

export const loginUser = createAsyncThunk<
  AuthUser,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post<LoginResponse>("/auth/login", {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: 60,
    });
    const token = data.accessToken ?? data.token;
    if (!token) {
      return rejectWithValue(
        "Login succeeded but no access token was returned.",
      );
    }
    tokenStorage.set(token);

    try {
      const { data: fullUser } = await api.get("/auth/me");
      return toAuthUser(fullUser);
    } catch {
      return toAuthUser(data);
    }
  } catch (err: unknown) {
    return rejectWithValue(
      getErrorMessage(err, "Invalid username or password."),
    );
  }
});

export const registerUser = createAsyncThunk<
  { username: string },
  RegisterCredentials,
  { rejectValue: string }
>("auth/register", async (values, { rejectWithValue }) => {
  try {
    await api.post("users/add", {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      username: values.username,
      password: values.password,
    });
    return { username: values.username };
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err, "Registration failed"));
  }
});

export const hydrateFromStorage = createAsyncThunk<AuthUser | null, void>(
  "auth/hydrate",
  async (_, { rejectWithValue }) => {
    const token = tokenStorage.get();
    if (!token) return null;
    try {
      const { data } = await api.get("/auth/me");
      return toAuthUser(data);
    } catch {
      tokenStorage.clear();
      return rejectWithValue("Session expired");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      tokenStorage.clear();
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
    },
    clearRegisterError(state) {
      state.registerError = null;
      state.registerStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Login failed";
        state.isAuthenticated = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = "loading";
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registerStatus = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = "failed";
        state.registerError = action.payload ?? "Registration failed.";
      })
      .addCase(hydrateFromStorage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(hydrateFromStorage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.initialized = true;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(hydrateFromStorage.rejected, (state) => {
        state.status = "failed";
        state.initialized = true;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearRegisterError } = authSlice.actions;
export default authSlice.reducer;
