"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Box, Typography, CircularProgress } from "@mui/material";
import { Shield, TrendingUp, ErrorOutline, CheckCircle } from "@mui/icons-material";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("User"); // Default to "User"
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [percentage, setPercentage] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push("/");
      } else {
        setUser(currentUser);
        fetchUserData(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchUserData = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();

        // Extract First Name from fullName
        if (data.personalInfo && data.personalInfo.fullName) {
          const fullName = data.personalInfo.fullName;
          const firstNameExtracted = fullName.split(" ")[0]; // Get first name
          setFirstName(firstNameExtracted || "User");
        }

        setCreditScore(data.creditScore);
        setPercentage((data.creditScore / 710) * 100);

        if (data.onboarding) {
          generateInsights(data.onboarding);
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (data: any) => {
    if (!data) return;
    const dynamicInsights = [];

    // ✅ Credit Utilization
    if (parseInt(data.creditUtilization) < 30) {
      dynamicInsights.push({
        title: "Great Credit Utilization",
        description: "You're maintaining a low credit usage, which boosts your score!",
        icon: <CheckCircle sx={{ color: "green", fontSize: 40 }} />,
      });
    } else {
      dynamicInsights.push({
        title: "High Credit Utilization",
        description: "Consider reducing your credit usage below 30% to improve your score.",
        icon: <ErrorOutline sx={{ color: "red", fontSize: 40 }} />,
      });
    }

    // ✅ Payment History
    if (parseInt(data.missedPayments) === 0 && parseInt(data.latePayments) === 0) {
      dynamicInsights.push({
        title: "Excellent Payment History",
        description: "No missed or late payments! This greatly improves your credit health.",
        icon: <Shield sx={{ color: "blue", fontSize: 40 }} />,
      });
    } else {
      dynamicInsights.push({
        title: "Missed/Late Payments Detected",
        description: "Try to make timely payments to boost your credit score.",
        icon: <ErrorOutline sx={{ color: "orange", fontSize: 40 }} />,
      });
    }

    // ✅ Debt-to-Income Ratio
    const debtToIncome = parseInt(data.totalDebt) / (parseInt(data.monthlyIncome) || 1);
    if (debtToIncome < 0.4) {
      dynamicInsights.push({
        title: "Healthy Debt-to-Income Ratio",
        description: "Your debt is manageable relative to your income. Keep it up!",
        icon: <TrendingUp sx={{ color: "purple", fontSize: 40 }} />,
      });
    } else {
      dynamicInsights.push({
        title: "High Debt-to-Income Ratio",
        description: "Consider reducing your debt to improve financial health.",
        icon: <ErrorOutline sx={{ color: "red", fontSize: 40 }} />,
      });
    }

    setInsights(dynamicInsights);
  };

  const getScoreCategory = (score: number | null) => {
    if (score === null) return { label: "N/A", color: "#B0BEC5" };
    if (score >= 650) return { label: "Excellent", color: "#4CAF50" };
    if (score >= 550) return { label: "Good", color: "#FFC107" };
    if (score >= 450) return { label: "Fair", color: "#FF9800" };
    return { label: "Poor", color: "#F44336" };
  };

  const scoreCategory = getScoreCategory(creditScore);

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat text-gray-900"
         style={{ backgroundImage: "url('/background.jpg')", backgroundAttachment: "fixed" }}>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto px-6">

        <motion.h2 initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.6, delay: 0.2 }}
                   className="text-5xl font-extrabold text-white mt-24">
          Welcome, {firstName}
        </motion.h2>

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }} className="relative mt-8 flex flex-col items-center">
          <Box position="relative" display="inline-flex">
            <CircularProgress variant="determinate" value={creditScore !== null ? percentage : 0}
                              size={180} thickness={5} sx={{ color: scoreCategory.color }} />
            <Box position="absolute" top="50%" left="50%"
                 sx={{ transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Typography variant="h4" fontWeight="bold" color="white">{creditScore ?? "N/A"}</Typography>
              <Typography variant="subtitle1" className="bg-opacity-50 rounded-xl px-2 py-1 font-bold"
                          sx={{ backgroundColor: `${scoreCategory.color}30`, color: scoreCategory.color }}>
                {scoreCategory.label}
              </Typography>
            </Box>
          </Box>
        </motion.div>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-8 max-w-4xl bg-gray-100 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Latest Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 bg-white shadow rounded-xl text-center hover:bg-gray-100 transition-all">
                <div className="mb-3 bg-gray-200 p-3 rounded-full inline-block">{insight.icon}</div>
                <h3 className="text-lg font-semibold">{insight.title}</h3>
                <p className="text-gray-700">{insight.description}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
