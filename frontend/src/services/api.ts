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

// ---------------------------------------------------------------------------
// CSRF protection
//
// The backend uses Spring Security's CSRF protection with a cookie-based token.
// Every request that changes data (POST, PUT, DELETE, PATCH) must send the token
// in the X-XSRF-TOKEN header. The token is fetched from GET /csrf.
// /login and /signup are exempt on the backend.
// ---------------------------------------------------------------------------
const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];
const CSRF_EXEMPT_URLS = ["/login", "/signup", "/csrf"];

let csrfToken: string | null = null;

const readCsrfToken = (data: any): string | null =>
  typeof data === "string" ? data : data?.token ?? data?.csrfToken ?? null;

/** GET /csrf - fetches a fresh token (and the XSRF-TOKEN cookie it belongs to). */
const fetchCsrfToken = async (): Promise<string | null> => {
  try {
    const response = await api.get("/csrf");
    csrfToken = readCsrfToken(response.data);
  } catch {
    // Backends without CSRF protection have no /csrf; send requests without it.
    csrfToken = null;
  }
  return csrfToken;
};

/** Forget the cached token, e.g. after login or logout changes the session. */
export const resetCsrfToken = () => {
  csrfToken = null;
};

api.interceptors.request.use(async (config) => {
  const method = (config.method ?? "get").toUpperCase();
  const url: string = config.url ?? "";

  if (SAFE_METHODS.includes(method) || CSRF_EXEMPT_URLS.includes(url)) {
    return config;
  }

  const token = csrfToken ?? (await fetchCsrfToken());
  if (token) {
    config.headers.set("X-XSRF-TOKEN", token);
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const url: string = response.config.url ?? "";

    // Login, signup and logout change the session, so the old token is stale.
    if (["/login", "/signup", "/logout"].includes(url)) {
      resetCsrfToken();
    }

    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url ?? "";
    const original = error.config;
    const method = (original?.method ?? "get").toUpperCase();

    // A 403 on a data-changing request is often a stale CSRF token: fetch a
    // new one and retry the request once.
    if (
      status === 403 &&
      original &&
      !original._csrfRetried &&
      !SAFE_METHODS.includes(method) &&
      !CSRF_EXEMPT_URLS.includes(url)
    ) {
      original._csrfRetried = true;
      const token = await fetchCsrfToken();

      if (token) {
        original.headers.set("X-XSRF-TOKEN", token);
        return api(original);
      }
    }

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