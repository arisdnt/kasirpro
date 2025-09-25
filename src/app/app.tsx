import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/features/auth/protected-route";
import { GuestRoute } from "@/features/auth/guest-route";
import { AppShell } from "@/layouts/app-shell";
import { DashboardPage } from "@/pages/dashboard/dashboard-page";
import { PosPage } from "@/pages/pos/pos-page";
import { ProductsPage } from "@/pages/products/products-page";
import { InventoryPage } from "@/pages/inventory/inventory-page";
import { PartnersPage } from "@/pages/partners/partners-page";
import { OperationsPage } from "@/pages/operations/operations-page";
import { SettingsPage } from "@/pages/settings/settings-page";
import { LoginPage } from "@/pages/auth/login-page";

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
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/operations" element={<OperationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
