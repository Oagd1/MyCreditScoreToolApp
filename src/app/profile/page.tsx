"use client";
import { useState, useEffect } from "react";
import { auth, updateUserProfile, getUserData } from "../config/firebase";

export default function Profile() {
  const [user, setUser] = useState(auth.currentUser);
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userData = await getUserData(currentUser.uid);
          if (userData) {
            setUserName(currentUser.displayName || userData.userName || "");
            setFullName(userData.fullName || "");
            setDateOfBirth(userData.dateOfBirth || "");
          }
        } catch (error) {
          console.error("❌ Error fetching user data:", (error as Error).message);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSaveChanges = async () => {
    if (!userName.trim() || !fullName.trim() || !dateOfBirth.trim()) return;
    setSaving(true);
    try {
      await updateUserProfile(userName, fullName, dateOfBirth);
      setUser((prevUser) => (prevUser ? { ...prevUser, displayName: userName } : null));
      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error("❌ Failed to update profile:", (error as Error).message);
      alert("⚠️ Error updating profile: " + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Edit Profile</h1>
      <div className="text-lg text-center mb-4 text-gray-700 dark:text-gray-300">
        <p><strong>Email:</strong> {user?.email}</p>
      </div>
      <div className="flex flex-col items-center">
        <label className="text-lg font-medium text-gray-900 dark:text-gray-300">Username</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          disabled={saving}
          className="mt-2 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md w-full max-w-sm text-center text-gray-900 dark:text-white"
        />
      </div>
      <div className="flex flex-col items-center mt-4">
        <label className="text-lg font-medium text-gray-900 dark:text-gray-300">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={saving}
          className="mt-2 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md w-full max-w-sm text-center text-gray-900 dark:text-white"
        />
      </div>
      <div className="flex flex-col items-center mt-4">
        <label className="text-lg font-medium text-gray-900 dark:text-gray-300">Date of Birth</label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          disabled={saving}
          className="mt-2 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md w-full max-w-sm text-center text-gray-900 dark:text-white"
        />
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={handleSaveChanges}
          className={`bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition dark:bg-green-700 dark:hover:bg-green-600 ${
            saving ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
