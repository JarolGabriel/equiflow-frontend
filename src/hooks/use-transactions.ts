"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { investmentsApi } from "@/lib/api/investments";
import type { CreateTransactionInput } from "@/lib/api/types";

import { queryKeys } from "./query-keys";

/** GET /investments/transactions/ */
export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions.all,
    queryFn: investmentsApi.listTransactions,
  });
}

/**
 * POST /investments/transactions/.
 * Recording a transaction updates portfolio balances (via backend signals),
 * so we invalidate the portfolio caches on success.
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTransactionInput) =>
      investmentsApi.createTransaction(input),
    onSuccess: (transaction) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolios.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.portfolios.detail(transaction.portfolio),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolios.assets });
    },
  });
}

/**
 * DELETE /investments/transactions/{id}/.
 * Deleting a transaction re-computes portfolio balances (backend signals), so we
 * invalidate the transaction list plus the affected portfolio caches.
 */
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; portfolio: string }) =>
      investmentsApi.deleteTransaction(id),
    onSuccess: (_data, { portfolio }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolios.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.portfolios.detail(portfolio),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolios.assets });
    },
  });
}
