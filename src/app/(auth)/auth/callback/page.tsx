"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { SocialProvider } from "@/lib/api/types";
import { useSocialLogin } from "@/hooks/use-auth";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const social = useSocialLogin();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    // Guard against double-invocation (React strict mode / re-renders).
    if (started.current) return;
    started.current = true;

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      setError("Se canceló el inicio de sesión con el proveedor.");
      return;
    }
    if (!code || (state !== "google" && state !== "github")) {
      setError("Faltan parámetros del proveedor OAuth.");
      return;
    }

    social.mutate(
      { provider: state as SocialProvider, code },
      {
        onSuccess: () => router.replace("/portfolios"),
        onError: (err) => setError(getApiErrorMessage(err)),
      },
    );
  }, [searchParams, router, social]);

  if (error) {
    return (
      <Card className="rounded-2xl border-border bg-card">
        <CardContent className="space-y-3 py-8 text-center">
          <p className="text-sm text-negative" role="alert">
            {error}
          </p>
          <Link href="/login" className="text-sm text-primary hover:underline">
            Volver al inicio de sesión
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Completando inicio de sesión…</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-10">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
