// app/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Box, Button, Typography } from "@mui/material";
import { Person, CreditCard, Insights, CheckCircle } from "@mui/icons-material";
import { auth } from "./config/firebase"; // Firebase authentication

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
    { icon: <CreditCard fontSize="large" className="text-blue-600" />, title: "A clearer picture", desc: "Checking your score gives you a clear view of how the financial world sees you when you make applications." },
    { icon: <Insights fontSize="large" className="text-green-600" />, title: "Know where you stand", desc: "Avoid the shock of being rejected for credit by understanding how lenders may see you before you apply." },
    { icon: <CheckCircle fontSize="large" className="text-purple-600" />, title: "Access to better deals", desc: "As you improve your credit score, you’ll have a better chance of getting credit at lower rates." }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 text-gray-900">
      {/* Hero Section */}
      <header className="w-full max-w-6xl mx-auto text-center px-6 py-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
          className="text-5xl sm:text-6xl font-extrabold text-blue-700 tracking-wide"
        >
          MyCreditScore
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }} 
          className="text-lg sm:text-xl text-gray-700 mt-4 max-w-3xl mx-auto leading-relaxed"
        >
          Your <span className="font-bold">credit score & insights</span>, made simple. Get real-time updates,
          personalized financial tips, and secure data protection—for free, forever.
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
              className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-full shadow-lg transition-transform duration-300 ease-in-out"
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button
                onClick={() => router.push("/signup")}
                variant="contained"
                size="large"
                className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-full shadow-lg transition-transform duration-300 ease-in-out"
              >
                Get Started
              </Button>
              <Button
                onClick={() => router.push("/login")}
                variant="outlined"
                size="large"
                className="text-blue-600 border border-blue-600 px-8 py-3 rounded-full shadow-md hover:bg-blue-100 transition-transform duration-300 ease-in-out"
              >
                Log In
              </Button>
            </>
          )}
        </motion.div>
      </header>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto text-center px-6 py-12 bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-xl">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
          className="text-3xl font-bold text-gray-800"
        >
          Why it’s important to know your score
        </motion.h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5, delay: 0.2 * index }} 
              className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300 ease-in-out"
            >
              <Box className="mb-4">{feature.icon}</Box>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {feature.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" className="mt-2">
                {feature.desc}
              </Typography>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 bg-gray-900 text-gray-300 py-10 text-center">
        <Typography variant="body2">MyCreditScore &copy; {new Date().getFullYear()}</Typography>
      </footer>
    </div>
  );
}
