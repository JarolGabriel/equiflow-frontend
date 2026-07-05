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
import type { AlertCondition, PriceAlert } from "@/lib/api/types";
import { useUpdateAlert } from "@/hooks/use-alerts";

const CONDITION_OPTIONS: { value: AlertCondition; label: string; hint: string }[] =
  [
    { value: "ABOVE", label: "Por encima", hint: "El precio sube y alcanza el objetivo" },
    { value: "BELOW", label: "Por debajo", hint: "El precio baja y alcanza el objetivo" },
  ];

export function EditAlertDialog({
  alert,
  trigger,
}: {
  alert: PriceAlert;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Editar alerta</DialogTitle>
          <DialogDescription>
            {alert.asset_symbol}: ajusta el precio objetivo o la condición.
          </DialogDescription>
        </DialogHeader>

        {/* Keyed remount para inicializar el estado desde props sin setState-en-effect. */}
        {open ? <EditForm alert={alert} onDone={() => setOpen(false)} /> : null}
      </DialogContent>
    </Dialog>
  );
}

function EditForm({
  alert,
  onDone,
}: {
  alert: PriceAlert;
  onDone: () => void;
}) {
  const [targetPrice, setTargetPrice] = useState(alert.target_price);
  const [condition, setCondition] = useState<AlertCondition>(alert.condition);
  const [error, setError] = useState<string | null>(null);

  const update = useUpdateAlert(alert.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    update.mutate(
      { target_price: targetPrice, condition },
      {
        onSuccess: () => {
          toast.success("Alerta actualizada");
          onDone();
        },
        onError: (err) => setError(getApiErrorMessage(err)),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Label htmlFor="edit-alert-price">Precio objetivo</Label>
        <Input
          id="edit-alert-price"
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
        <Button type="submit" disabled={update.isPending}>
          {update.isPending && <Loader2 className="size-4 animate-spin" />}
          Guardar cambios
        </Button>
      </DialogFooter>
    </form>
  );
}
