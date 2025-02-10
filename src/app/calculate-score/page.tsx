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
        console.log("Fetched User Data:", userData); // Debug log

        const score = calculateCreditScore(userData);
        setCreditScore(isNaN(score) ? null : score); // Handle NaN gracefully

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

  /** ✅ Updated TransUnion Credit Score Calculation */
  const calculateCreditScore = (data: any): number => {
    let score = 300; // Base Score

    // ✅ Prevent undefined values with defaults
    const missedPayments = data.missedPayments || 0;
    const latePayments = data.latePayments || 0;
    const defaultedLoans = data.defaultedLoans || 0;
    const creditUtilization = data.creditUtilization || 0;
    const creditAccounts = data.creditAccounts || 0;
    const oldestAccountAge = data.oldestAccountAge || 0;
    const totalDebt = data.totalDebt || 0;
    const monthlyIncome = data.monthlyIncome || 1; // Prevent division by zero
    const availableCredit = data.availableCredit || 1; // Prevent division by zero
    const recentInquiries = data.recentInquiries || 0;

    // ✅ Payment History (40%)
    const paymentHistoryScore = (1 - (missedPayments * 0.03 + latePayments * 0.02 + defaultedLoans * 0.05)) * 284;

    // ✅ Age & Credit Mix (21%)
    const creditMixScore = Math.min(149, (creditAccounts * 7) + (oldestAccountAge / 120) * 70);

    // ✅ Credit Utilization (20%)
    const utilizationPenalty = creditUtilization > 30 ? (creditUtilization - 30) * 1.5 : 0;
    const creditUtilizationScore = Math.max(0, 142 - utilizationPenalty);

    // ✅ Balances (11%)
    const balancePenalty = totalDebt > availableCredit * 0.5 ? (totalDebt - (availableCredit * 0.5)) * 0.05 : 0;
    const balanceScore = Math.max(0, 78 - balancePenalty);

    // ✅ New Credit (5%)
    const newCreditPenalty = Math.min(35, recentInquiries * 7);
    const newCreditScore = 35 - newCreditPenalty;

    // ✅ Available Credit (3%)
    const availableCreditScore = Math.min(21, (availableCredit / (availableCredit + totalDebt)) * 21);

    // ✅ Debt-to-Income Ratio (DTI) Penalty
    const dti = (totalDebt / monthlyIncome) * 100;
    const dtiPenalty = dti > 35 ? (dti - 35) * 1.2 : 0;

    // ✅ Bonus System
    const noMissedPaymentsBonus = missedPayments === 0 ? 20 : 0;
    const lowUtilizationBonus = creditUtilization < 10 ? 15 : 0;
    const creditAgeBonus = oldestAccountAge > 60 ? 10 : 0;

    // ✅ Final Score Calculation
    score += paymentHistoryScore;
    score += creditMixScore;
    score += creditUtilizationScore;
    score += balanceScore;
    score += newCreditScore;
    score += availableCreditScore;

    // Apply Penalties
    score -= dtiPenalty;

    // Apply Bonuses
    score += (noMissedPaymentsBonus + lowUtilizationBonus + creditAgeBonus);

    console.log("Calculated Score:", score); // Debug log

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
        ) : creditScore === null ? (
          <p className="text-red-500">Unable to calculate credit score. Please check your financial data.</p>
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
