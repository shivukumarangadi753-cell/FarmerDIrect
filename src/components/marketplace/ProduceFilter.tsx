import React from 'react';
import { ProduceCategory } from '../../types';
import { COASTAL_TALUKS } from '../../data/coastalLocations';
import { Search, Award, CheckCircle2, Check } from 'lucide-react';
import { useLanguage } from '../../lib/language';

interface ProduceFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedTaluk: string;
  setSelectedTaluk: (taluk: string) => void;
  onlyGI: boolean;
  setOnlyGI: (val: boolean) => void;
  onlyOrganic: boolean;
  setOnlyOrganic: (val: boolean) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  totalCount: number;
}

const CATEGORIES: ProduceCategory[] = [
  'GI Tagged',
  'Cash Crops',
  'Spices',
  'Fruits',
  'Vegetables',
  'Rice & Grains',
];

export const ProduceFilter: React.FC<ProduceFilterProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedTaluk,
  setSelectedTaluk,
  onlyGI,
  setOnlyGI,
  onlyOrganic,
  setOnlyOrganic,
  sortBy,
  setSortBy,
  totalCount,
}) => {
  const { lang, t } = useLanguage();

  return (
    <div className="bg-white rounded-lg border border-[#E5DFCE] p-4 space-y-3">
      {/* 1. Search Bar & Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="relative md:col-span-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#84897E]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search produce (e.g. Mattu Gulla, Arecanut, Pepper)..."
            className="w-full h-10 pl-9 pr-3 rounded-md bg-[#FAF7F0] border border-[#E5DFCE] text-xs text-[#1C1D1A] placeholder-[#84897E] focus:outline-none focus:ring-1 focus:ring-[#2D7A49]"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={selectedTaluk}
            onChange={(e) => setSelectedTaluk(e.target.value)}
            className="w-full h-10 px-3 rounded-md bg-[#FAF7F0] border border-[#E5DFCE] text-xs font-medium text-[#1C1D1A] focus:outline-none focus:ring-1 focus:ring-[#2D7A49]"
          >
            <option value="all">All Taluks (DK & Udupi)</option>
            <optgroup label="Dakshina Kannada">
              {COASTAL_TALUKS.filter((t) => t.district === 'Dakshina Kannada').map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Udupi">
              {COASTAL_TALUKS.filter((t) => t.district === 'Udupi').map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full h-10 px-3 rounded-md bg-[#FAF7F0] border border-[#E5DFCE] text-xs font-medium text-[#1C1D1A] focus:outline-none focus:ring-1 focus:ring-[#2D7A49]"
          >
            <option value="newest">Latest Harvest Date</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Farmer Rating</option>
          </select>
        </div>
      </div>

      {/* 2. Category Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`h-8 whitespace-nowrap px-3 rounded-md text-xs font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-[#164327] text-white'
              : 'bg-[#FAF7F0] text-[#444740] hover:bg-[#F2EEE2] border border-[#E5DFCE]'
          }`}
        >
          All Produce ({totalCount})
        </button>

        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`h-8 whitespace-nowrap px-3 rounded-md text-xs font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-[#164327] text-white'
                : 'bg-[#FAF7F0] text-[#444740] hover:bg-[#F2EEE2] border border-[#E5DFCE]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 3. Filter Tags */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E5DFCE] text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOnlyGI(!onlyGI)}
            className={`h-7 flex items-center gap-1 px-2.5 rounded-md text-xs border transition-colors ${
              onlyGI
                ? 'bg-[#FEF3C7] text-[#92400E] border-[#D97706] font-semibold'
                : 'bg-[#FAF7F0] text-[#63675E] border-[#E5DFCE]'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-[#D97706]" />
            <span>GI Tagged</span>
            {onlyGI && <Check className="w-3 h-3 text-[#D97706]" />}
          </button>

          <button
            onClick={() => setOnlyOrganic(!onlyOrganic)}
            className={`h-7 flex items-center gap-1 px-2.5 rounded-md text-xs border transition-colors ${
              onlyOrganic
                ? 'bg-[#E2F6EB] text-[#164327] border-[#2D7A49] font-semibold'
                : 'bg-[#FAF7F0] text-[#63675E] border-[#E5DFCE]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2D7A49]" />
            <span>Certified Organic</span>
            {onlyOrganic && <Check className="w-3 h-3 text-[#2D7A49]" />}
          </button>
        </div>

        <div className="text-xs text-[#84897E]">
          {totalCount} lots listed in DK & Udupi
        </div>
      </div>
    </div>
  );
};
