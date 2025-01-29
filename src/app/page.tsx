"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100 text-gray-900">
      {/* Hero Section */}
      <div className="w-full max-w-4xl text-center px-6 py-12">
        {/* Brand Name */}
        <h1 className="text-5xl font-extrabold text-blue-700">
          MyCreditScore
        </h1>
        <p className="text-lg text-gray-700 mt-4">
          Take control of your financial health with accurate credit scores and smart insights.
        </p>
      </div>

      {/* Call to Action Buttons */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => router.push("/signup")}
          className="px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-full shadow-md hover:bg-blue-700 transition"
        >
          Get Started
        </button>
        <button
          onClick={() => router.push("/login")}
          className="px-8 py-3 text-lg font-semibold text-blue-600 border border-blue-600 rounded-full hover:bg-blue-100 transition"
        >
          Log In
        </button>
      </div>

      {/* Features Section */}
      <div className="mt-12 w-full max-w-4xl text-center px-6">
        <h2 className="text-3xl font-bold text-gray-800">Why Choose Us?</h2>
        <p className="text-gray-600 mt-3">
          We offer real-time credit score tracking, actionable insights, and a secure platform to help you achieve financial stability.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold text-blue-600">Free Credit Score</h3>
            <p className="text-gray-600 mt-2">
              Access your credit score at any time with complete transparency.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold text-blue-600">Personalized Insights</h3>
            <p className="text-gray-600 mt-2">
              Get customized tips to improve your financial health.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold text-blue-600">Secure & Private</h3>
            <p className="text-gray-600 mt-2">
              Your financial data is protected with industry-leading security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
