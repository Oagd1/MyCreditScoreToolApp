"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { auth, uploadProfilePicture } from "../config/firebase";

export default function Profile() {
  const [user, setUser] = useState(auth.currentUser);
  const [profilePic, setProfilePic] = useState<string>(user?.photoURL || "/default-avatar.png");
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setProfilePic(currentUser?.photoURL || "/default-avatar.png");
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const downloadURL = await uploadProfilePicture(file);
      setProfilePic(downloadURL);
    } catch (error) {
      console.error("Failed to upload profile picture:", (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Profile</h1>

      {/* Profile Picture Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img 
            src={profilePic} 
            alt="Profile" 
            className="w-32 h-32 rounded-full shadow-md border border-gray-300 object-cover"
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-full">
              <span className="text-sm text-gray-600">Uploading...</span>
            </div>
          )}
        </div>
        
        {/* File Input */}
        <label className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition">
          {uploading ? "Uploading..." : "Change Profile Picture"}
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      </div>

      {/* User Info */}
      <div className="text-lg text-center">
        <p><strong>Email:</strong> {user?.email}</p>
      </div>
    </div>
  );
}
