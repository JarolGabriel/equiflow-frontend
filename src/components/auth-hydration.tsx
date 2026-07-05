"use client";

import { useEffect } from "react";

import { markAuthHydrated, useAuthStore } from "@/lib/store/auth-store";

/**
 * Flips the auth store's `hasHydrated` flag to true after the first client
 * mount. localStorage is synchronous, so by the time this effect runs the
 * persisted tokens are already loaded. Doing it in an effect (instead of
 * `onRehydrateStorage`) keeps the first client render identical to the server
 * render (avoiding hydration mismatches) while guaranteeing the app never gets
 * stuck on the loading spinner.
 */
export function AuthHydration() {
  useEffect(() => {
    // Handle the case where async hydration hasn't finished yet, plus the
    // common synchronous case.
    const unsub = useAuthStore.persist.onFinishHydration(markAuthHydrated);
    if (useAuthStore.persist.hasHydrated()) {
      markAuthHydrated();
    }
    return unsub;
  }, []);

  return null;
}
