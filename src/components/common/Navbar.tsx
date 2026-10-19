import React, { useState } from 'react';
import { Logo } from './Logo';
import { useLanguage } from '../../lib/language';
import { useAuth } from '../../lib/auth';
import {
  TrendingUp,
  ShoppingBag,
  Store,
  BarChart3,
  Menu,
  X,
  Languages,
  UserCheck,
  PlusCircle,
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onOpenCreateListing: () => void;
  onOpenAuthModal: () => void;
  ordersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  onOpenCreateListing,
  onOpenAuthModal,
  ordersCount,
}) => {
  const { lang, setLang, t } = useLanguage();
  const { currentUser, setRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoleSwitch = (newRole: UserRole) => {
    setUserRole(newRole);
    setRole(newRole);
    if (newRole === 'farmer') {
      setActiveTab('farmer');
    } else {
      setActiveTab('marketplace');
    }
  };

  const handleSellClick = () => {
    if (userRole !== 'farmer') {
      handleRoleSwitch('farmer');
    } else {
      setActiveTab('farmer');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F0] border-b border-[#E5DFCE]">
      {/* 1. APMC Market Benchmark Ticker Bar */}
      <div className="bg-[#0F2E1B] text-[#D8F3DC] text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-hidden">
          <div className="flex items-center gap-2 whitespace-nowrap text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#59bb7b]"></span>
            <span className="font-semibold text-white tracking-wide uppercase text-[10px]">
              APMC Prices (Mangalore & Udupi Mandis):
            </span>
          </div>

          <div className="flex items-center gap-5 sm:gap-6 overflow-x-auto no-scrollbar font-mono text-[11px]">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-[#A7DFB8]">Coconut:</span>
              <span className="text-white font-bold">₹25/nut</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-[#A7DFB8]">Chali Arecanut:</span>
              <span className="text-white font-bold">₹465/kg</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-[#A7DFB8]">Mattu Gulla:</span>
              <span className="text-white font-bold">₹48/kg</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap hidden md:flex">
              <span className="text-[#A7DFB8]">Black Pepper:</span>
              <span className="text-white font-bold">₹615/kg</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1 whitespace-nowrap text-[#D8F3DC]/70 text-[10px]">
            <span>Where available</span>
          </div>
        </div>
      </div>

      {/* 2. Simplified Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('marketplace')}
            className="cursor-pointer"
          >
            <Logo size="md" showTagline={false} />
          </div>

          {/* Core Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`h-9 flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'marketplace'
                  ? 'bg-[#164327] text-white'
                  : 'text-[#444740] hover:bg-[#F2EEE2] hover:text-[#0F2E1B]'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Marketplace</span>
            </button>

            <button
              onClick={() => setActiveTab('mandi')}
              className={`h-9 flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'mandi'
                  ? 'bg-[#164327] text-white'
                  : 'text-[#444740] hover:bg-[#F2EEE2] hover:text-[#0F2E1B]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Market Prices</span>
            </button>

            <button
              onClick={handleSellClick}
              className={`h-9 flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'farmer'
                  ? 'bg-[#164327] text-white'
                  : 'text-[#444740] hover:bg-[#F2EEE2] hover:text-[#0F2E1B]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Sell</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`h-9 relative flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'orders'
                  ? 'bg-[#164327] text-white'
                  : 'text-[#444740] hover:bg-[#F2EEE2] hover:text-[#0F2E1B]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders</span>
              {ordersCount > 0 && (
                <span className="inline-flex items-center justify-center bg-[#D97706] text-white text-[10px] font-bold rounded-full w-4 h-4 ml-0.5">
                  {ordersCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Controls: Role Toggle & Language */}
          <div className="hidden lg:flex items-center gap-2">
            {/* User Profile Pill */}
            <button
              onClick={onOpenAuthModal}
              className="h-9 flex items-center gap-2 px-2.5 rounded-lg bg-white hover:bg-[#F2EEE2] border border-[#E5DFCE] text-xs font-medium text-[#1C1D1A] transition-colors whitespace-nowrap"
              title="Click to view or switch profile"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="truncate max-w-[120px] font-semibold">{currentUser.name}</span>
              <span className="text-[10px] text-[#63675E] uppercase font-bold">({currentUser.role})</span>
            </button>

            {/* Role Toggle */}
            <div className="flex items-center bg-[#F2EEE2] p-0.5 rounded-lg border border-[#E5DFCE]">
              <button
                onClick={() => handleRoleSwitch('farmer')}
                className={`h-8 px-2.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                  userRole === 'farmer'
                    ? 'bg-[#164327] text-white'
                    : 'text-[#444740] hover:text-[#0F2E1B]'
                }`}
              >
                Farmer
              </button>
              <button
                onClick={() => handleRoleSwitch('buyer')}
                className={`h-8 px-2.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                  userRole === 'buyer'
                    ? 'bg-[#164327] text-white'
                    : 'text-[#444740] hover:text-[#0F2E1B]'
                }`}
              >
                Buyer
              </button>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'kn' : 'en')}
              className="h-9 flex items-center gap-1.5 px-2.5 rounded-lg bg-white hover:bg-[#F2EEE2] border border-[#E5DFCE] text-xs font-semibold text-[#164327] whitespace-nowrap transition-colors"
              title="Switch language / ಭಾಷೆ ಬದಲಿಸಿ"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'ಕನ್ನಡ' : 'EN'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setLang(lang === 'en' ? 'kn' : 'en')}
              className="h-8 px-2 rounded-lg bg-white border border-[#E5DFCE] text-xs font-bold text-[#164327]"
            >
              {lang === 'en' ? 'ಕನ್ನಡ' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-[#E5DFCE] text-[#1C1D1A]"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F0] border-b border-[#E5DFCE] px-4 pt-3 pb-4 space-y-2">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => {
                handleRoleSwitch('farmer');
                setMobileMenuOpen(false);
              }}
              className={`h-9 rounded-lg text-xs font-semibold text-center border ${
                userRole === 'farmer'
                  ? 'bg-[#164327] text-white border-[#164327]'
                  : 'bg-white text-[#444740] border-[#E5DFCE]'
              }`}
            >
              Farmer Mode
            </button>
            <button
              onClick={() => {
                handleRoleSwitch('buyer');
                setMobileMenuOpen(false);
              }}
              className={`h-9 rounded-lg text-xs font-semibold text-center border ${
                userRole === 'buyer'
                  ? 'bg-[#164327] text-white border-[#164327]'
                  : 'bg-white text-[#444740] border-[#E5DFCE]'
              }`}
            >
              Buyer Mode
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveTab('marketplace');
                setMobileMenuOpen(false);
              }}
              className={`w-full h-9 flex items-center gap-2 px-3 rounded-lg text-xs font-semibold ${
                activeTab === 'marketplace' ? 'bg-[#164327] text-white' : 'text-[#444740]'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Marketplace</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('mandi');
                setMobileMenuOpen(false);
              }}
              className={`w-full h-9 flex items-center gap-2 px-3 rounded-lg text-xs font-semibold ${
                activeTab === 'mandi' ? 'bg-[#164327] text-white' : 'text-[#444740]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Market Prices</span>
            </button>

            <button
              onClick={() => {
                handleSellClick();
                setMobileMenuOpen(false);
              }}
              className={`w-full h-9 flex items-center gap-2 px-3 rounded-lg text-xs font-semibold ${
                activeTab === 'farmer' ? 'bg-[#164327] text-white' : 'text-[#444740]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Sell</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('orders');
                setMobileMenuOpen(false);
              }}
              className={`w-full h-9 flex items-center justify-between px-3 rounded-lg text-xs font-semibold ${
                activeTab === 'orders' ? 'bg-[#164327] text-white' : 'text-[#444740]'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Orders</span>
              </div>
              {ordersCount > 0 && (
                <span className="bg-[#D97706] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                  {ordersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                onOpenAuthModal();
                setMobileMenuOpen(false);
              }}
              className="w-full h-9 flex items-center gap-2 px-3 rounded-lg text-xs font-semibold text-[#444740]"
            >
              <UserCheck className="w-4 h-4" />
              <span>Profile ({currentUser.name})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
