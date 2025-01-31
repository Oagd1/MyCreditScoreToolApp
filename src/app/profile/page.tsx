"use client";
import { useState } from "react";
import { auth } from "../config/firebase";

export default function Profile() {
  const [user, setUser] = useState(auth.currentUser);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      <p>Email: {user?.email}</p>
      {/* Add profile editing fields here */}
    </div>
  );
}
