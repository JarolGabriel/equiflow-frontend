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
import type { PortfolioType } from "@/lib/api/types";
import { useCreatePortfolio } from "@/hooks/use-portfolios";

const EMPTY = {
  name: "",
  description: "",
  currency: "USD",
  is_public: false,
  portfolio_type: "REAL" as PortfolioType,
};

const TYPE_OPTIONS: {
  value: PortfolioType;
  title: string;
  hint: string;
}[] = [
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

export function CreatePortfolioDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const create = useCreatePortfolio();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    create.mutate(
      {
        name: form.name,
        description: form.description || null,
        currency: form.currency || "USD",
        is_public: form.is_public,
        portfolio_type: form.portfolio_type,
      },
      {
        onSuccess: () => {
          toast.success("Portfolio creado");
          setForm(EMPTY);
          setOpen(false);
        },
        onError: (err) => setError(getApiErrorMessage(err)),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Nuevo portfolio
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Nuevo portfolio</DialogTitle>
          <DialogDescription>
            Crea un portfolio para agrupar tus inversiones.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de portafolio</Label>
            <div className="grid grid-cols-2 gap-2">
              {TYPE_OPTIONS.map((opt) => {
                const active = form.portfolio_type === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setForm({ ...form, portfolio_type: opt.value })
                    }
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
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej. Cripto largo plazo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Moneda</Label>
            <Input
              id="currency"
              value={form.currency}
              maxLength={10}
              onChange={(e) =>
                setForm({ ...form, currency: e.target.value.toUpperCase() })
              }
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_public}
              onChange={(e) =>
                setForm({ ...form, is_public: e.target.checked })
              }
              className="size-4 accent-[hsl(var(--primary))]"
            />
            Portfolio público
          </label>

          {error && (
            <p className="text-sm text-negative" role="alert">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending && <Loader2 className="size-4 animate-spin" />}
              Crear
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
