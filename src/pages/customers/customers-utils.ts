export function getStatusBadgeVariant(status: string) {
  return status === "aktif" ? "outline" : "destructive";
}

export function formatContactInfo(telepon?: string | null, email?: string | null) {
  return {
    telepon: telepon ?? "-",
    email: email ?? "-"
  };
}

export function formatDisplayValue(value?: string | number | null, defaultValue = "-") {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === "number") return value.toLocaleString("id-ID");
  return value || defaultValue;
}