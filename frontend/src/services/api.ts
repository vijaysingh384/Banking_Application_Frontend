import axios from "axios";
import { API_BASE_URL } from "../config";

// The backend authenticates with a Spring Security HTTP session, so every
// request must send the session cookie (withCredentials).
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const USER_KEY = "io_bank_user";

export const clearSession = () => localStorage.removeItem(USER_KEY);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url ?? "";

    // Session expired or not signed in: drop the cached user so the route
    // guards show the login page. Failed logins are handled by the form.
    if (status === 401 && url !== "/login" && url !== "/signup") {
      clearSession();
      window.dispatchEvent(new Event("auth:logout"));
    }

    return Promise.reject(error);
  }
);

/** Reads the `message` field of the backend's ResponseDTO. */
export const readMessage = (data: any, fallback: string): string =>
  data?.message ?? fallback;

/** Reads the backend's ErrorDetails (`msg`) or ResponseDTO (`message`). */
export const readErrorMessage = (error: any, fallback: string): string =>
  error?.response?.data?.msg ??
  error?.response?.data?.message ??
  error?.response?.data?.error ??
  fallback;
