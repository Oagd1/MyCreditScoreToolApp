"use client";
import React from "react";
import Link from "next/link";

export default function ProtectPage() {
  const userVerifiedEmail = false;

  const protectionFeatures = [
    {
      id: 1,
      title: "Fraudulent Credit Activity Alerts",
      status: "ACTIVE",
      description: "We monitor for unusual credit activity to help you stay informed.",
      ctaText: "View Alerts",
    },
    {
      id: 2,
      title: "Suspicious Activity Review",
      status: "NOT ACTIVE",
      description: "Review and report any suspicious credit activity instantly.",
      ctaText: "Check Now",
    },
    {
      id: 3,
      title: "Preventative Credit Habits",
      status: "ACTIVE",
      description: "Learn effective practices to protect your financial health.",
      ctaText: "Read Guide",
    },
  ];

  return (
    <main className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* HERO SECTION */}
      <section className="relative w-full h-52 bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 flex flex-col items-center justify-center">
        <div className="z-10 text-center px-4">
          <h1 className="text-3xl font-semibold mb-2 text-gray-800 dark:text-white">
            Credit Security & Fraud Prevention
          </h1>
          <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto text-sm md:text-base">
            Stay informed and take proactive steps to secure your credit.
          </p>
        </div>
      </section>

      {/* SECURITY STATUS SECTION */}
      <section className="py-8 px-4 md:px-8">
        <div className="max-w-4xl mx-auto bg-blue-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
            Your Credit Security Status
          </h2>
          {userVerifiedEmail ? (
            <p className="text-green-600 dark:text-green-400 font-semibold">
              ✓ Email Verified
            </p>
          ) : (
            <>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Verify your email to receive important security updates.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition shadow-md">
                Verify Email
              </button>
            </>
          )}
        </div>
      </section>

      {/* CREDIT SECURITY FEATURES SECTION */}
      <section className="bg-blue-50 dark:bg-gray-800 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            Credit Security Features
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Use these tools to maintain a secure financial profile.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {protectionFeatures.map((feature) => (
              <div
                key={feature.id}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {feature.description}
                </p>
                {feature.ctaText && (
                  <Link
                    href="#"
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    {feature.ctaText}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
