import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { usePosCartStore } from "./use-pos-cart-store";
import { finalizeTransaction } from "./checkout-service";
import { PosInvoiceTable } from "./pos-invoice-table";
import { PosPaymentControls, type PaymentMethod } from "./pos-payment-controls";
import type { Customer } from "@/types/partners";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/format";
import { CheckCircle, AlertCircle, X, Printer } from "lucide-react";

const PAYMENT_METHODS: PaymentMethod[] = [
  { key: "cash", label: "Tunai" },
  { key: "qris", label: "QRIS" },
  { key: "transfer", label: "Transfer" },
];

type PosSummaryProps = {
  customer: Customer | null;
  payButtonRef: React.RefObject<HTMLButtonElement | null>;
};

export function PosSummary({ customer, payButtonRef }: PosSummaryProps) {
  const {
    state: { user },
  } = useSupabaseAuth();
  const items = usePosCartStore((state) => state.items);
  const clearCart = usePosCartStore((state) => state.clear);
  const formRef = useRef<HTMLFormElement>(null);
  const [method, setMethod] = useState<string>(PAYMENT_METHODS[0].key);
  const [amount, setAmount] = useState("0");
  const [discount, setDiscount] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [completedTransaction, setCompletedTransaction] = useState<any>(null);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.product.hargaJual - item.discount, 0),
    [items],
  );
  const discountValue = Number(discount) || 0;
  const total = Math.max(subtotal - discountValue, 0);
  const paid = Number(amount) || 0;
  const change = Math.max(paid - total, 0);

  // Auto-set amount to total for non-cash payment methods
  useEffect(() => {
    if (method === 'qris' || method === 'transfer') {
      setAmount(total.toString());
    }
  }, [method, total]);
  const invoiceNumber = useMemo(
    () => `INV-${format(new Date(), "ddMMyy-HHmm")}`,
    [],
  );

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Anda perlu login ulang");
      return;
    }
    if (!items.length) {
      toast.error("Keranjang masih kosong");
      return;
    }
    if (!user.tokoId) {
      toast.error("Pilih toko aktif terlebih dahulu");
      return;
    }
    if (paid < total) {
      toast.error("Nominal pembayaran belum mencukupi");
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmTransaction = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);

    try {
      const result = await finalizeTransaction({
        tenantId: user.tenantId,
        tokoId: user.tokoId,
        penggunaId: user.id,
        cart: items,
        amountPaid: paid,
        method,
        customerId: customer?.id ?? null,
        discount: discountValue,
      });

      // Store transaction data for invoice
      setCompletedTransaction({
        ...result,
        items: items,
        customer: customer,
        subtotal: subtotal,
        discount: discountValue,
        total: total,
        paid: paid,
        change: change,
        method: method,
        invoiceNumber: invoiceNumber,
      });

      toast.success(`Transaksi ${result.nomorTransaksi} berhasil`);
      setShowInvoiceModal(true);

      clearCart();
      setAmount("0");
      setDiscount("0");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan transaksi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    // Create thermal receipt content for iframe
    const thermalHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Struk Pembayaran</title>
          <meta charset="utf-8">
          <style>
            @page {
              size: 58mm auto;
              margin: 2mm;
            }

            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              width: 58mm;
              font-family: 'Courier New', monospace;
              font-size: 10px;
              line-height: 1.3;
              color: #000;
              background: white;
            }

            .receipt {
              width: 100%;
            }

            .center {
              text-align: center;
            }

            .bold {
              font-weight: bold;
            }

            .dashed-border {
              border-top: 1px dashed #000;
              margin: 2mm 0;
              padding-top: 2mm;
            }

            .row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 1mm;
            }

            .store-name {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 2mm;
            }

            .store-info {
              font-size: 8px;
              margin-bottom: 1mm;
            }

            .section {
              margin: 3mm 0;
            }

            .item {
              margin-bottom: 2mm;
            }

            .item-name {
              font-weight: bold;
              margin-bottom: 1mm;
            }

            .item-details {
              font-size: 8px;
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <!-- Store Header -->
            <div class="center section">
              <div class="store-name">KASIR PRO</div>
              <div class="store-info">SISTEM KASIR MODERN</div>
              <div class="store-info">Jl. Raya Teknologi No. 123</div>
              <div class="store-info">Kota Digital, 12345</div>
              <div class="store-info">Telp: (021) 1234-5678</div>
            </div>

            <!-- Transaction Info -->
            <div class="section dashed-border">
              <div class="row">
                <span>No. Struk</span>
                <span>${completedTransaction?.invoiceNumber || ''}</span>
              </div>
              <div class="row">
                <span>Tanggal</span>
                <span>${format(new Date(), "dd/MM/yyyy", { locale: localeID })}</span>
              </div>
              <div class="row">
                <span>Jam</span>
                <span>${format(new Date(), "HH:mm:ss", { locale: localeID })}</span>
              </div>
              <div class="row">
                <span>Kasir</span>
                <span>${user?.fullName || user?.username || "Admin"}</span>
              </div>
              <div class="row">
                <span>Pelanggan</span>
                <span>${completedTransaction?.customer ? completedTransaction.customer.nama : "Umum"}</span>
              </div>
            </div>

            <!-- Items Header -->
            <div class="section dashed-border">
              <div class="row bold">
                <span>ITEM</span>
                <span>QTY</span>
                <span>TOTAL</span>
              </div>
            </div>

            <!-- Items -->
            <div class="section">
              ${completedTransaction?.items.map((item: any) => `
                <div class="item">
                  <div class="item-name">${item.product.nama}</div>
                  <div class="item-details">
                    <div class="row">
                      <span>#${item.product.kode}</span>
                      <span>${item.quantity}</span>
                      <span>${formatCurrency(item.quantity * item.product.hargaJual)}</span>
                    </div>
                    <div style="font-size: 7px;">
                      ${formatCurrency(item.product.hargaJual)} x ${item.quantity}
                    </div>
                  </div>
                </div>
              `).join('') || ''}
            </div>

            <!-- Totals -->
            <div class="section dashed-border">
              <div class="row">
                <span>Sub Total:</span>
                <span>${formatCurrency(completedTransaction?.subtotal || 0)}</span>
              </div>
              ${completedTransaction?.discount > 0 ? `
                <div class="row">
                  <span>Diskon:</span>
                  <span>-${formatCurrency(completedTransaction.discount)}</span>
                </div>
              ` : ''}
              <div class="row bold" style="font-size: 12px; border-top: 1px dashed #000; padding-top: 1mm; margin-top: 2mm;">
                <span>TOTAL:</span>
                <span>${formatCurrency(completedTransaction?.total || 0)}</span>
              </div>
            </div>

            <!-- Payment -->
            <div class="section">
              <div class="row">
                <span>Bayar (${PAYMENT_METHODS.find(m => m.key === completedTransaction?.method)?.label || ''}):</span>
                <span>${formatCurrency(completedTransaction?.paid || 0)}</span>
              </div>
              <div class="row bold">
                <span>Kembalian:</span>
                <span>${formatCurrency(completedTransaction?.change || 0)}</span>
              </div>
            </div>

            <!-- Footer -->
            <div class="center section dashed-border">
              <div class="bold" style="margin-bottom: 2mm;">** TERIMA KASIH **</div>
              <div style="margin-bottom: 2mm;">Atas kunjungan Anda</div>
              <div style="font-size: 8px; margin-top: 3mm;">
                Struk ini adalah bukti pembayaran yang sah
              </div>
              <div style="font-size: 8px;">
                Dicetak: ${format(new Date(), "dd/MM/yyyy, HH:mm", { locale: localeID })}
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Create hidden iframe for printing
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-1000px';
    printFrame.style.left = '-1000px';
    printFrame.style.width = '1px';
    printFrame.style.height = '1px';
    printFrame.style.border = 'none';

    document.body.appendChild(printFrame);

    // Write content to iframe
    const frameDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(thermalHTML);
      frameDoc.close();

      // Wait for content to load then print
      setTimeout(() => {
        if (printFrame.contentWindow) {
          printFrame.contentWindow.focus();
          printFrame.contentWindow.print();

          // Clean up iframe after print
          setTimeout(() => {
            document.body.removeChild(printFrame);
          }, 1000);
        }
      }, 500);
    }
  };

  return (
    <>
      <form
        ref={formRef}
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
        className="flex h-full flex-col gap-4"
      >
        <div className="grid gap-2 text-xs uppercase tracking-wider text-slate-500">
          <div className="flex items-center justify-between text-slate-600">
            <span>Nomor</span>
            <span className="text-sm font-semibold text-slate-900">{invoiceNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tanggal</span>
            <span className="text-sm font-medium text-slate-900">
              {format(new Date(), "dd MMMM yyyy HH:mm", { locale: localeID })}
            </span>
          </div>
          <div className="flex items-start justify-between">
            <span>Pelanggan</span>
            <span className="max-w-[200px] text-right text-sm font-medium text-slate-900">
              {customer ? `${customer.nama} • ${customer.kode}` : "Umum"}
            </span>
          </div>
        </div>

        <PosInvoiceTable items={items} />

        <PosPaymentControls
          methods={PAYMENT_METHODS}
          activeMethod={method}
          onChangeMethod={setMethod}
          amount={amount}
          onChangeAmount={setAmount}
          discount={discount}
          onChangeDiscount={setDiscount}
          subtotal={subtotal}
          total={total}
          change={change}
          payButtonRef={payButtonRef}
          disabled={isSubmitting || !items.length}
        />
      </form>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200">
          <div className="mb-4">
            <DialogTitle className="flex items-center gap-2 text-xl text-emerald-700 mb-2">
              <CheckCircle className="h-6 w-6 text-emerald-500" />
              Konfirmasi Transaksi
            </DialogTitle>
            <DialogDescription className="text-base text-emerald-600">
              Pastikan detail transaksi sudah benar sebelum melanjutkan.
            </DialogDescription>
          </div>

          <div className="space-y-4 py-4">
            <div className="bg-white/80 backdrop-blur-sm p-4 space-y-3 rounded-lg border border-emerald-100 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-sm text-emerald-700 font-medium">Total Belanja</span>
                <span className="text-lg font-bold text-emerald-800">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700 font-medium">Uang Diterima</span>
                <span className="text-lg font-semibold text-blue-600">{formatCurrency(paid)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-emerald-200 pt-3">
                <span className="text-sm text-[#476EAE] font-medium">Kembalian</span>
                <span className="text-xl font-bold text-[#476EAE]">{formatCurrency(change)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span>Transaksi tidak dapat dibatalkan setelah dikonfirmasi</span>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmTransaction}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg"
            >
              {isSubmitting ? "Memproses..." : "Ya, Selesaikan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Modal */}
      {showInvoiceModal && completedTransaction && (
        <div className="fixed inset-0 z-50 bg-transparent flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative">
            {/* Invoice Content - Thermal Receipt Style */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 font-mono text-sm bg-white text-black" id="invoice-content">
                {/* Store Header */}
                <div className="text-center mb-4 border-dashed border-b-2 border-gray-300 pb-3">
                  <div className="bg-[#476EAE] text-white p-2 mb-2 -mx-4">
                    <h1 className="text-base font-bold tracking-wider">KASIR PRO</h1>
                    <p className="text-xs opacity-90 mt-1">SISTEM KASIR MODERN</p>
                  </div>
                  <div className="space-y-0.5 text-xs text-black">
                    <p className="font-semibold">Jl. Raya Teknologi No. 123</p>
                    <p>Kota Digital, 12345</p>
                    <p>Telp: (021) 1234-5678</p>
                  </div>
                </div>

                {/* Transaction Info */}
                <div className="space-y-1 mb-3 text-xs border-dashed border-b border-gray-300 pb-2">
                  <div className="flex justify-between text-black">
                    <span>No. Struk</span>
                    <span className="font-semibold">{completedTransaction.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between text-black">
                    <span>Tanggal</span>
                    <span>{format(new Date(), "dd/MM/yyyy", { locale: localeID })}</span>
                  </div>
                  <div className="flex justify-between text-black">
                    <span>Jam</span>
                    <span>{format(new Date(), "HH:mm:ss", { locale: localeID })}</span>
                  </div>
                  <div className="flex justify-between text-black">
                    <span>Kasir</span>
                    <span>{user?.fullName || user?.username || "Admin"}</span>
                  </div>
                  <div className="flex justify-between text-black">
                    <span>Pelanggan</span>
                    <span className="text-right max-w-[120px] truncate">
                      {completedTransaction.customer ? completedTransaction.customer.nama : "Umum"}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-3">
                  <div className="border-dashed border-b border-gray-300 pb-1 mb-1">
                    <div className="grid grid-cols-[1fr_auto_auto] gap-1 text-xs font-bold text-black">
                      <span>ITEM</span>
                      <span className="text-right">QTY</span>
                      <span className="text-right w-16">TOTAL</span>
                    </div>
                  </div>
                  {completedTransaction.items.map((item: any, index: number) => (
                    <div key={item.product.id} className={`mb-2 ${index % 2 === 0 ? 'bg-gray-50 -mx-1 px-1 py-0.5' : ''}`}>
                      <div className="font-semibold text-xs text-black mb-0.5 truncate">
                        {item.product.nama}
                      </div>
                      <div className="grid grid-cols-[1fr_auto_auto] gap-1 text-xs text-black">
                        <div>
                          <span className="text-black">#{item.product.kode}</span>
                          <br />
                          <span>{formatCurrency(item.product.hargaJual)} x {item.quantity}</span>
                        </div>
                        <span className="text-right font-medium">{item.quantity}</span>
                        <span className="text-right font-bold w-16">
                          {formatCurrency(item.quantity * item.product.hargaJual)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals Section */}
                <div className="border-dashed border-t-2 border-gray-400 pt-2 space-y-1">
                  <div className="flex justify-between text-xs text-black">
                    <span>Sub Total:</span>
                    <span className="font-semibold">{formatCurrency(completedTransaction.subtotal)}</span>
                  </div>
                  {completedTransaction.discount > 0 && (
                    <div className="flex justify-between text-xs text-black">
                      <span>Diskon:</span>
                      <span className="font-semibold">-{formatCurrency(completedTransaction.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold border-dashed border-t border-gray-300 pt-1 text-black">
                    <span>TOTAL:</span>
                    <span>{formatCurrency(completedTransaction.total)}</span>
                  </div>
                  <div className="bg-gray-100 -mx-4 px-4 py-1 space-y-0.5">
                    <div className="flex justify-between text-xs text-black">
                      <span>Bayar ({PAYMENT_METHODS.find(m => m.key === completedTransaction.method)?.label}):</span>
                      <span className="font-semibold">{formatCurrency(completedTransaction.paid)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-black">
                      <span>Kembalian:</span>
                      <span>{formatCurrency(completedTransaction.change)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-4 pt-3 border-dashed border-t-2 border-gray-300">
                  <div className="text-xs space-y-1 text-black">
                    <p className="font-semibold">** TERIMA KASIH **</p>
                    <p>Atas kunjungan Anda</p>
                    <p className="mt-2 text-xs text-black">
                      Struk ini adalah bukti pembayaran yang sah
                    </p>
                    <p className="text-xs text-black">
                      Dicetak pada: {format(new Date(), "dd/MM/yyyy, HH:mm", { locale: localeID })}
                    </p>
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="mt-3 flex justify-center">
                    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-xs text-black text-center leading-tight">
                      QR<br/>CODE
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-50 p-2 border-t flex gap-2 flex-shrink-0">
              <Button
                onClick={handlePrintReceipt}
                size="sm"
                className="flex-1 bg-[#476EAE] hover:bg-[#476EAE]/90 text-white gap-1 text-xs h-8"
              >
                <Printer className="w-3 h-3" />
                Cetak Struk
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInvoiceModal(false)}
                className="px-3 text-xs h-8"
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
