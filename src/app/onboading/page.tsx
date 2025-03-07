"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { format } from "date-fns"; // Ensure date-fns is installed

const steps = [
  "Welcome",
  "Personal Info",
  "Financial Overview",
  "Credit Health Check",
  "Confirmation",
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Step Data State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dob: "", // Will be formatted
    creditAccounts: 0,
    totalDebt: 0,
    monthlyIncome: 0,
    missedPayments: 0,
    latePayments: 0,
    recentInquiries: 0,
  });

  /** ✅ Fetch User Data from Firebase */
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("User not logged in.");
          router.push("/login");
          return;
        }

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setFormData((prevData) => ({
            ...prevData,
            fullName: userSnap.data().fullName || "",
            email: userSnap.data().email || "",
            dob: userSnap.data().dob 
              ? format(new Date(userSnap.data().dob), "dd-MM-yyyy") // Ensure consistent format
              : "",
          }));
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [router]);

  /** ✅ Handle Next Step */
  const nextStep = () => {
    setStep((prev) => prev + 1);
    setProgress(((step + 1) / (steps.length - 1)) * 100);
  };

  /** ✅ Handle Previous Step */
  const prevStep = () => {
    setStep((prev) => prev - 1);
    setProgress(((step - 1) / (steps.length - 1)) * 100);
  };

  /** ✅ Handle Input Changes */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /** ✅ Handle Onboarding Submission */
  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in.");

      // Format DOB before saving
      const formattedDOB = formData.dob ? format(new Date(formData.dob), "dd-MM-yyyy") : "";

      // Ensure all form inputs are properly converted to numbers
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        dob: formattedDOB, // 🔥 Store consistently formatted DOB
        creditAccounts: Number(formData.creditAccounts) || 0,
        totalDebt: Number(formData.totalDebt) || 0,
        monthlyIncome: Number(formData.monthlyIncome) || 0,
        missedPayments: Number(formData.missedPayments) || 0,
        latePayments: Number(formData.latePayments) || 0,
        recentInquiries: Number(formData.recentInquiries) || 0,
      };

      const userRef = doc(db, "users", user.uid);

      // 🔥 Save onboarding data to Firestore with a lastUpdated timestamp
      await setDoc(userRef, { 
        onboarding: userData, 
        lastUpdated: new Date().toISOString() 
      }, { merge: true });

      console.log("✅ Onboarding data saved successfully.");

      // 🔥 Redirect to calculate-score
      router.push("/calculate-score");

    } catch (err) {
      console.error("❌ Error saving onboarding data:", err);
      setError("Failed to save onboarding data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md">
      {/* ✅ Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <h2 className="text-xl font-semibold text-center">{steps[step]}</h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* ✅ Step 1: Welcome Screen */}
      {step === 0 && (
        <div className="text-center">
          <p className="text-gray-600 mt-2">
            Welcome to MyCreditScore! This quick onboarding helps us understand your financial profile.
          </p>
          <button
            onClick={nextStep}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Get Started →
          </button>
        </div>
      )}

      {/* ✅ Step 2: Personal Information */}
      {step === 1 && (
        <div className="space-y-3">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg"
            value={formData.fullName}
            disabled
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
            value={formData.email}
            disabled
          />
          <input
            type="date"
            name="dob"
            className="w-full p-3 border rounded-lg"
            value={formData.dob}
            onChange={handleChange}
          />
          <button onClick={nextStep} className="w-full bg-blue-600 text-white p-3 rounded-lg">
            Next →
          </button>
        </div>
      )}

      {/* ✅ Step 3: Financial Overview */}
      {step === 2 && (
        <div className="space-y-3">
          <input
            type="number"
            name="creditAccounts"
            placeholder="Number of Credit Accounts"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
          />
          <input
            type="number"
            name="totalDebt"
            placeholder="Total Debt (£)"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
          />
          <input
            type="number"
            name="monthlyIncome"
            placeholder="Monthly Income (£)"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
          />
          <button onClick={nextStep} className="w-full bg-blue-600 text-white p-3 rounded-lg">
            Next →
          </button>
        </div>
      )}

      {/* ✅ Step 4: Credit Health Check */}
      {step === 3 && (
        <div className="space-y-3">
          <input
            type="number"
            name="missedPayments"
            placeholder="Missed Payments"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
          />
          <input
            type="number"
            name="latePayments"
            placeholder="Late Payments"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
          />
          <input
            type="number"
            name="recentInquiries"
            placeholder="Recent Credit Applications"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
          />
          <button onClick={nextStep} className="w-full bg-blue-600 text-white p-3 rounded-lg">
            Next →
          </button>
        </div>
      )}

      {/* ✅ Step 5: Confirmation */}
      {step === 4 && (
        <div className="text-center">
          <p>Review and submit your details.</p>
          <button onClick={handleSubmit} className="w-full bg-green-600 text-white p-3 rounded-lg">
            Complete Onboarding
          </button>
        </div>
      )}
    </div>
  );
}
