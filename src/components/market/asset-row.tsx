"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import type { Asset } from "@/lib/api/types";
import { formatCurrency, formatPercent, signColorClass } from "@/lib/format";
import { FavoriteToggle } from "./favorite-toggle";

/**
 * List row for watchlist / search results: symbol + name + exchange on the
 * left, price + change on the right, favorite star at the end.
 */
export function AssetRow({
  asset,
  href,
  showFavorite = true,
}: {
  asset: Asset;
  href?: string;
  showFavorite?: boolean;
}) {
  const content = (
    <div className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-accent">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold uppercase">
        {asset.symbol.slice(0, 3)}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{asset.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {asset.symbol}
          {asset.exchange ? ` · ${asset.exchange}` : ""}
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-medium font-tabular">
          {asset.price !== null ? formatCurrency(asset.price) : "—"}
        </p>
        <p className={cn("text-xs font-tabular", signColorClass(asset.change))}>
          {formatPercent(asset.change)}
        </p>
      </div>

      {showFavorite ? (
        <FavoriteToggle asset={asset} className="-mr-2" />
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }
  return content;
}
