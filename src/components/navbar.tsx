"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../app/config/firebase";

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
    <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-80 text-white shadow-lg py-4 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <h1
          className="text-2xl sm:text-3xl font-extrabold tracking-wide cursor-pointer"
          onClick={() => router.push("/")}
        >
          MyCreditScore
        </h1>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-6 text-lg font-semibold">
          <li
            className="hover:text-blue-400 transition-all duration-300 cursor-pointer"
            onClick={() => router.push("/")}
          >
            Home
          </li>
          <li
            className="hover:text-blue-400 transition-all duration-300 cursor-pointer"
            onClick={() => router.push("/credit-health")} // ✅ Navigate to Credit Health
          >
            Credit Health
          </li>
          <li className="hover:text-blue-400 transition-all duration-300 cursor-pointer">Offers</li>
          <li className="hover:text-blue-400 transition-all duration-300 cursor-pointer">Improve</li>
          <li className="hover:text-blue-400 transition-all duration-300 cursor-pointer">Protect</li>
        </ul>

        {/* Profile Dropdown */}
        <div className="relative">
          {user ? (
            <button onClick={() => setIsOpen(!isOpen)} className="text-md flex items-center space-x-2">
              <img
                src={user.photoURL || "/default-avatar.png"} // Default avatar if no profile picture is set
                alt="Profile"
                className="w-10 h-10 rounded-full border border-white shadow-md"
              />
              <span className="text-lg">⏷</span>
            </button>
          ) : (
            <button onClick={() => router.push("/login")} className="text-md font-semibold hover:text-blue-400">
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
