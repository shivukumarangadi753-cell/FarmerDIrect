import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, MapPin, Scale, Database } from 'lucide-react';

interface FooterProps {
  onOpenSupabaseModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSupabaseModal }) => {
  return (
    <footer className="bg-[#0F2E1B] text-[#D0C8B3] border-t border-[#1F5C36]/40 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Logo size="md" />
            </div>
            <p className="text-xs leading-relaxed text-[#A7DFB8]/90">
              Direct market access platform for smallholder and marginal farmers in Dakshina Kannada and Udupi, Karnataka. 
              Produce prices are compared with official mandi prices where available.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#59BB7B]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Direct farmer-to-buyer transactions</span>
            </div>
          </div>

          {/* Coastal Farming Belts */}
          <div>
            <h4 className="text-white text-xs font-semibold tracking-wide uppercase mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#59BB7B]" />
              <span>Coastal Karavali Belts</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-[#A7DFB8]/90">
              <li>Puttur & Sullia (Arecanut & Black Pepper)</li>
              <li>Kaup & Mattu (Mattu Gulla Brinjal)</li>
              <li>Shankarpura (Udupi Mallige Jasmine)</li>
              <li>Belthangady (Coastal Coconuts)</li>
              <li>Kundapura (Red Matta Rice)</li>
            </ul>
          </div>

          {/* Market Integrity & Technical Info */}
          <div>
            <h4 className="text-white text-xs font-semibold tracking-wide uppercase mb-3 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#59BB7B]" />
              <span>Price Benchmarks & System</span>
            </h4>
            <p className="text-xs leading-relaxed text-[#A7DFB8]/80 mb-3">
              Mandi prices reference official Agmarknet reports (Ministry of Agriculture & Farmers Welfare, GoI) where available.
            </p>
            {onOpenSupabaseModal && (
              <button
                onClick={onOpenSupabaseModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#164327] hover:bg-[#1F5C36] text-white text-xs font-medium border border-[#1F5C36] transition-colors"
              >
                <Database className="w-3.5 h-3.5 text-[#59BB7B]" />
                <span>Inspect Database & Schema</span>
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-[#1F5C36]/50 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A7DFB8]/70">
          <div>
            © 2026 FarmDirect — Direct Market Access for Marginal Farmers.
          </div>
          <div className="flex items-center gap-4">
            <span>Fair Prices. Fresh Produce. Direct Connections.</span>
            {onOpenSupabaseModal && (
              <button
                onClick={onOpenSupabaseModal}
                className="hover:text-white underline underline-offset-2 transition-colors"
              >
                Schema & RLS
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
