import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useTenantsQuery } from "@/features/tenants/use-tenants";
import { useStoresQuery } from "@/features/stores/use-stores";
import { useUsersQuery } from "@/features/users/use-users";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";

export type CascadingTarget = {
  tenantId?: string;
  storeId?: string;
  userId?: string;
  level: "all_tenants" | "specific_tenant" | "all_stores_in_tenant" | "specific_store" | "all_users_in_store" | "specific_user";
};

type Props = {
  value: CascadingTarget;
  onChange: (target: CascadingTarget) => void;
};

export function HierarchicalTargetSelector({ value, onChange }: Props) {
  const { state: { user } } = useSupabaseAuth();
  const { data: tenants } = useTenantsQuery();
  const { data: stores } = useStoresQuery();
  const { data: users } = useUsersQuery();

  const [selectedTenantId, setSelectedTenantId] = useState<string>("");
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  useEffect(() => {
    if (value) {
      setSelectedTenantId(value.tenantId || "");
      setSelectedStoreId(value.storeId || "");
      setSelectedUserId(value.userId || "");
    }
  }, [value]);

  // Cascading logic: determine level based on what's selected
  const determineLevel = (tenantId: string, storeId: string, userId: string): CascadingTarget["level"] => {
    if (userId) return "specific_user";
    if (storeId) return "all_users_in_store";
    if (tenantId) return "all_stores_in_tenant";
    return "all_tenants";
  };

  const handleTenantChange = (tenantId: string) => {
    setSelectedTenantId(tenantId);
    // Reset child selections when parent changes
    setSelectedStoreId("");
    setSelectedUserId("");

    const level = determineLevel(tenantId, "", "");
    onChange({
      tenantId: tenantId || undefined,
      storeId: undefined,
      userId: undefined,
      level
    });
  };

  const handleStoreChange = (storeId: string) => {
    setSelectedStoreId(storeId);
    // Reset child selections when parent changes
    setSelectedUserId("");

    const level = determineLevel(selectedTenantId, storeId, "");
    onChange({
      tenantId: selectedTenantId || undefined,
      storeId: storeId || undefined,
      userId: undefined,
      level
    });
  };

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);

    const level = determineLevel(selectedTenantId, selectedStoreId, userId);
    onChange({
      tenantId: selectedTenantId || undefined,
      storeId: selectedStoreId || undefined,
      userId: userId || undefined,
      level
    });
  };

  // Filter stores based on selected tenant
  const filteredStores = stores?.filter(store =>
    !selectedTenantId || store.tenantId === selectedTenantId
  );

  // Filter users based on selected tenant and store
  const filteredUsers = users?.filter(user => {
    if (selectedTenantId && user.tenantId !== selectedTenantId) {
      return false;
    }
    if (selectedStoreId && user.tokoId !== selectedStoreId) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-3">
      {/* Step 1: Tenant Selection */}
      <div className="space-y-1">
        <Label className="text-sm font-medium">1. Pilih Tenant</Label>
        <select
          value={selectedTenantId}
          onChange={(e) => handleTenantChange(e.target.value)}
          className="h-10 w-full rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="">Semua Tenant</option>
          {tenants?.map((tenant) => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.nama}
            </option>
          ))}
        </select>
      </div>

      {/* Step 2: Store Selection - only shown if tenant is selected */}
      {selectedTenantId && (
        <div className="space-y-1">
          <Label className="text-sm font-medium">2. Pilih Toko</Label>
          <select
            value={selectedStoreId}
            onChange={(e) => handleStoreChange(e.target.value)}
            className="h-10 w-full rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">Semua Toko di Tenant Ini</option>
            {filteredStores?.map((store) => (
              <option key={store.id} value={store.id}>
                {store.nama}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Step 3: User Selection - only shown if store is selected */}
      {selectedStoreId && (
        <div className="space-y-1">
          <Label className="text-sm font-medium">3. Pilih User</Label>
          <select
            value={selectedUserId}
            onChange={(e) => handleUserChange(e.target.value)}
            className="h-10 w-full rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">Semua User di Toko Ini</option>
            {filteredUsers?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.nama} ({user.email})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Display current selection */}
      <div className="mt-3 p-2 bg-slate-50 rounded text-sm text-slate-600">
        <strong>Penerima:</strong>{" "}
        {value.level === "all_tenants" && "Semua Tenant"}
        {value.level === "all_stores_in_tenant" && `Semua Toko di ${tenants?.find(t => t.id === selectedTenantId)?.nama || "Tenant Terpilih"}`}
        {value.level === "all_users_in_store" && `Semua User di ${filteredStores?.find(s => s.id === selectedStoreId)?.nama || "Toko Terpilih"}`}
        {value.level === "specific_user" && `${filteredUsers?.find(u => u.id === selectedUserId)?.nama || "User Terpilih"}`}
      </div>
    </div>
  );
}