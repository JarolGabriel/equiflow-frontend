import { cn } from "@/lib/utils";

/**
 * Small circular unread-count badge (e.g. the "12" on Alerts).
 * Hidden when count is 0. Real-time updates arrive in Phase 3 (WebSocket).
 */
export function AlertBadge({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  if (!count || count <= 0) return null;

  return (
    <span
      className={cn(
        "inline-flex min-w-4 items-center justify-center rounded-full bg-negative px-1 text-[10px] font-semibold leading-4 text-negative-foreground font-tabular",
        className,
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
