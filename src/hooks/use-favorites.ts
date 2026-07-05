"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { marketApi } from "@/lib/api/market";
import type { Asset } from "@/lib/api/types";
import { useAuthStore } from "@/lib/store/auth-store";

import { queryKeys } from "./query-keys";

/** GET /market/assets/my-favorites/ (the user's single watchlist). */
export function useFavorites() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.favorites.all,
    queryFn: marketApi.listFavorites,
    enabled: isAuthenticated,
  });
}

/**
 * POST /market/assets/toggle-favorite/ with optimistic UI.
 *
 * Takes the full `Asset` (not just an id) so the favorites list can be updated
 * optimistically before the server responds, and rolled back on error.
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (asset: Asset) => marketApi.toggleFavorite(asset.id),
    onMutate: async (asset) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites.all });

      const previous = queryClient.getQueryData<Asset[]>(
        queryKeys.favorites.all,
      );

      queryClient.setQueryData<Asset[]>(queryKeys.favorites.all, (current) => {
        const list = current ?? [];
        const exists = list.some((a) => a.id === asset.id);
        return exists
          ? list.filter((a) => a.id !== asset.id)
          : [...list, asset];
      });

      return { previous };
    },
    onError: (_error, _asset, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.favorites.all, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all });
    },
  });
}

/** Convenience helper to check if an asset id is in the favorites list. */
export function useIsFavorite(assetId: string | undefined) {
  const { data } = useFavorites();
  if (!assetId || !data) return false;
  return data.some((a) => a.id === assetId);
}
