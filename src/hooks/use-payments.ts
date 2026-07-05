"use client";

import { useMutation } from "@tanstack/react-query";

import { paymentsApi } from "@/lib/api/payments";

/**
 * POST /payments/create-intent/ — starts the PRO ($29.99) checkout and returns
 * the Stripe `clientSecret` used to confirm the payment on the client.
 */
export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: () => paymentsApi.createIntent(),
  });
}
