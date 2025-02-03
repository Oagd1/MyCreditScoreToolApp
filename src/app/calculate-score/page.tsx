"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function CalculateScore() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [error, setError] = useState("");

  /** ✅ Fetch User Financial Data */
  useEffect(() => {
    const fetchFinancialData = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("User not logged in.");
          router.push("/login");
          return;
        }

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists() || !userSnap.data().onboarding) {
          setError("No financial data found. Complete onboarding first.");
          router.push("/onboarding");
          return;
        }

        const userData = userSnap.data().onboarding;
        const score = calculateCreditScore(userData);
        setCreditScore(score);

        // ✅ Save the calculated score in Firestore
        await setDoc(userRef, { creditScore: score }, { merge: true });

        setTimeout(() => {
          router.push("/dashboard"); // Redirect after showing score
        }, 5000);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load financial data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [router]);

  /** ✅ TransUnion Credit Score Calculation */
  const calculateCreditScore = (data: any): number => {
    let score = 710; // Max TransUnion score

    // ✅ Payment History (40%)
    const missedPaymentsPenalty = data.missedPayments * 15;
    const latePaymentsPenalty = data.latePayments * 10;
    score -= (missedPaymentsPenalty + latePaymentsPenalty) * 0.4;

    // ✅ Credit Utilization (30%)
    const utilization = data.creditUtilization || 0;
    if (utilization > 30) {
      score -= ((utilization - 30) * 2) * 0.3; // Higher utilization → Lower score
    }

    // ✅ Credit Age (10%)
    const creditAge = data.oldestAccountAge || 0;
    score += Math.min(creditAge * 2, 10); // Older accounts = Higher score

    // ✅ Debt-to-Income Ratio (10%)
    const debtToIncome = data.totalDebt / (data.monthlyIncome || 1); // Avoid division by zero
    if (debtToIncome > 0.4) {
      score -= (debtToIncome * 10) * 0.1; // Higher debt → Lower score
    }

    // ✅ Recent Credit Applications (5%)
    score -= data.recentInquiries * 5 * 0.05; // More applications → Slightly lower score

    // ✅ Credit Mix (5%)
    const creditMixScore = data.creditAccounts > 3 ? 10 : data.creditAccounts * 2;
    score += creditMixScore * 0.05; // More variety = Higher score

    return Math.max(0, Math.min(Math.round(score), 710)); // Ensure score is within 0-710 range
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-blue-600">Your Credit Score</h2>

        {loading ? (
          <p className="text-gray-600 mt-4">Calculating your score...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <p className="text-4xl font-semibold mt-4">{creditScore}</p>
            <p className="text-gray-600 mt-2">
              Based on your financial data, your TransUnion-style credit score is calculated.
            </p>

            <div className="mt-6">
              <p className="text-gray-500">Redirecting to your dashboard...</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
