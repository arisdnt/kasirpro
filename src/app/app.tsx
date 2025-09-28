import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/features/auth/protected-route";
import { GuestRoute } from "@/features/auth/guest-route";
import { AppShell } from "@/layouts/app-shell";
import { DashboardPage } from "@/pages/dashboard/dashboard-page";
import { PosPage } from "@/pages/pos/pos-page";
import { ProdukPage } from "@/pages/produk/produk-page";
import { KategoriPage } from "@/pages/kategori/kategori-page";
import { BrandPage } from "@/pages/brand/brand-page";
import { InvetarisPage } from "@/pages/invetaris/invetaris-page";
import { InventoryVariancePage } from "@/pages/variance/inventory-variance-page";
import { StockOpnamePage } from "@/pages/stock-opname/stock-opname-page";
import { PartnersPage } from "@/pages/partners/partners-page";
import { SalesPage } from "@/pages/sales/sales-page";
import { PurchasesPage } from "@/pages/purchases/purchases-page";
import { ReturnsPage } from "@/pages/returns/returns-page";
import { PurchaseReturnsPage } from "@/pages/purchase-returns/purchase-returns-page";
import { PurchaseEntryPage } from "@/pages/purchase-entry/purchase-entry-page";
import { CustomersPage } from "@/pages/customers/customers-page";
import { SuppliersPage } from "@/pages/suppliers/suppliers-page";
import { PesanPage } from "@/pages/pesan/pesan-page";
import { AuditPage } from "@/pages/audit/audit-page";
import { NewsPage } from "@/pages/news/news-page";
import { StoresPage } from "@/pages/stores/stores-page";
import { TenantsPage } from "@/pages/tenants/tenants-page";
import { UsersPage } from "@/pages/users/users-page";
import { RolesPage } from "@/pages/roles/roles-page";
import { SettingsPage } from "@/pages/settings/settings-page";
import { SystemConfigPage } from "@/pages/system-config/system-config-page";
import { DeviceInfoPage } from "@/pages/settings/device-info-page";
import { PromoPage } from "@/pages/promo/promo-page";
import { LoginPage } from "@/pages/auth/login-page";
import { ProfileDetailPage } from "@/pages/profile/profile-detail-page";
import ProfileSettingsPage from "@/pages/profile/profile-settings-page";

function ShellOutlet() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<ShellOutlet />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pos" element={<PosPage />} />
          <Route path="/promo" element={<PromoPage />} />
          <Route path="/produk" element={<ProdukPage />} />
          <Route path="/kategori" element={<KategoriPage />} />
          <Route path="/brand" element={<BrandPage />} />
          <Route path="/products" element={<Navigate to="/produk" replace />} />
          <Route path="/invetaris" element={<InvetarisPage />} />
          <Route path="/inventory" element={<Navigate to="/invetaris" replace />} />
          <Route path="/invetaris/variance" element={<InventoryVariancePage />} />
          <Route path="/stock-opname" element={<StockOpnamePage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/purchases" element={<PurchasesPage />} />
          <Route path="/purchases/quick-entry" element={<PurchaseEntryPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/purchase-returns" element={<PurchaseReturnsPage />} />
          <Route path="/pesan" element={<PesanPage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/tenants" element={<TenantsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/system-config" element={<SystemConfigPage />} />
          <Route path="/settings/device-info" element={<DeviceInfoPage />} />
          <Route path="/profile" element={<ProfileDetailPage />} />
          <Route path="/profile/settings" element={<ProfileSettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
