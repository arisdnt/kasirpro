import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { Customer, CustomerInput } from "@/features/customers/types";
import { createCustomer, deleteCustomer, fetchCustomers, updateCustomer } from "./api";

export const CUSTOMERS_KEY = ["customers"] as const;

export function useCustomersQuery(filterStoreId: string | null | "all" = "all") {
  const {
    state: { user },
  } = useSupabaseAuth();

  const effectiveStore = filterStoreId === "all" ? null : filterStoreId;

  return useQuery<Customer[]>({
    queryKey: [...CUSTOMERS_KEY, user?.tenantId, effectiveStore],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchCustomers(user!.tenantId, effectiveStore),
    staleTime: 1000 * 60,
  });
}

export function useCustomerCreateMutation() {
  const queryClient = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();

  return useMutation({
    mutationFn: async (input: CustomerInput) => {
      if (!user) throw new Error("Unauthorized");
      await createCustomer({ tenantId: user.tenantId, input });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CUSTOMERS_KEY });
      toast.success("Pelanggan berhasil ditambahkan");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Gagal menambahkan pelanggan");
    },
  });
}

export function useCustomerUpdateMutation() {
  const queryClient = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();

  return useMutation({
    mutationFn: async (payload: { id: string; input: CustomerInput }) => {
      if (!user) throw new Error("Unauthorized");
      await updateCustomer({ id: payload.id, tenantId: user.tenantId, input: payload.input });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CUSTOMERS_KEY });
      toast.success("Data pelanggan diperbarui");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Gagal memperbarui pelanggan");
    },
  });
}

export function useCustomerDeleteMutation() {
  const queryClient = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();

  return useMutation({
    mutationFn: async (customerId: string) => {
      if (!user) throw new Error("Unauthorized");
      await deleteCustomer({ id: customerId, tenantId: user.tenantId });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CUSTOMERS_KEY });
      toast.success("Pelanggan dihapus");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Tidak dapat menghapus pelanggan");
    },
  });
}
