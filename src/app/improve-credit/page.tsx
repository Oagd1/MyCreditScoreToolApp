"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ImproveCredit() {
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
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

        const personalizedSuggestions = score < 600
          ? [
              "📉 Reduce credit utilization below 30%",
              "⏰ Make on-time payments consistently",
              "💼 Keep older accounts open for credit age boost",
            ]
          : [
              "📊 Maintain low credit utilization",
              "📚 Diversify your credit mix",
              "🚫 Limit new credit applications",
            ];

        setSuggestions(personalizedSuggestions);
      }
      setLoading(false);
    };

    fetchData();
  }, [router]);

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
      className="min-h-screen bg-gradient-to-r from-green-50 to-teal-100 p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="bg-green-700 text-white p-8 rounded-xl text-center shadow-lg mb-6">
        <h1 className="text-4xl font-bold mb-2">🌟 Improve Your Credit Score</h1>
        <p className="text-lg">Get personalized tips and actionable insights to boost your score.</p>
      </div>

      {/* 🎥 Video Section */}
      <motion.div
        className="bg-white p-4 rounded-lg shadow-md mb-6 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-semibold mb-4">🎥 Credit Tips for Students</h2>
        <iframe
          width="100%"
          height="400"
          src="https://www.youtube.com/embed/71iaNlskCc0"
          title="Credit Tips for Students"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-md shadow-lg"
        ></iframe>
      </motion.div>

      {/* 📊 Credit Factor Breakdown */}
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md mb-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">📊 Credit Factor Breakdown</h2>
        <Bar data={barChartData} />
      </motion.div>

      {/* ✅ Personalized Suggestions */}
      <motion.div
        className="bg-white p-4 rounded-lg shadow-md mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">✅ Personalized Suggestions</h2>
        <ul className="space-y-4 text-gray-700">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-center gap-2">
              👉 {suggestion}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
