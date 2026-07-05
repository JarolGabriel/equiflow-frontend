"use client";

import { Wallet } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CreatePortfolioDialog } from "@/components/portfolios/create-portfolio-dialog";
import { PortfolioCard } from "@/components/portfolios/portfolio-card";
import { usePortfolios } from "@/hooks/use-portfolios";

export default function PortfoliosPage() {
  const { data, isLoading, isError, refetch } = usePortfolios();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Portfolios</h1>
        <CreatePortfolioDialog />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <Card className="flex flex-col items-center gap-3 rounded-2xl border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No se pudieron cargar tus portfolios.
          </p>
          <button
            onClick={() => refetch()}
            className="text-sm text-primary hover:underline"
          >
            Reintentar
          </button>
        </Card>
      ) : !data || data.length === 0 ? (
        <Card className="flex flex-col items-center gap-4 rounded-2xl border-border bg-card p-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
            <Wallet className="size-6" />
          </span>
          <div>
            <p className="font-medium">Aún no tienes portfolios</p>
            <p className="text-sm text-muted-foreground">
              Crea tu primer portfolio para empezar a registrar inversiones.
            </p>
          </div>
          <CreatePortfolioDialog />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {data.map((portfolio) => (
            <PortfolioCard key={portfolio.id} portfolio={portfolio} />
          ))}
        </div>
      )}
    </div>
  );
}
