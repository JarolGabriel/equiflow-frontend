import type {
  Asset,
  AssetHistory,
  AssetListParams,
  CreatePortfolioInput,
  CreateTransactionInput,
  MarketSummary,
  Portfolio,
  PortfolioAsset,
  Transaction,
  UpdatePortfolioInput,
} from "@/lib/api/types";

import { request } from "./client";

export const investmentsApi = {
  // --- Assets (public) ---
  /** GET /investments/assets/ */
  listAssets: (params?: AssetListParams) =>
    request<Asset[]>({ method: "GET", url: "/investments/assets/", params }),

  /** GET /investments/assets/{id}/ */
  getAsset: (id: string) =>
    request<Asset>({ method: "GET", url: `/investments/assets/${id}/` }),

  /** GET /investments/assets/{id}/history/ */
  getAssetHistory: (id: string) =>
    request<AssetHistory>({
      method: "GET",
      url: `/investments/assets/${id}/history/`,
    }),

  /** GET /investments/market-summary/ */
  getMarketSummary: () =>
    request<MarketSummary>({
      method: "GET",
      url: "/investments/market-summary/",
    }),

  // --- Portfolios ---
  /** GET /investments/portfolios/ */
  listPortfolios: () =>
    request<Portfolio[]>({ method: "GET", url: "/investments/portfolios/" }),

  /** GET /investments/portfolios/{id}/ */
  getPortfolio: (id: string) =>
    request<Portfolio>({
      method: "GET",
      url: `/investments/portfolios/${id}/`,
    }),

  /** POST /investments/portfolios/ */
  createPortfolio: (input: CreatePortfolioInput) =>
    request<Portfolio>({
      method: "POST",
      url: "/investments/portfolios/",
      data: input,
    }),

  /** PATCH /investments/portfolios/{id}/ */
  updatePortfolio: (id: string, input: UpdatePortfolioInput) =>
    request<Portfolio>({
      method: "PATCH",
      url: `/investments/portfolios/${id}/`,
      data: input,
    }),

  /** DELETE /investments/portfolios/{id}/ */
  deletePortfolio: (id: string) =>
    request<void>({
      method: "DELETE",
      url: `/investments/portfolios/${id}/`,
    }),

  /** GET /investments/portfolios/{id}/export-pdf/ -> PDF blob. */
  exportPortfolioPdf: (id: string) =>
    request<Blob>({
      method: "GET",
      url: `/investments/portfolios/${id}/export-pdf/`,
      responseType: "blob",
    }),

  // --- Portfolio assets (holdings) ---
  /** GET /investments/portfolio-assets/ */
  listPortfolioAssets: () =>
    request<PortfolioAsset[]>({
      method: "GET",
      url: "/investments/portfolio-assets/",
    }),

  /** DELETE /investments/portfolio-assets/{id}/ */
  deletePortfolioAsset: (id: number) =>
    request<void>({
      method: "DELETE",
      url: `/investments/portfolio-assets/${id}/`,
    }),

  // --- Transactions ---
  /** GET /investments/transactions/ */
  listTransactions: () =>
    request<Transaction[]>({
      method: "GET",
      url: "/investments/transactions/",
    }),

  /** POST /investments/transactions/ */
  createTransaction: (input: CreateTransactionInput) =>
    request<Transaction>({
      method: "POST",
      url: "/investments/transactions/",
      data: input,
    }),

  /** DELETE /investments/transactions/{id}/ */
  deleteTransaction: (id: string) =>
    request<void>({
      method: "DELETE",
      url: `/investments/transactions/${id}/`,
    }),
};
