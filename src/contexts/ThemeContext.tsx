import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ThemeColor = string;

interface ThemeContextType {
  theme: Theme;
  themeColor: ThemeColor;
  setTheme: (theme: Theme) => void;
  setThemeColor: (color: ThemeColor) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultPresets = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [themeColor, setThemeColor] = useState<ThemeColor>("#3b82f6");

  useEffect(() => {
    const savedTheme = localStorage.getItem("lawdesk-theme") as Theme;
    const savedColor = localStorage.getItem("lawdesk-theme-color");

    if (savedTheme) setTheme(savedTheme);
    if (savedColor) setThemeColor(savedColor);
  }, []);

  useEffect(() => {
    localStorage.setItem("lawdesk-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("lawdesk-theme-color", themeColor);

    // Convert hex to RGB for CSS variables
    const hex = themeColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    document.documentElement.style.setProperty(
      "--theme-primary",
      `${r} ${g} ${b}`,
    );
  }, [themeColor]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value = {
    theme,
    themeColor,
    setTheme,
    setThemeColor,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export { defaultPresets };
