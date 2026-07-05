import type {
  Asset,
  MarketStatus,
  ToggleFavoriteResponse,
} from "@/lib/api/types";

import { request } from "./client";

export const marketApi = {
  /** GET /market/status/ -> live prices keyed by symbol. */
  getStatus: () => request<MarketStatus>({ method: "GET", url: "/market/status/" }),

  /**
   * GET /market/assets/my-favorites/ -> the user's watchlist as an array of assets.
   */
  listFavorites: () =>
    request<Asset[]>({ method: "GET", url: "/market/assets/my-favorites/" }),

  /**
   * POST /market/assets/toggle-favorite/ with `{ asset_id }`.
   * Returns `{ status: "added" }` (201) or `{ status: "removed" }` (200).
   */
  toggleFavorite: (assetId: string) =>
    request<ToggleFavoriteResponse>({
      method: "POST",
      url: "/market/assets/toggle-favorite/",
      data: { asset_id: assetId },
    }),
};
