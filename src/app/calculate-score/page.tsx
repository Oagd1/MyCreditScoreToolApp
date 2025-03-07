"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../config/firebase";
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { format } from "date-fns";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useTheme } from "../../context/themeContext"; 

export default function CalculateScore() {
  const router = useRouter();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [dob, setDob] = useState("");

  /** ✅ Fixed: Ensure `calculateCreditScore` is defined before calling `fetchFinancialData` */
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
    const monthlyIncome = data.monthlyIncome || 1;
    const availableCredit = data.availableCredit || 1;
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
    score -= dtiPenalty;
    score += (noMissedPaymentsBonus + lowUtilizationBonus + creditAgeBonus);

    return Math.max(0, Math.min(Math.round(score), 710)); // Ensure score is within 0-710 range
  };

  useEffect(() => {
    const fetchFinancialData = async (uid: string) => {
      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setError("No financial data found. Complete onboarding first.");
          router.push("/onboarding");
          return;
        }

        const userData = userSnap.data();
        console.log("✅ Fetched User Data:", userData);

        if (!userData.onboarding) {
          setError("Onboarding data is missing. Please complete onboarding.");
          router.push("/onboarding");
          return;
        }

        const rawDob = userData.dateOfBirth || "";
        setDob(rawDob ? format(new Date(rawDob), "dd-MM-yyyy") : "N/A");

        let calculatedScore = userData.creditScore || calculateCreditScore(userData.onboarding);
        setCreditScore(calculatedScore);

        if (!userData.creditScore) {
          await updateDoc(userRef, { creditScore: calculatedScore });
          const historyRef = collection(db, "users", uid, "creditHistory");
          await addDoc(historyRef, {
            timestamp: serverTimestamp(),
            score: calculatedScore,
          });

          console.log("✅ Credit history updated in Firestore.");
        }
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setError("Failed to load financial data.");
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchFinancialData(user.uid);
      } else {
        setError("User not logged in.");
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const getScoreColor = (score: number) => {
    if (score < 450) return "text-red-500";
    if (score < 600) return "text-yellow-500";
    if (score < 700) return "text-green-500";
    return "text-blue-500";
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className={`p-6 rounded-lg shadow-md text-center 
        ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>

        <h2 className="text-2xl font-bold text-blue-600 dark:text-yellow-400">Your Credit Score</h2>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-300 mt-4">Calculating your score...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="w-32 h-32 mx-auto mt-4">
              <CircularProgressbar
                value={creditScore || 0}
                maxValue={710}
                text={`${creditScore}`}
                styles={buildStyles({
                  textColor: theme === "dark" ? "#fff" : "#000",
                  pathColor: getScoreColor(creditScore!),
                  trailColor: theme === "dark" ? "#374151" : "#E5E7EB",
                })}
              />
            </div>

            <p className="text-gray-500 mt-4">Date of Birth: <strong>{dob}</strong></p>

            <div className="mt-6">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 text-white font-semibold rounded-lg transition-all 
                  bg-blue-600 hover:bg-blue-700 dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-black"
              >
                Go to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
