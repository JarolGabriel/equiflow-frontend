import { GITHUB_CLIENT_ID, GOOGLE_CLIENT_ID } from "@/lib/api/config";
import type { SocialProvider } from "@/lib/api/types";

/**
 * Client-side OAuth (Authorization Code flow). We redirect the user to the
 * provider; the provider redirects back to `/auth/callback?code=...&state=<provider>`,
 * and the callback page exchanges the `code` for JWT tokens via the backend.
 *
 * The `redirect_uri` must match exactly what is registered in the provider console
 * AND in the Django backend (allauth). In production this resolves to
 * `https://<vercel-domain>/auth/callback`.
 */

export function isProviderEnabled(provider: SocialProvider): boolean {
  return provider === "google"
    ? Boolean(GOOGLE_CLIENT_ID)
    : Boolean(GITHUB_CLIENT_ID);
}

export function hasAnyProvider(): boolean {
  return isProviderEnabled("google") || isProviderEnabled("github");
}

/** Callback URL on this app; derived from the current origin at runtime. */
function getRedirectUri(): string {
  return `${window.location.origin}/auth/callback`;
}

export function buildAuthorizeUrl(provider: SocialProvider): string {
  const redirectUri = getRedirectUri();

  if (provider === "google") {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      state: "google",
      prompt: "select_account",
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: "read:user user:email",
    state: "github",
  });
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

/** Starts the OAuth redirect for the given provider. */
export function startOAuth(provider: SocialProvider): void {
  window.location.assign(buildAuthorizeUrl(provider));
}
