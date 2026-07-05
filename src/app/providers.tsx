"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { makeQueryClient } from "@/lib/query-client";

let browserQueryClient: QueryClient | undefined;

/**
 * On the server: always create a new client.
 * In the browser: reuse a single client so state survives re-renders and
 * Suspense boundaries (recommended TanStack Query App Router pattern).
 */
function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
