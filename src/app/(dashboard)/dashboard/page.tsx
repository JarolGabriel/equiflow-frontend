"use client";

import { Bell, Search, Star, Wallet } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AssetRow } from "@/components/market/asset-row";
import { PriceCard } from "@/components/market/price-card";
import type { Asset } from "@/lib/api/types";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useMarketStatus, useMarketSummary } from "@/hooks/use-market";

const QUICK_LINKS = [
  { href: "/portfolios", label: "Mis portafolios", icon: Wallet },
  { href: "/explore", label: "Explorar activos", icon: Search },
  { href: "/watchlist", label: "Favoritos", icon: Star },
  { href: "/alerts", label: "Alertas", icon: Bell },
];

export default function DashboardPage() {
  const summary = useMarketSummary();
  const status = useMarketStatus();

  const groups: { title: string; assets: Asset[] }[] = [
    { title: "Criptomonedas", assets: summary.data?.cryptos ?? [] },
    { title: "Acciones", assets: summary.data?.stocks ?? [] },
    { title: "Forex", assets: summary.data?.forex ?? [] },
  ];

  const isOpen = status.data?.status?.toLowerCase() === "open";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Inicio</h1>
        {status.data ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className={cn(
                "inline-block size-2 rounded-full",
                isOpen ? "bg-positive" : "bg-muted-foreground",
              )}
            />
            <span className="capitalize">{status.data.status}</span>
            {status.data.last_update ? (
              <span className="font-tabular">
                · {formatDate(status.data.last_update)}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUICK_LINKS.map((link) => (
          <PriceCard
            key={link.href}
            href={link.href}
            label={link.label}
            icon={link.icon}
          />
        ))}
      </div>

      {summary.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : summary.isError ? (
        <Card className="flex flex-col items-center gap-2 rounded-2xl border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No se pudo cargar el resumen de mercado.
          </p>
          <button
            onClick={() => summary.refetch()}
            className="text-sm text-primary hover:underline"
          >
            Reintentar
          </button>
        </Card>
      ) : (
        groups.map((group) =>
          group.assets.length === 0 ? null : (
            <section key={group.title} className="space-y-2">
              <h2 className="text-sm font-semibold text-muted-foreground">
                {group.title}
              </h2>
              <Card className="divide-y divide-border rounded-2xl border-border bg-card p-1">
                {group.assets.slice(0, 5).map((asset) => (
                  <AssetRow
                    key={asset.id}
                    asset={asset}
                    href={`/assets/${asset.id}`}
                  />
                ))}
              </Card>
            </section>
          ),
        )
      )}
    </div>
  );
}
