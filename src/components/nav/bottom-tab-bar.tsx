"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useAlerts } from "@/hooks/use-alerts";
import { AlertBadge } from "./alert-badge";
import { navItems } from "./nav-items";

export function BottomTabBar() {
  const pathname = usePathname();
  const alerts = useAlerts();
  const alertCount = alerts.data?.length ?? 0;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-card md:hidden">
      {navItems.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <span className="relative">
              <Icon className="size-5" />
              <AlertBadge
                count={item.href === "/alerts" ? alertCount : item.badge ?? 0}
                className="absolute -right-2 -top-1"
              />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
