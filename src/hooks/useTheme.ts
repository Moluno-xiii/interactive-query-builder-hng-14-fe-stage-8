import { useContext } from "react";
import { ThemeContext, type ThemeContextValue } from "@/contexts/ThemeContext";

const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("Theme context was used outside its provider");

  return ctx;
};

export default useTheme;
