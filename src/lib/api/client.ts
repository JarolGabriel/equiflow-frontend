import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import {
  clearAuth,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setAuthTokens,
} from "@/lib/store/auth-store";

import { API_BASE_URL } from "./config";

/** Endpoints that must never trigger a token-refresh attempt. */
const AUTH_FREE_PATHS = [
  "/users/login/",
  "/users/login/refresh/",
  "/users/register/",
];

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ---------------------------------------------------------------------------
// Request interceptor: attach the bearer token when present.
// ---------------------------------------------------------------------------

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------------------------------------------------------------------
// Response interceptor: single-flight refresh on 401.
// ---------------------------------------------------------------------------

/**
 * Holds the in-flight refresh request so concurrent 401s share one refresh
 * call instead of each firing their own (single-flight / request coalescing).
 */
let refreshPromise: Promise<string> | null = null;

function isAuthFreePath(url?: string): boolean {
  if (!url) return false;
  return AUTH_FREE_PATHS.some((path) => url.includes(path));
}

async function refreshAccessToken(): Promise<string> {
  const refresh = getRefreshToken();
  if (!refresh) {
    throw new Error("No refresh token available");
  }

  // Use a bare axios call (not `apiClient`) to avoid interceptor recursion.
  const { data } = await axios.post<{ access: string; refresh?: string }>(
    `${API_BASE_URL}/users/login/refresh/`,
    { refresh },
    { headers: { "Content-Type": "application/json" } },
  );

  // SimpleJWT returns a new access token; with ROTATE_REFRESH_TOKENS it may also
  // return a new refresh token.
  if (data.refresh) {
    setAuthTokens({ access: data.access, refresh: data.refresh });
  } else {
    setAccessToken(data.access);
  }

  return data.access;
}

function redirectToLogin() {
  if (typeof window === "undefined") return;
  const { pathname, search } = window.location;
  const next = encodeURIComponent(`${pathname}${search}`);
  // Avoid redirect loops if we're already on the login page.
  if (!pathname.startsWith("/login")) {
    window.location.assign(`/login?next=${next}`);
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    const status = error.response?.status;
    const shouldAttemptRefresh =
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthFreePath(originalRequest.url) &&
      Boolean(getRefreshToken());

    if (!shouldAttemptRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise = refreshPromise ?? refreshAccessToken();
      const newAccess = await refreshPromise;
      refreshPromise = null;

      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      refreshPromise = null;
      clearAuth();
      redirectToLogin();
      return Promise.reject(refreshError);
    }
  },
);

/** Thin typed helper around `apiClient` that unwraps `response.data`. */
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<T>(config);
  return response.data;
}
