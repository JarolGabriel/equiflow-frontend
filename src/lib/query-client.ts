import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

/**
 * Creates a configured QueryClient. A factory (not a singleton) so the server
 * gets a fresh client per request and the browser reuses one instance.
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Don't retry auth/permission/not-found errors; they won't recover.
          if (isAxiosError(error)) {
            const status = error.response?.status;
            if (status && [401, 403, 404].includes(status)) return false;
          }
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}
