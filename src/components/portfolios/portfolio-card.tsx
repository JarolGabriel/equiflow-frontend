import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Portfolio } from "@/lib/api/types";
import {
  formatCurrency,
  formatSignedCurrency,
  signColorClass,
} from "@/lib/format";

export function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  return (
    <Link href={`/portfolios/${portfolio.id}`}>
      <Card className="rounded-2xl border-border bg-card p-4 transition-colors hover:bg-accent">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-medium">{portfolio.name}</p>
            {portfolio.description ? (
              <p className="truncate text-xs text-muted-foreground">
                {portfolio.description}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {portfolio.assets.length} activo
                {portfolio.assets.length === 1 ? "" : "s"}
              </p>
            )}
          </div>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Balance total</p>
            <p className="text-xl font-bold font-tabular">
              {formatCurrency(portfolio.total_balance, portfolio.currency)}
            </p>
          </div>
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
      </Card>
    </Link>
  );
}
