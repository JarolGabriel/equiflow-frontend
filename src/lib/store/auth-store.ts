import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AuthTokens, User } from "@/lib/api/types";

interface AuthState {
  access: string | null;
  refresh: string | null;
  user: User | null;
  isAuthenticated: boolean;
  /** True once the persisted state has been rehydrated from localStorage on the client. */
  hasHydrated: boolean;

  setTokens: (tokens: AuthTokens) => void;
  /** Update only the access token (used after a successful refresh). */
  setAccess: (access: string) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

/**
 * SSR-safe storage: on the server there is no `localStorage`, so we fall back to
 * a no-op storage and let the client rehydrate after mount.
 */
const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      access: null,
      refresh: null,
      user: null,
      isAuthenticated: false,
      hasHydrated: false,

      setTokens: ({ access, refresh }) =>
        set({ access, refresh, isAuthenticated: true }),
      setAccess: (access) => set({ access, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      logout: () =>
        set({
          access: null,
          refresh: null,
          user: null,
          isAuthenticated: false,
        }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "equiflow-auth",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : noopStorage,
      ),
      partialize: (state) => ({
        access: state.access,
        refresh: state.refresh,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

/**
 * Marks the store as hydrated. Called from a client mount effect (see
 * `AuthHydration`) rather than `onRehydrateStorage`, so that the first client
 * render still matches the server (hasHydrated=false) and there's no hydration
 * mismatch — then it flips to true after mount, guaranteeing we never hang.
 */
export function markAuthHydrated() {
  const store = useAuthStore.getState();
  if (!store.hasHydrated) store.setHasHydrated(true);
}

// ---------------------------------------------------------------------------
// Non-React accessors (for axios interceptors and other imperative code)
// ---------------------------------------------------------------------------

export const getAccessToken = () => useAuthStore.getState().access;
export const getRefreshToken = () => useAuthStore.getState().refresh;
export const setAccessToken = (access: string) =>
  useAuthStore.getState().setAccess(access);
export const setAuthTokens = (tokens: AuthTokens) =>
  useAuthStore.getState().setTokens(tokens);
export const clearAuth = () => useAuthStore.getState().logout();
