/** Formatting helpers for financial values. All numbers should be rendered with
 * the `.font-tabular` utility so they don't shift when updated. */

type Numeric = number | string | null | undefined;

export function toNumber(value: Numeric): number {
  if (value === null || value === undefined || value === "") return 0;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function formatCurrency(
  value: Numeric,
  currency = "USD",
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(toNumber(value));
}

export function formatNumber(value: Numeric, maximumFractionDigits = 8): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(toNumber(value));
}

/** Signed percentage, e.g. `+2.50%` / `-1.20%`. */
export function formatPercent(value: Numeric, fractionDigits = 2): string {
  const n = toNumber(value);
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(fractionDigits)}%`;
}

/** Signed currency, e.g. `+$1,200.00` / `-$300.00`. */
export function formatSignedCurrency(value: Numeric, currency = "USD"): string {
  const n = toNumber(value);
  const sign = n > 0 ? "+" : "";
  return `${sign}${formatCurrency(n, currency)}`;
}

/** Tailwind text color class based on the sign of the value. */
export function signColorClass(value: Numeric): string {
  const n = toNumber(value);
  if (n > 0) return "text-positive";
  if (n < 0) return "text-negative";
  return "text-muted-foreground";
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}
