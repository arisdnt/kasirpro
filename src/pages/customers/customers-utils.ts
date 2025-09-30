export function getStatusTone(status?: string | null) {
  if (!status || status.toLowerCase() !== "nonaktif") {
    return {
      backgroundColor: "#dcfce7",
      color: "#166534",
      borderColor: "#86efac",
    };
  }
  return {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    borderColor: "#fecaca",
  };
}

export function formatContactInfo(telepon?: string | null, email?: string | null) {
  return {
    telepon: telepon && telepon.trim().length > 0 ? telepon : "Tidak tersedia",
    email: email && email.trim().length > 0 ? email : "Tidak tersedia",
  };
}

export function formatDisplayValue(value?: string | number | null, defaultValue = "-") {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === "number") return value.toLocaleString("id-ID");
  const normalized = value.toString().trim();
  return normalized.length > 0 ? normalized : defaultValue;
}

export function formatGender(gender?: string | null) {
  if (!gender) return "-";
  const normalized = gender.toLowerCase();
  if (normalized === "l" || normalized === "laki-laki" || normalized === "male") return "Laki-laki";
  if (normalized === "p" || normalized === "perempuan" || normalized === "female") return "Perempuan";
  return gender;
}

export function formatBirthDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", { dateStyle: "medium" });
}
