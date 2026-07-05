"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
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
import type { AlertCondition } from "@/lib/api/types";
import { useAssets } from "@/hooks/use-assets";
import { useCreateAlert } from "@/hooks/use-alerts";

const CONDITION_OPTIONS: { value: AlertCondition; label: string; hint: string }[] =
  [
    { value: "ABOVE", label: "Por encima", hint: "El precio sube y alcanza el objetivo" },
    { value: "BELOW", label: "Por debajo", hint: "El precio baja y alcanza el objetivo" },
  ];

export function CreateAlertDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Nueva alerta
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Nueva alerta</DialogTitle>
          <DialogDescription>
            Te avisamos cuando el precio cruce tu objetivo.
          </DialogDescription>
        </DialogHeader>

        {/* Keyed remount so el form arranca limpio cada vez que se abre. */}
        {open ? <AlertForm onDone={() => setOpen(false)} /> : null}
      </DialogContent>
    </Dialog>
  );
}

function AlertForm({ onDone }: { onDone: () => void }) {
  const [asset, setAsset] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [condition, setCondition] = useState<AlertCondition>("ABOVE");
  const [error, setError] = useState<string | null>(null);

  const assets = useAssets();
  const create = useCreateAlert();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!asset) {
      setError("Selecciona un activo.");
      return;
    }

    create.mutate(
      { asset, target_price: targetPrice, condition },
      {
        onSuccess: () => {
          toast.success("Alerta creada");
          onDone();
        },
        onError: (err) => setError(getApiErrorMessage(err)),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="alert-asset">Activo</Label>
        <select
          id="alert-asset"
          required
          value={asset}
          onChange={(e) => setAsset(e.target.value)}
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

      <div className="space-y-2">
        <Label>Condición</Label>
        <div className="grid grid-cols-2 gap-2">
          {CONDITION_OPTIONS.map((opt) => {
            const active = condition === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCondition(opt.value)}
                aria-pressed={active}
                className={cn(
                  "rounded-xl border p-3 text-left transition-colors",
                  active
                    ? "border-primary bg-accent"
                    : "border-border bg-card hover:bg-accent",
                )}
              >
                <span
                  className={cn(
                    "block text-sm font-semibold",
                    active ? "text-primary" : "text-foreground",
                  )}
                >
                  {opt.label}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {opt.hint}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="alert-price">Precio objetivo</Label>
        <Input
          id="alert-price"
          type="number"
          step="any"
          min="0"
          required
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          className="font-tabular"
          placeholder="0.00"
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
          Crear alerta
        </Button>
      </DialogFooter>
    </form>
  );
}
