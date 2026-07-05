"use client";

import { usePathname, useRouter } from "next/navigation";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Asset } from "@/lib/api/types";
import { useIsFavorite, useToggleFavorite } from "@/hooks/use-favorites";
import { useAuthStore } from "@/lib/store/auth-store";

/**
 * Star toggle for the user's single watchlist (FavoriteAsset is unique per
 * (user, asset), so there are no multiple named lists). Optimistic via
 * useToggleFavorite.
 */
export function FavoriteToggle({
  asset,
  className,
}: {
  asset: Asset;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isFavorite = useIsFavorite(asset.id);
  const toggle = useToggleFavorite();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
      aria-pressed={isFavorite}
      disabled={toggle.isPending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
          router.push(`/login?next=${encodeURIComponent(pathname)}`);
          return;
        }
        toggle.mutate(asset);
      }}
      className={className}
    >
      <Star
        className={cn(
          "size-5 transition-colors",
          isFavorite
            ? "fill-primary text-primary"
            : "text-muted-foreground",
        )}
      />
    </Button>
  );
}
