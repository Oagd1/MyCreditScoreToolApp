"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Typography } from "@mui/material";
import {
  Person,
  CreditCard,
  Insights,
  CheckCircle,
  TrendingUp,
  Security,
  Facebook,
  Twitter,
  LinkedIn,
} from "@mui/icons-material";
import { auth } from "./config/firebase";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const features = [
    {
      icon: <CreditCard fontSize="large" className="text-blue-600 dark:text-blue-400" />,
      title: "A Clearer Picture",
      desc: "See how the financial world views you when applying for credit.",
    },
    {
      icon: <Insights fontSize="large" className="text-green-600 dark:text-green-400" />,
      title: "Know Where You Stand",
      desc: "Avoid surprises by understanding how lenders view your credit.",
    },
    {
      icon: <CheckCircle fontSize="large" className="text-purple-600 dark:text-purple-400" />,
      title: "Access Better Deals",
      desc: "Improve your score to access better credit deals with lower rates.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-sans transition-colors duration-300">
      {/* Hero Section */}
      <header className="w-full max-w-6xl mx-auto text-center px-6 py-20">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl font-extrabold text-blue-700 dark:text-blue-400 tracking-wide drop-shadow-lg"
        >
          MyCreditScore
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mt-4 max-w-3xl mx-auto leading-relaxed"
        >
          Your <span className="font-bold">credit score & insights</span> made simple. Real-time updates, personalized tips, and secure data—for free, forever.
        </motion.p>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 flex flex-wrap justify-center gap-4"
        >
          {user ? (
            <Button
              onClick={() => router.push("/dashboard")}
              variant="contained"
              size="large"
              startIcon={<Person />}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 text-white px-8 py-3 rounded-full shadow-xl transition-transform duration-300"
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button
                onClick={() => router.push("/signup")}
                variant="contained"
                size="large"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 text-white px-8 py-3 rounded-full shadow-xl transition-transform duration-300"
              >
                Get Started
              </Button>
              <Button
                onClick={() => router.push("/login")}
                variant="outlined"
                size="large"
                className="text-blue-600 dark:text-blue-300 border-2 border-blue-600 dark:border-blue-300 px-8 py-3 rounded-full hover:bg-blue-100 dark:hover:bg-gray-700 transition-transform duration-300"
              >
                Log In
              </Button>
            </>
          )}
        </motion.div>
      </header>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto text-center px-6 py-14 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-gray-800 dark:text-white"
        >
          Why Knowing Your Score Matters
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 * index }}
              className="p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300 border border-gray-200 dark:border-gray-600"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-bold text-xl text-gray-800 dark:text-white">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 py-8 text-center transition-colors">
        <div className="flex justify-center gap-4 mb-4">
          <Facebook className="hover:text-blue-500 cursor-pointer" />
          <Twitter className="hover:text-sky-400 cursor-pointer" />
          <LinkedIn className="hover:text-blue-700 cursor-pointer" />
        </div>
        <Typography variant="body2">
          MyCreditScore &copy; {new Date().getFullYear()}
        </Typography>
      </footer>
    </div>
  );
}
