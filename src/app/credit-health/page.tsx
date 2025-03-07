"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import * as framer from "framer-motion";
const { motion } = framer;

import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useTheme } from "../../context/themeContext"; // ✅ Import Theme Context

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, ArcElement);

export default function CreditHealth() {
  const { theme } = useTheme();
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [historicalData, setHistoricalData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const score = userSnap.data().creditScore;
        setCreditScore(score);

        const simulatedHistory = Array.from({ length: 6 }, (_, i) =>
          score - Math.floor(Math.random() * 50) + i * 5
        );
        setHistoricalData(simulatedHistory);
      }
      setLoading(false);
    };

    fetchData();
  }, [router]);

  const lineChartData = {
    labels: ["6M Ago", "5M Ago", "4M Ago", "3M Ago", "2M Ago", "1M Ago", "Now"],
    datasets: [
      {
        label: "Credit Score Trend",
        data: [...historicalData, creditScore],
        fill: true,
        borderColor: "#4CAF50",
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
      },
    ],
  };

  const pieChartData = {
    labels: [
      "Payment History",
      "Credit Utilization",
      "Credit Age",
      "Debt Ratio",
      "Credit Mix",
    ],
    datasets: [
      {
        label: "Impact on Credit Score",
        data: [35, 25, 15, 15, 10],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  return (
    <motion.div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 text-black dark:text-white">
      {/* HERO SECTION */}
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-6 md:p-8 rounded-xl text-center shadow-sm dark:shadow-md mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Understand Your Credit Health
        </h1>
        <p className="text-md md:text-lg">
          Track your score, analyze trends, and improve your financial well-being.
        </p>
      </div>

      {/* LEARN ABOUT CREDIT HEALTH */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-sm dark:shadow-md">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">
            🎥 Learn About Credit Health
          </h2>
          <iframe
            width="100%"
            height="300"
            src="https://www.youtube.com/embed/DSqorm91Wgg"
            title="Be Smart About Your Credit Health"
            frameBorder="0"
            allowFullScreen
            className="rounded-md"
          ></iframe>
        </div>
      </div>

      {/* YOUR CREDIT SCORE AND REPORT */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md dark:shadow-md">
          <h2 className="text-xl font-bold mb-1 text-gray-800 dark:text-gray-200 text-center">
            Your credit score and report
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
            We get weekly updates from Equifax
          </p>
          <div className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-blue-600 dark:border-blue-400 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-400">
                {creditScore !== null ? creditScore : "--"}
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-center">
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-300">Equifax</p>
            </div>
          </div>
        </div>
      </div>

      {/* SCORE TREND & FACTOR BREAKDOWN */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-sm dark:shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            📈 Credit Score Trend
          </h2>
          <Line data={lineChartData} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-sm dark:shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            🍰 Credit Factor Breakdown
          </h2>
          <Pie data={pieChartData} />
        </div>
      </div>
    </motion.div>
  );
}
