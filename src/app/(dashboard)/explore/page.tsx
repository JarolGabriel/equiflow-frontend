"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AssetRow } from "@/components/market/asset-row";
import { cn } from "@/lib/utils";
import type { AssetType } from "@/lib/api/types";
import { useAssets } from "@/hooks/use-assets";

const FILTERS: { label: string; value: AssetType | "all" }[] = [
  { label: "Todos", value: "all" },
  { label: "Cripto", value: "crypto" },
  { label: "Acciones", value: "stock" },
  { label: "Forex", value: "forex" },
];

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<AssetType | "all">("all");

  const assets = useAssets({
    ...(search ? { search } : {}),
    ...(type !== "all" ? { asset_type: type } : {}),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Explorar</h1>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por símbolo o nombre…"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = type === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setType(f.value)}
                aria-pressed={active}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {assets.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : assets.isError ? (
        <Card className="flex flex-col items-center gap-2 rounded-2xl border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No se pudieron cargar los activos.
          </p>
          <button
            onClick={() => assets.refetch()}
            className="text-sm text-primary hover:underline"
          >
            Reintentar
          </button>
        </Card>
      ) : !assets.data || assets.data.length === 0 ? (
        <Card className="rounded-2xl border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Sin resultados.
        </Card>
      ) : (
        <Card className="divide-y divide-border rounded-2xl border-border bg-card p-1">
          {assets.data.map((asset) => (
            <AssetRow
              key={asset.id}
              asset={asset}
              href={`/assets/${asset.id}`}
            />
          ))}
        </Card>
      )}
    </div>
  );
}
