"use client";

import { useState, useEffect } from "react";
import { auth } from "../config/firebase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Box, Typography, CircularProgress } from "@mui/material";
import { CreditCard, Shield, TrendingUp } from "@mui/icons-material";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [creditScore, setCreditScore] = useState<number>(667);
  const [percentage, setPercentage] = useState<number>((creditScore / 710) * 100);

  useEffect(() => {
    // Listen for authentication changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push("/"); // Redirect to homepage if not authenticated
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Credit Score Category
  const getScoreCategory = (score: number) => {
    if (score >= 650) return { label: "Excellent", color: "#4CAF50" };
    if (score >= 550) return { label: "Good", color: "#FFC107" };
    if (score >= 450) return { label: "Fair", color: "#FF9800" };
    return { label: "Poor", color: "#F44336" };
  };

  const scoreCategory = getScoreCategory(creditScore);

  // Mock insights data
  const insights = [
    {
      id: 1,
      title: "Great Credit Utilization",
      description: "You're maintaining a low credit usage. This boosts your score!",
      icon: <CreditCard fontSize="large" sx={{ color: "blue" }} />,
    },
    {
      id: 2,
      title: "No Recent Credit Checks",
      description: "Lenders see fewer hard inquiries as a positive sign.",
      icon: <Shield fontSize="large" sx={{ color: "green" }} />,
    },
    {
      id: 3,
      title: "Your Score is Improving!",
      description: "Your score has gone up by 20 points this month. Keep it up!",
      icon: <TrendingUp fontSize="large" sx={{ color: "purple" }} />,
    },
  ];

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat text-gray-900"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark Overlay for Better Visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto px-6">
        
        {/* Welcome Section */}
        <motion.h2
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl font-extrabold text-white mt-24"
          style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.6)" }}
        >
          Welcome, {user?.email?.split("@")[0]}
        </motion.h2>

        {/* Animated Credit Score Gauge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mt-8 flex flex-col items-center"
        >
          <Box position="relative" display="inline-flex">
            <CircularProgress
              variant="determinate"
              value={percentage}
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
                {creditScore}
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
      </div>

      {/* Insights Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative max-w-5xl mx-auto py-8 px-6 bg-white bg-opacity-90 rounded-xl shadow-xl backdrop-blur-md mt-12"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Latest Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * insight.id }}
              className="p-6 bg-white shadow-lg rounded-xl flex flex-col items-center text-center hover:shadow-2xl transition transform hover:scale-105 duration-300"
              style={{
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              }}
            >
              {insight.icon}
              <h3 className="text-xl font-semibold text-gray-800 mt-4">{insight.title}</h3>
              <p className="text-gray-600 mt-2">{insight.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative bg-black text-white text-center py-6 bg-opacity-80 z-10 mt-12">
        <p>MyCreditScore &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
