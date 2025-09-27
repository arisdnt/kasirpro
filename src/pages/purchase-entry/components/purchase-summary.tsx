import { Button as HeroButton, CardFooter } from "@heroui/react";
import { MoveRight } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { PurchaseEntryTotals } from "../purchase-entry-types";

interface PurchaseSummaryProps {
  totals: PurchaseEntryTotals;
  isSubmitting: boolean;
  hasItems: boolean;
  onSubmitDraft: () => void;
  onSubmitPurchase: () => void;
}

export function PurchaseSummary({
  totals,
  isSubmitting,
  hasItems,
  onSubmitDraft,
  onSubmitPurchase,
}: PurchaseSummaryProps) {
  return (
    <>
      <div className="border border-emerald-200 bg-emerald-50/90 p-4 text-slate-700 rounded-none">
        <div className="flex items-center justify-between text-sm">
          <span>Total qty</span>
          <span className="font-semibold">{totals.totalQty}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-base font-semibold text-emerald-600">
          <span>Grand total</span>
          <span>{formatCurrency(totals.totalAmount)}</span>
        </div>
      </div>
      <CardFooter className="flex flex-col gap-2 border-t border-sky-100 pt-4">
        <HeroButton
          className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] data-[disabled=true]:bg-[#476EAE]/70 data-[disabled=true]:opacity-80"
          fullWidth
          onPress={onSubmitDraft}
          isDisabled={isSubmitting || !hasItems}
          isLoading={isSubmitting}
        >
          Simpan Draft
        </HeroButton>
        <HeroButton
          className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] data-[disabled=true]:bg-[#476EAE]/70 data-[disabled=true]:opacity-80"
          fullWidth
          onPress={onSubmitPurchase}
          endContent={<MoveRight className="h-4 w-4" />}
          isDisabled={isSubmitting || !hasItems}
          isLoading={isSubmitting}
        >
          Konfirmasi Pembelian
        </HeroButton>
      </CardFooter>
    </>
  );
}