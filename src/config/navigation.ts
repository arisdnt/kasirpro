import type { ComponentType, SVGProps } from "react";
import {
  Box,
  Building,
  LayoutDashboard,
  Package2,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  description?: string;
};

export const mainNavigation: NavItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Ringkasan realtime performa toko",
  },
  {
    to: "/pos",
    label: "POS",
    icon: ShoppingCart,
    description: "Transaksi kasir cepat dan stabil",
  },
  {
    to: "/products",
    label: "Produk",
    icon: Package2,
    description: "Manajemen katalog produk",
  },
  {
    to: "/inventory",
    label: "Inventori",
    icon: Box,
    description: "Pantau stok antar toko",
  },
  {
    to: "/partners",
    label: "Relasi",
    icon: Users,
    description: "Data pelanggan & supplier",
  },
  {
    to: "/operations",
    label: "Operasional",
    icon: Building,
    description: "Retur, pembelian, audit",
  },
  {
    to: "/settings",
    label: "Pengaturan",
    icon: Settings,
    description: "Preferensi sistem & akses",
  },
];
