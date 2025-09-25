import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";

export type PaymentMethod = {
  key: string;
  label: string;
};

type PosPaymentControlsProps = {
  methods: PaymentMethod[];
  activeMethod: string;
  onChangeMethod: (method: string) => void;
  amount: string;
  onChangeAmount: (value: string) => void;
  discount: string;
  onChangeDiscount: (value: string) => void;
  subtotal: number;
  total: number;
  change: number;
  payButtonRef: React.RefObject<HTMLButtonElement | null>;
  disabled: boolean;
};

export function PosPaymentControls({
  methods,
  activeMethod,
  onChangeMethod,
  amount,
  onChangeAmount,
  discount,
  onChangeDiscount,
  subtotal,
  total,
  change,
  payButtonRef,
  disabled,
}: PosPaymentControlsProps) {
  return (
    <div className="space-y-3 text-sm text-slate-600">
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Diskon</span>
          <Input
            inputMode="numeric"
            value={discount}
            onChange={(event) => onChangeDiscount(event.target.value)}
            className="h-9 w-32 border-slate-200 bg-slate-50 text-right"
          />
        </div>
        <div className="flex items-center justify-between text-base">
          <span className="font-semibold text-slate-600">Total</span>
          <span className="font-semibold text-emerald-600">{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Metode pembayaran
        </span>
        <div className="grid grid-cols-3 gap-2">
          {methods.map((method) => (
            <button
              key={method.key}
              type="button"
              onClick={() => onChangeMethod(method.key)}
              className={`h-10 border text-sm font-medium transition-colors ${
                activeMethod === method.key
                  ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {method.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col justify-center items-center bg-[#476EAE] p-4 h-16">
            <span className="text-3xl font-bold text-white">{formatCurrency(change)}</span>
          </div>
          <Input
            inputMode="numeric"
            placeholder="Nominal diterima"
            value={amount ? new Intl.NumberFormat('id-ID').format(Number(amount)) : ''}
            onChange={(event) => {
              const value = event.target.value.replace(/\D/g, '');
              onChangeAmount(value);
            }}
            disabled={activeMethod === 'qris' || activeMethod === 'transfer'}
            className="h-16 border-slate-200 bg-slate-50 text-slate-900 text-right text-3xl font-bold px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <Button
        ref={payButtonRef}
        type="submit"
        size="lg"
        className="h-12 w-full bg-emerald-500 text-base font-semibold text-white shadow-sm transition-transform hover:bg-emerald-600 hover:shadow-md active:scale-[.99]"
        disabled={disabled}
      >
        Selesaikan & Cetak
      </Button>
    </div>
  );
}
