import React from 'react';
import { useAuth, PRESET_PROFILES, UserProfile } from '../../lib/auth';
import { X, UserCheck, Shield, Check, Phone, MapPin } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { currentUser, switchProfile } = useAuth();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[#FAF7F0] rounded-3xl border border-[#E5DFCE] shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0F2E1B] text-white">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#59BB7B]" />
            <div>
              <h3 className="text-lg font-bold">Active User Identity & Role</h3>
              <p className="text-xs text-[#A7DFB8]">
                Switch between Farmer and Buyer accounts to test role permissions
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

        {/* Profiles Selector */}
        <div className="p-6 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#63675E]">
            Select Persona:
          </div>

          <div className="space-y-2.5">
            {PRESET_PROFILES.map((profile) => {
              const isSelected = profile.id === currentUser.id;

              return (
                <div
                  key={profile.id}
                  onClick={() => {
                    switchProfile(profile.id);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-[#2D7A49] shadow-xs ring-1 ring-[#2D7A49]'
                      : 'bg-white/70 hover:bg-white border-[#E5DFCE]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#E5DFCE]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#0F2E1B]">{profile.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            profile.role === 'farmer'
                              ? 'bg-[#E2F6EB] text-[#164327]'
                              : 'bg-[#FEF3C7] text-[#92400E]'
                          }`}
                        >
                          {profile.role.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#63675E] flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#2D7A49]" />
                          {profile.village ? `${profile.village}, ` : ''}{profile.taluk}
                        </span>
                        <span>•</span>
                        <span>+91 {profile.phone}</span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="p-1 rounded-full bg-[#164327] text-white">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Role Policy Explanation */}
          <div className="p-3.5 rounded-2xl bg-[#E2F6EB] text-[#164327] text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#2D7A49]" />
              <span>Role Permissions Enforced:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#1F5C36]">
              • <strong>Farmers:</strong> Full access to create harvest lots, set direct prices, and accept/dispatch buyer purchase contracts.<br />
              • <strong>Buyers:</strong> Access to order direct lots, calculate APMC savings, and generate GST-exempt sale memos.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-white border-t border-[#E5DFCE] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#164327] text-white text-xs font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
