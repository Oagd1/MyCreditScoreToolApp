"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "../app/config/firebase";
import { Menu, Close, Notifications, Person } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import {
  HomeIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../context/themeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md py-4 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 w-full flex-nowrap">
        
        {/* Logo Section (Fixed Spacing & Prevented Shift) */}
        <div
          className="flex items-center min-w-max gap-x-4 cursor-pointer pr-4"
          onClick={() => router.push("/")}
        >
          <img src="/logo.svg" alt="MyCreditScore Logo" className="w-7 h-7" />
          <h1 className="text-xl font-semibold tracking-wide whitespace-nowrap">MyCreditScore</h1>
        </div>

        {/* Desktop Navigation (Prevented Alignment Shift) */}
        <div className="hidden md:flex gap-x-6 items-center text-lg">
          {[
            { name: "Home", path: "/", icon: HomeIcon },
            { name: "Credit Health", path: "/credit-health", icon: DocumentTextIcon },
            { name: "Offers", path: "/offers", icon: CreditCardIcon },
            { name: "Improve", path: "/improve-credit", icon: ArrowTrendingUpIcon },
            { name: "Protect", path: "/protect", icon: ShieldCheckIcon },
          ].map(({ name, path, icon: Icon }) => (
            <Link key={name} href={path} passHref>
              <div
                className={`flex items-center px-4 py-2 rounded-lg transition duration-300 ${
                  pathname === path
                    ? "bg-blue-600 text-white dark:bg-yellow-500 dark:text-black border-b-2 border-yellow-400"
                    : "hover:text-yellow-300 dark:hover:text-yellow-400"
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {name}
              </div>
            </Link>
          ))}
        </div>

        {/* Right Section - Theme Toggle, Profile & Notifications */}
        <div className="flex items-center gap-x-6">
          
          {/* Theme Toggle Button (Smooth Rotation) */}
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            whileTap={{ rotate: 180 }}
          >
            {theme === "light" ? (
              <MoonIcon className="w-6 h-6 text-gray-900" />
            ) : (
              <SunIcon className="w-6 h-6 text-yellow-400" />
            )}
          </motion.button>

          {/* Notification Bell (No Alerts) */}
          <button
            className="relative hover:scale-110 transition cursor-pointer"
            title="No new notifications"
          >
            <Notifications className="w-6 h-6" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {user ? (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 hover:scale-105 transition"
              >
                <Person className="w-6 h-6" />
                <span className="text-lg whitespace-nowrap pl-2">
                  Hey, {user.displayName || "User"}
                </span>
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black rounded-md font-semibold transition"
              >
                Log In
              </button>
            )}

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {isOpen && user && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-xl py-2 w-52 transition-colors"
                >
                  {/* ✅ Removed "Edit Profile" - No longer needed since it's inside Settings */}
                  
                  {/* ✅ Kept "Settings" - Users can still access their profile settings */}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/settings");
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
