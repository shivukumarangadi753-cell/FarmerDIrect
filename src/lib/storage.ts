import { ProduceListing, Order, MandiRecord } from '../types';
import { INITIAL_PRODUCE_LISTINGS, INITIAL_ORDERS } from '../data/mockProduce';
import { COASTAL_MANDI_BENCHMARKS } from '../data/mandiBenchmarks';

const STORAGE_KEY_LISTINGS = 'farmdirect_listings_v4';
const STORAGE_KEY_ORDERS = 'farmdirect_orders_v4';
const STORAGE_KEY_SAVINGS = 'farmdirect_impact_v4';

export class FarmDirectStorage {
  private static instance: FarmDirectStorage;

  private constructor() {
    this.init();
  }

  public static getInstance(): FarmDirectStorage {
    if (!FarmDirectStorage.instance) {
      FarmDirectStorage.instance = new FarmDirectStorage();
    }
    return FarmDirectStorage.instance;
  }

  private init() {
    if (typeof window === 'undefined') return;

    const existingListings = localStorage.getItem(STORAGE_KEY_LISTINGS);
    if (!existingListings || existingListings.includes('unsplash.com') || !existingListings.includes('banana.jpg')) {
      localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(INITIAL_PRODUCE_LISTINGS));
    }

    const existingOrders = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (!existingOrders || existingOrders.includes('Ocean Pearl') || existingOrders.includes('Shruti')) {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(INITIAL_ORDERS));
    }
  }

  public getListings(): ProduceListing[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_LISTINGS);
      return data ? JSON.parse(data) : INITIAL_PRODUCE_LISTINGS;
    } catch {
      return INITIAL_PRODUCE_LISTINGS;
    }
  }

  public addListing(newListing: Omit<ProduceListing, 'id' | 'created_at' | 'rating' | 'reviews_count' | 'status'>): ProduceListing {
    const listings = this.getListings();

    // Auto-compute middleman cut & retail estimation based on crop & mandi benchmark
    const mandiPrice = newListing.mandi_benchmark_price || Math.round(newListing.farmer_price_per_unit * 0.85);
    const middlemanPrice = Math.round(mandiPrice * 0.78);
    const retailPrice = Math.round(newListing.farmer_price_per_unit * 1.35);

    const created: ProduceListing = {
      ...newListing,
      id: `prod-${Date.now()}`,
      status: 'active',
      rating: 5.0,
      reviews_count: 1,
      mandi_benchmark_price: mandiPrice,
      middleman_trader_price: middlemanPrice,
      retail_market_estimate: retailPrice,
      created_at: new Date().toISOString(),
    };

    const updated = [created, ...listings];
    localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('farmdirect:listings_updated', { detail: updated }));
    return created;
  }

  public updateListing(id: string, updates: Partial<ProduceListing>): ProduceListing | null {
    const listings = this.getListings();
    const index = listings.findIndex((l) => l.id === id);
    if (index === -1) return null;

    listings[index] = { ...listings[index], ...updates };
    localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(listings));
    window.dispatchEvent(new CustomEvent('farmdirect:listings_updated', { detail: listings }));
    return listings[index];
  }

  public getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ORDERS);
      return data ? JSON.parse(data) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  }

  public createOrder(orderInput: {
    buyer_name: string;
    buyer_phone: string;
    buyer_type: Order['buyer_type'];
    listing_id: string;
    quantity: number;
    delivery_type: Order['delivery_type'];
    delivery_address: string;
    delivery_taluk: Order['delivery_taluk'];
    payment_method: Order['payment_method'];
    notes?: string;
  }): Order {
    const listings = this.getListings();
    const listing = listings.find((l) => l.id === orderInput.listing_id);

    if (!listing) {
      throw new Error('Listing not found');
    }

    if (listing.available_qty < orderInput.quantity) {
      throw new Error(`Only ${listing.available_qty} ${listing.unit} available in stock.`);
    }

    const unitPrice = listing.farmer_price_per_unit;
    const totalAmount = unitPrice * orderInput.quantity;
    
    // Impact calculations:
    // Farmer gain = (farmer price - middleman trader price) * quantity
    const farmerExtraEarned = Math.round((unitPrice - listing.middleman_trader_price) * orderInput.quantity);
    // Buyer saved = (retail market estimate - farmer price) * quantity
    const buyerSaved = Math.round((listing.retail_market_estimate - unitPrice) * orderInput.quantity);

    const orderNumber = `FD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      buyer_id: `buyer-${Date.now()}`,
      buyer_name: orderInput.buyer_name,
      buyer_phone: orderInput.buyer_phone,
      buyer_type: orderInput.buyer_type,
      listing_id: listing.id,
      farmer_id: listing.farmer_id,
      farmer_name: listing.farmer_name,
      farmer_phone: listing.farmer_phone,
      crop_name: listing.crop_name,
      variety: listing.variety,
      quantity: orderInput.quantity,
      unit: listing.unit,
      unit_price: unitPrice,
      total_amount: totalAmount,
      farmer_extra_earned: Math.max(0, farmerExtraEarned),
      buyer_saved: Math.max(0, buyerSaved),
      delivery_type: orderInput.delivery_type,
      delivery_address: orderInput.delivery_address,
      delivery_taluk: orderInput.delivery_taluk,
      status: 'confirmed',
      payment_method: orderInput.payment_method,
      payment_status: orderInput.payment_method === 'cash_on_delivery' ? 'pending' : 'paid',
      notes: orderInput.notes,
      created_at: new Date().toISOString(),
    };

    // Deduct available quantity from listing
    const remainingQty = listing.available_qty - orderInput.quantity;
    const updatedStatus = remainingQty <= 0 ? 'sold_out' : remainingQty < (listing.min_order_qty * 2) ? 'low_stock' : 'active';
    this.updateListing(listing.id, {
      available_qty: Math.max(0, remainingQty),
      status: updatedStatus,
    });

    const orders = this.getOrders();
    const updatedOrders = [newOrder, ...orders];
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updatedOrders));
    window.dispatchEvent(new CustomEvent('farmdirect:orders_updated', { detail: updatedOrders }));

    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: Order['status']): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;

    orders[index] = {
      ...orders[index],
      status,
      payment_status: status === 'delivered' ? 'paid' : orders[index].payment_status,
    };

    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('farmdirect:orders_updated', { detail: orders }));
    return orders[index];
  }

  public resetToDemoData() {
    localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(INITIAL_PRODUCE_LISTINGS));
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(INITIAL_ORDERS));
    window.dispatchEvent(new CustomEvent('farmdirect:listings_updated', { detail: INITIAL_PRODUCE_LISTINGS }));
    window.dispatchEvent(new CustomEvent('farmdirect:orders_updated', { detail: INITIAL_ORDERS }));
  }

  public getPlatformImpactStats() {
    const orders = this.getOrders();
    const totalTradedValue = orders.reduce((sum, o) => sum + o.total_amount, 0);
    const totalFarmerGain = orders.reduce((sum, o) => sum + o.farmer_extra_earned, 0);
    const totalBuyerSavings = orders.reduce((sum, o) => sum + o.buyer_saved, 0);
    const completedOrders = orders.filter((o) => o.status === 'delivered' || o.status === 'in_transit' || o.status === 'confirmed').length;

    return {
      totalTradedValue,
      totalFarmerGain,
      totalBuyerSavings,
      completedOrders,
      activeFarmersCount: 184, // Verified DK & Udupi registered marginal farmers
      coastalVillagesReached: 42,
    };
  }

  public findMandiBenchmarkForProduce(cropName: string): MandiRecord | undefined {
    return COASTAL_MANDI_BENCHMARKS.find(
      (m) =>
        cropName.toLowerCase().includes(m.commodity.toLowerCase()) ||
        m.commodity.toLowerCase().includes(cropName.toLowerCase())
    );
  }
}

export const storage = FarmDirectStorage.getInstance();
