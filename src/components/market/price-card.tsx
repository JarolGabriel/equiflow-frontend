import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * "Quick Access" card (icon + label + chevron) for the dashboard grid.
 * Used as static navigation; an optional `value` can show a small counter.
 */
export function PriceCard({
  href,
  label,
  icon: Icon,
  value,
  className,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  value?: string;
  className?: string;
}) {
  return (
    <Link href={href}>
      <Card
        className={cn(
          "flex items-center gap-3 rounded-2xl border-border bg-card p-4 transition-colors hover:bg-accent",
          className,
        )}
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{label}</p>
          {value ? (
            <p className="text-xs text-muted-foreground font-tabular">{value}</p>
          ) : null}
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </Card>
    </Link>
  );
}
