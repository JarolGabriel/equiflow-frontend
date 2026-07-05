"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { investmentsApi } from "@/lib/api/investments";
import type {
  CreatePortfolioInput,
  UpdatePortfolioInput,
} from "@/lib/api/types";

import { queryKeys } from "./query-keys";

/** GET /investments/portfolios/ */
export function usePortfolios() {
  return useQuery({
    queryKey: queryKeys.portfolios.all,
    queryFn: investmentsApi.listPortfolios,
  });
}

/** GET /investments/portfolios/{id}/ */
export function usePortfolio(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.portfolios.detail(id ?? ""),
    queryFn: () => investmentsApi.getPortfolio(id as string),
    enabled: Boolean(id),
  });
}

export function useCreatePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePortfolioInput) =>
      investmentsApi.createPortfolio(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolios.all });
    },
  });
}

export function useUpdatePortfolio(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdatePortfolioInput) =>
      investmentsApi.updatePortfolio(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolios.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.portfolios.detail(id),
      });
    },
  });
}

export function useDeletePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => investmentsApi.deletePortfolio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolios.all });
    },
  });
}
