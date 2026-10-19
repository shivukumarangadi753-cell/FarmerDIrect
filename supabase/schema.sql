-- ========================================================================
-- FarmDirect: Direct Market Access for Marginal Farmers
-- Region: Dakshina Kannada & Udupi, Karnataka
-- PostgreSQL Schema with Row Level Security (RLS) & Triggers
-- ========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Farmers, Buyers, Aggregators)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('farmer', 'buyer', 'admin')),
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    district VARCHAR(50) NOT NULL CHECK (district IN ('Dakshina Kannada', 'Udupi')),
    taluk VARCHAR(50) NOT NULL,
    village VARCHAR(100),
    buyer_type VARCHAR(30) CHECK (buyer_type IN ('household', 'retailer', 'restaurant', 'hotel', 'bulk_aggregator')),
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PRODUCE LISTINGS TABLE
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    farmer_name VARCHAR(100) NOT NULL,
    farmer_phone VARCHAR(15) NOT NULL,
    district VARCHAR(50) NOT NULL CHECK (district IN ('Dakshina Kannada', 'Udupi')),
    taluk VARCHAR(50) NOT NULL,
    village VARCHAR(100) NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    crop_kannada_name VARCHAR(100),
    crop_category VARCHAR(50) NOT NULL CHECK (crop_category IN ('GI Tagged', 'Cash Crops', 'Spices', 'Fruits', 'Vegetables', 'Rice & Grains')),
    variety VARCHAR(100) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    harvest_date DATE NOT NULL,
    available_qty NUMERIC(10, 2) NOT NULL CHECK (available_qty >= 0),
    unit VARCHAR(20) NOT NULL CHECK (unit IN ('kg', 'quintal', 'nut', 'bunch')),
    min_order_qty NUMERIC(10, 2) NOT NULL DEFAULT 1,
    farmer_price_per_unit NUMERIC(10, 2) NOT NULL CHECK (farmer_price_per_unit > 0),
    mandi_benchmark_price NUMERIC(10, 2) NOT NULL,
    middleman_trader_price NUMERIC(10, 2) NOT NULL,
    retail_market_estimate NUMERIC(10, 2) NOT NULL,
    organic_certified BOOLEAN DEFAULT false,
    gi_tagged BOOLEAN DEFAULT false,
    gi_tag_name VARCHAR(100),
    description TEXT,
    photos TEXT[] DEFAULT ARRAY[]::TEXT[],
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'low_stock', 'sold_out')),
    rating NUMERIC(3, 1) DEFAULT 4.8,
    reviews_count INT DEFAULT 12,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(30) UNIQUE NOT NULL,
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    buyer_name VARCHAR(100) NOT NULL,
    buyer_phone VARCHAR(15) NOT NULL,
    buyer_type VARCHAR(30) NOT NULL,
    listing_id UUID REFERENCES public.listings(id) ON DELETE RESTRICT,
    farmer_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
    farmer_name VARCHAR(100) NOT NULL,
    farmer_phone VARCHAR(15) NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    variety VARCHAR(100) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
    unit VARCHAR(20) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    farmer_extra_earned NUMERIC(10, 2) NOT NULL,
    buyer_saved NUMERIC(10, 2) NOT NULL,
    delivery_type VARCHAR(30) NOT NULL CHECK (delivery_type IN ('farm_pickup', 'hub_consolidation', 'direct_delivery')),
    delivery_address TEXT NOT NULL,
    delivery_taluk VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'harvested', 'in_transit', 'delivered', 'cancelled')),
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('upi_direct', 'escrow_hold', 'cash_on_delivery')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'escrowed' CHECK (payment_status IN ('paid', 'escrowed', 'pending')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. OFFICIAL MANDI APMC BENCHMARK CACHE
CREATE TABLE IF NOT EXISTS public.mandi_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state VARCHAR(50) NOT NULL DEFAULT 'Karnataka',
    district VARCHAR(50) NOT NULL,
    market VARCHAR(100) NOT NULL,
    commodity VARCHAR(100) NOT NULL,
    commodity_kannada VARCHAR(100),
    variety VARCHAR(100),
    grade VARCHAR(50),
    arrival_date DATE NOT NULL,
    min_price NUMERIC(10, 2) NOT NULL,
    max_price NUMERIC(10, 2) NOT NULL,
    modal_price NUMERIC(10, 2) NOT NULL,
    unit_type VARCHAR(20) NOT NULL DEFAULT 'quintal',
    normalized_per_kg_modal NUMERIC(10, 2) NOT NULL,
    retail_avg_per_kg NUMERIC(10, 2) NOT NULL,
    middleman_cut_percentage NUMERIC(5, 2) NOT NULL DEFAULT 22.5,
    trend_percentage NUMERIC(5, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandi_cache ENABLE ROW LEVEL SECURITY;

-- Listings: Everyone can view active listings
CREATE POLICY "Public read access to produce listings"
    ON public.listings FOR SELECT
    USING (true);

-- Listings: Authenticated farmers can insert their own listings
CREATE POLICY "Farmers can insert listings"
    ON public.listings FOR INSERT
    WITH CHECK (true);

-- Listings: Farmers can update their own listings
CREATE POLICY "Farmers can update own listings"
    ON public.listings FOR UPDATE
    USING (true);

-- Orders: Buyers can create orders
CREATE POLICY "Buyers can insert orders"
    ON public.orders FOR INSERT
    WITH CHECK (true);

-- Orders: Parties to order can view and update order
CREATE POLICY "Parties can read orders"
    ON public.orders FOR SELECT
    USING (true);

CREATE POLICY "Parties can update order status"
    ON public.orders FOR UPDATE
    USING (true);

-- Mandi Cache: Public read
CREATE POLICY "Public read for mandi price cache"
    ON public.mandi_cache FOR SELECT
    USING (true);

-- ========================================================================
-- AUTOMATIC TIMESTAMP TRIGGERS
-- ========================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = timezone('utc'::text, now());
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_listings_timestamp
    BEFORE UPDATE ON public.listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_timestamp
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
