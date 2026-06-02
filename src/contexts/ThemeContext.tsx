"use client";

import { createContext, useSyncExternalStore, type ReactNode } from "react";
import { type Theme } from "@/lib/theme";
import { storageKeys } from "@/lib/storage-keys";

interface ThemeContextValue {
  theme: Theme;
  applyTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};
const getSnapshot = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
const getServerSnapshot = (): Theme => "dark";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const applyTheme = (next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(storageKeys.theme.mode, JSON.stringify(next));
    listeners.forEach((l) => l());
  };

  const toggleTheme = () => applyTheme(theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, applyTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext };
export type { ThemeContextValue };
export default ThemeProvider;
