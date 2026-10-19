import React from 'react';
import { ProduceListing } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { MapPin, Award, CheckCircle2, ShoppingCart, Info, Clock } from 'lucide-react';
import { useLanguage } from '../../lib/language';

interface ProduceCardProps {
  produce: ProduceListing;
  onBuyDirect: (produce: ProduceListing) => void;
  onViewDetails: (produce: ProduceListing) => void;
}

export const ProduceCard: React.FC<ProduceCardProps> = ({
  produce,
  onBuyDirect,
  onViewDetails,
}) => {
  const { lang, t } = useLanguage();

  const farmerGainVsTrader = Math.round(
    ((produce.farmer_price_per_unit - produce.middleman_trader_price) /
      produce.middleman_trader_price) *
      100
  );

  const buyerSavingVsRetail = Math.round(
    ((produce.retail_market_estimate - produce.farmer_price_per_unit) /
      produce.retail_market_estimate) *
      100
  );

  const isSoldOut = produce.status === 'sold_out' || produce.available_qty <= 0;

  return (
    <div className="group relative flex flex-col bg-white rounded-lg border border-[#E5DFCE] hover:border-[#2D7A49]/50 transition-colors overflow-hidden">
      {/* 1. Image & Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F2EEE2]">
        <img
          src={produce.photos[0] || '/images_farm/mattu-gulla.jpg'}
          alt={produce.crop_name}
          className="h-full w-full object-cover object-center"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1.5 pointer-events-none">
          <div className="flex flex-col gap-1 items-start">
            {produce.gi_tagged && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#D97706] text-white">
                <Award className="w-3 h-3" />
                <span>GI Tagged</span>
              </span>
            )}
            {produce.organic_certified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#164327] text-white">
                <CheckCircle2 className="w-3 h-3 text-[#59BB7B]" />
                <span>Organic</span>
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-white/95 text-[#1C1D1A] border border-[#E5DFCE]">
            <Clock className="w-3 h-3 text-[#63675E]" />
            <span>{formatDate(produce.harvest_date)}</span>
          </span>
        </div>

        {/* Location Tag */}
        <div className="absolute bottom-2 left-2.5 pointer-events-none">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/70 text-white text-[11px] font-medium">
            <MapPin className="w-3 h-3 text-[#8AD3A4]" />
            <span>
              {produce.village}, {produce.taluk}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Farmer Header */}
        <div className="flex items-center gap-2 mb-2">
          <img
            src={produce.farmer_avatar || '/images_farm/farmer-1.jpg'}
            alt={produce.farmer_name}
            className="w-6 h-6 rounded-full object-cover border border-[#E5DFCE]"
          />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-[#1C1D1A] truncate block">
              {produce.farmer_name}
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#D97706] bg-[#FEF3C7] px-1.5 py-0.5 rounded">
            ★ {produce.rating.toFixed(1)}
          </span>
        </div>

        {/* Crop Title */}
        <div className="mb-2.5">
          <h3 className="text-base font-bold text-[#0F2E1B] leading-tight group-hover:text-[#2D7A49] transition-colors">
            {produce.crop_name}
          </h3>
          {produce.crop_kannada_name && (
            <p className="text-xs text-[#63675E] font-medium mt-0.5">
              {produce.crop_kannada_name}
            </p>
          )}
          <p className="text-[11px] text-[#84897E] line-clamp-1 mt-0.5">
            {produce.variety} • {produce.grade}
          </p>
        </div>

        {/* Price Discovery Box */}
        <div className="mt-auto bg-[#FAF7F0] rounded-md p-2.5 border border-[#E5DFCE] space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold text-[#444740]">Farmer Price:</span>
            <div className="text-right">
              <span className="text-lg font-bold text-[#164327]">
                {formatCurrency(produce.farmer_price_per_unit)}
              </span>
              <span className="text-xs text-[#63675E]"> /{produce.unit}</span>
            </div>
          </div>

          {/* Comparative Benchmarks */}
          <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-[#E5DFCE] text-[11px]">
            <div className="bg-white p-1 rounded border border-[#E5DFCE]/80">
              <span className="text-[#63675E] flex items-center gap-1 text-[10px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                <span>Live Mandi</span>
              </span>
              <span className="font-semibold text-[#1C1D1A]">
                {formatCurrency(produce.mandi_benchmark_price)}/{produce.unit}
              </span>
            </div>
            <div className="bg-white p-1 rounded border border-[#E5DFCE]/80">
              <span className="text-[#84897E] block text-[10px]">Retail Market</span>
              <span className="font-semibold text-[#63675E]">
                {formatCurrency(produce.retail_market_estimate)}/{produce.unit}
              </span>
            </div>
          </div>
        </div>

        {/* Stock info */}
        <div className="flex items-center justify-between text-xs text-[#63675E] mt-2.5 mb-3">
          <span>
            Available: <strong>{produce.available_qty} {produce.unit}</strong>
          </span>
          <span>
            Min lot: <strong>{produce.min_order_qty} {produce.unit}</strong>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewDetails(produce)}
            className="h-9 flex items-center justify-center gap-1 rounded-md border border-[#E5DFCE] hover:bg-[#F2EEE2] text-xs font-semibold text-[#444740] transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-[#2D7A49]" />
            <span>Details</span>
          </button>

          <button
            onClick={() => onBuyDirect(produce)}
            disabled={isSoldOut}
            className={`h-9 flex items-center justify-center gap-1 rounded-md text-xs font-bold transition-colors ${
              isSoldOut
                ? 'bg-[#E5DFCE] text-[#84897E] cursor-not-allowed'
                : 'bg-[#164327] hover:bg-[#0F2E1B] text-white'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5 text-[#59BB7B]" />
            <span>{isSoldOut ? 'Sold Out' : 'Buy Direct'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
