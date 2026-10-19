import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MarketplaceView } from './components/marketplace/MarketplaceView';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { MandiPriceTracker } from './components/mandi/MandiPriceTracker';
import { BuyerOrdersView } from './components/buyer/BuyerOrdersView';
import { OrderModal } from './components/marketplace/OrderModal';
import { ProduceDetailModal } from './components/marketplace/ProduceDetailModal';
import { CreateListingModal } from './components/farmer/CreateListingModal';
import { OrderInvoiceModal } from './components/buyer/OrderInvoiceModal';
import { SupabaseModal } from './components/supabase/SupabaseModal';
import { AuthModal } from './components/common/AuthModal';
import { LanguageProvider } from './lib/language';
import { AuthProvider, useAuth } from './lib/auth';
import { LivePricingProvider, useLivePricing } from './lib/LivePricingContext';
import { storage } from './lib/storage';
import { ProduceListing, Order, UserRole } from './types';

export function FarmDirectApp() {
  const [activeTab, setActiveTab] = useState<string>('marketplace');
  const { currentUser, setRole } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>(currentUser.role);
  const { records: liveMandiRecords, status: liveMandiStatus, lastFetchedAt, totalRecords, getLivePrice } = useLivePricing();

  // Sync userRole with auth currentUser
  useEffect(() => {
    setUserRole(currentUser.role);
  }, [currentUser.role]);

  // Core Data State
  const [listings, setListings] = useState<ProduceListing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Modals State
  const [selectedProduceForOrder, setSelectedProduceForOrder] = useState<ProduceListing | null>(null);
  const [selectedProduceForDetail, setSelectedProduceForDetail] = useState<ProduceListing | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Initial load from storage
    setListings(storage.getListings());
    setOrders(storage.getOrders());

    // Listen for custom reactive storage events
    const handleListingsUpdate = (e: CustomEvent<ProduceListing[]>) => {
      setListings(e.detail);
    };

    const handleOrdersUpdate = (e: CustomEvent<Order[]>) => {
      setOrders(e.detail);
    };

    window.addEventListener('farmdirect:listings_updated', handleListingsUpdate as EventListener);
    window.addEventListener('farmdirect:orders_updated', handleOrdersUpdate as EventListener);

    return () => {
      window.removeEventListener('farmdirect:listings_updated', handleListingsUpdate as EventListener);
      window.removeEventListener('farmdirect:orders_updated', handleOrdersUpdate as EventListener);
    };
  }, []);

  // Dynamic Real-time Live APMC pricing for all produce items
  const dynamicListings = useMemo(() => {
    return listings.map((item) => {
      const match = getLivePrice(item.crop_name, item.mandi_benchmark_price);
      const mandiPrice = match.mandiPrice;
      const middlemanCut = Math.round(mandiPrice * 0.76);
      const retailEst = Math.max(item.farmer_price_per_unit + 14, Math.round(mandiPrice * 1.52));
      return {
        ...item,
        mandi_benchmark_price: mandiPrice,
        middleman_trader_price: middlemanCut,
        retail_market_estimate: retailEst,
      };
    });
  }, [listings, liveMandiRecords, getLivePrice]);

  const handleBuyDirect = (produce: ProduceListing) => {
    setSelectedProduceForOrder(produce);
  };

  const handleViewDetails = (produce: ProduceListing) => {
    setSelectedProduceForDetail(produce);
  };

  const handleOrderSuccess = (order: Order) => {
    setSelectedProduceForOrder(null);
    setSelectedOrderForInvoice(order);
    setActiveTab('orders');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#1C1D1A]">
      {/* Top Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={(role) => {
          setUserRole(role);
          setRole(role);
        }}
        onOpenCreateListing={() => setIsCreateListingOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        ordersCount={orders.length}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'marketplace' && (
          <MarketplaceView
            listings={dynamicListings}
            onBuyDirect={handleBuyDirect}
            onViewDetails={handleViewDetails}
            onOpenCreateListing={() => setIsCreateListingOpen(true)}
            onOpenMandiTracker={() => setActiveTab('mandi')}
            liveStatus={liveMandiStatus}
            lastFetchedAt={lastFetchedAt}
            totalLiveRecords={totalRecords}
          />
        )}

        {activeTab === 'farmer' && (
          <FarmerDashboard
            listings={dynamicListings}
            orders={orders}
            onOpenCreateModal={() => setIsCreateListingOpen(true)}
            onOpenInvoiceModal={(order) => setSelectedOrderForInvoice(order)}
          />
        )}

        {activeTab === 'mandi' && <MandiPriceTracker />}

        {activeTab === 'orders' && (
          <BuyerOrdersView
            orders={orders}
            onOpenInvoiceModal={(order) => setSelectedOrderForInvoice(order)}
            onBrowseMarketplace={() => setActiveTab('marketplace')}
          />
        )}
      </main>

      {/* Footer with database schema inspector link */}
      <Footer onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)} />

      {/* Modals */}
      <OrderModal
        produce={selectedProduceForOrder}
        isOpen={Boolean(selectedProduceForOrder)}
        onClose={() => setSelectedProduceForOrder(null)}
        onOrderSuccess={handleOrderSuccess}
      />

      <ProduceDetailModal
        produce={selectedProduceForDetail}
        isOpen={Boolean(selectedProduceForDetail)}
        onClose={() => setSelectedProduceForDetail(null)}
        onOpenOrder={(produce) => {
          setSelectedProduceForOrder(produce);
        }}
      />

      <CreateListingModal
        isOpen={isCreateListingOpen}
        onClose={() => setIsCreateListingOpen(false)}
        onSuccess={() => {
          setIsCreateListingOpen(false);
          setActiveTab('farmer');
        }}
      />

      <OrderInvoiceModal
        order={selectedOrderForInvoice}
        isOpen={Boolean(selectedOrderForInvoice)}
        onClose={() => setSelectedOrderForInvoice(null)}
      />

      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <LivePricingProvider>
          <FarmDirectApp />
        </LivePricingProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
