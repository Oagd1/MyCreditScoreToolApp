"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Box, Typography, CircularProgress } from "@mui/material";
import { CreditCard, Shield, TrendingUp, ErrorOutline, CheckCircle } from "@mui/icons-material";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
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
    const dynamicInsights = [];

    // ✅ Credit Utilization
    if (data.creditUtilization < 30) {
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
    if (data.missedPayments === 0 && data.latePayments === 0) {
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
    const debtToIncome = data.totalDebt / (data.monthlyIncome || 1);
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
  const username = user?.email ? user.email.split("@")[0] : "User";

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat text-gray-900"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl font-extrabold text-white mt-24"
          style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.6)" }}
        >
          Welcome, {username}
        </motion.h2>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mt-8 flex flex-col items-center"
        >
          <Box position="relative" display="inline-flex">
            <CircularProgress
              variant="determinate"
              value={creditScore !== null ? percentage : 0}
              size={180}
              thickness={5}
              sx={{ color: scoreCategory.color }}
            />
            <Box
              position="absolute"
              top="50%"
              left="50%"
              sx={{
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" fontWeight="bold" color="white">
                {creditScore !== null ? creditScore : "N/A"}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  backgroundColor: `${scoreCategory.color}30`,
                  color: scoreCategory.color,
                  px: 2,
                  py: 0.5,
                  borderRadius: "8px",
                  fontWeight: "bold",
                }}
              >
                {scoreCategory.label}
              </Typography>
            </Box>
          </Box>
        </motion.div>

        <p className="text-lg mt-4 font-medium text-white">Your current credit score</p>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative max-w-5xl mx-auto py-8 px-6 bg-white bg-opacity-90 rounded-xl shadow-xl backdrop-blur-md mt-12"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Latest Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white shadow-lg rounded-xl flex flex-col items-center text-center hover:shadow-2xl transition transform hover:scale-105 duration-300"
            >
              {insight.icon}
              <h3 className="text-xl font-semibold text-gray-800 mt-4">{insight.title}</h3>
              <p className="text-gray-600 mt-2">{insight.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
