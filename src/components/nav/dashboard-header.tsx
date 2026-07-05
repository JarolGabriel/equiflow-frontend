"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogout, useProfile } from "@/hooks/use-auth";
import { useAuthStore } from "@/lib/store/auth-store";

function initials(first?: string, last?: string, email?: string) {
  const a = first?.[0] ?? "";
  const b = last?.[0] ?? "";
  const combined = `${a}${b}`.trim();
  if (combined) return combined.toUpperCase();
  return (email?.[0] ?? "U").toUpperCase();
}

export function DashboardHeader() {
  const router = useRouter();
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: user, isLoading } = useProfile();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => router.replace("/watchlist"),
    });
  };

  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email
    : "";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
      {!hasHydrated ? (
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      ) : !isAuthenticated ? (
        <>
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-accent text-sm">EF</AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground">Invitado</p>
          </div>
          <Button asChild size="sm">
            <Link href="/login">
              <LogIn className="size-4" />
              Iniciar sesión
            </Link>
          </Button>
        </>
      ) : (
        <>
          <div className="flex items-center gap-3">
            {isLoading ? (
              <>
                <Skeleton className="size-9 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </>
            ) : (
              <>
                <Avatar className="size-9">
                  {user?.profile_picture ? (
                    <AvatarImage src={user.profile_picture} alt={displayName} />
                  ) : null}
                  <AvatarFallback className="bg-accent text-sm">
                    {initials(user?.first_name, user?.last_name, user?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="leading-tight">
                  <p className="text-sm font-medium">{displayName}</p>
                  {user?.is_pro ? (
                    <span className="text-xs font-semibold text-primary">
                      PRO
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Free</span>
                  )}
                </div>
              </>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Abrir menú">
                <Settings className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="size-4" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-negative focus:text-negative"
              >
                <LogOut className="size-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </header>
  );
}
