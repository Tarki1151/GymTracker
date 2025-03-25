import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

type CurrencyContextType = {
  currency: string;
  currencySymbol: string;
  formatCurrency: (amount: number) => string;
};

const defaultContext: CurrencyContextType = {
  currency: "TRY",
  currencySymbol: "₺",
  formatCurrency: (amount: number) => `₺${amount.toFixed(2)}`,
};

export const CurrencyContext = createContext<CurrencyContextType>(defaultContext);

type Setting = {
  id: number;
  key: string;
  value: string;
  updatedAt: string;
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState("TRY");
  const [currencySymbol, setCurrencySymbol] = useState("₺");

  // Ayarları getirmek için query
  const { data: settings } = useQuery<Setting[]>({ 
    queryKey: ['/api/settings']
  });
  
  // Ayarları değişkenlere atama
  useEffect(() => {
    if (settings) {
      const currencySetting = settings.find(setting => setting.key === 'currency');
      if (currencySetting) {
        setCurrency(currencySetting.value);
        setCurrencySymbol(getCurrencySymbolFromCode(currencySetting.value));
      }
    }
  }, [settings]);

  const getCurrencySymbolFromCode = (code: string): string => {
    switch (code) {
      case "TRY":
        return "₺";
      case "USD":
        return "$";
      case "EUR":
        return "€";
      default:
        return "₺";
    }
  };

  const formatCurrency = (amount: number): string => {
    return `${currencySymbol}${amount.toLocaleString(undefined, { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    })}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencySymbol,
        formatCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}