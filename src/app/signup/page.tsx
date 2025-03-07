"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, UserCredential } from "firebase/auth";
import { Eye, EyeOff, Loader2, Calendar as CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function SignUp() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /** ✅ Step 1: Check if Email Exists */
  const checkEmail = async () => {
    setLoading(true);
    setError("");
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        setError("This email is already in use.");
      } else {
        setStep(2);
      }
    } catch (err: any) {
      setError("Invalid email address.");
    }
    setLoading(false);
  };

  /** ✅ Step 3: Handle Sign-Up */
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (!userCredential.user) {
        throw new Error("Sign-up failed. No user returned from Firebase.");
      }

      const user = userCredential.user;
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email,
        createdAt: new Date().toISOString(),
        personalInfo: {
          userName,
          fullName,
          dateOfBirth: dateOfBirth ? format(dateOfBirth, "yyyy-MM-dd") : null,
        },
        security: {
          passwordLastUpdated: new Date().toISOString(),
        },
      });

      alert("✅ Sign-up successful! Redirecting to onboarding...");
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message || "Sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Sign Up</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* ✅ Step 1: Email Entry */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              onClick={checkEmail}
              className="w-full bg-blue-600 text-white p-3 rounded-lg mt-4"
            >
              {loading ? "Checking..." : "Continue"}
            </button>
          </>
        )}

        {/* ✅ Step 2: Personal Information */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 border rounded-lg"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border rounded-lg mt-3"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <div className="relative mt-3">
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <DatePicker
                selected={dateOfBirth}
                onChange={(date: Date | null) => setDateOfBirth(date)}
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                maxDate={new Date()}
                className="w-full p-3 border rounded-lg"
                placeholderText="Select Date of Birth"
              />
            </div>
            <button
              onClick={() => setStep(3)}
              className="w-full bg-blue-600 text-white p-3 rounded-lg mt-4"
            >
              Continue
            </button>
          </>
        )}

        {/* ✅ Step 3: Password Setup */}
        {step === 3 && (
          <>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
              className="w-full p-3 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full p-3 border rounded-lg mt-3"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              onClick={handleSignUp}
              className="w-full bg-blue-600 text-white p-3 rounded-lg mt-4"
            >
              {loading ? "Signing up..." : "Complete Signup"}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
