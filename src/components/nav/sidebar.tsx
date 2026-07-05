"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useAlerts } from "@/hooks/use-alerts";
import { AlertBadge } from "./alert-badge";
import { navItems } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();
  const alerts = useAlerts();
  const alertCount = alerts.data?.length ?? 0;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" aria-label="EquiFlow">
          <Image
            src="/equiflow.svg"
            alt="EquiFlow"
            width={170}
            height={51}
            priority
            className="h-11 w-auto"
          />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="size-5 shrink-0" />
              <span className="flex-1">{item.label}</span>
              <AlertBadge
                count={item.href === "/alerts" ? alertCount : item.badge ?? 0}
              />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
