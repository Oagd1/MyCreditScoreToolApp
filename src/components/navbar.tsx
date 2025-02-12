"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "../app/config/firebase";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../components/ui/navigation-menu";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
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
      router.push("/"); // Redirect to homepage after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-90 text-white shadow-md py-4 z-50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <h1
          className="text-2xl sm:text-3xl font-extrabold tracking-wide cursor-pointer"
          onClick={() => router.push("/")}
        >
          MyCreditScore
        </h1>

        {/* ShadCN Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-6 text-lg font-semibold">
            <NavigationMenuItem>
              <Link href="/" passHref legacyBehavior>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Credit Health</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="p-4 w-48">
                  <li>
                    <NavigationMenuLink
                      asChild
                      className="block px-4 py-2 hover:bg-gray-100 text-black rounded-md"
                    >
                      <Link href="/credit-health">Overview</Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink
                      asChild
                      className="block px-4 py-2 hover:bg-gray-100 text-black rounded-md"
                    >
                      <Link href="/improve-credit">Improve Credit</Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/offers" passHref legacyBehavior>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Offers
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/protect" passHref legacyBehavior>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Protect
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Profile Dropdown */}
        <div className="relative">
          {user ? (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-2"
            >
              <img
                src={user.photoURL || "/default-avatar.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
              />
              <span className="text-lg">⏷</span>
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="text-md font-semibold hover:text-blue-400"
            >
              Log In
            </button>
          )}

          {isOpen && user && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg py-2 w-40">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/profile");
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Edit Profile
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/settings");
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
