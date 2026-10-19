import React, { useState } from 'react';
import { ProduceListing, Order } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { storage } from '../../lib/storage';
import {
  TrendingUp,
  Package,
  PlusCircle,
  Clock,
  CheckCircle2,
  Truck,
  IndianRupee,
  ShieldCheck,
  AlertTriangle,
  FileText,
  MapPin,
  ExternalLink,
  Edit2,
  Trash2,
} from 'lucide-react';

interface FarmerDashboardProps {
  listings: ProduceListing[];
  orders: Order[];
  onOpenCreateModal: () => void;
  onOpenInvoiceModal: (order: Order) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  listings,
  orders,
  onOpenCreateModal,
  onOpenInvoiceModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'listings' | 'orders'>('listings');

  // Compute metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const totalBrokerLossAvoided = orders.reduce((sum, o) => sum + o.farmer_extra_earned, 0);
  const pendingOrders = orders.filter((o) => o.status === 'confirmed' || o.status === 'pending');
  const activeListingsCount = listings.filter((l) => l.status === 'active').length;

  const handleUpdateStatus = (orderId: string, nextStatus: Order['status']) => {
    storage.updateOrderStatus(orderId, nextStatus);
  };

  const handleToggleListingStatus = (listingId: string, current: string) => {
    const next = current === 'active' ? 'sold_out' : 'active';
    storage.updateListing(listingId, { status: next as any });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F2E1B] p-6 sm:p-8 rounded-3xl text-white border border-[#1F5C36]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#164327] text-[#A7DFB8] text-xs font-semibold">
            <span>👨‍🌾 Farmer Command Center</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#59BB7B]"></span>
            <span>Coastal FPO Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Devaki Poojary & Coastal Producer Circle
          </h1>
          <p className="text-xs sm:text-sm text-[#A7DFB8]">
            Mattu Padu, Kaup Taluk • Dakshina Kannada & Udupi Cooperative Member #DK-904
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#2D7A49] hover:bg-[#1F5C36] text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>List New Harvest Lot</span>
        </button>
      </div>

      {/* 2. Farmer Vital Stats Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Direct Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5DFCE] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#63675E] uppercase tracking-wider">
              Direct Gross Revenue
            </span>
            <div className="p-2 rounded-xl bg-[#E2F6EB] text-[#164327]">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0F2E1B]">
            {formatCurrency(totalRevenue)}
          </div>
          <span className="text-[11px] text-[#2D7A49] font-medium block">
            100% Direct to Farmer Bank Account
          </span>
        </div>

        {/* Broker Losses Avoided */}
        <div className="bg-white p-5 rounded-2xl border border-[#59BB7B]/40 shadow-xs space-y-1 bg-gradient-to-br from-white to-[#E2F6EB]/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#164327] uppercase tracking-wider">
              Broker Cut Recovered
            </span>
            <div className="p-2 rounded-xl bg-[#2D7A49] text-white">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#164327]">
            +{formatCurrency(totalBrokerLossAvoided)}
          </div>
          <span className="text-[11px] text-[#164327] font-bold block">
            Extra profit above APMC middleman rate
          </span>
        </div>

        {/* Active Produce Listings */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5DFCE] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#63675E] uppercase tracking-wider">
              Active Produce Lots
            </span>
            <div className="p-2 rounded-xl bg-[#FAF7F0] text-[#0F2E1B]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0F2E1B]">{activeListingsCount}</div>
          <span className="text-[11px] text-[#63675E] font-medium block">
            Live on buyer marketplace
          </span>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5DFCE] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#63675E] uppercase tracking-wider">
              Orders to Fulfill
            </span>
            <div className="p-2 rounded-xl bg-[#FEF3C7] text-[#D97706]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#D97706]">{pendingOrders.length}</div>
          <span className="text-[11px] text-[#63675E] font-medium block">
            Awaiting harvest packing / transit
          </span>
        </div>
      </div>

      {/* 3. Sub-Tab Switcher (Listings vs Orders) */}
      <div className="flex items-center gap-2 border-b border-[#E5DFCE] pb-3">
        <button
          onClick={() => setActiveSubTab('listings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'listings'
              ? 'bg-[#164327] text-white shadow-xs'
              : 'text-[#63675E] hover:bg-[#FAF7F0]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Farm Produce Inventory ({listings.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'orders'
              ? 'bg-[#164327] text-white shadow-xs'
              : 'text-[#63675E] hover:bg-[#FAF7F0]'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Incoming Buyer Orders ({orders.length})</span>
          {pendingOrders.length > 0 && (
            <span className="bg-[#D97706] text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {pendingOrders.length} new
            </span>
          )}
        </button>
      </div>

      {/* 4. Active Produce Inventory Table */}
      {activeSubTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-[#E5DFCE] shadow-xs overflow-hidden">
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5DFCE]">
            <div>
              <h3 className="text-lg font-bold text-[#0F2E1B]">
                Active Coastal Harvest Inventory
              </h3>
              <p className="text-xs text-[#63675E]">
                Set your direct price. No broker commissions, APMC cess deducted.
              </p>
            </div>
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#164327] text-white text-xs font-bold"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Harvest Lot</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F0] text-[#63675E] uppercase text-[10px] tracking-wider border-b border-[#E5DFCE]">
                <tr>
                  <th className="py-3 px-5 font-semibold">Crop & Variety</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Harvest Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Available Lot</th>
                  <th className="py-3 px-4 font-semibold text-right">Your Direct Price</th>
                  <th className="py-3 px-4 font-semibold text-right">Mandi Benchmark</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFCE]">
                {listings.map((l) => (
                  <tr key={l.id} className="hover:bg-[#FAF7F0]/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={l.photos[0]}
                          alt={l.crop_name}
                          className="w-10 h-10 rounded-lg object-cover border border-[#E5DFCE]"
                        />
                        <div>
                          <span className="font-bold text-[#0F2E1B] block">{l.crop_name}</span>
                          <span className="text-[11px] text-[#63675E] block">
                            {l.variety} • {l.grade}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#1C1D1A]">
                      {l.village}, {l.taluk}
                    </td>
                    <td className="py-3.5 px-4 text-[#84897E]">{formatDate(l.harvest_date)}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#1C1D1A]">
                      {l.available_qty} {l.unit}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-[#164327]">
                      {formatCurrency(l.farmer_price_per_unit)}/{l.unit}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[#63675E]">
                      {formatCurrency(l.mandi_benchmark_price)}/{l.unit}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          l.status === 'active'
                            ? 'bg-[#E2F6EB] text-[#164327]'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {l.status === 'active' ? 'Active' : 'Sold Out'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleToggleListingStatus(l.id, l.status)}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#FAF7F0] hover:bg-[#F2EEE2] border border-[#E5DFCE] text-[#444740] transition-colors"
                      >
                        {l.status === 'active' ? 'Mark Sold' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Incoming Buyer Orders Table */}
      {activeSubTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-[#E5DFCE] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#E5DFCE]">
            <h3 className="text-lg font-bold text-[#0F2E1B]">
              Direct Purchase Contracts & Fulfillment
            </h3>
            <p className="text-xs text-[#63675E]">
              Track buyers, approve harvest dispatch, and view direct payment receipts.
            </p>
          </div>

          <div className="divide-y divide-[#E5DFCE]">
            {orders.map((order) => (
              <div key={order.id} className="p-5 hover:bg-[#FAF7F0]/50 transition-colors space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#0F2E1B] bg-[#F2EEE2] px-2.5 py-1 rounded-md">
                      {order.order_number}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-[#0F2E1B]">{order.buyer_name}</h4>
                      <span className="text-xs text-[#63675E]">
                        {order.buyer_type.toUpperCase()} • Ph: {order.buyer_phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'delivered'
                          ? 'bg-[#E2F6EB] text-[#164327]'
                          : order.status === 'in_transit'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-[#FEF3C7] text-[#92400E]'
                      }`}
                    >
                      ● Status: {order.status.toUpperCase()}
                    </span>

                    <button
                      onClick={() => onOpenInvoiceModal(order)}
                      className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-[#FAF7F0] hover:bg-[#F2EEE2] border border-[#E5DFCE] text-[#444740]"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#2D7A49]" />
                      <span>Invoice</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF7F0] p-3.5 rounded-2xl border border-[#E5DFCE] text-xs">
                  <div>
                    <span className="text-[#84897E] text-[10px] block uppercase font-semibold">
                      Crop & Lot
                    </span>
                    <span className="font-bold text-[#1C1D1A]">
                      {order.quantity} {order.unit} • {order.crop_name}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#84897E] text-[10px] block uppercase font-semibold">
                      Total Payout
                    </span>
                    <span className="font-extrabold text-[#164327]">
                      {formatCurrency(order.total_amount)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#84897E] text-[10px] block uppercase font-semibold">
                      Broker Loss Avoided
                    </span>
                    <span className="font-bold text-[#2D7A49]">
                      +{formatCurrency(order.farmer_extra_earned)} extra
                    </span>
                  </div>

                  <div>
                    <span className="text-[#84897E] text-[10px] block uppercase font-semibold">
                      Logistics Mode
                    </span>
                    <span className="font-medium text-[#1C1D1A]">
                      {order.delivery_type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {order.notes && (
                  <p className="text-xs text-[#63675E] italic">
                    Buyer Note: "{order.notes}"
                  </p>
                )}

                {/* Progress / Transition Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-[#84897E] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#2D7A49]" />
                    <span>Destination: {order.delivery_address} ({order.delivery_taluk})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'harvested')}
                        className="px-3 py-1.5 bg-[#2D7A49] hover:bg-[#1F5C36] text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        ✓ Mark Harvested & Packed
                      </button>
                    )}
                    {order.status === 'harvested' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'in_transit')}
                        className="px-3 py-1.5 bg-[#164327] hover:bg-[#0F2E1B] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Dispatch with Van</span>
                      </button>
                    )}
                    {order.status === 'in_transit' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'delivered')}
                        className="px-3 py-1.5 bg-[#164327] hover:bg-[#0F2E1B] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#59BB7B]" />
                        <span>Confirm Delivered</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
