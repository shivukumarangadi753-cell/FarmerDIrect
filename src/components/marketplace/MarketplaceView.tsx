import React, { useState, useMemo } from 'react';
import { ProduceListing } from '../../types';
import { ProduceCard } from './ProduceCard';
import { ProduceFilter } from './ProduceFilter';
import { useLanguage } from '../../lib/language';
import {
  ShieldCheck,
  Scale,
  Store,
  MapPin,
} from 'lucide-react';

interface MarketplaceViewProps {
  listings: ProduceListing[];
  onBuyDirect: (produce: ProduceListing) => void;
  onViewDetails: (produce: ProduceListing) => void;
  onOpenCreateListing: () => void;
  onOpenMandiTracker: () => void;
  liveStatus?: string;
  lastFetchedAt?: string;
  totalLiveRecords?: number;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  listings,
  onBuyDirect,
  onViewDetails,
  onOpenCreateListing,
  onOpenMandiTracker,
  liveStatus = 'LIVE',
  lastFetchedAt,
  totalLiveRecords = 52,
}) => {
  const { lang, t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTaluk, setSelectedTaluk] = useState('all');
  const [onlyGI, setOnlyGI] = useState(false);
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Filter & Sort Logic
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        const matchesSearch =
          searchTerm === '' ||
          item.crop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.taluk.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.crop_kannada_name && item.crop_kannada_name.includes(searchTerm));

        const matchesCategory =
          selectedCategory === 'all' || item.crop_category === selectedCategory;

        const matchesTaluk = selectedTaluk === 'all' || item.taluk === selectedTaluk;
        const matchesGI = !onlyGI || item.gi_tagged;
        const matchesOrganic = !onlyOrganic || item.organic_certified;

        return matchesSearch && matchesCategory && matchesTaluk && matchesGI && matchesOrganic;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') {
          return a.farmer_price_per_unit - b.farmer_price_per_unit;
        }
        if (sortBy === 'price_desc') {
          return b.farmer_price_per_unit - a.farmer_price_per_unit;
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        return new Date(b.harvest_date).getTime() - new Date(a.harvest_date).getTime();
      });
  }, [
    listings,
    searchTerm,
    selectedCategory,
    selectedTaluk,
    onlyGI,
    onlyOrganic,
    sortBy,
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Real-time Live Mandi Pricing Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg bg-[#164327] text-white border border-[#2D7A49] shadow-xs text-xs">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-[#A7DFB8] tracking-wide text-[11px]">
            LIVE TIME PRICING ACTIVE
          </span>
          <span className="text-white/40 hidden sm:inline">|</span>
          <span className="text-[#FAF7F0] hidden sm:inline">
            Official Data.gov.in (Agmarknet) Connected
          </span>
          <span className="text-[#8AD3A4] font-medium">
            ({totalLiveRecords} Live APMC Benchmarks)
          </span>
        </div>
        <div className="flex items-center gap-2">
          {lastFetchedAt && (
            <span className="text-[11px] text-[#D0C8B3]">
              Synced: {lastFetchedAt}
            </span>
          )}
          <button
            onClick={onOpenMandiTracker}
            className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-[#A7DFB8] hover:text-white text-[11px] font-medium transition-colors"
          >
            Mandi Price Tracker &rarr;
          </button>
        </div>
      </div>

      {/* 1. Hero Section: Modest 6-8px radius, Inter font, reduced headline, no sparkle, no artificial stats */}
      <section className="rounded-lg bg-[#0F2E1B] text-[#FAF7F0] border border-[#1F5C36] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 lg:p-10 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#164327] border border-[#1F5C36] text-[#A7DFB8] text-xs font-medium">
              <span>Dakshina Kannada & Udupi Coastal Marketplace</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                Fair Prices. Fresh Produce. <span className="text-[#8AD3A4]">Direct Connections.</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#D0C8B3] leading-relaxed max-w-xl">
                Connecting marginal coastal farmers in Mattu, Puttur, Belthangady, and Sullia directly with households, restaurants, and bulk buyers. Produce prices are compared with official mandi prices where available.
              </p>
            </div>

            {/* Restrained CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => {
                  const filterEl = document.getElementById('marketplace-filters');
                  filterEl?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="h-10 px-4 rounded-lg bg-[#2D7A49] hover:bg-[#1F5C36] text-white text-xs font-semibold transition-colors flex items-center gap-2"
              >
                <Store className="w-4 h-4 text-[#8AD3A4]" />
                <span>Browse Marketplace</span>
              </button>

              <button
                onClick={onOpenMandiTracker}
                className="h-10 px-4 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-medium transition-colors flex items-center gap-2"
              >
                <Scale className="w-4 h-4 text-[#A7DFB8]" />
                <span>View Mandi Rates</span>
              </button>
            </div>
          </div>

          {/* Right Hero Visual Card with clear DEMO labelling, modest radius, no strike-through */}
          <div className="lg:col-span-5">
            <div className="relative rounded-lg overflow-hidden border border-white/20 bg-[#164327]">
              <img
                src="/images_farm/mattu-gulla.jpg"
                alt="Mattu Gulla GI Brinjal"
                className="w-full h-64 object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

              {/* Verified DEMO Card */}
              <div className="absolute bottom-3 left-3 right-3 bg-white rounded-md p-3 text-[#1C1D1A] border border-[#E5DFCE] shadow-sm">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-[#0F2E1B] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2D7A49]" />
                    Mattu Gulla (Brinjal)
                  </span>
                  <span className="font-bold text-blue-800 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded text-[10px]">
                    DEMO
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-[#63675E]">Farmer Direct Price:</span>
                  <span className="font-bold text-sm text-[#164327]">
                    ₹58/kg
                  </span>
                </div>

                <div className="text-[10px] text-[#63675E] mt-1 pt-1 border-t border-[#E5DFCE]/60 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#2D7A49]" />
                  <span>Sample listing: Devaki Poojary • Mattu Village, Kaup</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Filters & Search Section */}
      <div id="marketplace-filters">
        <ProduceFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedTaluk={selectedTaluk}
          setSelectedTaluk={setSelectedTaluk}
          onlyGI={onlyGI}
          setOnlyGI={setOnlyGI}
          onlyOrganic={onlyOrganic}
          setOnlyOrganic={setOnlyOrganic}
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalCount={filteredListings.length}
        />
      </div>

      {/* 3. Produce Grid */}
      {filteredListings.length === 0 ? (
        <div className="bg-white rounded-lg p-10 text-center border border-[#E5DFCE] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F0] flex items-center justify-center mx-auto text-[#84897E]">
            <Store className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#0F2E1B]">No matching produce found</h3>
          <p className="text-xs text-[#63675E] max-w-sm mx-auto">
            Try adjusting your search query, clearing taluk filters, or resetting category selections.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedTaluk('all');
              setOnlyGI(false);
              setOnlyOrganic(false);
            }}
            className="h-9 px-3 rounded-lg bg-[#FAF7F0] border border-[#E5DFCE] text-xs font-semibold text-[#1C1D1A]"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredListings.map((produce) => (
            <ProduceCard
              key={produce.id}
              produce={produce}
              onBuyDirect={onBuyDirect}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};
