import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { PromoWithRelations } from "@/features/promo/types";
import type { PromoTiming } from "./promo-list";
import { PromoDetailCard } from "./promo-detail-card";

type PromoDetailModalProps = {
  promo: PromoWithRelations | null;
  timing: PromoTiming | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleStatus: (promo: PromoWithRelations) => void;
  isStatusUpdating: boolean;
};

export function PromoDetailModal({
  promo,
  timing,
  open,
  onOpenChange,
  onToggleStatus,
  isStatusUpdating,
}: PromoDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-white rounded-none">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Detail Promo</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto">
          <PromoDetailCard
            promo={promo}
            timing={timing}
            onToggleStatus={onToggleStatus}
            isStatusUpdating={isStatusUpdating}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
