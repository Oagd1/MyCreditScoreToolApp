"use client";

import { createContext, useContext, useEffect, useState } from "react";

// ✅ Define ThemeContext type
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

// ✅ Create ThemeContext with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

// ✅ ThemeProvider Component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    // ✅ Ensures correct class is set on <html> instantly
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ✅ Custom Hook to use ThemeContext
export function useTheme() {
  return useContext(ThemeContext);
}
