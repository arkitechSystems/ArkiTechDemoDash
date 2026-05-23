import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  defaultMonth: string;
  isDynamic: boolean;
  dynamicDays: number;
  saveSettings: (month: string, dynamic: boolean, days: number) => void;
  getDefaultMonth: () => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [defaultMonth, setDefaultMonth] = useState<string>('2026-03');
  const [isDynamic, setIsDynamic] = useState<boolean>(false);
  const [dynamicDays, setDynamicDays] = useState<number>(15);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedMonth = localStorage.getItem('defaultMonth');
    const savedDynamic = localStorage.getItem('isDynamic');
    const savedDays = localStorage.getItem('dynamicDays');

    if (savedMonth) setDefaultMonth(savedMonth);
    if (savedDynamic) setIsDynamic(savedDynamic === 'true');
    if (savedDays) setDynamicDays(parseInt(savedDays));
  }, []);

  // Calculate dynamic month based on current date
  const calculateDynamicMonth = (): string => {
    const today = new Date();
    const currentDay = today.getDate();

    let targetDate: Date;

    if (currentDay >= dynamicDays) {
      // On or after the dynamic day: use previous month
      targetDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    } else {
      // Before the dynamic day: use the month before previous month
      targetDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    }

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}`;
  };

  // Get the effective default month (either dynamic or fixed)
  const getDefaultMonth = (): string => {
    if (isDynamic) {
      return calculateDynamicMonth();
    }
    return defaultMonth;
  };

  // Save settings to localStorage
  const saveSettings = (month: string, dynamic: boolean, days: number) => {
    setDefaultMonth(month);
    setIsDynamic(dynamic);
    setDynamicDays(days);

    localStorage.setItem('defaultMonth', month);
    localStorage.setItem('isDynamic', dynamic.toString());
    localStorage.setItem('dynamicDays', days.toString());
  };

  return (
    <SettingsContext.Provider
      value={{
        defaultMonth,
        isDynamic,
        dynamicDays,
        saveSettings,
        getDefaultMonth,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
