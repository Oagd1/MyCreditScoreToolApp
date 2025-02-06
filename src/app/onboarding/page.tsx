"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Onboarding() {
  const router = useRouter();
  const user = auth.currentUser;

  const [formData, setFormData] = useState({
    monthlyIncome: "",
    totalDebt: "",
    creditUtilization: "",
    creditAccounts: "",
    oldestAccountAge: "",
    missedPayments: "",
    latePayments: "",
    defaultedLoans: "",
    recentInquiries: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!user) {
        alert("You must be logged in to submit onboarding details.");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { onboarding: formData }, { merge: true });

      alert("✅ Onboarding complete! Redirecting to credit score calculation...");
      router.push("/calculate-score");
    } catch (error) {
      console.error("❌ Error saving onboarding data:", error);
      alert("Error submitting data. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Complete Your Onboarding</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="number" name="monthlyIncome" placeholder="Monthly Income (£)" onChange={handleChange} required className="w-full p-3 border rounded" />
          <input type="number" name="totalDebt" placeholder="Total Outstanding Debt (£)" onChange={handleChange} required className="w-full p-3 border rounded" />
          <input type="number" name="creditUtilization" placeholder="Credit Utilization (%)" onChange={handleChange} required className="w-full p-3 border rounded" />
          <input type="number" name="creditAccounts" placeholder="Number of Credit Accounts" onChange={handleChange} required className="w-full p-3 border rounded" />
          <input type="number" name="oldestAccountAge" placeholder="Oldest Account Age (Years)" onChange={handleChange} required className="w-full p-3 border rounded" />
          <input type="number" name="missedPayments" placeholder="Missed Payments" onChange={handleChange} required className="w-full p-3 border rounded" />
          <input type="number" name="latePayments" placeholder="Late Payments" onChange={handleChange} required className="w-full p-3 border rounded" />
          <input type="number" name="defaultedLoans" placeholder="Defaulted Loans" onChange={handleChange} required className="w-full p-3 border rounded" />
          <input type="number" name="recentInquiries" placeholder="Recent Credit Inquiries (Last 6 Months)" onChange={handleChange} required className="w-full p-3 border rounded" />

          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition">
            Complete Onboarding
          </button>
        </form>
      </div>
    </div>
  );
}
