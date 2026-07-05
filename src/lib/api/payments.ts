import type { CreatePaymentIntentResponse } from "@/lib/api/types";

import { request } from "./client";

export const paymentsApi = {
  /**
   * POST /payments/create-intent/ -> Stripe PaymentIntent client secret used to
   * confirm the Pro subscription on the client with Stripe.js.
   */
  createIntent: () =>
    request<CreatePaymentIntentResponse>({
      method: "POST",
      url: "/payments/create-intent/",
    }),
};
