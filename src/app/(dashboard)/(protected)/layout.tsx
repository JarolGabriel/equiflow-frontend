import { AuthGuard } from "@/components/auth-guard";

/**
 * Guards the protected dashboard routes (portfolios, alerts, settings). The
 * route group `(protected)` does not affect URLs — /portfolios stays /portfolios.
 * Public routes (watchlist, asset detail) live outside this group and render
 * without a session.
 */
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
