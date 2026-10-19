import React from 'react';
import { Order } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { X, Printer, ShieldCheck, CheckCircle2, Download, QrCode } from 'lucide-react';
import { Logo } from '../common/Logo';

interface OrderInvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#E5DFCE] shadow-2xl overflow-hidden my-6">
        {/* Top Controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAF7F0] border-b border-[#E5DFCE]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2D7A49]" />
            <span className="text-xs font-bold text-[#0F2E1B] uppercase tracking-wider">
              Official Direct Agricultural Sale Memo
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#164327] hover:bg-[#0F2E1B] text-white text-xs font-bold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Bill</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#E5DFCE] text-[#63675E] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document */}
        <div className="p-8 space-y-6 text-[#1C1D1A]" id="printable-invoice">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#E5DFCE]">
            <div>
              <Logo size="md" showTagline={false} />
              <p className="text-xs text-[#63675E] mt-1">
                Direct Farm-to-Buyer Network • DK & Udupi, Karnataka
              </p>
              <p className="text-[11px] text-[#84897E]">
                Under Karnataka Agricultural Produce Marketing (Regulation) Exemption
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-xs text-[#84897E] uppercase block font-semibold">Memo Ref #</span>
              <span className="font-mono font-bold text-sm text-[#0F2E1B]">{order.order_number}</span>
              <span className="text-xs text-[#63675E] block mt-1">Date: {formatDate(order.created_at)}</span>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E2F6EB] text-[#164327]">
                Payment: {order.payment_status.toUpperCase()} ({order.payment_method.replace('_', ' ').toUpperCase()})
              </span>
            </div>
          </div>

          {/* Farmer & Buyer Addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Farmer / Producer */}
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E5DFCE] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#2D7A49] tracking-wider block">
                Direct Producer (Farmer)
              </span>
              <div className="font-bold text-sm text-[#0F2E1B]">{order.farmer_name}</div>
              <div className="text-[#63675E]">Registered Coastal Producer Circle</div>
              <div className="text-[#63675E]">Phone: +91 {order.farmer_phone}</div>
              <div className="text-[#84897E] text-[11px] pt-1">
                Farm Gate: Dakshina Kannada / Udupi Belt
              </div>
            </div>

            {/* Buyer */}
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E5DFCE] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#63675E] tracking-wider block">
                Consignee / Buyer
              </span>
              <div className="font-bold text-sm text-[#0F2E1B]">{order.buyer_name}</div>
              <div className="text-[#63675E]">Category: {order.buyer_type.toUpperCase()}</div>
              <div className="text-[#63675E]">Phone: +91 {order.buyer_phone}</div>
              <div className="text-[#84897E] text-[11px] pt-1">
                Delivery: {order.delivery_address} ({order.delivery_taluk})
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-[#E5DFCE] rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F0] text-[#63675E] uppercase text-[10px] font-semibold border-b border-[#E5DFCE]">
                <tr>
                  <th className="py-3 px-4">Agricultural Commodity</th>
                  <th className="py-3 px-3 text-center">Lot Quantity</th>
                  <th className="py-3 px-3 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFCE]">
                <tr>
                  <td className="py-4 px-4">
                    <span className="font-bold text-sm text-[#0F2E1B] block">{order.crop_name}</span>
                    <span className="text-xs text-[#63675E]">{order.variety}</span>
                  </td>
                  <td className="py-4 px-3 text-center font-mono font-bold text-sm">
                    {order.quantity} {order.unit}
                  </td>
                  <td className="py-4 px-3 text-right font-mono font-medium">
                    {formatCurrency(order.unit_price)}/{order.unit}
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-base text-[#164327]">
                    {formatCurrency(order.total_amount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Transparency Summary Breakdown */}
          <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#E5DFCE] space-y-2 text-xs">
            <div className="flex justify-between text-[#63675E]">
              <span>Subtotal Produce Value:</span>
              <span className="font-mono font-semibold">{formatCurrency(order.total_amount)}</span>
            </div>
            <div className="flex justify-between text-[#63675E]">
              <span>Middleman Brokerage / APMC Commission:</span>
              <span className="font-mono font-bold text-[#2D7A49]">₹0 (Direct Exemption)</span>
            </div>
            <div className="flex justify-between text-[#63675E]">
              <span>Logistics Mode:</span>
              <span className="font-mono">{order.delivery_type.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-[#0F2E1B] font-bold text-sm pt-2 border-t border-[#E5DFCE]">
              <span>Net Paid to Producer:</span>
              <span className="font-mono text-base text-[#164327]">{formatCurrency(order.total_amount)}</span>
            </div>
          </div>

          {/* Value Created Footnote */}
          <div className="p-3.5 rounded-xl bg-[#E2F6EB] text-[#164327] text-xs flex items-center justify-between">
            <span className="font-medium">
              Win-Win Transaction: Farmer earned <strong>+{formatCurrency(order.farmer_extra_earned)} extra</strong>; Buyer saved <strong>{formatCurrency(order.buyer_saved)}</strong> vs commercial retail.
            </span>
            <CheckCircle2 className="w-5 h-5 text-[#2D7A49] shrink-0" />
          </div>

          {/* Legal Exemption Notice */}
          <div className="text-[10px] text-[#84897E] text-center leading-relaxed pt-2">
            This direct agricultural sale invoice is generated by FarmDirect under the Direct-to-Consumer Agricultural Marketing guidelines of Karnataka. 100% of proceeds go directly to the registered producer.
          </div>
        </div>
      </div>
    </div>
  );
};
