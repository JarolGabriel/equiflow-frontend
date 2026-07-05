import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/equiflow.svg"
            alt="EquiFlow"
            width={200}
            height={60}
            priority
            className="h-12 w-auto"
          />
          <p className="mt-3 text-sm text-muted-foreground">
            Gestiona tus inversiones en un solo lugar
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
