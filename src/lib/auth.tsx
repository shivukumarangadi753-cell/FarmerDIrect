import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, BuyerType, District, Taluk } from '../types';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  avatar: string;
  district: District;
  taluk: Taluk;
  village?: string;
  buyer_type?: BuyerType;
  is_verified: boolean;
}

export const PRESET_PROFILES: UserProfile[] = [
  {
    id: 'user-farmer-1',
    name: 'Devaki Poojary',
    role: 'farmer',
    phone: '9845123456',
    avatar: '/images_farm/farmer-1.jpg',
    district: 'Udupi',
    taluk: 'Kaup',
    village: 'Mattu Village',
    is_verified: true,
  },
  {
    id: 'user-farmer-2',
    name: 'Mahabala Bhat',
    role: 'farmer',
    phone: '9448234567',
    avatar: '/images_farm/farmer-2.jpg',
    district: 'Dakshina Kannada',
    taluk: 'Belthangady',
    village: 'Ujire',
    is_verified: true,
  },
  {
    id: 'user-buyer-1',
    name: 'Ashweej',
    role: 'buyer',
    buyer_type: 'restaurant',
    phone: '9845998877',
    avatar: '/images_farm/buyer-1.jpeg',
    district: 'Dakshina Kannada',
    taluk: 'Mangalore',
    village: 'Hampankatta',
    is_verified: true,
  },
  {
    id: 'user-buyer-2',
    name: 'Kushith',
    role: 'buyer',
    buyer_type: 'household',
    phone: '9900112233',
    avatar: '/images_farm/buyer-2.jpeg',
    district: 'Dakshina Kannada',
    taluk: 'Mangalore',
    village: 'Kadri Hills',
    is_verified: true,
  },
];

interface AuthContextType {
  currentUser: UserProfile;
  switchProfile: (profileId: string) => void;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: PRESET_PROFILES[2], // Default: Ashweej (Buyer)
  switchProfile: () => {},
  setRole: () => {},
  isAuthenticated: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('farmdirect_auth_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.id === 'user-buyer-1') return PRESET_PROFILES[2];
        if (parsed.id === 'user-buyer-2') return PRESET_PROFILES[3];
        return parsed;
      }
    } catch {}
    return PRESET_PROFILES[2]; // Default: Ashweej (Buyer)
  });

  useEffect(() => {
    localStorage.setItem('farmdirect_auth_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const switchProfile = (profileId: string) => {
    const found = PRESET_PROFILES.find((p) => p.id === profileId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const setRole = (role: UserRole) => {
    if (currentUser.role === role) return;
    const defaultForRole = PRESET_PROFILES.find((p) => p.role === role) || PRESET_PROFILES[0];
    setCurrentUser(defaultForRole);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchProfile,
        setRole,
        isAuthenticated: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
