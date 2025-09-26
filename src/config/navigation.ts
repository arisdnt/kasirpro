import type { ComponentType, SVGProps } from "react";
import {
  ArrowLeftRight,
  Activity,
  Box,
  Building,
  Building2,
  ChartPie,
  ClipboardList,
  Factory,
  LayoutDashboard,
  Layers,
  Percent,
  Newspaper,
  Package2,
  Settings,
  Settings2,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Tags,
  Users,
  UserCheck,
} from "lucide-react";

export type NavLink = {
  to?: string;
  label: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  description?: string;
  tables?: string[];
  children?: NavLink[];
  disabled?: boolean;
  match?: string[];
};

export type NavSection = {
  id: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  description?: string;
  tables: string[];
  items: NavLink[];
};

export const navigationSections: NavSection[] = [
  {
    id: "monitoring",
    label: "Monitor Bisnis",
    icon: ChartPie,
    description: "Pantau performa tenant dan toko",
    tables: ["tenants", "toko", "audit_log"],
    items: [
      {
        to: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        description: "Ringkasan realtime performa toko",
        tables: ["transaksi_penjualan", "transaksi_pembelian", "inventaris"],
      },
    ],
  },
  {
    id: "penjualan",
    label: "Penjualan",
    icon: ShoppingCart,
    description: "Kelola transaksi POS dan retur",
    tables: [
      "transaksi_penjualan",
      "item_transaksi_penjualan",
      "retur_penjualan",
      "item_retur_penjualan",
      "pelanggan",
    ],
    items: [
      {
        to: "/pos",
        label: "POS",
        icon: ShoppingCart,
        description: "Transaksi kasir cepat dan stabil",
        tables: ["transaksi_penjualan"],
      },
      {
        to: "/sales",
        label: "Riwayat Penjualan",
        icon: ShoppingCart,
        description: "Data transaksi penjualan dan omzet",
        tables: ["transaksi_penjualan", "item_transaksi_penjualan"],
      },
      {
        to: "/promo",
        label: "Promo",
        icon: Percent,
        description: "Kelola kampanye diskon dan voucher",
        tables: ["promo", "promo_produk", "promo_kategori", "promo_brand", "promo_pelanggan", "promo_penerapan"],
      },
      {
        to: "/returns",
        label: "Retur Penjualan",
        icon: ClipboardList,
        description: "Kelola retur dan item terkait",
        tables: ["retur_penjualan", "item_retur_penjualan"],
      },
      {
        to: "/customers",
        label: "Pelanggan",
        icon: Users,
        description: "Data pelanggan dan loyalti",
        tables: ["pelanggan"],
      },
    ],
  },
  {
    id: "pembelian",
    label: "Pembelian",
    icon: ShoppingBag,
    description: "Proses pembelian dan supplier",
    tables: [
      "transaksi_pembelian",
      "item_transaksi_pembelian",
      "retur_pembelian",
      "item_retur_pembelian",
      "supplier",
    ],
    items: [
      {
        to: "/purchases/quick-entry",
        label: "Pembelian Cepat",
        icon: Sparkles,
        description: "Input restok instan dengan barcode",
        tables: ["transaksi_pembelian", "item_transaksi_pembelian", "produk"],
      },
      {
        to: "/purchases",
        label: "Transaksi Pembelian",
        icon: Package2,
        description: "Pesanan pembelian dan status pembayaran",
        tables: ["transaksi_pembelian", "item_transaksi_pembelian"],
      },
      {
        to: "/purchase-returns",
        label: "Retur Pembelian",
        icon: ArrowLeftRight,
        description: "Kelola retur pembelian dan supplier",
        tables: ["retur_pembelian", "item_retur_pembelian"],
      },
      {
        to: "/suppliers",
        label: "Supplier",
        icon: Factory,
        description: "Daftar supplier dan limit kredit",
        tables: ["supplier"],
      },
    ],
  },
  {
    id: "katalog",
    label: "Katalog & Stok",
    icon: Package2,
    description: "Manajemen produk dan stok",
    tables: [
      "produk",
      "kategori",
      "brand",
      "inventaris",
      "stock_opname",
      "stock_opname_items",
    ],
    items: [
      {
        to: "/produk",
        label: "Produk",
        icon: Package2,
        description: "Manajemen katalog produk",
        tables: ["produk"],
      },
      {
        to: "/kategori",
        label: "Kategori",
        icon: Layers,
        description: "Struktur kategori dan subkategori",
        tables: ["kategori"],
      },
      {
        to: "/brand",
        label: "Brand",
        icon: Tags,
        description: "Kelola brand lintas channel",
        tables: ["brand"],
      },
      {
        to: "/inventory",
        label: "Inventaris",
        icon: Box,
        description: "Kelola stok barang untuk setiap toko",
        tables: ["inventaris", "stock_opname", "stock_opname_items"],
      },
      {
        to: "/inventory/variance",
        label: "Kesehatan Stok",
        icon: Activity,
        description: "Analisis selisih stok fisik dan sistem",
        tables: ["inventaris", "stock_opname", "stock_opname_items"],
      },
      {
        to: "/stock-opname",
        label: "Stock Opname",
        icon: ClipboardList,
        description: "Catat penyesuaian stok fisik",
        tables: ["stock_opname", "stock_opname_items"],
      },
    ],
  },
  {
    id: "komunikasi",
    label: "Relasi & Komunikasi",
    icon: Users,
    description: "Interaksi internal dan eksternal",
    tables: ["perpesanan", "berita", "berita_views", "detail_user"],
    items: [
      {
        to: "/pesan",
        label: "Perpesanan",
        icon: Building,
        description: "Pesan internal antar pengguna",
        tables: ["perpesanan"],
      },
      {
        to: "/news",
        label: "Berita",
        icon: Newspaper,
        description: "Manajemen artikel dan pengumuman",
        tables: ["berita", "berita_views"],
      },
      {
        to: "/audit",
        label: "Audit Log",
        icon: ClipboardList,
        description: "Jejak aktivitas sistem",
        tables: ["audit_log"],
      },
    ],
  },
  {
    id: "manajemen",
    label: "Manajemen",
    icon: Building2,
    description: "Kelola toko, tenant, dan user",
    tables: ["toko", "tenant", "user", "role"],
    items: [
      {
        to: "/stores",
        label: "Toko",
        icon: Building,
        description: "Manajemen data toko dan lokasi",
        tables: ["toko"],
      },
      {
        to: "/tenants",
        label: "Tenant",
        icon: Building2,
        description: "Manajemen tenant dan berlangganan",
        tables: ["tenant"],
      },
      {
        to: "/users",
        label: "User",
        icon: UserCheck,
        description: "Manajemen pengguna dan role",
        tables: ["user", "role"],
      },
      {
        to: "/roles",
        label: "Role",
        icon: Shield,
        description: "Manajemen role dan permission",
        tables: ["peran"],
      },
    ],
  },
  {
    id: "pengaturan",
    label: "Pengaturan",
    icon: Settings,
    description: "Konfigurasi sistem dan akses",
    tables: ["users", "peran", "konfigurasi_sistem", "dokumen_storage"],
    items: [
      {
        to: "/settings",
        label: "Pengaturan",
        icon: Settings,
        description: "Preferensi sistem & akses",
        tables: ["konfigurasi_sistem", "users", "peran"],
      },
      {
        to: "/settings/system-config",
        label: "Konfigurasi Sistem",
        icon: Settings2,
        description: "Kelola key konfigurasi tenant dan toko",
        tables: ["konfigurasi_sistem"],
      },
    ],
  },
];
