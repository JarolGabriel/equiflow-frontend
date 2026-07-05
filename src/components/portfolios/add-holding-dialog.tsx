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
import { getApiErrorMessage } from "@/lib/api/errors";
import { useAssets } from "@/hooks/use-assets";
import { useCreateTransaction } from "@/hooks/use-transactions";

interface Props {
  portfolioId: string;
  trigger: React.ReactNode;
}

/**
 * "Add asset directly" flow for TRACKING portfolios. The backend only creates
 * holdings via a Transaction (quantity + price required), so this is a minimal
 * form: pick an asset, set quantity, and a price prefilled with the current
 * market price (editable). It's recorded as a BUY behind the scenes — no
 * BUY/SELL toggle, no fees.
 */
export function AddHoldingDialog({ portfolioId, trigger }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Agregar activo</DialogTitle>
          <DialogDescription>
            Añade un activo a este portafolio de seguimiento. El precio se
            prellenó con el valor de mercado; puedes ajustarlo.
          </DialogDescription>
        </DialogHeader>
        {open ? (
          <HoldingForm
            portfolioId={portfolioId}
            onDone={() => setOpen(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function HoldingForm({
  portfolioId,
  onDone,
}: {
  portfolioId: string;
  onDone: () => void;
}) {
  const assets = useAssets();
  const create = useCreateTransaction();

  const [assetId, setAssetId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAssetChange = (id: string) => {
    setAssetId(id);
    // Prefill the price with the selected asset's live market price (editable).
    const asset = assets.data?.find((a) => a.id === id);
    setPrice(asset?.price != null ? String(asset.price) : "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!assetId) {
      setError("Selecciona un activo.");
      return;
    }

    create.mutate(
      {
        portfolio: portfolioId,
        asset: assetId,
        transaction_type: "BUY",
        quantity,
        price_at_transaction: price,
      },
      {
        onSuccess: () => {
          toast.success("Activo agregado");
          onDone();
        },
        onError: (err) => setError(getApiErrorMessage(err)),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="holding-asset">Activo</Label>
        <select
          id="holding-asset"
          required
          value={assetId}
          onChange={(e) => handleAssetChange(e.target.value)}
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

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="holding-quantity">Cantidad</Label>
          <Input
            id="holding-quantity"
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
          <Label htmlFor="holding-price">Precio</Label>
          <Input
            id="holding-price"
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

      {error && (
        <p className="text-sm text-negative" role="alert">
          {error}
        </p>
      )}

      <DialogFooter>
        <Button type="submit" disabled={create.isPending}>
          {create.isPending && <Loader2 className="size-4 animate-spin" />}
          Agregar
        </Button>
      </DialogFooter>
    </form>
  );
}
