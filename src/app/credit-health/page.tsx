"use client";

import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
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
        pointRadius: 5,
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
      },
    ],
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="bg-blue-700 text-white p-8 rounded-xl text-center shadow-lg mb-6">
        <h1 className="text-4xl font-bold mb-2">Start Understanding Your Credit Health</h1>
        <p className="text-lg">Analyze your credit score, track trends, and improve your financial well-being.</p>
      </div>

      <motion.div
        className="bg-white p-4 rounded-lg shadow-md mb-6 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-semibold mb-2">🎥 Welcome to Credit Health</h2>
        <iframe
        width="100%"
        height="400"
        src="https://www.youtube.com/embed/DSqorm91Wgg"
        title="Be Smart About Your Credit Health"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-md shadow-lg"
        ></iframe>

      </motion.div>

      <motion.div
        className="bg-white p-6 rounded-lg shadow-md mb-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">📈 Credit Score Trend</h2>
        <Line data={lineChartData} />
      </motion.div>

      <motion.div
        className="bg-white p-6 rounded-lg shadow-md mb-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">📊 Credit Factor Breakdown</h2>
        <Bar data={barChartData} />
      </motion.div>

      <motion.div
        className="bg-white p-4 rounded-lg shadow-md mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">✅ What to Do Next</h2>
        <ul className="space-y-4 text-gray-700">
          <li>🔗 <strong>Link Your Bank Account:</strong> See how lenders view your financial habits.</li>
          <li>👤 <strong>Verify Your Information:</strong> Ensure your credit report is accurate and up-to-date.</li>
          <li>📊 <strong>Review Your Credit Mix:</strong> Diversify to improve your score.</li>
        </ul>
      </motion.div>

      <motion.div
        className="bg-blue-50 p-4 rounded-md shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-semibold text-blue-700 mb-2">💡 Insights Just for You</h2>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Your score has improved by {Math.abs(historicalData[5] - creditScore!)} points in the last 6 months.</li>
          <li>Consider reducing your credit utilization for further improvement.</li>
          <li>Maintaining on-time payments will positively impact your score.</li>
        </ul>
      </motion.div>
    </motion.div>
  );
}
