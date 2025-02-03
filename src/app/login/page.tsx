"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logIn, googleSignIn } from "../config/firebase";
import { Eye, EyeOff } from "lucide-react"; // ✅ Use icons for password toggle

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  /** 🔹 Handle Email/Password Login */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await logIn(email, password);
      alert("✅ Login Successful!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("❌ Login error:", err.message);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Handle Google Login */
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await googleSignIn();
      alert("✅ Login Successful with Google!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("❌ Google Login error:", err.message);
      setError(err.message || "Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-blue-600">Log In</h2>

        {/* 🔹 Error Display */}
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        {/* 🔹 Email/Password Login Form */}
        <form onSubmit={handleLogin} className="mt-4 space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* 🔹 Password Input with Toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 border rounded-lg pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* 🔹 Divider */}
        <div className="my-4 border-t border-gray-300"></div>

        {/* 🔹 Google Sign-In */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}
