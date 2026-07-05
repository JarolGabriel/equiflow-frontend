import { isAxiosError } from "axios";

/**
 * Extracts a human-readable message from a DRF error response.
 * Handles `{ detail }`, `{ non_field_errors: [...] }`, field errors
 * (`{ field: ["msg"] }`) and plain strings.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Algo salió mal. Inténtalo de nuevo.",
): string {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const data = error.response?.data;
  if (!data) return error.message || fallback;
  if (typeof data === "string") return data;

  if (typeof data === "object") {
    const record = data as Record<string, unknown>;

    if (typeof record.detail === "string") return record.detail;
    if (Array.isArray(record.non_field_errors)) {
      return String(record.non_field_errors[0]);
    }
    if (typeof record.message === "string") return record.message;

    // First field error found.
    for (const value of Object.values(record)) {
      if (Array.isArray(value) && value.length > 0) return String(value[0]);
      if (typeof value === "string") return value;
    }
  }

  return fallback;
}
