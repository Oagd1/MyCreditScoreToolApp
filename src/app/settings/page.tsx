"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../../context/themeContext"; // ✅ Global Theme Context
import { Switch } from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Lock,
  Notifications,
  Person,
  Mail,
} from "@mui/icons-material";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState("Test1");
  const [fullName, setFullName] = useState("Test User1");
  const [dob, setDob] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [activeSection, setActiveSection] = useState("profile");
  const router = useRouter();

  useEffect(() => {
    if (window.location.pathname === "/profile") {
      router.push("/settings#profile");
    }
  }, []);

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Settings
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Manage your account settings and preferences.
      </p>

      {/* 🔹 Sidebar Navigation */}
      <div className="grid md:grid-cols-4 gap-8">
        {/* Left Sidebar (Only visible on larger screens) */}
        <div className="hidden md:block">
          <nav className="space-y-3 border-r pr-4">
            {[
              { id: "profile", label: "Profile", icon: <Person fontSize="small" /> },
              { id: "security", label: "Security", icon: <Lock fontSize="small" /> },
              {
                id: "appearance",
                label: "Appearance",
                icon: theme === "light" ? (
                  <Brightness7 fontSize="small" />
                ) : (
                  <Brightness4 fontSize="small" />
                ),
              },
              { id: "notifications", label: "Notifications", icon: <Mail fontSize="small" /> },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => handleSectionClick(id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all
                  ${
                    activeSection === id
                      ? "bg-blue-600 text-white dark:bg-gray-700 dark:text-white"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
              >
                {icon} {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Content Section */}
        <div className="col-span-3 space-y-8">
          {/* 🔹 Profile Section */}
          <div id="profile" className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Profile
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Update your personal information.
            </p>

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              value={username}
              className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white mb-4"
              disabled
            />

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <button className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700">
              Save Changes
            </button>
          </div>

          {/* 🔹 Security Section */}
          <div id="security" className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Security
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Manage your account security settings.
            </p>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
              Change Password
            </button>
          </div>

          {/* 🔹 Appearance Section */}
          <div id="appearance" className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Appearance
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Customize your theme preferences.
            </p>
            <Switch checked={theme === "dark"} onChange={toggleTheme} />
          </div>

          {/* 🔹 Notifications Section */}
          <div id="notifications" className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Notifications
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Manage your notification settings.
            </p>
            <Switch checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} />
          </div>
        </div>
      </div>
    </div>
  );
}
