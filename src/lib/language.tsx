import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'kn';

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    tagline: 'Fair Prices. Fresh Produce. Direct Connections.',
    marketplace: 'Marketplace',
    farmer_hub: 'Farmer Center',
    mandi_tracker: 'Mandi Intelligence',
    my_orders: 'Orders & Receipts',
    post_produce: 'List Produce',
    farmer_mode: 'Farmer View',
    buyer_mode: 'Buyer View',
    apmc_benchmark: 'Official APMC Benchmark',
    middleman_cut: 'Middleman Cut Avoided',
    buyer_savings: 'Buyer Savings',
    gi_certified: 'Authentic GI Tagged',
    organic: '100% Organic',
    buy_direct: 'Buy Direct',
    negotiate_deal: 'Order Lot',
    harvest_freshness: 'Fresh Harvest',
    all_taluks: 'All Taluks (DK & Udupi)',
    all_categories: 'All Categories',
    search_placeholder: 'Search Mattu Gulla, Arecanut, Pepper, Coconuts, Rice...',
    live_mandi_feed: 'Official Karnataka Mandi Rates (Data.gov.in Live)',
    platform_motto: 'Eliminating predatory middlemen across Dakshina Kannada & Udupi',
  },
  kn: {
    tagline: 'ನ್ಯಾಯೋಚಿತ ಬೆಲೆ • ತಾಜಾ ಬೆಳೆ • ನೇರ ಸಂಪರ್ಕ',
    marketplace: 'ನೇರ ಮಾರುಕಟ್ಟೆ',
    farmer_hub: 'ರೈತರ ಕೇಂದ್ರ',
    mandi_tracker: 'ಮಂಡಿ ಬೆಲೆ ಮಾಹಿತಿ',
    my_orders: 'ನನ್ನ ಆರ್ಡರ್‌ಗಳು',
    post_produce: 'ಬೆಳೆ ಪ್ರಕಟಿಸಿ',
    farmer_mode: 'ರೈತರ ವಲಯ',
    buyer_mode: 'ಖರೀದಿದಾರರ ವಲಯ',
    apmc_benchmark: 'ಅಧಿಕೃತ ಎಪಿಎಂಸಿ ದರ',
    middleman_cut: 'ದಲ್ಲಾಳಿ ಕಮಿಷನ್ ಉಳಿತಾಯ',
    buyer_savings: 'ಗ್ರಾಹಕರ ಉಳಿತಾಯ',
    gi_certified: 'ಭೌಗೋಳಿಕ ಮಾನ್ಯತೆ (GI)',
    organic: 'ಸಾವಯವ ಪ್ರಮಾಣಿತ',
    buy_direct: 'ನೇರ ಖರೀದಿ',
    negotiate_deal: 'ಆರ್ಡರ್ ಮಾಡಿ',
    harvest_freshness: 'ತಾಜಾ ಕೊಯ್ಲು',
    all_taluks: 'ಎಲ್ಲಾ ತಾಲೂಕುಗಳು (ದ.ಕ ಮತ್ತು ಉಡುಪಿ)',
    all_categories: 'ಎಲ್ಲಾ ವರ್ಗಗಳು',
    search_placeholder: 'ಮಟ್ಟು ಗುಳ್ಳ, ಅಡಿಕೆ, ಕರಿಮೆಣಸು, ತೆಂಗಿನಕಾಯಿ, ಕುಚಲಕ್ಕಿ ಹುಡುಕಿ...',
    live_mandi_feed: 'ಕರ್ನಾಟಕ ಎಪಿಎಂಸಿ ಅಧಿಕೃತ ದೈನಂದಿನ ದರ (Data.gov.in)',
    platform_motto: 'ದಕ್ಷಿಣ ಕನ್ನಡ ಮತ್ತು ಉಡುಪಿ ಜಿಲ್ಲೆಯ ರೈತರಿಗೆ ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದ ನೇರ ಮಾರುಕಟ್ಟೆ',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('farmdirect_lang') as Language;
    if (saved === 'en' || saved === 'kn') {
      setLang(saved);
    }
  }, []);

  const handleSetLang = (l: Language) => {
    setLang(l);
    localStorage.setItem('farmdirect_lang', l);
  };

  const t = (key: string): string => {
    return translations[lang][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
