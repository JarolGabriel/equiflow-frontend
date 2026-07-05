"use client";

import { ArrowDown, ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Asset } from "@/lib/api/types";
import { formatCurrency, formatPercent, signColorClass, toNumber } from "@/lib/format";
import { FavoriteToggle } from "./favorite-toggle";

/**
 * Header for an asset detail screen: name, large price, change with direction
 * arrow, and a "Real Time" label.
 */
export function AssetDetailHeader({ asset }: { asset: Asset }) {
  const change = toNumber(asset.change);
  const up = change >= 0;
  const DirIcon = up ? ArrowUp : ArrowDown;

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{asset.name}</h1>
          <span className="text-sm text-muted-foreground">{asset.symbol}</span>
        </div>

        <p className="mt-2 text-3xl font-bold font-tabular">
          {asset.price !== null ? formatCurrency(asset.price) : "—"}
        </p>

        <div
          className={cn(
            "mt-1 flex items-center gap-1 text-sm font-tabular",
            signColorClass(change),
          )}
        >
          <DirIcon className="size-4" />
          <span>{formatPercent(change)}</span>
          <span className="ml-2 text-xs text-muted-foreground">Tiempo real</span>
        </div>
      </div>

      <FavoriteToggle asset={asset} />
    </div>
  );
}
