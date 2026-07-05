"use client";

import { Bell } from "lucide-react";

import { Card } from "@/components/ui/card";

/**
 * Placeholder for Phase 3 (real-time price alerts via WebSocket).
 * Kept minimal so the "Alertas" nav item doesn't 404. No live logic here yet.
 */
export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Alertas</h1>
      <Card className="flex flex-col items-center gap-4 rounded-2xl border-border bg-card p-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
          <Bell className="size-6" />
        </span>
        <div>
          <p className="font-medium">Alertas en tiempo real</p>
          <p className="text-sm text-muted-foreground">
            Las alertas de precio llegan en la Fase 3.
          </p>
        </div>
      </Card>
    </div>
  );
}
