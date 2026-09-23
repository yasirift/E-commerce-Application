import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  loginUser,
  registerUser,
  logout as logoutAction,
  clearRegisterError,
} from "../features/auth/authSlice";
import type {
  LoginCredentials,
  RegisterCredentials,
} from "../features/auth/types";

export function useAuth() {
  const dispatch = useAppDispatch();
  const {
    user,
    isAuthenticated,
    status,
    error,
    initialized,
    registerStatus,
    registerError,
  } = useAppSelector((s) => s.auth);

  const login = useCallback(
    (credentials: LoginCredentials) => dispatch(loginUser(credentials)),
    [dispatch],
  );

  const register = useCallback(
    (values: RegisterCredentials) => dispatch(registerUser(values)),
    [dispatch],
  );

  const logout = useCallback(() => dispatch(logoutAction()), [dispatch]);
  const resetRegisterError = useCallback(
    () => dispatch(clearRegisterError()),
    [dispatch],
  );

  return {
    user,
    isAuthenticated,
    loading: status === "loading",
    initialized,
    error,
    login,
    logout,
    register,
    registering: registerStatus === "loading",
    registerSucceeded: registerStatus === "succeeded",
    registerError,
    resetRegisterError,
    role: user?.role ?? null,
    isAdmin: user?.role === "admin",
  };
}
