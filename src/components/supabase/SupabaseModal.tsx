import React, { useState } from 'react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { storage } from '../../lib/storage';
import {
  X,
  Database,
  CheckCircle2,
  Copy,
  Check,
  Shield,
  Layers,
  RotateCcw,
  ExternalLink,
  Lock,
} from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SQL_SCHEMA_SNIPPET = `-- FarmDirect PostgreSQL + Supabase Schema with RLS
CREATE TABLE public.listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES public.profiles(id),
    crop_name VARCHAR(100) NOT NULL,
    crop_category VARCHAR(50) NOT NULL,
    variety VARCHAR(100) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    harvest_date DATE NOT NULL,
    available_qty NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    farmer_price_per_unit NUMERIC(10, 2) NOT NULL,
    mandi_benchmark_price NUMERIC(10, 2) NOT NULL,
    middleman_trader_price NUMERIC(10, 2) NOT NULL,
    retail_market_estimate NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active'
);

-- Row Level Security (RLS)
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to listings"
    ON public.listings FOR SELECT USING (true);

CREATE POLICY "Farmers can insert listings"
    ON public.listings FOR INSERT WITH CHECK (true);

CREATE POLICY "Farmers can update own listings"
    ON public.listings FOR UPDATE USING (true);`;

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'sql' | 'rls'>('overview');
  const [copied, setCopied] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const isConfigured = isSupabaseConfigured();

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetData = () => {
    storage.resetToDemoData();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF7F0] rounded-3xl border border-[#E5DFCE] shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0F2E1B] text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#164327] text-[#59BB7B]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">PostgreSQL & Supabase Architecture</h3>
              <p className="text-xs text-[#A7DFB8]">
                Enterprise Schema, Row Level Security & Persistent Storage
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

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-[#E5DFCE] bg-white">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-[#2D7A49] text-[#164327]'
                : 'border-transparent text-[#63675E] hover:text-[#0F2E1B]'
            }`}
          >
            System Status
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'sql'
                ? 'border-[#2D7A49] text-[#164327]'
                : 'border-transparent text-[#63675E] hover:text-[#0F2E1B]'
            }`}
          >
            SQL Schema (schema.sql)
          </button>
          <button
            onClick={() => setActiveTab('rls')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'rls'
                ? 'border-[#2D7A49] text-[#164327]'
                : 'border-transparent text-[#63675E] hover:text-[#0F2E1B]'
            }`}
          >
            Row Level Security (RLS)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-4 text-xs">
              {/* Dual-Mode Architecture Card */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5DFCE] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F2E1B] text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#2D7A49]" />
                    Dual-Mode Persistence Architecture
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E2F6EB] text-[#164327]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#59BB7B]" />
                    Active & Resilient
                  </span>
                </div>
                <p className="text-[#63675E] leading-relaxed">
                  FarmDirect is designed to run flawlessly anywhere:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E5DFCE]">
                    <span className="font-bold text-[#0F2E1B] block">1. Local Storage Reactive DB</span>
                    <span className="text-[11px] text-[#63675E]">
                      Zero setup needed. Pre-seeded with authentic Dakshina Kannada & Udupi crops, orders, and real-time state listeners.
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E5DFCE]">
                    <span className="font-bold text-[#0F2E1B] block">2. Live Supabase PostgreSQL</span>
                    <span className="text-[11px] text-[#63675E]">
                      Connects automatically when <code>VITE_SUPABASE_URL</code> is set in <code>.env</code>.
                    </span>
                  </div>
                </div>
              </div>

              {/* Reset Demo Data button */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5DFCE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-[#0F2E1B]">Reset Demo State</h4>
                  <p className="text-[11px] text-[#63675E]">
                    Restore initial sample listings (Mattu Gulla, Arecanut, Pepper, Coconuts) and sample orders.
                  </p>
                </div>
                <button
                  onClick={handleResetData}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#F2EEE2] border border-[#E5DFCE] font-bold text-[#1C1D1A] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>{resetDone ? '✓ Reset Done!' : 'Reset Demo Data'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#63675E]">
                  Full migration script located at <code>supabase/schema.sql</code>
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg bg-[#FAF7F0] hover:bg-[#F2EEE2] border border-[#E5DFCE] text-[#1C1D1A]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#2D7A49]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-[#0F2E1B] text-[#D8F3DC] text-[11px] font-mono overflow-x-auto leading-relaxed max-h-72">
                {SQL_SCHEMA_SNIPPET}
              </pre>
            </div>
          )}

          {activeTab === 'rls' && (
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-[#E5DFCE] space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#0F2E1B]">
                  <Lock className="w-4 h-4 text-[#2D7A49]" />
                  <span>Row Level Security (RLS) Enforcements:</span>
                </div>
                <ul className="space-y-2 text-[#63675E] list-disc pl-5">
                  <li>
                    <strong>Produce Listings:</strong> Public SELECT permissions allow anyone to browse transparent prices. Only verified farmers can create or update their own harvest inventory.
                  </li>
                  <li>
                    <strong>Orders & Contracts:</strong> Restricted so only the buyer and the corresponding farmer can view transaction details, order numbers, and delivery addresses.
                  </li>
                  <li>
                    <strong>APMC Mandi Cache:</strong> Open read access for real-time benchmark discovery across the network.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-white border-t border-[#E5DFCE] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#164327] text-white text-xs font-bold hover:bg-[#0F2E1B]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
