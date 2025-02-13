"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Import usePathname to track active page
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "../app/config/firebase";
import { Menu, Close, Notifications, Person } from "@mui/icons-material";
import { 
  HomeIcon, 
  DocumentTextIcon, 
  CreditCardIcon, 
  ArrowTrendingUpIcon, 
  ShieldCheckIcon 
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // Get current page path
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
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
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-md py-4 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
        
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push("/")}>
          <img src="/logo.svg" alt="MyCreditScore Logo" className="w-6 h-6" />
          <h1 className="text-xl font-semibold">MyCreditScore</h1>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <Close /> : <Menu />}
        </button>

        {/* Desktop Navigation */}
        <div className={`hidden md:flex space-x-6 items-center text-lg`}>
          {[
            { name: "Home", path: "/", icon: HomeIcon },
            { name: "Credit Health", path: "/credit-health", icon: DocumentTextIcon },
            { name: "Offers", path: "/offers", icon: CreditCardIcon },
            { name: "Improve", path: "/improve-credit", icon: ArrowTrendingUpIcon },
            { name: "Protect", path: "/protect", icon: ShieldCheckIcon }
          ].map(({ name, path, icon: Icon }) => (
            <Link key={name} href={path} passHref>
              <div className={`flex items-center px-4 py-2 rounded-full transition ${
                pathname === path ? "bg-gray-700 text-white" : "hover:text-yellow-300"
              }`}>
                <Icon className="w-5 h-5 mr-2" />
                {name}
              </div>
            </Link>
          ))}
        </div>

        {/* Right Section - Profile & Notifications */}
        <div className="flex items-center space-x-6">
          {/* Notification Bell */}
          <button className="relative">
            <Notifications className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full px-1">1</span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            {user ? (
              <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
                <Person className="w-6 h-6" />
                <span className="text-lg">Hey, {user.displayName || "User"}</span>
              </button>
            ) : (
              <button onClick={() => router.push("/login")} className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black rounded-md font-semibold transition">
                Log In
              </button>
            )}

            {isOpen && user && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-xl py-2 w-40">
                <button onClick={() => { setIsOpen(false); router.push("/profile"); }} className="block w-full text-left px-4 py-2 hover:bg-gray-200 transition">
                  Edit Profile
                </button>
                <button onClick={() => { setIsOpen(false); router.push("/settings"); }} className="block w-full text-left px-4 py-2 hover:bg-gray-200 transition">
                  Settings
                </button>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200 transition">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col space-y-4 bg-gray-800 text-white p-4 absolute top-16 left-0 w-full">
          {[
            { name: "Home", path: "/", icon: HomeIcon },
            { name: "Credit Health", path: "/credit-health", icon: DocumentTextIcon },
            { name: "Offers", path: "/offers", icon: CreditCardIcon },
            { name: "Improve", path: "/improve-credit", icon: ArrowTrendingUpIcon },
            { name: "Protect", path: "/protect", icon: ShieldCheckIcon }
          ].map(({ name, path, icon: Icon }) => (
            <Link key={name} href={path} passHref>
              <div className={`flex items-center px-4 py-2 transition ${
                pathname === path ? "bg-gray-700 text-white" : "hover:text-yellow-300"
              }`}>
                <Icon className="w-5 h-5 mr-2" />
                {name}
              </div>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
