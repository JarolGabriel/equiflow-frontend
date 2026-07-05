"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { alertsApi } from "@/lib/api/alerts";
import type { CreateAlertInput, UpdateAlertInput } from "@/lib/api/types";
import { useAuthStore } from "@/lib/store/auth-store";

import { queryKeys } from "./query-keys";

/** GET /alerts/my-alerts/ (only when authenticated). */
export function useAlerts() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.alerts.all,
    queryFn: alertsApi.list,
    enabled: isAuthenticated,
  });
}

/** POST /alerts/my-alerts/ */
export function useCreateAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAlertInput) => alertsApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all });
    },
  });
}

/** PATCH /alerts/my-alerts/{id}/ */
export function useUpdateAlert(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateAlertInput) => alertsApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all });
    },
  });
}

/** DELETE /alerts/my-alerts/{id}/ */
export function useDeleteAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => alertsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all });
    },
  });
}
