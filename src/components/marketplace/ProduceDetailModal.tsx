import React from 'react';
import { ProduceListing } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import {
  X,
  MapPin,
  Award,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  Scale,
  ShoppingCart,
} from 'lucide-react';

interface ProduceDetailModalProps {
  produce: ProduceListing | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenOrder: (produce: ProduceListing) => void;
}

export const ProduceDetailModal: React.FC<ProduceDetailModalProps> = ({
  produce,
  isOpen,
  onClose,
  onOpenOrder,
}) => {
  if (!isOpen || !produce) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF7F0] rounded-lg border border-[#E5DFCE] shadow-xl overflow-hidden my-6">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-md bg-black/50 hover:bg-black/70 text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Image Section */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-[#0F2E1B]">
          <img
            src={produce.photos[0]}
            alt={produce.crop_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

          {/* Badges Overlay */}
          <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-end justify-between gap-2 text-white">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                {produce.gi_tagged && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#D97706] text-white">
                    <Award className="w-3 h-3" />
                    <span>{produce.gi_tag_name || 'GI Tagged'}</span>
                  </span>
                )}
                {produce.organic_certified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#164327] text-[#D8F3DC]">
                    <CheckCircle2 className="w-3 h-3 text-[#59BB7B]" />
                    <span>Certified Organic</span>
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                {produce.crop_name}
              </h2>
              {produce.crop_kannada_name && (
                <p className="text-xs text-[#A7DFB8] font-medium">{produce.crop_kannada_name}</p>
              )}
            </div>

            <div className="bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-md border border-white/20 text-right">
              <span className="text-[10px] text-[#A7DFB8] block">Farmer Direct Price</span>
              <span className="text-xl font-bold text-white">
                {formatCurrency(produce.farmer_price_per_unit)}
              </span>
              <span className="text-xs text-white/80"> /{produce.unit}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
          {/* 1. Farmer Profile Card & Direct Contact */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white rounded-md border border-[#E5DFCE] gap-3">
            <div className="flex items-center gap-3">
              <img
                src={produce.farmer_avatar || '/images_farm/farmer-1.jpg'}
                alt={produce.farmer_name}
                className="w-10 h-10 rounded-full object-cover border border-[#164327]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-[#0F2E1B]">
                    {produce.farmer_name}
                  </h4>
                  <span className="text-[10px] font-bold bg-[#FEF3C7] text-[#92400E] px-1.5 py-0.5 rounded">
                    ★ {produce.rating}
                  </span>
                </div>
                <p className="text-[11px] text-[#63675E] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#2D7A49]" />
                  <span>
                    {produce.village}, {produce.taluk} Taluk, {produce.district}
                  </span>
                </p>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="flex items-center gap-2">
              <a
                href={`tel:${produce.farmer_phone}`}
                className="h-8 flex items-center gap-1.5 px-3 rounded-md bg-[#FAF7F0] hover:bg-[#F2EEE2] border border-[#E5DFCE] text-xs font-semibold text-[#1C1D1A] transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#2D7A49]" />
                <span>Call Farmer</span>
              </a>
              <a
                href={`https://wa.me/91${produce.farmer_phone}?text=Hello%20${encodeURIComponent(
                  produce.farmer_name
                )},%20I%20saw%20your%20listing%20for%20${encodeURIComponent(
                  produce.crop_name
                )}%20on%20FarmDirect.`}
                target="_blank"
                rel="noreferrer"
                className="h-8 flex items-center gap-1.5 px-3 rounded-md bg-[#E2F6EB] hover:bg-[#D8F3DC] border border-[#59BB7B]/40 text-xs font-semibold text-[#164327] transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#2D7A49]" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* 2. Story & Agronomic Details */}
          <div className="bg-white p-4 rounded-md border border-[#E5DFCE] space-y-2">
            <h4 className="text-xs font-bold text-[#1C1D1A] uppercase tracking-wider">
              Harvest Details
            </h4>
            <p className="text-xs leading-relaxed text-[#444740]">
              {produce.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#E5DFCE] text-xs">
              <div>
                <span className="text-[#84897E] text-[10px] block uppercase font-semibold">Variety</span>
                <span className="font-bold text-[#1C1D1A]">{produce.variety}</span>
              </div>
              <div>
                <span className="text-[#84897E] text-[10px] block uppercase font-semibold">Grade</span>
                <span className="font-bold text-[#1C1D1A]">{produce.grade}</span>
              </div>
              <div>
                <span className="text-[#84897E] text-[10px] block uppercase font-semibold">Harvest Date</span>
                <span className="font-bold text-[#1C1D1A]">{formatDate(produce.harvest_date)}</span>
              </div>
              <div>
                <span className="text-[#84897E] text-[10px] block uppercase font-semibold">Min Lot Size</span>
                <span className="font-bold text-[#1C1D1A]">
                  {produce.min_order_qty} {produce.unit}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Transparent Mandi Price Comparison */}
          <div className="bg-white p-4 rounded-md border border-[#E5DFCE] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#1C1D1A] uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-[#2D7A49]" />
                <span>Price Comparison (Where Available)</span>
              </h4>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-md bg-[#FAF7F0] border border-[#E5DFCE]">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  <span className="text-[10px] text-[#63675E] font-medium uppercase">
                    Live Mandi Benchmark
                  </span>
                </div>
                <span className="text-sm font-bold text-[#1C1D1A]">
                  {formatCurrency(produce.mandi_benchmark_price)}/{produce.unit}
                </span>
                <span className="text-[9px] text-[#2D7A49] block mt-0.5">Agmarknet Live API</span>
              </div>

              <div className="p-2.5 rounded-md bg-[#E2F6EB] border border-[#2D7A49]">
                <span className="text-[10px] text-[#164327] font-bold block uppercase">
                  Farmer Direct (Here)
                </span>
                <span className="text-base font-extrabold text-[#164327]">
                  {formatCurrency(produce.farmer_price_per_unit)}/{produce.unit}
                </span>
              </div>

              <div className="p-2.5 rounded-md bg-[#FAF7F0] border border-[#E5DFCE]">
                <span className="text-[10px] text-[#63675E] font-medium block uppercase">
                  Retail Market Est.
                </span>
                <span className="text-sm font-semibold text-[#63675E]">
                  {formatCurrency(produce.retail_market_estimate)}/{produce.unit}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#84897E] leading-relaxed">
              Mandi prices reference official Agmarknet wholesale reports where available. By purchasing directly from {produce.farmer_name}, buyers bypass commercial distribution tiers.
            </p>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="flex items-center justify-between p-3.5 px-5 bg-white border-t border-[#E5DFCE]">
          <div>
            <span className="text-[11px] text-[#63675E] block">Available:</span>
            <span className="text-xs font-bold text-[#0F2E1B]">
              {produce.available_qty} {produce.unit} in {produce.village}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="h-9 px-3 rounded-md border border-[#E5DFCE] text-xs font-semibold text-[#63675E] hover:bg-[#F2EEE2]"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenOrder(produce);
              }}
              className="h-9 flex items-center gap-1.5 px-4 rounded-md bg-[#164327] hover:bg-[#0F2E1B] text-white text-xs font-bold transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-[#59BB7B]" />
              <span>Order Direct Lot</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
