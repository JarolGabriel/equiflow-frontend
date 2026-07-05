import type { AssetListParams } from "@/lib/api/types";

/** Centralized, hierarchical query keys for cache management and invalidation. */
export const queryKeys = {
  auth: {
    profile: ["auth", "profile"] as const,
  },
  assets: {
    all: ["assets"] as const,
    list: (params?: AssetListParams) => ["assets", "list", params ?? {}] as const,
    detail: (id: string) => ["assets", "detail", id] as const,
    history: (id: string) => ["assets", "history", id] as const,
  },
  market: {
    status: ["market", "status"] as const,
    summary: ["market", "summary"] as const,
  },
  favorites: {
    all: ["favorites"] as const,
  },
  portfolios: {
    all: ["portfolios"] as const,
    detail: (id: string) => ["portfolios", "detail", id] as const,
    assets: ["portfolio-assets"] as const,
  },
  transactions: {
    all: ["transactions"] as const,
  },
  alerts: {
    all: ["alerts"] as const,
  },
} as const;
