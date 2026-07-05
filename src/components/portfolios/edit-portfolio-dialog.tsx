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
import type { Portfolio, PortfolioType } from "@/lib/api/types";
import { useUpdatePortfolio } from "@/hooks/use-portfolios";

const TYPE_OPTIONS: { value: PortfolioType; title: string; hint: string }[] = [
  {
    value: "REAL",
    title: "Portafolio real",
    hint: "Registra compras/ventas y calcula P/L.",
  },
  {
    value: "TRACKING",
    title: "Solo seguimiento",
    hint: "Añade activos para vigilarlos, sin operar.",
  },
];

export function EditPortfolioDialog({
  portfolio,
  trigger,
}: {
  portfolio: Portfolio;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Editar portafolio</DialogTitle>
          <DialogDescription>
            Actualiza los datos de este portafolio.
          </DialogDescription>
        </DialogHeader>

        {/* Keyed remount para inicializar el estado desde props sin setState-en-effect. */}
        {open ? (
          <EditForm portfolio={portfolio} onDone={() => setOpen(false)} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function EditForm({
  portfolio,
  onDone,
}: {
  portfolio: Portfolio;
  onDone: () => void;
}) {
  const [name, setName] = useState(portfolio.name);
  const [description, setDescription] = useState(portfolio.description ?? "");
  const [currency, setCurrency] = useState(portfolio.currency);
  const [isPublic, setIsPublic] = useState(portfolio.is_public);
  const [portfolioType, setPortfolioType] = useState<PortfolioType>(
    portfolio.portfolio_type ?? "REAL",
  );
  const [error, setError] = useState<string | null>(null);

  const update = useUpdatePortfolio(portfolio.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    update.mutate(
      {
        name,
        description: description || null,
        currency: currency || "USD",
        is_public: isPublic,
        portfolio_type: portfolioType,
      },
      {
        onSuccess: () => {
          toast.success("Portafolio actualizado");
          onDone();
        },
        onError: (err) => setError(getApiErrorMessage(err)),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Tipo de portafolio</Label>
        <div className="grid grid-cols-2 gap-2">
          {TYPE_OPTIONS.map((opt) => {
            const active = portfolioType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPortfolioType(opt.value)}
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
                  {opt.title}
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
        <Label htmlFor="edit-name">Nombre</Label>
        <Input
          id="edit-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-description">Descripción (opcional)</Label>
        <Input
          id="edit-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-currency">Moneda</Label>
        <Input
          id="edit-currency"
          value={currency}
          maxLength={10}
          onChange={(e) => setCurrency(e.target.value.toUpperCase())}
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="size-4 accent-[hsl(var(--primary))]"
        />
        Portafolio público
      </label>

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
