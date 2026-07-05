"use client";

import Link from "next/link";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { ArrowLeft, Check, Crown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { STRIPE_PUBLISHABLE_KEY } from "@/lib/api/config";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useProfile } from "@/hooks/use-auth";
import { useCreatePaymentIntent } from "@/hooks/use-payments";

const PRO_PRICE = "$29.99";
const PRO_PERKS = [
  "Portafolios ilimitados",
  "Reportes PDF ilimitados",
  "Prioridad en nuevas funciones",
];

// Load Stripe once at module scope (only when a publishable key is configured).
const stripePromise = STRIPE_PUBLISHABLE_KEY
  ? loadStripe(STRIPE_PUBLISHABLE_KEY)
  : null;

export default function UpgradePage() {
  const { data: user } = useProfile();
  const createIntent = useCreatePaymentIntent();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = () => {
    setError(null);
    createIntent.mutate(undefined, {
      onSuccess: (res) => setClientSecret(res.clientSecret),
      onError: (err) => setError(getApiErrorMessage(err)),
    });
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <Link
        href="/settings"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Configuración
      </Link>

      <Card className="rounded-2xl border-border bg-card">
        <CardHeader>
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Crown className="size-6" />
          </span>
          <CardTitle>EquiFlow PRO</CardTitle>
          <CardDescription>
            {PRO_PRICE} — pago único. Desbloquea todo el potencial de EquiFlow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="space-y-2">
            {PRO_PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-2 text-sm">
                <Check className="size-4 text-positive" />
                {perk}
              </li>
            ))}
          </ul>

          {user?.is_pro ? (
            <p className="rounded-xl bg-primary/15 px-4 py-3 text-center text-sm font-semibold text-primary">
              Ya eres PRO. ¡Gracias por tu apoyo!
            </p>
          ) : !stripePromise ? (
            <p className="rounded-xl bg-accent px-4 py-3 text-sm text-muted-foreground">
              El pago no está configurado. Falta definir{" "}
              <code className="font-tabular">
                NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
              </code>{" "}
              en el entorno.
            </p>
          ) : clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance: { theme: "night" } }}
            >
              <CheckoutForm />
            </Elements>
          ) : (
            <div className="space-y-3">
              {error && (
                <p className="text-sm text-negative" role="alert">
                  {error}
                </p>
              )}
              <Button
                className="w-full"
                onClick={startCheckout}
                disabled={createIntent.isPending}
              >
                {createIntent.isPending && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                Continuar al pago
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/upgrade`,
      },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message ?? "No se pudo procesar el pago.");
      setSubmitting(false);
      return;
    }

    // Payment succeeded (no redirect needed). The backend webhook flips the user
    // to PRO asynchronously, so we show a confirmation message.
    setSucceeded(true);
    setSubmitting(false);
  };

  if (succeeded) {
    return (
      <div className="space-y-4 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-positive/15 text-positive">
          <Check className="size-6" />
        </span>
        <p className="text-sm">
          Pago recibido. Tu cuenta se actualizará a PRO en unos instantes.
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link href="/settings">Volver a Configuración</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />

      {error && (
        <p className="text-sm text-negative" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={!stripe || submitting}>
        {submitting && <Loader2 className="size-4 animate-spin" />}
        Pagar {PRO_PRICE}
      </Button>
    </form>
  );
}
