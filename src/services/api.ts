import axios, { AxiosError } from "axios";
import { tokenStorage } from "../utils/tokenStorage";

const BASE_URL = import.meta.env.VITE_API_URL as string;

export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ApiErrorInfo {
  status: number | null;
  message: string;
}

function describeError(error: AxiosError): ApiErrorInfo {
  const status = error.response?.status ?? null;
  const serverMessage = (
    error.response?.data as { message?: string } | undefined
  )?.message;

  switch (status) {
    case 400:
      return {
        status,
        message: serverMessage || "Bad request. Please check your input.",
      };
    case 401:
      return {
        status,
        message: serverMessage || "Session expired. Please log in again.",
      };
    case 403:
      return { status, message: serverMessage || "Access denied" };
    case 404:
      return { status, message: serverMessage || "Resource not found" };
    case 422:
      return {
        status,
        message: serverMessage || "Invalid fields. Review form submition",
      };
    case 500:
      return { status, message: serverMessage || "Server Error. Try again" };
    default:
      return { status, message: serverMessage || "Network error" };
  }
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const info = describeError(error);

    if (info.status === 401) {
      tokenStorage.clear();
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject({ ...error, apiError: info });
  },
);

export default api;
