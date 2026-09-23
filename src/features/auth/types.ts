export type Role = "admin" | "customer";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
  gender?: string;
  role: Role;
}

export interface LoginResponse extends Omit<AuthUser, "role"> {
  accessToken: string;
  token?: string;
  refreshToken?: string;
  role?: string;
}

export type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  status: AsyncStatus;
  error: string | null;
  initialized: boolean;
  registerStatus: AsyncStatus;
  registerError: string | null;
}
