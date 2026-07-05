"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useConfirmPasswordReset } from "@/hooks/use-auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid") ?? "";
  const token = searchParams.get("token") ?? "";
  const confirm = useConfirmPasswordReset();

  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState<string | null>(null);

  const invalidLink = !uid || !token;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password1 !== password2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    confirm.mutate(
      { uid, token, new_password1: password1, new_password2: password2 },
      {
        onSuccess: () => {
          toast.success("Contraseña actualizada. Inicia sesión.");
          router.replace("/login");
        },
        onError: (err) => setError(getApiErrorMessage(err)),
      },
    );
  };

  if (invalidLink) {
    return (
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader>
          <CardTitle>Enlace inválido</CardTitle>
          <CardDescription>
            El enlace de restablecimiento no es válido o está incompleto.
            Solicita uno nuevo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="w-full">
            <Link href="/forgot-password">Solicitar nuevo enlace</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardHeader>
        <CardTitle>Nueva contraseña</CardTitle>
        <CardDescription>Elige una contraseña nueva para tu cuenta.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password1">Nueva contraseña</Label>
            <Input
              id="password1"
              type="password"
              autoComplete="new-password"
              required
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password2">Confirmar contraseña</Label>
            <Input
              id="password2"
              type="password"
              autoComplete="new-password"
              required
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-negative" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={confirm.isPending}>
            {confirm.isPending && <Loader2 className="animate-spin" />}
            Guardar contraseña
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-10">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
