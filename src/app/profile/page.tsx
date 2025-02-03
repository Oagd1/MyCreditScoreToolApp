"use client";
import { useState, useEffect } from "react";
import { auth, updateUserProfile, getUserData } from "../config/firebase";

export default function Profile() {
  const [user, setUser] = useState(auth.currentUser);
  const [userName, setUserName] = useState(""); // Updated from displayName
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState(""); // Remove if not needed
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
            setAddress(userData.address || ""); // Remove if not needed
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
      setUser((prevUser) => (prevUser ? { ...prevUser, displayName: userName } : null)); // Update UI
      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error("❌ Failed to update profile:", (error as Error).message);
      alert("⚠️ Error updating profile: " + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Profile</h1>

      {/* User Info */}
      <div className="text-lg text-center mb-4">
        <p><strong>Email:</strong> {user?.email}</p>
      </div>

      {/* Username Field */}
      <div className="flex flex-col items-center">
        <label className="text-lg font-medium">Username</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          disabled={saving}
          className="mt-2 p-2 border border-gray-300 rounded-md w-full max-w-sm text-center"
        />
      </div>

      {/* Full Name */}
      <div className="flex flex-col items-center mt-4">
        <label className="text-lg font-medium">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={saving}
          className="mt-2 p-2 border border-gray-300 rounded-md w-full max-w-sm text-center"
        />
      </div>

      {/* Date of Birth */}
      <div className="flex flex-col items-center mt-4">
        <label className="text-lg font-medium">Date of Birth</label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          disabled={saving}
          className="mt-2 p-2 border border-gray-300 rounded-md w-full max-w-sm text-center"
        />
      </div>

      {/* Address (Remove if not needed) */}
      <div className="flex flex-col items-center mt-4">
        <label className="text-lg font-medium">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={saving}
          className="mt-2 p-2 border border-gray-300 rounded-md w-full max-w-sm text-center"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleSaveChanges}
          className={`bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition ${
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
