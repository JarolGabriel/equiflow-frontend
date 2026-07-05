"use client";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Two side-by-side full-width actions: Buy (positive) and Sell (negative).
 * Used to open the transaction flow for an asset.
 */
export function BuySellButtons({
  onBuy,
  onSell,
  isPending = false,
  disabled = false,
}: {
  onBuy: () => void;
  onSell: () => void;
  isPending?: boolean;
  disabled?: boolean;
}) {
  const base =
    "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50";

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onBuy}
        disabled={disabled || isPending}
        className={cn(base, "bg-positive text-positive-foreground hover:bg-positive/90")}
      >
        {isPending && <Loader2 className="size-4 animate-spin" />}
        Comprar
      </button>
      <button
        type="button"
        onClick={onSell}
        disabled={disabled || isPending}
        className={cn(base, "bg-negative text-negative-foreground hover:bg-negative/90")}
      >
        Vender
      </button>
    </div>
  );
}
