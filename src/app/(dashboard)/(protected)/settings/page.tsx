"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Camera, Crown, Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Skeleton } from "@/components/ui/skeleton";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { User } from "@/lib/api/types";
import {
  useChangePassword,
  useLogout,
  useProfile,
  useUpdateProfile,
} from "@/hooks/use-auth";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2MB

export default function SettingsPage() {
  const router = useRouter();
  const { data: user, isLoading } = useProfile();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, { onSettled: () => router.replace("/login") });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>

      <Card className="rounded-2xl border-border bg-card">
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Actualiza tus datos personales.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading || !user ? (
            <div className="space-y-4">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : (
            <ProfileForm key={user.id} user={user} />
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border bg-card">
        <CardHeader>
          <CardTitle>Cambiar contraseña</CardTitle>
          <CardDescription>
            Actualiza tu contraseña de acceso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="size-5 text-primary" />
            Plan
          </CardTitle>
          <CardDescription>
            {user?.is_pro
              ? "Tienes EquiFlow PRO. ¡Gracias por tu apoyo!"
              : "Mejora a PRO para portafolios ilimitados y reportes PDF."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user?.is_pro ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary">
              PRO activo
            </span>
          ) : (
            <Button asChild>
              <Link href="/upgrade">
                <Crown className="size-4" />
                Mejorar a PRO
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border bg-card">
        <CardHeader>
          <CardTitle>Sesión</CardTitle>
          <CardDescription>Cierra tu sesión en este dispositivo.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={logout.isPending}
            className="text-negative hover:text-negative"
          >
            {logout.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LogOut className="size-4" />
            )}
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileForm({ user }: { user: User }) {
  const updateProfile = useUpdateProfile();
  const [firstName, setFirstName] = useState(user.first_name ?? "");
  const [lastName, setLastName] = useState(user.last_name ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials =
    `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() ||
    user.email[0]?.toUpperCase() ||
    "?";
  const avatarSrc = preview ?? user.profile_picture ?? undefined;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;

    if (selected) {
      if (!selected.type.startsWith("image/")) {
        toast.error("El archivo debe ser una imagen (JPG o PNG).");
        e.target.value = "";
        return;
      }
      if (selected.size > MAX_AVATAR_BYTES) {
        toast.error("La imagen supera el tamaño máximo de 2MB.");
        e.target.value = "";
        return;
      }
    }

    setFile(selected);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(selected ? URL.createObjectURL(selected) : null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(
      {
        first_name: firstName,
        last_name: lastName,
        ...(file ? { profile_picture: file } : {}),
      },
      {
        onSuccess: () => {
          toast.success("Perfil actualizado");
          setFile(null);
          if (preview) URL.revokeObjectURL(preview);
          setPreview(null);
        },
        onError: (err) => toast.error(getApiErrorMessage(err)),
      },
    );
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarImage src={avatarSrc} alt={`${firstName} ${lastName}`} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="size-4" />
            Cambiar foto
          </Button>
          <p className="text-xs text-muted-foreground">
            {file ? file.name : "JPG o PNG. Máx. recomendado 2MB."}
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={user.email} disabled />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="first_name">Nombre</Label>
          <Input
            id="first_name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Apellido</Label>
          <Input
            id="last_name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
      <Button type="submit" disabled={updateProfile.isPending}>
        {updateProfile.isPending && <Loader2 className="size-4 animate-spin" />}
        Guardar cambios
      </Button>
    </form>
  );
}

function ChangePasswordForm() {
  const changePassword = useChangePassword();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword1 !== newPassword2) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    changePassword.mutate(
      {
        old_password: oldPassword,
        new_password1: newPassword1,
        new_password2: newPassword2,
      },
      {
        onSuccess: () => {
          toast.success("Contraseña actualizada");
          setOldPassword("");
          setNewPassword1("");
          setNewPassword2("");
        },
        onError: (err) => setError(getApiErrorMessage(err)),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="old_password">Contraseña actual</Label>
        <Input
          id="old_password"
          type="password"
          autoComplete="current-password"
          required
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="new_password1">Nueva contraseña</Label>
          <Input
            id="new_password1"
            type="password"
            autoComplete="new-password"
            required
            value={newPassword1}
            onChange={(e) => setNewPassword1(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new_password2">Confirmar</Label>
          <Input
            id="new_password2"
            type="password"
            autoComplete="new-password"
            required
            value={newPassword2}
            onChange={(e) => setNewPassword2(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-negative" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" disabled={changePassword.isPending}>
        {changePassword.isPending && <Loader2 className="size-4 animate-spin" />}
        Actualizar contraseña
      </Button>
    </form>
  );
}
