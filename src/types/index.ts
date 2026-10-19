export type UserRole = 'farmer' | 'buyer' | 'admin';

export type BuyerType = 'household' | 'retailer' | 'restaurant' | 'hotel' | 'bulk_aggregator';

export type District = 'Dakshina Kannada' | 'Udupi';

export type Taluk =
  | 'Mangalore'
  | 'Bantwal'
  | 'Belthangady'
  | 'Puttur'
  | 'Sullia'
  | 'Moodbidri'
  | 'Kadaba'
  | 'Udupi'
  | 'Kundapura'
  | 'Karkala'
  | 'Brahmavara'
  | 'Byndoor'
  | 'Kaup'
  | 'Hebri';

export type ProduceCategory =
  | 'GI Tagged'
  | 'Cash Crops'
  | 'Spices'
  | 'Fruits'
  | 'Vegetables'
  | 'Rice & Grains';

export type ProduceUnit = 'kg' | 'quintal' | 'nut' | 'bunch';

export interface ProduceListing {
  id: string;
  farmer_id: string;
  farmer_name: string;
  farmer_phone: string;
  farmer_avatar?: string;
  district: District;
  taluk: Taluk;
  village: string;
  crop_name: string;
  crop_kannada_name?: string;
  crop_category: ProduceCategory;
  variety: string;
  grade: 'Standard (FAQ)' | 'Grade A Premium' | 'Export Quality' | 'Certified Organic';
  harvest_date: string;
  available_qty: number;
  unit: ProduceUnit;
  min_order_qty: number;
  farmer_price_per_unit: number; // In INR ₹
  mandi_benchmark_price: number; // APMC Mandi wholesale price per unit
  middleman_trader_price: number; // What middleman offers farmer
  retail_market_estimate: number; // What supermarket charges consumers
  organic_certified: boolean;
  gi_tagged: boolean;
  gi_tag_name?: string;
  description: string;
  photos: string[];
  status: 'active' | 'low_stock' | 'sold_out';
  rating: number;
  reviews_count: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  buyer_id: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_type: BuyerType;
  listing_id: string;
  farmer_id: string;
  farmer_name: string;
  farmer_phone: string;
  crop_name: string;
  variety: string;
  quantity: number;
  unit: ProduceUnit;
  unit_price: number;
  total_amount: number;
  farmer_extra_earned: number; // How much extra farmer received vs traditional middleman
  buyer_saved: number; // How much buyer saved vs retail supermarket
  delivery_type: 'farm_pickup' | 'hub_consolidation' | 'direct_delivery';
  delivery_address: string;
  delivery_taluk: Taluk;
  status: 'pending' | 'confirmed' | 'harvested' | 'in_transit' | 'delivered' | 'cancelled';
  payment_method: 'upi_direct' | 'escrow_hold' | 'cash_on_delivery';
  payment_status: 'paid' | 'escrowed' | 'pending';
  notes?: string;
  created_at: string;
}

export interface MandiRecord {
  id: string;
  state: string;
  district: string;
  market: string;
  commodity: string;
  commodity_kannada?: string;
  variety: string;
  grade: string;
  arrival_date: string;
  min_price: number; // In ₹ per Quintal or 100 nuts
  max_price: number;
  modal_price: number;
  unit_type: 'quintal' | 'nut';
  normalized_per_kg_modal: number; // Converted to ₹/kg or ₹/nut for easy comparison
  retail_avg_per_kg: number;
  middleman_cut_percentage: number;
  trend_percentage: number;
}

export interface PriceHistoryPoint {
  date: string;
  mandi_modal: number;
  farmer_direct: number;
  retail_supermarket: number;
  middleman_trader: number;
}
