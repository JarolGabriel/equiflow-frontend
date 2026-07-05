"use client";

import { useQuery } from "@tanstack/react-query";

import { investmentsApi } from "@/lib/api/investments";
import { marketApi } from "@/lib/api/market";

import { queryKeys } from "./query-keys";

/**
 * GET /market/status/ (live prices from Redis).
 * Polls periodically so dashboards stay fresh without a WebSocket.
 */
export function useMarketStatus() {
  return useQuery({
    queryKey: queryKeys.market.status,
    queryFn: marketApi.getStatus,
    refetchInterval: 60_000,
  });
}

/** GET /investments/market-summary/ (public: grouped crypto/stocks/forex). */
export function useMarketSummary() {
  return useQuery({
    queryKey: queryKeys.market.summary,
    queryFn: investmentsApi.getMarketSummary,
    refetchInterval: 60_000,
  });
}
