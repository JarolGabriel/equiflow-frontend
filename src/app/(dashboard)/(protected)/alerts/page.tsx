"use client";

import { Bell, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { CreateAlertDialog } from "@/components/alerts/create-alert-dialog";
import { EditAlertDialog } from "@/components/alerts/edit-alert-dialog";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AlertCondition, AlertStatus } from "@/lib/api/types";
import { useAlerts, useDeleteAlert } from "@/hooks/use-alerts";

const CONDITION_LABEL: Record<AlertCondition, string> = {
  ABOVE: "Por encima de",
  BELOW: "Por debajo de",
};

const STATUS_META: Record<AlertStatus, { label: string; className: string }> = {
  PENDING: { label: "Pendiente", className: "text-primary" },
  FIRED: { label: "Disparada", className: "text-positive" },
  PAUSED: { label: "Pausada", className: "text-muted-foreground" },
};

export default function AlertsPage() {
  const alerts = useAlerts();
  const deleteAlert = useDeleteAlert();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Alertas</h1>
        <CreateAlertDialog />
      </div>

      {alerts.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : alerts.isError ? (
        <Card className="flex flex-col items-center gap-2 rounded-2xl border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No se pudieron cargar las alertas.
          </p>
          <button
            onClick={() => alerts.refetch()}
            className="text-sm text-primary hover:underline"
          >
            Reintentar
          </button>
        </Card>
      ) : !alerts.data || alerts.data.length === 0 ? (
        <Card className="flex flex-col items-center gap-4 rounded-2xl border-border bg-card p-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
            <Bell className="size-6" />
          </span>
          <div>
            <p className="font-medium">Sin alertas todavía</p>
            <p className="text-sm text-muted-foreground">
              Crea tu primera alerta para vigilar el precio de un activo.
            </p>
          </div>
          <CreateAlertDialog />
        </Card>
      ) : (
        <Card className="divide-y divide-border rounded-2xl border-border bg-card">
          {alerts.data.map((alert) => {
            const status = STATUS_META[alert.status];
            return (
              <div
                key={alert.id}
                className="flex items-center gap-3 p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{alert.asset_symbol}</span>
                    <span className={cn("text-xs font-medium", status.className)}>
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {CONDITION_LABEL[alert.condition]}{" "}
                    <span className="font-tabular text-foreground">
                      {formatCurrency(alert.target_price)}
                    </span>
                  </p>
                </div>

                <EditAlertDialog
                  alert={alert}
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Editar alerta de ${alert.asset_symbol}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-4" />
                    </Button>
                  }
                />

                <ConfirmDialog
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Eliminar alerta de ${alert.asset_symbol}`}
                      className="text-muted-foreground hover:text-negative"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  }
                  title="Eliminar alerta"
                  description={`Se eliminará la alerta de ${alert.asset_symbol}. Esta acción no se puede deshacer.`}
                  confirmLabel="Eliminar"
                  destructive
                  onConfirm={async () => {
                    await deleteAlert.mutateAsync(alert.id);
                    toast.success("Alerta eliminada");
                  }}
                />
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
