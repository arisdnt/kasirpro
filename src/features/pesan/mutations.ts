import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { createInternalMessage, createInternalMessagesBatch, deleteInternalMessage, fetchUsersByStore, fetchUsersByTenant, markInternalMessageRead, updateInternalMessage } from "./api";
import type { InternalMessageInput } from "@/features/pesan/types";
import type { CascadingTarget } from "./components/hierarchical-target-selector";

export const MESSAGE_KEY = ["pesan-messages"] as const;

export type MessageComposePayload = InternalMessageInput & {
  cascadingTarget: CascadingTarget;
};

export function useCreateMessageMutation() {
  const qc = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();

  return useMutation({
    mutationFn: async (input: MessageComposePayload) => {
      if (!user) throw new Error("Unauthorized");

      const { cascadingTarget } = input;

      // Specific user
      if (cascadingTarget.level === "specific_user" && cascadingTarget.userId) {
        return createInternalMessage({
          tenantId: cascadingTarget.tenantId || user.tenantId,
          pengirimId: user.id,
          tokoId: user.tokoId ?? null,
          input: { ...input, penerimaId: cascadingTarget.userId },
        });
      }

      // All users in specific store
      if (cascadingTarget.level === "all_users_in_store" && cascadingTarget.storeId) {
        const userIds = await fetchUsersByStore({
          tenantId: cascadingTarget.tenantId || user.tenantId,
          storeId: cascadingTarget.storeId
        });
        await createInternalMessagesBatch({
          tenantId: cascadingTarget.tenantId || user.tenantId,
          pengirimId: user.id,
          tokoId: user.tokoId ?? null,
          input,
          recipientUserIds: userIds,
          storeIdForContext: cascadingTarget.storeId,
        });
        return "ok";
      }

      // All stores in specific tenant
      if (cascadingTarget.level === "all_stores_in_tenant" && cascadingTarget.tenantId) {
        const userIds = await fetchUsersByTenant(cascadingTarget.tenantId);
        await createInternalMessagesBatch({
          tenantId: cascadingTarget.tenantId,
          pengirimId: user.id,
          tokoId: user.tokoId ?? null,
          input,
          recipientUserIds: userIds,
          storeIdForContext: null,
        });
        return "ok";
      }

      // All tenants (fallback to current tenant for now)
      if (cascadingTarget.level === "all_tenants") {
        const userIds = await fetchUsersByTenant(user.tenantId);
        await createInternalMessagesBatch({
          tenantId: user.tenantId,
          pengirimId: user.id,
          tokoId: user.tokoId ?? null,
          input,
          recipientUserIds: userIds,
          storeIdForContext: null,
        });
        return "ok";
      }

      throw new Error("Target tidak valid");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...MESSAGE_KEY, user?.tenantId, user?.tokoId] });
      toast.success("Pesan berhasil dikirim");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Gagal mengirim pesan");
    },
  });
}

export function useUpdateMessageMutation(messageId: string) {
  const qc = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();

  return useMutation({
    mutationFn: async (input: Partial<InternalMessageInput> & { status?: string | null }) => {
      if (!user) throw new Error("Unauthorized");
      await updateInternalMessage({
        tenantId: user.tenantId,
        messageId,
        input,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...MESSAGE_KEY, user?.tenantId, user?.tokoId] });
      toast.success("Pesan diperbarui");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Gagal memperbarui pesan");
    },
  });
}

export function useDeleteMessageMutation() {
  const qc = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();

  return useMutation({
    mutationFn: async (messageId: string) => {
      if (!user) throw new Error("Unauthorized");
      await deleteInternalMessage({ tenantId: user.tenantId, messageId });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...MESSAGE_KEY, user?.tenantId, user?.tokoId] });
      toast.success("Pesan dihapus");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Tidak dapat menghapus pesan");
    },
  });
}

export function useMarkReadMessageMutation() {
  const qc = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();

  return useMutation({
    mutationFn: async (messageId: string) => {
      if (!user) throw new Error("Unauthorized");
      await markInternalMessageRead({ tenantId: user.tenantId, messageId });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...MESSAGE_KEY, user?.tenantId, user?.tokoId] });
    },
    onError: (err) => {
      console.error(err);
      toast.error("Gagal menandai pesan dibaca");
    },
  });
}
