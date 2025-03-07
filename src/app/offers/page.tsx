"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "../../context/themeContext"; // ✅ Import Theme Context

export default function OffersPage() {
  const { theme } = useTheme(); // ✅ Get theme state

  const [offers] = useState([
    {
      id: 1,
      title: "Student-Friendly Credit Card",
      description:
        "Enjoy 0% APR for the first 12 months, designed for students with limited credit history.",
      link: "#",
      recommendedScore: 650,
    },
    {
      id: 2,
      title: "Low Interest Student Loan",
      description:
        "Lower rates and flexible repayment options to help you cover tuition and living expenses.",
      link: "#",
      recommendedScore: 600,
    },
    {
      id: 3,
      title: "Textbook Cashback Rewards",
      description:
        "Earn up to 5% cashback on textbooks, online courses, and essential student purchases.",
      link: "#",
      recommendedScore: 620,
    },
  ]);

  const userCreditScore = 720;
  const filteredOffers = offers.filter((offer) => true);

  return (
    <main className={`w-full min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
      {/* HERO SECTION */}
      <section
        className={`
          relative mb-8 px-6 py-10 
          ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-gradient-to-b from-gray-100 to-gray-200"}
          rounded-b-lg
        `}
        style={{ minHeight: "600px" }}
      >
        <div
          className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center justify-center"
          style={{ minHeight: "100%" }}
        >
          {/* LEFT TEXT BLOCK */}
          <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Compare credit cards
            </h2>
            <p className="text-base md:text-lg mb-6 max-w-md mx-auto md:mx-0">
              Find the best credit card deals without affecting your credit score.
            </p>

            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0 mb-4 justify-center md:justify-start">
              <Link
                href="#"
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
              >
                Get a Card
              </Link>
              <Link
                href="#"
                className="border border-blue-600 text-blue-600 px-5 py-2 rounded hover:bg-blue-50 transition-colors"
              >
                Read More
              </Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We’re a credit broker, not a lender
            </p>
          </div>

          {/* RIGHT IMAGE BLOCK */}
          <div className="md:w-1/2 flex justify-center relative">
            <div
              className={`absolute w-[400px] h-[400px] rounded-full opacity-20 -z-10 top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] 
              ${theme === "dark" ? "bg-gray-700" : "bg-blue-100"}`}
            />
            <img
              src="/cards-illustrations.JPG"
              alt="Credit Cards Illustration"
              className="w-[350px] md:w-[500px] h-auto drop-shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* STUDENT OFFERS SECTION */}
      <section className={`max-w-7xl mx-auto mt-4 px-6 py-8 ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white"} rounded-lg shadow-sm`}>
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          Student Offers
        </h1>
        <p className="mb-8">
          Explore student-focused deals designed to help you build your credit and manage finances smartly while studying!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className={`
                relative flex flex-col p-4 rounded-lg shadow hover:shadow-md hover:scale-[1.01] transition-transform 
                ${theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"}
              `}
            >
              <h2 className="text-xl font-semibold mb-2">
                {offer.title}
              </h2>
              <p className="flex-grow">{offer.description}</p>
              {userCreditScore >= offer.recommendedScore && (
                <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                  Best Match
                </span>
              )}
              <div className="mt-4">
                <Link
                  href={offer.link}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
