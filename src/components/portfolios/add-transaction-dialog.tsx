"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { TransactionType } from "@/lib/api/types";
import { useAssets } from "@/hooks/use-assets";
import { usePortfolios } from "@/hooks/use-portfolios";
import { useCreateTransaction } from "@/hooks/use-transactions";

interface Props {
  /** Fixed portfolio; if omitted a selector is shown. */
  portfolioId?: string;
  /** Fixed asset; if omitted a selector is shown. */
  assetId?: string;
  defaultType?: TransactionType;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function AddTransactionDialog({
  portfolioId,
  assetId,
  defaultType = "BUY",
  open,
  onOpenChange,
  trigger,
}: Props) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = (o: boolean) => {
    onOpenChange?.(o);
    if (!isControlled) setInternalOpen(o);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Agregar transacción</DialogTitle>
          <DialogDescription>
            Registra una compra o venta. Actualiza el balance del portfolio
            automáticamente.
          </DialogDescription>
        </DialogHeader>

        {/* Remounted per open (and per defaultType) so the form always starts
            from the right state without a setState-in-effect sync. */}
        {dialogOpen ? (
          <TransactionForm
            key={`${defaultType}-${portfolioId ?? ""}-${assetId ?? ""}`}
            portfolioId={portfolioId}
            assetId={assetId}
            defaultType={defaultType}
            onDone={() => setDialogOpen(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function TransactionForm({
  portfolioId,
  assetId,
  defaultType,
  onDone,
}: {
  portfolioId?: string;
  assetId?: string;
  defaultType: TransactionType;
  onDone: () => void;
}) {
  const [type, setType] = useState<TransactionType>(defaultType);
  const [selectedPortfolio, setSelectedPortfolio] = useState(portfolioId ?? "");
  const [selectedAsset, setSelectedAsset] = useState(assetId ?? "");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [fees, setFees] = useState("");
  const [error, setError] = useState<string | null>(null);

  const assets = useAssets();
  const portfolios = usePortfolios();
  const create = useCreateTransaction();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const portfolio = portfolioId ?? selectedPortfolio;
    const asset = assetId ?? selectedAsset;
    if (!portfolio || !asset) {
      setError("Selecciona portfolio y activo.");
      return;
    }

    create.mutate(
      {
        portfolio,
        asset,
        transaction_type: type,
        quantity,
        price_at_transaction: price,
        fees: fees || 0,
      },
      {
        onSuccess: () => {
          toast.success("Transacción registrada");
          onDone();
        },
        onError: (err) => setError(getApiErrorMessage(err)),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {(["BUY", "SELL"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={cn(
              "h-10 rounded-xl text-sm font-semibold transition-colors",
              type === t
                ? t === "BUY"
                  ? "bg-positive text-positive-foreground"
                  : "bg-negative text-negative-foreground"
                : "bg-accent text-muted-foreground",
            )}
          >
            {t === "BUY" ? "Comprar" : "Vender"}
          </button>
        ))}
      </div>

      {!portfolioId ? (
        <div className="space-y-2">
          <Label htmlFor="portfolio">Portfolio</Label>
          <select
            id="portfolio"
            required
            value={selectedPortfolio}
            onChange={(e) => setSelectedPortfolio(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            <option value="">Selecciona…</option>
            {portfolios.data?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {!assetId ? (
        <div className="space-y-2">
          <Label htmlFor="asset">Activo</Label>
          <select
            id="asset"
            required
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            <option value="">Selecciona…</option>
            {assets.data?.map((a) => (
              <option key={a.id} value={a.id}>
                {a.symbol} — {a.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="quantity">Cantidad</Label>
          <Input
            id="quantity"
            type="number"
            step="any"
            min="0"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="font-tabular"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Precio</Label>
          <Input
            id="price"
            type="number"
            step="any"
            min="0"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="font-tabular"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="fees">Comisiones (opcional)</Label>
        <Input
          id="fees"
          type="number"
          step="any"
          min="0"
          value={fees}
          onChange={(e) => setFees(e.target.value)}
          className="font-tabular"
        />
      </div>

      {error && (
        <p className="text-sm text-negative" role="alert">
          {error}
        </p>
      )}

      <DialogFooter>
        <Button type="submit" disabled={create.isPending}>
          {create.isPending && <Loader2 className="size-4 animate-spin" />}
          Registrar
        </Button>
      </DialogFooter>
    </form>
  );
}
