"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AssetDetailHeader } from "@/components/market/asset-detail-header";
import { BuySellButtons } from "@/components/market/buy-sell-buttons";
import { PriceChart } from "@/components/market/price-chart";
import { AddTransactionDialog } from "@/components/portfolios/add-transaction-dialog";
import type { TransactionType } from "@/lib/api/types";
import { useAsset } from "@/hooks/use-assets";
import { useAuthStore } from "@/lib/store/auth-store";

export default function AssetDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: asset, isLoading, isError, refetch } = useAsset(id);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [txOpen, setTxOpen] = useState(false);
  const [txType, setTxType] = useState<TransactionType>("BUY");

  const openTx = (type: TransactionType) => {
    setTxType(type);
    setTxOpen(true);
  };

  return (
    <div className="space-y-6">
      <Link
        href="/explore"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Explorar
      </Link>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
        </div>
      ) : isError || !asset ? (
        <Card className="flex flex-col items-center gap-3 rounded-2xl border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No se pudo cargar el activo.
          </p>
          <button
            onClick={() => refetch()}
            className="text-sm text-primary hover:underline"
          >
            Reintentar
          </button>
        </Card>
      ) : (
        <>
          <Card className="rounded-2xl border-border bg-card p-6">
            <AssetDetailHeader asset={asset} />
          </Card>

          <Card className="rounded-2xl border-border bg-card p-4">
            <PriceChart assetId={asset.id} />
          </Card>

          {isAuthenticated ? (
            <>
              <BuySellButtons
                onBuy={() => openTx("BUY")}
                onSell={() => openTx("SELL")}
              />
              <AddTransactionDialog
                assetId={asset.id}
                defaultType={txType}
                open={txOpen}
                onOpenChange={setTxOpen}
              />
            </>
          ) : (
            <Card className="flex flex-col items-center gap-2 rounded-2xl border-border bg-card p-6 text-center text-sm text-muted-foreground">
              <p>Inicia sesión para operar este activo en tus portafolios.</p>
              <Link
                href={`/login?next=${encodeURIComponent(`/assets/${id}`)}`}
                className="text-sm text-primary hover:underline"
              >
                Iniciar sesión
              </Link>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
