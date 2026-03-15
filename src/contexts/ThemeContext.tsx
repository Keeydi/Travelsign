import React, { createContext, useContext, useEffect, useState } from 'react';
import { lightTheme, darkTheme, type ThemeShape } from '../theme';
import { getThemePreference, setThemePreference } from '../services/preferences';

type ThemeContextValue = {
  theme: ThemeShape;
  isDark: boolean;
  setDark: (isDark: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    getThemePreference().then(setIsDark);
  }, []);

  const setDark = (value: boolean) => {
    setIsDark(value);
    setThemePreference(value).catch(() => {});
  };

  const theme = isDark ? darkTheme : lightTheme;
  const value: ThemeContextValue = { theme, isDark, setDark };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: lightTheme,
      isDark: false,
      setDark: () => {},
    };
  }
  return ctx;
}
