/** Shared API configuration derived from environment variables. */

function required(name: string, value: string | undefined): string {
  if (!value) {
    // Fail loudly in dev; in prod the value is inlined at build time.
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value.replace(/\/$/, "");
}

/** Base URL of the REST API, including the `/api` prefix, without trailing slash. */
export const API_BASE_URL = required(
  "NEXT_PUBLIC_API_URL",
  process.env.NEXT_PUBLIC_API_URL,
);

/** Base URL for WebSocket connections (used by the alerts feature in Phase 3). */
export const WS_BASE_URL = (process.env.NEXT_PUBLIC_WS_URL ?? "").replace(
  /\/$/,
  "",
);

/**
 * Stripe publishable key for the PRO checkout (Payment Element).
 * Optional: when unset, the Upgrade page shows a "not configured" notice instead
 * of failing, so the rest of the app keeps working.
 */
export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

/**
 * OAuth client IDs for social login. Optional: when a value is empty, the
 * corresponding social button is hidden (same pattern as the Stripe key), so the
 * normal email/password login keeps working without extra configuration.
 */
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
export const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ?? "";
