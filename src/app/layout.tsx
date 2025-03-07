"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar";
import { usePathname } from "next/navigation";
import { ThemeProvider, useTheme } from "../context/themeContext"; // ✅ Import ThemeProvider and useTheme
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider>
      <ThemeWrapper>{children}</ThemeWrapper>
    </ThemeProvider>
  );
}

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme } = useTheme(); // ✅ Get theme from context
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Condition to hide navbar on login and signup pages
  const hideNavbar = pathname === "/login" || pathname === "/signup";

  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen`}
      >
        {!hideNavbar && <Navbar />}
        <main className={!hideNavbar ? "pt-16" : ""}>
          {/* ✅ Prevents hydration mismatch */}
          {mounted ? children : null}
        </main>
      </body>
    </html>
  );
}
