"use client";

import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import * as framer from "framer-motion";
const { motion } = framer;

import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js registration
ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function CreditHealth() {
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

        const simulatedHistory = Array.from({ length: 6 }, (_, i) => {
          return score - Math.floor(Math.random() * 50) + i * 5;
        });
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
        fill: false,
        borderColor: "#4CAF50",
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: "#4CAF50",
      },
    ],
  };

  const barChartData = {
    labels: ["Payment History", "Credit Utilization", "Credit Age", "Debt Ratio", "Credit Mix"],
    datasets: [
      {
        label: "Impact on Credit Score",
        data: [35, 25, 15, 15, 10],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        borderRadius: 5,
      },
    ],
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-100 p-4 md:p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="bg-blue-600 text-white p-6 md:p-8 rounded-xl text-center shadow-md mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Understand Your Credit Health</h1>
        <p className="text-md md:text-lg">Track your score, analyze trends, and improve financial well-being.</p>
      </div>

      <motion.div
        className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl md:text-2xl font-semibold mb-3">🎥 Learn About Credit Health</h2>
        <iframe
          width="100%"
          height="300"
          src="https://www.youtube.com/embed/DSqorm91Wgg"
          title="Be Smart About Your Credit Health"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-md"
        ></iframe>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="bg-white p-4 md:p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-3">📈 Credit Score Trend</h2>
          <Line data={lineChartData} />
        </motion.div>

        <motion.div
          className="bg-white p-4 md:p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-3">📊 Credit Factor Breakdown</h2>
          <Bar data={barChartData} />
        </motion.div>
      </div>

      <motion.div
        className="bg-white p-4 md:p-6 rounded-lg shadow-md mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-3">✅ Next Steps</h2>
        <ul className="space-y-3 text-gray-700">
          <li>🔗 <strong>Link Your Bank Account:</strong> Gain insights into your financial habits.</li>
          <li>👤 <strong>Verify Your Information:</strong> Ensure your credit report is accurate.</li>
          <li>📊 <strong>Review Your Credit Mix:</strong> Diversify to boost your score.</li>
        </ul>
      </motion.div>

      <motion.div
        className="bg-blue-50 p-4 md:p-6 rounded-lg shadow-sm mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-xl font-semibold text-blue-700 mb-2">💡 Personalized Insights</h2>
        <ul className="list-disc ml-5 text-gray-700 space-y-1">
          <li>Your score improved by {Math.abs(historicalData[5] - creditScore!)} points in the last 6 months.</li>
          <li>Reduce credit utilization for further improvements.</li>
          <li>On-time payments have a positive impact on your score.</li>
        </ul>
      </motion.div>
    </motion.div>
  );
}
