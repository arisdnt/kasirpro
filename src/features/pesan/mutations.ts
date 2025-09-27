import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { createInternalMessage, createInternalMessagesBatch, deleteInternalMessage, fetchUsersByStore, fetchUsersByTenant, markInternalMessageRead, updateInternalMessage } from "./api";
import type { InternalMessageInput } from "@/types/transactions";

export const MESSAGE_KEY = ["pesan-messages"] as const;

export type MessageComposePayload = InternalMessageInput & {
  target: "user" | "store" | "tenant";
  userId?: string | null;
  storeId?: string | null;
};

export function useCreateMessageMutation() {
  const qc = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();

  return useMutation({
    mutationFn: async (input: MessageComposePayload) => {
      if (!user) throw new Error("Unauthorized");
      // Direct to a single user
      if (input.target === "user") {
        return createInternalMessage({
          tenantId: user.tenantId,
          pengirimId: user.id,
          tokoId: user.tokoId ?? null,
          input: { ...input, penerimaId: input.userId ?? null },
        });
      }

      // Broadcast to store
      if (input.target === "store") {
        const storeId = input.storeId ?? user.tokoId;
        if (!storeId) throw new Error("Toko belum dipilih");
        const userIds = await fetchUsersByStore({ tenantId: user.tenantId, storeId });
        await createInternalMessagesBatch({
          tenantId: user.tenantId,
          pengirimId: user.id,
          tokoId: user.tokoId ?? null,
          input,
          recipientUserIds: userIds,
          storeIdForContext: storeId,
        });
        return "ok";
      }

      // Broadcast to tenant
      if (input.target === "tenant") {
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
