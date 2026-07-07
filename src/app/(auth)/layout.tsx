import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" aria-label="Ir al inicio">
            <Image
              src="/equiflow.svg"
              alt="EquiFlow"
              width={260}
              height={78}
              priority
              className="h-16 w-auto"
            />
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Gestiona tus inversiones en un solo lugar
          </p>
        </div>
        {children}
        <p className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}
