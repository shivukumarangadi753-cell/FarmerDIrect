import React, { useState } from 'react';
import { ProduceListing, ProduceCategory, District, Taluk, ProduceUnit } from '../../types';
import { listingFormSchema } from '../../lib/validation';
import { storage } from '../../lib/storage';
import { COASTAL_TALUKS } from '../../data/coastalLocations';
import { COASTAL_MANDI_BENCHMARKS } from '../../data/mandiBenchmarks';
import { formatCurrency } from '../../lib/utils';
import { useLivePricing } from '../../lib/LivePricingContext';
import {
  X,
  PlusCircle,
  Award,
  CheckCircle2,
  AlertCircle,
  Scale,
  MapPin,
  Image as ImageIcon,
} from 'lucide-react';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newListing: ProduceListing) => void;
}

const PRESET_PHOTO_OPTIONS = [
  { label: 'Mattu Gulla (Brinjal)', url: '/images_farm/mattu-gulla.jpg' },
  { label: 'Coastal Coconuts', url: '/images_farm/fresh-coastal-mature-coconut.jpg' },
  { label: 'Arecanut (Chali)', url: '/images_farm/mangalore-chali-arecanut.jpg' },
  { label: 'Black Pepper', url: '/images_farm/malabar-black-pepper.jpg' },
  { label: 'Shankarpura Jasmine', url: '/images_farm/shankarpura-jasmine.jpg' },
  { label: 'Red Matta Rice', url: '/images_farm/coastal-red-boiled-rice.jpg' },
  { label: 'Malabar Spinach (Basale)', url: '/images_farm/tender-malabar-spinach.jpg' },
  { label: 'Coastal Bananas (Rasabale)', url: '/images_farm/banana.jpg' },
];

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const { getLivePrice } = useLivePricing();

  const [cropName, setCropName] = useState('Udupi Mattu Gulla (GI Brinjal)');
  const [cropKannadaName, setCropKannadaName] = useState('ಮಟ್ಟು ಗುಳ್ಳ');
  const [category, setCategory] = useState<ProduceCategory>('GI Tagged');
  const [variety, setVariety] = useState('Authentic Green-Striped Mattu Village');
  const [grade, setGrade] = useState<'Standard (FAQ)' | 'Grade A Premium' | 'Export Quality' | 'Certified Organic'>('Grade A Premium');
  const [district, setDistrict] = useState<District>('Udupi');
  const [taluk, setTaluk] = useState<Taluk>('Kaup');
  const [village, setVillage] = useState('Mattu Padu');
  const [harvestDate, setHarvestDate] = useState('2026-10-18');
  const [availableQty, setAvailableQty] = useState<number>(250);
  const [unit, setUnit] = useState<ProduceUnit>('kg');
  const [minOrderQty, setMinOrderQty] = useState<number>(5);
  const [farmerPrice, setFarmerPrice] = useState<number>(55);
  const [organicCertified, setOrganicCertified] = useState(true);
  const [giTagged, setGiTagged] = useState(true);
  const [giTagName, setGiTagName] = useState('GI-69: Udupi Mattu Gulla');
  const [description, setDescription] = useState('Handpicked this morning from our family homestead sandy coastal soil. Rich aromatic flavor, zero chemical pesticides.');
  const [farmerName, setFarmerName] = useState('Devaki Poojary');
  const [farmerPhone, setFarmerPhone] = useState('9845123456');
  const [selectedPhoto, setSelectedPhoto] = useState(PRESET_PHOTO_OPTIONS[0].url);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Look up matching Mandi Benchmark to give farmer smart pricing advice
  const matchedBenchmark = COASTAL_MANDI_BENCHMARKS.find((b) =>
    cropName.toLowerCase().includes(b.commodity.toLowerCase()) ||
    b.commodity.toLowerCase().includes(cropName.toLowerCase())
  ) || COASTAL_MANDI_BENCHMARKS[3];

  const livePriceInfo = getLivePrice(cropName, matchedBenchmark.normalized_per_kg_modal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = listingFormSchema.safeParse({
      crop_name: cropName,
      crop_kannada_name: cropKannadaName,
      crop_category: category,
      variety,
      grade,
      district,
      taluk,
      village,
      harvest_date: harvestDate,
      available_qty: availableQty,
      unit,
      min_order_qty: minOrderQty,
      farmer_price_per_unit: farmerPrice,
      organic_certified: organicCertified,
      gi_tagged: giTagged,
      description,
      farmer_name: farmerName,
      farmer_phone: farmerPhone,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const issues = result.error.issues || [];
      issues.forEach((err: any) => {
        if (err.path && err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const created = storage.addListing({
        farmer_id: `farmer-${Date.now()}`,
        farmer_name: farmerName,
        farmer_phone: farmerPhone,
        farmer_avatar: '/images_farm/farmer-1.jpg',
        district,
        taluk,
        village,
        crop_name: cropName,
        crop_kannada_name: cropKannadaName,
        crop_category: category,
        variety,
        grade,
        harvest_date: harvestDate,
        available_qty: availableQty,
        unit,
        min_order_qty: minOrderQty,
        farmer_price_per_unit: farmerPrice,
        mandi_benchmark_price: livePriceInfo.mandiPrice,
        middleman_trader_price: Math.round(livePriceInfo.mandiPrice * 0.76),
        retail_market_estimate: Math.round(farmerPrice * 1.35),
        organic_certified: organicCertified,
        gi_tagged: giTagged,
        gi_tag_name: giTagged ? giTagName : undefined,
        description,
        photos: [selectedPhoto],
      });

      onSuccess(created);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error adding produce';
      setErrors({ submit: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FAF7F0] rounded-3xl border border-[#E5DFCE] shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0F2E1B] text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#164327] text-[#59BB7B]">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">List Harvested Produce</h3>
              <p className="text-xs text-[#A7DFB8]">
                Direct Market Listing for Dakshina Kannada & Udupi Farmers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* 1. Mandi Fair Price Guidance Banner */}
          <div className="p-4 rounded-2xl bg-[#E2F6EB] border border-[#2D7A49]/30 flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-[#164327] text-[#59BB7B] shrink-0 mt-0.5">
              <Scale className="w-4 h-4" />
            </div>
            <div className="space-y-1 text-xs">
              <span className="font-bold text-[#0F2E1B] block">
                Official Mandi Benchmark: {matchedBenchmark.market}
              </span>
              <p className="text-[#1F5C36] leading-relaxed">
                The current APMC wholesale modal price for this crop is{' '}
                <strong>{formatCurrency(matchedBenchmark.normalized_per_kg_modal)}/{matchedBenchmark.unit_type === 'nut' ? 'nut' : 'kg'}</strong>.
                Local middlemen typically only offer{' '}
                <strong className="text-red-700">
                  {formatCurrency(Math.round(matchedBenchmark.normalized_per_kg_modal * 0.76))}
                </strong>.
                We recommend pricing your direct lot around{' '}
                <strong className="text-[#0F2E1B]">
                  {formatCurrency(Math.round(matchedBenchmark.normalized_per_kg_modal * 1.15))}
                </strong>{' '}
                to maximize profit while offering buyers attractive savings!
              </p>
            </div>
          </div>

          {/* 2. Crop Identity */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5DFCE] space-y-4">
            <h4 className="text-xs font-bold text-[#1C1D1A] uppercase tracking-wider">
              1. Crop & Variety
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#444740] block mb-1">
                  Crop Name (English)
                </label>
                <input
                  type="text"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-xl bg-[#FAF7F0] border border-[#E5DFCE] focus:outline-none focus:ring-2 focus:ring-[#2D7A49]"
                />
                {errors.crop_name && <p className="text-[10px] text-red-600 mt-1">{errors.crop_name}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#444740] block mb-1">
                  Kannada Name (ಬೆಳೆಯ ಹೆಸರು)
                </label>
                <input
                  type="text"
                  value={cropKannadaName}
                  onChange={(e) => setCropKannadaName(e.target.value)}
                  placeholder="ಉದಾ: ಮಟ್ಟು ಗುಳ್ಳ, ಅಡಿಕೆ"
                  className="w-full py-2 px-3 text-xs rounded-xl bg-[#FAF7F0] border border-[#E5DFCE] focus:outline-none focus:ring-2 focus:ring-[#2D7A49]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#444740] block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProduceCategory)}
                  className="w-full py-2 px-3 text-xs rounded-xl bg-[#FAF7F0] border border-[#E5DFCE] focus:outline-none focus:ring-2 focus:ring-[#2D7A49]"
                >
                  <option value="GI Tagged">GI Tagged</option>
                  <option value="Cash Crops">Cash Crops</option>
                  <option value="Spices">Spices</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Rice & Grains">Rice & Grains</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#444740] block mb-1">
                  Variety
                </label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-xl bg-[#FAF7F0] border border-[#E5DFCE] focus:outline-none focus:ring-2 focus:ring-[#2D7A49]"
                />
                {errors.variety && <p className="text-[10px] text-red-600 mt-1">{errors.variety}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#444740] block mb-1">
                  Quality Grade
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as any)}
                  className="w-full py-2 px-3 text-xs rounded-xl bg-[#FAF7F0] border border-[#E5DFCE] focus:outline-none focus:ring-2 focus:ring-[#2D7A49]"
                >
                  <option value="Standard (FAQ)">Standard (FAQ)</option>
                  <option value="Grade A Premium">Grade A Premium</option>
                  <option value="Export Quality">Export Quality</option>
                  <option value="Certified Organic">Certified Organic</option>
                </select>
              </div>
            </div>

            {/* GI & Organic Badges Checkboxes */}
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[#E5DFCE]">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1C1D1A]">
                <input
                  type="checkbox"
                  checked={giTagged}
                  onChange={(e) => setGiTagged(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2D7A49] focus:ring-[#2D7A49]"
                />
                <span className="flex items-center gap-1 text-[#D97706]">
                  <Award className="w-3.5 h-3.5" />
                  GI Tagged Produce
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1C1D1A]">
                <input
                  type="checkbox"
                  checked={organicCertified}
                  onChange={(e) => setOrganicCertified(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2D7A49] focus:ring-[#2D7A49]"
                />
                <span className="flex items-center gap-1 text-[#164327]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#59BB7B]" />
                  100% Organically Grown
                </span>
              </label>
            </div>
          </div>

          {/* 3. Location & Harvest Info */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5DFCE] space-y-4">
            <h4 className="text-xs font-bold text-[#1C1D1A] uppercase tracking-wider">
              2. Location & Harvest Date
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#444740] block mb-1">
                  District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value as District)}
                  className="w-full py-2 px-3 text-xs rounded-xl bg-[#FAF7F0] border border-[#E5DFCE] focus:outline-none focus:ring-2 focus:ring-[#2D7A49]"
                >
                  <option value="Dakshina Kannada">Dakshina Kannada</option>
                  <option value="Udupi">Udupi</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#444740] block mb-1">
                  Taluk
                </label>
                <select
                  value={taluk}
                  onChange={(e) => setTaluk(e.target.value as Taluk)}
                  className="w-full py-2 px-3 text-xs rounded-xl bg-[#FAF7F0] border border-[#E5DFCE] focus:outline-none focus:ring-2 focus:ring-[#2D7A49]"
                >
                  {COASTAL_TALUKS.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name} ({t.district})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#444740] block mb-1">
                  Village / Locality
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-xl bg-[#FAF7F0] border border-[#E5DFCE] focus:outline-none focus:ring-2 focus:ring-[#2D7A49]"
                />
                {errors.village && <p className="text-[10px] text-red-600 mt-1">{errors.village}</p>}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#444740] block mb-1">
                Harvest Date
              </label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full sm:w-60 py-2 px-3 text-xs rounded-xl bg-[#FAF7F0] border border-[#E5DFCE] focus:outline-none focus:ring-2 focus:ring-[#2D7A49]"
              />
            </div>
          </div>

          {/* 4. Lot Size & Pricing */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5DFCE] space-y-4">
            <h4 className="text-xs font-bold text-[#1C1D1A] uppercase tracking-wider">
              3. Lot Size & Fair Pricing
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#444740] block mb-1">
                  Total Lot Available
                </label>
                <input
                  type="number"
                  min="1"
                  value={availableQty}
                  onChange={(e) => setAvailableQty(Number(e.target.value))}
                  className="w-full py-2 px-3 text-xs rounded-xl bg-[#FAF7F0] border border-[#E5DFCE] focus:outline-none focus:ring-2 focus:ring-[#2D7A49]"
                />
                {errors.available_qty && <p className="text-[10px] text-red-600 mt-1">{errors.available_qty}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#444740] block mb-1">
                  Trading Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as ProduceUnit)}
                  className="w-full py-2 px-3 text-xs rounded-xl bg-[#FAF7F0] border border-[#E5DFCE] focus:outline-none focus:ring-2 focus:ring-[#2D7A49]"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="quintal">Quintal (100 kg)</option>
                  <option value="nut">Per Nut (ತೆಂಗಿನಕಾಯಿ)</option>
                  <option value="bunch">Per Bunch (ಮಲ್ಲಿಗೆ ಅಟ್ಟೆ)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#444740] block mb-1">
                  Min Order Lot
                </label>
                <input
                  type="number"
                  min="1"
                  value={minOrderQty}
                  onChange={(e) => setMinOrderQty(Number(e.target.value))}
                  className="w-full py-2 px-3 text-xs rounded-xl bg-[#FAF7F0] border border-[#E5DFCE] focus:outline-none focus:ring-2 focus:ring-[#2D7A49]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#444740] block mb-1">
                  Your Price (₹/{unit})
                </label>
                <input
                  type="number"
                  min="1"
                  value={farmerPrice}
                  onChange={(e) => setFarmerPrice(Number(e.target.value))}
                  className="w-full py-2 px-3 text-xs rounded-xl bg-[#FAF7F0] border border-[#2D7A49] font-bold text-[#164327] focus:outline-none focus:ring-2 focus:ring-[#2D7A49]"
                />
                {errors.farmer_price_per_unit && (
                  <p className="text-[10px] text-red-600 mt-1">{errors.farmer_price_per_unit}</p>
                )}
              </div>
            </div>

            {/* Live Mandi Rate Advisory */}
            <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E5DFCE] flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[#63675E]">
                  Official Live Mandi Benchmark ({livePriceInfo.marketName}):
                </span>
                <span className="font-bold text-[#164327]">₹{livePriceInfo.mandiPrice}/{unit}</span>
              </div>
              <span className="text-[10px] text-[#2D7A49] font-medium bg-[#E2F6EB] px-2 py-0.5 rounded-md">
                Agmarknet Live Feed
              </span>
            </div>
          </div>

          {/* 5. Authentic Photo Selector */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5DFCE] space-y-3">
            <h4 className="text-xs font-bold text-[#1C1D1A] uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#2D7A49]" />
              <span>4. Authentic Crop Photo</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRESET_PHOTO_OPTIONS.map((item) => (
                <div
                  key={item.label}
                  onClick={() => setSelectedPhoto(item.url)}
                  className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedPhoto === item.url ? 'border-[#2D7A49] ring-2 ring-[#2D7A49]/30' : 'border-[#E5DFCE]'
                  }`}
                >
                  <img src={item.url} alt={item.label} className="h-16 w-full object-cover" />
                  <span className="block text-[10px] font-semibold text-[#1C1D1A] p-1 bg-white truncate">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Description & Farmer Bio */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5DFCE] space-y-3">
            <h4 className="text-xs font-bold text-[#1C1D1A] uppercase tracking-wider">
              5. Harvest Description & Farmer Details
            </h4>
            <div>
              <label className="text-xs font-semibold text-[#444740] block mb-1">
                Harvest Story / Quality Notes
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl bg-[#FAF7F0] border border-[#E5DFCE] focus:outline-none focus:ring-2 focus:ring-[#2D7A49]"
              />
              {errors.description && <p className="text-[10px] text-red-600 mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#444740] block mb-1">
                  Farmer Full Name
                </label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-xl bg-[#FAF7F0] border border-[#E5DFCE] focus:outline-none focus:ring-2 focus:ring-[#2D7A49]"
                />
                {errors.farmer_name && <p className="text-[10px] text-red-600 mt-1">{errors.farmer_name}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#444740] block mb-1">
                  Mobile Number (10 Digits)
                </label>
                <input
                  type="text"
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-xl bg-[#FAF7F0] border border-[#E5DFCE] focus:outline-none focus:ring-2 focus:ring-[#2D7A49]"
                />
                {errors.farmer_phone && <p className="text-[10px] text-red-600 mt-1">{errors.farmer_phone}</p>}
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
              {errors.submit}
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#E5DFCE] text-xs font-semibold text-[#63675E] hover:bg-[#F2EEE2]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#164327] hover:bg-[#0F2E1B] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-[#59BB7B]" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Listing to Marketplace'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
