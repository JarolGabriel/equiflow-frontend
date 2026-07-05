"use client";

import { useMemo, useId } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/format";
import { useAssetHistory } from "@/hooks/use-assets";

/**
 * Price evolution chart. Rendered as an area/line chart (NOT candlestick) since
 * the backend only exposes `{ price, timestamp }` history (no OHLC). Source:
 * GET /investments/assets/{id}/history/ (last ~50 points).
 */
export function PriceChart({ assetId }: { assetId: string }) {
  const gradientId = useId();
  const { data, isLoading, isError, refetch } = useAssetHistory(assetId);

  // Backend returns newest-first; reverse to chronological order for the chart.
  const points = useMemo(() => {
    const history = data?.history ?? [];
    return [...history].reverse().map((p) => ({
      price: p.price,
      timestamp: p.timestamp,
    }));
  }, [data]);

  const trendUp = useMemo(() => {
    if (points.length < 2) return true;
    return points[points.length - 1].price >= points[0].price;
  }, [points]);

  if (isLoading) {
    return <Skeleton className="h-56 w-full rounded-xl" />;
  }

  if (isError) {
    return (
      <div className="flex h-56 flex-col items-center justify-center gap-2 rounded-xl border border-border">
        <p className="text-sm text-muted-foreground">
          No se pudo cargar el histórico.
        </p>
        <button
          onClick={() => refetch()}
          className="text-sm text-primary hover:underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-xl border border-border">
        <p className="text-sm text-muted-foreground">
          Sin datos de precio para este activo.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-56 w-full",
        trendUp ? "text-positive" : "text-negative",
      )}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity={0.3} />
              <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="timestamp" hide />
          <YAxis domain={["auto", "auto"]} hide />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.75rem",
              fontSize: "0.75rem",
            }}
            labelStyle={{ color: "hsl(var(--muted-foreground))" }}
            labelFormatter={(label) => formatDate(label as string)}
            formatter={(value) => [
              formatCurrency(value as number | string),
              "Precio",
            ]}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="currentColor"
            strokeWidth={2}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
