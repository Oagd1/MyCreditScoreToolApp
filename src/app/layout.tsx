"use client"; // ✅ Ensures client-side functionality

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar";
import { usePathname } from "next/navigation"; // ✅ Import for path checking

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
  const pathname = usePathname(); // ✅ Get the current path

  // ✅ Condition to hide navbar on login and signup pages
  const hideNavbar = pathname === "/login" || pathname === "/signup";

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ✅ Conditionally Render Navbar */}
        {!hideNavbar && <Navbar />}
        
        <main className={!hideNavbar ? "pt-16" : ""}>
          {children}
        </main>
      </body>
    </html>
  );
}
