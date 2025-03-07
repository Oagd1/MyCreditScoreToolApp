"use client";

import { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navbar";
import { useTheme } from "../../context/themeContext"; // ✅ Dark mode support
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  PieController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";

ChartJS.register(BarElement, ArcElement, PieController, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement);

export default function ImproveCredit() {
  const { theme } = useTheme(); 
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [chartType, setChartType] = useState("bar");
  const [forecastModalOpen, setForecastModalOpen] = useState(false);
  const [forecastScore, setForecastScore] = useState<number>(0);
  const router = useRouter();

  const videos = [
    { title: "Credit Scores 101", url: "https://www.youtube.com/embed/XYZ123" },
    { title: "Building Credit from Scratch", url: "https://www.youtube.com/embed/ABC456" },
    { title: "Credit Utilization Explained", url: "https://www.youtube.com/embed/DEF789" },
    { title: "How to Avoid Common Mistakes", url: "https://www.youtube.com/embed/GHI101" }
  ];

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
        setForecastScore(score);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <Navbar />

      <motion.div className={`p-8 rounded-xl shadow-md mt-20 mb-6 text-center ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"}`}>
        <h1 className="text-4xl font-bold mb-2">Improve Your Credit Score</h1>
        <p className="text-lg">Take control of your credit with tailored insights and actions.</p>
        <button 
          onClick={() => setForecastModalOpen(true)}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          Take Charge of Your Credit
        </button>
      </motion.div>

      {/* Video Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mx-auto max-w-5xl">
        {videos.map((video, index) => (
          <div key={index} className={`p-4 rounded-lg shadow ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
            <iframe
              className="w-full h-40 rounded-lg"
              src={video.url}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <p className="text-center mt-2 font-medium">{video.title}</p>
          </div>
        ))}
      </div>

      {/* Credit Factor Breakdown Section */}
      <motion.div className={`p-6 rounded-lg shadow-md text-center mt-10 ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"}`}>
        <h2 className="text-2xl font-semibold mb-4">Credit Factor Breakdown</h2>
        <button
          onClick={() => setChartType(chartType === "bar" ? "pie" : "bar")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mb-4 transition"
        >
          {chartType === "bar" ? "Switch to Pie Chart" : "Switch to Bar Chart"}
        </button>
        <div className="flex justify-center">
          <div className="w-[80%] max-w-[400px]">
            {chartType === "bar" ? (
              <Bar 
                data={{ 
                  labels: ["Payment History", "Credit Utilization", "Credit Age", "Debt Ratio", "Credit Mix"], 
                  datasets: [{ label: "Impact on Credit Score", data: [35, 25, 15, 15, 10], backgroundColor: ["#4C82F7", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"], borderRadius: 5 }]
                }} 
              />
            ) : (
              <Pie 
                data={{ 
                  labels: ["Payment History", "Credit Utilization", "Credit Age", "Debt Ratio", "Credit Mix"], 
                  datasets: [{ data: [35, 25, 15, 15, 10], backgroundColor: ["#4C82F7", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"], borderRadius: 5 }]
                }} 
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* Forecast Modal */}
      <Dialog.Root open={forecastModalOpen} onOpenChange={setForecastModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          <Dialog.Content className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"}`}>
            <Dialog.Title className="text-lg font-bold">Take Charge of Your Credit</Dialog.Title>
            <Dialog.Description className="mt-2">
              Discover personalized strategies to boost your credit score and financial well-being.
            </Dialog.Description>
            <button className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md" onClick={() => setForecastModalOpen(false)}>Close</button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
