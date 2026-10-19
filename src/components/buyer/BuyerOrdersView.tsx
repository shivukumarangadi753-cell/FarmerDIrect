import React from 'react';
import { Order } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  PhoneCall,
  MessageSquare,
  FileText,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface BuyerOrdersViewProps {
  orders: Order[];
  onOpenInvoiceModal: (order: Order) => void;
  onBrowseMarketplace: () => void;
}

export const BuyerOrdersView: React.FC<BuyerOrdersViewProps> = ({
  orders,
  onOpenInvoiceModal,
  onBrowseMarketplace,
}) => {
  const totalSpent = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const totalSaved = orders.reduce((sum, o) => sum + o.buyer_saved, 0);

  const getStepNumber = (status: Order['status']): number => {
    switch (status) {
      case 'confirmed':
        return 1;
      case 'harvested':
        return 2;
      case 'in_transit':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Header Banner */}
      <div className="bg-[#0F2E1B] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-[#1F5C36]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#164327] text-[#A7DFB8] text-xs font-semibold">
              <ShoppingBag className="w-3.5 h-3.5 text-[#59BB7B]" />
              <span>Direct Harvest Orders & Delivery Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Track Fresh Coastal Produce Orders
            </h1>
            <p className="text-xs sm:text-sm text-[#A7DFB8]/90 leading-relaxed">
              Real-time harvest status, direct farmer communication, and zero-broker direct farm receipts.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <span className="text-[10px] text-[#A7DFB8] uppercase tracking-wider block">
                Total Direct Purchases
              </span>
              <span className="text-xl font-black text-white">{formatCurrency(totalSpent)}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#E2F6EB] text-center">
              <span className="text-[10px] text-[#164327] uppercase tracking-wider block font-bold">
                Total Saved vs Retail
              </span>
              <span className="text-xl font-black text-[#164327]">+{formatCurrency(totalSaved)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E5DFCE] space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F0] flex items-center justify-center mx-auto text-[#2D7A49]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#0F2E1B]">No Direct Orders Yet</h3>
          <p className="text-xs text-[#63675E] max-w-md mx-auto">
            Support coastal Karnataka farmers in Mattu, Belthangady, Sullia, and Puttur by ordering fresh produce directly!
          </p>
          <button
            onClick={onBrowseMarketplace}
            className="px-6 py-2.5 rounded-xl bg-[#164327] text-white text-xs font-bold hover:bg-[#0F2E1B] transition-colors"
          >
            Explore Direct Marketplace
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const step = getStepNumber(order.status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-[#E5DFCE] shadow-xs overflow-hidden p-6 sm:p-7 space-y-6"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DFCE]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#0F2E1B] bg-[#FAF7F0] px-2.5 py-1 rounded-md border border-[#E5DFCE]">
                        {order.order_number}
                      </span>
                      <span className="text-xs text-[#84897E]">
                        Placed on {formatDate(order.created_at)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#0F2E1B]">
                      {order.crop_name} ({order.quantity} {order.unit})
                    </h3>
                    <p className="text-xs text-[#63675E]">
                      Producer: <strong className="text-[#1C1D1A]">{order.farmer_name}</strong> • Coastal Producer Hub
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="text-right">
                      <span className="text-xs text-[#84897E] block">Total Amount</span>
                      <span className="text-xl font-black text-[#164327]">
                        {formatCurrency(order.total_amount)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#D97706] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full">
                        Saved {formatCurrency(order.buyer_saved)}
                      </span>
                      <button
                        onClick={() => onOpenInvoiceModal(order)}
                        className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-[#FAF7F0] hover:bg-[#F2EEE2] border border-[#E5DFCE] text-[#444740]"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#2D7A49]" />
                        <span>View Memo</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4-Step Interactive Tracking Bar */}
                <div className="bg-[#FAF7F0] p-4 sm:p-5 rounded-2xl border border-[#E5DFCE]">
                  <span className="text-[10px] font-bold text-[#84897E] uppercase tracking-wider block mb-4">
                    Live Farm-to-Door Journey
                  </span>

                  <div className="grid grid-cols-4 gap-2 relative">
                    {/* Connecting line */}
                    <div className="absolute top-3.5 left-6 right-6 h-0.5 bg-[#E5DFCE] -z-0" />

                    {/* Step 1: Confirmed */}
                    <div className="flex flex-col items-center text-center relative z-10">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          step >= 1 ? 'bg-[#164327] text-white' : 'bg-[#E5DFCE] text-[#84897E]'
                        }`}
                      >
                        ✓
                      </div>
                      <span className="text-[11px] font-bold text-[#0F2E1B] mt-2">Deal Confirmed</span>
                      <span className="text-[10px] text-[#84897E] hidden sm:block">Direct match</span>
                    </div>

                    {/* Step 2: Harvested */}
                    <div className="flex flex-col items-center text-center relative z-10">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          step >= 2 ? 'bg-[#164327] text-white' : 'bg-[#E5DFCE] text-[#84897E]'
                        }`}
                      >
                        {step >= 2 ? '✓' : '2'}
                      </div>
                      <span className="text-[11px] font-bold text-[#0F2E1B] mt-2">Fresh Harvested</span>
                      <span className="text-[10px] text-[#84897E] hidden sm:block">Packed at farm</span>
                    </div>

                    {/* Step 3: In Transit */}
                    <div className="flex flex-col items-center text-center relative z-10">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          step >= 3 ? 'bg-[#164327] text-white' : 'bg-[#E5DFCE] text-[#84897E]'
                        }`}
                      >
                        {step >= 3 ? '✓' : '3'}
                      </div>
                      <span className="text-[11px] font-bold text-[#0F2E1B] mt-2">In Transit</span>
                      <span className="text-[10px] text-[#84897E] hidden sm:block">Local coastal van</span>
                    </div>

                    {/* Step 4: Delivered */}
                    <div className="flex flex-col items-center text-center relative z-10">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          step >= 4 ? 'bg-[#164327] text-white' : 'bg-[#E5DFCE] text-[#84897E]'
                        }`}
                      >
                        {step >= 4 ? '✓' : '4'}
                      </div>
                      <span className="text-[11px] font-bold text-[#0F2E1B] mt-2">Delivered</span>
                      <span className="text-[10px] text-[#84897E] hidden sm:block">Completed</span>
                    </div>
                  </div>
                </div>

                {/* Logistics & Direct Contact Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs pt-2">
                  <div className="flex items-center gap-2 text-[#63675E]">
                    <MapPin className="w-4 h-4 text-[#2D7A49]" />
                    <span>
                      Delivery: <strong>{order.delivery_address}</strong> ({order.delivery_taluk}) via{' '}
                      <strong>{order.delivery_type.replace('_', ' ').toUpperCase()}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${order.farmer_phone}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F0] hover:bg-[#F2EEE2] border border-[#E5DFCE] font-semibold text-[#1C1D1A]"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#2D7A49]" />
                      <span>Call Farmer ({order.farmer_name})</span>
                    </a>
                    <a
                      href={`https://wa.me/91${order.farmer_phone}?text=Hello%20${encodeURIComponent(
                        order.farmer_name
                      )},%20regarding%20order%20${order.order_number}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E2F6EB] hover:bg-[#D8F3DC] border border-[#59BB7B]/40 font-semibold text-[#164327]"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#2D7A49]" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
