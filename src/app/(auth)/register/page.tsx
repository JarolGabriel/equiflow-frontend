"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useRegister } from "@/hooks/use-auth";

export default function RegisterPage() {
  const router = useRouter();
  const register = useRegister();

  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    register.mutate(form, {
      onSuccess: () => {
        toast.success("Cuenta creada. Ahora inicia sesión.");
        router.replace("/login");
      },
      onError: (err) => setError(getApiErrorMessage(err)),
    });
  };

  return (
    <Card className="rounded-2xl border-border bg-card">
      <CardHeader>
        <CardTitle>Crear cuenta</CardTitle>
        <CardDescription>Empieza a gestionar tus inversiones</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="first_name">Nombre</Label>
              <Input
                id="first_name"
                autoComplete="given-name"
                required
                value={form.first_name}
                onChange={update("first_name")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Apellido</Label>
              <Input
                id="last_name"
                autoComplete="family-name"
                required
                value={form.last_name}
                onChange={update("last_name")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={update("email")}
              placeholder="tu@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={form.password}
              onChange={update("password")}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-negative" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={register.isPending}>
            {register.isPending && <Loader2 className="animate-spin" />}
            Crear cuenta
          </Button>
        </form>

        <SocialLoginButtons />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Inicia sesión
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
