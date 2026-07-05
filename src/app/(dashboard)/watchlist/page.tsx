"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AssetRow } from "@/components/market/asset-row";
import { useAssets } from "@/hooks/use-assets";
import { useFavorites } from "@/hooks/use-favorites";
import { useAuthStore } from "@/lib/store/auth-store";

export default function WatchlistPage() {
  const [search, setSearch] = useState("");
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const favorites = useFavorites();
  const assets = useAssets(search ? { search } : undefined);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Watchlist</h1>

      {/* Favorites */}
      <section className="space-y-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Star className="size-4" /> Favoritos
        </h2>
        {!isAuthenticated ? (
          <Card className="flex flex-col items-center gap-2 rounded-2xl border-border bg-card p-6 text-center text-sm text-muted-foreground">
            <p>Inicia sesión para guardar favoritos.</p>
            <Link href="/login" className="text-sm text-primary hover:underline">
              Iniciar sesión
            </Link>
          </Card>
        ) : favorites.isLoading ? (
          <Skeleton className="h-16 rounded-xl" />
        ) : !favorites.data || favorites.data.length === 0 ? (
          <Card className="rounded-2xl border-border bg-card p-6 text-center text-sm text-muted-foreground">
            Marca activos con la estrella para seguirlos aquí.
          </Card>
        ) : (
          <Card className="divide-y divide-border rounded-2xl border-border bg-card p-1">
            {favorites.data.map((asset) => (
              <AssetRow
                key={asset.id}
                asset={asset}
                href={`/assets/${asset.id}`}
              />
            ))}
          </Card>
        )}
      </section>

      {/* All assets + search */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Todos los activos
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por símbolo o nombre…"
            className="pl-9"
          />
        </div>

        {assets.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
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
      </section>
    </div>
  );
}
