"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  FileDown,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddHoldingDialog } from "@/components/portfolios/add-holding-dialog";
import { AddTransactionDialog } from "@/components/portfolios/add-transaction-dialog";
import { EditPortfolioDialog } from "@/components/portfolios/edit-portfolio-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { getApiErrorMessage } from "@/lib/api/errors";
import { investmentsApi } from "@/lib/api/investments";
import { cn } from "@/lib/utils";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatSignedCurrency,
  signColorClass,
} from "@/lib/format";
import { useDeletePortfolio, usePortfolio } from "@/hooks/use-portfolios";
import { useDeleteTransaction, useTransactions } from "@/hooks/use-transactions";

export default function PortfolioDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const router = useRouter();
  const { data: portfolio, isLoading, isError, refetch } = usePortfolio(id);
  const { data: allTransactions } = useTransactions();
  const [isExporting, setIsExporting] = useState(false);

  const deletePortfolio = useDeletePortfolio();
  const deleteTransaction = useDeleteTransaction();

  const isTracking = portfolio?.portfolio_type === "TRACKING";

  const transactions = useMemo(
    () => (allTransactions ?? []).filter((t) => t.portfolio === id),
    [allTransactions, id],
  );

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      const blob = await investmentsApi.exportPortfolioPdf(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `EquiFlow_${portfolio?.name ?? "portfolio"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "No se pudo exportar el PDF."));
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (isError || !portfolio) {
    return (
      <Card className="flex flex-col items-center gap-3 rounded-2xl border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">
          No se pudo cargar el portfolio.
        </p>
        <button
          onClick={() => refetch()}
          className="text-sm text-primary hover:underline"
        >
          Reintentar
        </button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/portfolios"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Portfolios
      </Link>

      {/* Header: balance + P/L */}
      <Card className="rounded-2xl border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">
                {portfolio.name}
              </h1>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  isTracking
                    ? "bg-accent text-muted-foreground"
                    : "bg-primary/15 text-primary",
                )}
              >
                {isTracking ? "Seguimiento" : "Real"}
              </span>
            </div>
            {portfolio.description ? (
              <p className="text-sm text-muted-foreground">
                {portfolio.description}
              </p>
            ) : null}
            <p className="mt-4 text-xs text-muted-foreground">Balance total</p>
            <p className="text-3xl font-bold font-tabular">
              {formatCurrency(portfolio.total_balance, portfolio.currency)}
            </p>
            <p
              className={cn(
                "text-sm font-medium font-tabular",
                signColorClass(portfolio.total_profit_loss),
              )}
            >
              {formatSignedCurrency(
                portfolio.total_profit_loss,
                portfolio.currency,
              )}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {isTracking ? (
              <AddHoldingDialog
                portfolioId={id}
                trigger={
                  <Button>
                    <Plus className="size-4" />
                    Agregar activo
                  </Button>
                }
              />
            ) : (
              <AddTransactionDialog
                portfolioId={id}
                trigger={
                  <Button>
                    <Plus className="size-4" />
                    Agregar transacción
                  </Button>
                }
              />
            )}
            <Button
              variant="outline"
              onClick={handleExportPdf}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <FileDown className="size-4" />
              )}
              Exportar PDF
            </Button>
            <div className="flex gap-2">
              <EditPortfolioDialog
                portfolio={portfolio}
                trigger={
                  <Button variant="outline" className="flex-1">
                    <Pencil className="size-4" />
                    Editar
                  </Button>
                }
              />
              <ConfirmDialog
                trigger={
                  <Button
                    variant="outline"
                    className="flex-1 text-negative hover:text-negative"
                  >
                    <Trash2 className="size-4" />
                    Eliminar
                  </Button>
                }
                title="Eliminar portafolio"
                description={`Se eliminará "${portfolio.name}" y todas sus posiciones y transacciones. Esta acción no se puede deshacer.`}
                confirmLabel="Eliminar"
                destructive
                onConfirm={async () => {
                  await deletePortfolio.mutateAsync(portfolio.id);
                  toast.success("Portafolio eliminado");
                  router.replace("/portfolios");
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Holdings */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Posiciones
        </h2>
        {portfolio.assets.length === 0 ? (
          <Card className="rounded-2xl border-border bg-card p-6 text-center text-sm text-muted-foreground">
            {isTracking
              ? "Sin activos. Agrega uno para empezar a seguirlo."
              : "Sin posiciones. Agrega una transacción para empezar."}
          </Card>
        ) : (
          <Card className="overflow-x-auto rounded-2xl border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activo</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Precio prom.</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">P/L</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolio.assets.map((holding) => (
                  <TableRow key={holding.id}>
                    <TableCell className="font-medium">
                      {holding.asset_details.symbol}
                      <span className="ml-2 text-xs text-muted-foreground">
                        {holding.asset_details.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-tabular">
                      {formatNumber(holding.quantity)}
                    </TableCell>
                    <TableCell className="text-right font-tabular">
                      {formatCurrency(
                        holding.average_purchase_price,
                        portfolio.currency,
                      )}
                    </TableCell>
                    <TableCell className="text-right font-tabular">
                      {formatCurrency(
                        holding.current_balance,
                        portfolio.currency,
                      )}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-tabular",
                        signColorClass(holding.profit_loss),
                      )}
                    >
                      {formatSignedCurrency(
                        holding.profit_loss,
                        portfolio.currency,
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </section>

      {/* Transactions (hidden for tracking-only portfolios) */}
      {!isTracking ? (
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Transacciones
        </h2>
        {transactions.length === 0 ? (
          <Card className="rounded-2xl border-border bg-card p-6 text-center text-sm text-muted-foreground">
            Aún no hay transacciones en este portfolio.
          </Card>
        ) : (
          <Card className="overflow-x-auto rounded-2xl border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Activo</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-muted-foreground">
                      {formatDate(tx.created_at)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          tx.transaction_type === "BUY"
                            ? "text-positive"
                            : "text-negative",
                        )}
                      >
                        {tx.transaction_type === "BUY" ? "Compra" : "Venta"}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {tx.asset_symbol}
                    </TableCell>
                    <TableCell className="text-right font-tabular">
                      {formatNumber(tx.quantity)}
                    </TableCell>
                    <TableCell className="text-right font-tabular">
                      {formatCurrency(
                        tx.price_at_transaction,
                        portfolio.currency,
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <ConfirmDialog
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Eliminar transacción de ${tx.asset_symbol}`}
                            className="text-muted-foreground hover:text-negative"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        }
                        title="Eliminar transacción"
                        description={`Se eliminará esta ${
                          tx.transaction_type === "BUY" ? "compra" : "venta"
                        } de ${tx.asset_symbol} y se recalculará el balance. Esta acción no se puede deshacer.`}
                        confirmLabel="Eliminar"
                        destructive
                        onConfirm={async () => {
                          await deleteTransaction.mutateAsync({
                            id: tx.id,
                            portfolio: id,
                          });
                          toast.success("Transacción eliminada");
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </section>
      ) : null}
    </div>
  );
}
