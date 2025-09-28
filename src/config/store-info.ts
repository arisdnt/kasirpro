/**
 * Store information configuration for login page
 * This config displays store details on the login screen
 */

export interface StoreInfo {
  /** Store name displayed prominently */
  name: string;
  /** Store tagline or description */
  tagline?: string;
  /** Store logo URL or path */
  logoUrl?: string;
  /** Store address */
  address?: string;
  /** Store phone number */
  phone?: string;
  /** Store email */
  email?: string;
  /** Store website URL */
  website?: string;
  /** Operating hours display text */
  operatingHours?: string;
  /** Background image for login page */
  backgroundImage?: string;
  /** Primary brand color (hex) */
  primaryColor?: string;
  /** Secondary brand color (hex) */
  secondaryColor?: string;
  /** Whether to show store info on login */
  showOnLogin?: boolean;
  /** List of key features to display on login */
  features?: string[];
}

/**
 * Default store information configuration
 * Override these values based on tenant/store settings
 */
export const defaultStoreInfo: StoreInfo = {
  name: "KasirPro",
  tagline: "Sistem Point of Sale Terpadu",
  logoUrl: "/assets/logo-kasirpro.png",
  address: "Jl. Teknologi Digital No. 1, Jakarta",
  phone: "+62 21 1234 5678",
  email: "info@kasirpro.com",
  website: "https://kasirpro.com",
  operatingHours: "Senin - Sabtu: 08:00 - 22:00",
  backgroundImage: "/bglogin.jpg",
  primaryColor: "#2563eb",
  secondaryColor: "#64748b",
  showOnLogin: true,
  features: [
    "Kelola penjualan real-time",
    "Pantau inventori otomatis",
    "Laporan lengkap & analitik",
  ],
};

/**
 * Store info display themes
 */
export const storeInfoThemes = {
  modern: {
    layout: "split",
    textPosition: "left",
    showBackground: true,
    opacity: 0.9,
  },
  classic: {
    layout: "centered",
    textPosition: "center",
    showBackground: false,
    opacity: 1,
  },
  minimal: {
    layout: "top",
    textPosition: "center",
    showBackground: false,
    opacity: 1,
  },
} as const;

export type StoreInfoTheme = keyof typeof storeInfoThemes;

/**
 * Get store information for login page
 * This can be extended to fetch from API based on domain/tenant
 */
export function getStoreInfoForLogin(
  tenantId?: string,
  storeId?: string
): StoreInfo {
  // For now, return default config
  // TODO: Implement dynamic loading based on tenant/store
  return defaultStoreInfo;
}

/**
 * Validate store info configuration
 */
export function validateStoreInfo(storeInfo: Partial<StoreInfo>): boolean {
  return !!(storeInfo.name && storeInfo.name.trim().length > 0);
}