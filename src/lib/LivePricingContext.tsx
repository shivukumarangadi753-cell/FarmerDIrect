import React, { createContext, useContext, useState, useEffect } from 'react';
import { MandiRecord } from '../types';
import {
  fetchKarnatakaMandiPrices,
  matchLiveMandiPrice,
  MandiDataStatus,
  MandiFetchResult,
} from './mandiApi';
import { COASTAL_MANDI_BENCHMARKS } from '../data/mandiBenchmarks';

export interface LivePricingContextType {
  status: MandiDataStatus;
  records: MandiRecord[];
  lastFetchedAt: string;
  sourceDescription: string;
  totalRecords: number;
  isLoading: boolean;
  refreshPrices: (forceDemo?: boolean) => Promise<void>;
  getLivePrice: (
    cropName: string,
    fallbackPrice: number
  ) => {
    mandiPrice: number;
    marketName: string;
    isLive: boolean;
    arrivalDate: string;
  };
}

const LivePricingContext = createContext<LivePricingContextType | undefined>(undefined);

export const LivePricingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [records, setRecords] = useState<MandiRecord[]>(COASTAL_MANDI_BENCHMARKS);
  const [status, setStatus] = useState<MandiDataStatus>('LIVE');
  const [lastFetchedAt, setLastFetchedAt] = useState<string>('');
  const [sourceDescription, setSourceDescription] = useState<string>(
    'Official Data.gov.in (Agmarknet) Live Feed'
  );
  const [totalRecords, setTotalRecords] = useState<number>(COASTAL_MANDI_BENCHMARKS.length);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshPrices = async (forceDemo: boolean = false) => {
    setIsLoading(true);
    try {
      const result: MandiFetchResult = await fetchKarnatakaMandiPrices(forceDemo);
      setRecords(result.data);
      setStatus(result.status);
      setLastFetchedAt(result.lastFetchedAt);
      setSourceDescription(result.sourceDescription);
      setTotalRecords(result.totalRecords);
    } catch (e) {
      console.error('Failed to fetch live mandi prices:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch of real-time mandi prices on mount using .env API key
    refreshPrices(false);

    // Refresh every 10 minutes to maintain real-time live prices
    const interval = setInterval(() => {
      refreshPrices(false);
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getLivePrice = (cropName: string, fallbackPrice: number) => {
    return matchLiveMandiPrice(cropName, records, fallbackPrice);
  };

  return (
    <LivePricingContext.Provider
      value={{
        status,
        records,
        lastFetchedAt,
        sourceDescription,
        totalRecords,
        isLoading,
        refreshPrices,
        getLivePrice,
      }}
    >
      {children}
    </LivePricingContext.Provider>
  );
};

export function useLivePricing(): LivePricingContextType {
  const context = useContext(LivePricingContext);
  if (!context) {
    throw new Error('useLivePricing must be used within a LivePricingProvider');
  }
  return context;
}
