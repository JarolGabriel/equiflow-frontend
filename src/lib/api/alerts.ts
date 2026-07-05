import type {
  CreateAlertInput,
  PriceAlert,
  UpdateAlertInput,
} from "@/lib/api/types";

import { request } from "./client";

export const alertsApi = {
  /** GET /alerts/my-alerts/ */
  list: () =>
    request<PriceAlert[]>({ method: "GET", url: "/alerts/my-alerts/" }),

  /** GET /alerts/my-alerts/{id}/ */
  get: (id: string) =>
    request<PriceAlert>({ method: "GET", url: `/alerts/my-alerts/${id}/` }),

  /** POST /alerts/my-alerts/ */
  create: (input: CreateAlertInput) =>
    request<PriceAlert>({
      method: "POST",
      url: "/alerts/my-alerts/",
      data: input,
    }),

  /** PATCH /alerts/my-alerts/{id}/ */
  update: (id: string, input: UpdateAlertInput) =>
    request<PriceAlert>({
      method: "PATCH",
      url: `/alerts/my-alerts/${id}/`,
      data: input,
    }),

  /** DELETE /alerts/my-alerts/{id}/ */
  remove: (id: string) =>
    request<void>({ method: "DELETE", url: `/alerts/my-alerts/${id}/` }),
};
