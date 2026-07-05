"use client";

import { useQuery } from "@tanstack/react-query";

import { investmentsApi } from "@/lib/api/investments";
import type { AssetListParams } from "@/lib/api/types";

import { queryKeys } from "./query-keys";

/** GET /investments/assets/ (public catalog, supports search/filter/order). */
export function useAssets(params?: AssetListParams) {
  return useQuery({
    queryKey: queryKeys.assets.list(params),
    queryFn: () => investmentsApi.listAssets(params),
  });
}

/** GET /investments/assets/{id}/ (single asset metadata + live price). */
export function useAsset(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.assets.detail(id ?? ""),
    queryFn: () => investmentsApi.getAsset(id as string),
    enabled: Boolean(id),
  });
}

/** GET /investments/assets/{id}/history/ (last ~50 price points). */
export function useAssetHistory(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.assets.history(id ?? ""),
    queryFn: () => investmentsApi.getAssetHistory(id as string),
    enabled: Boolean(id),
  });
}
