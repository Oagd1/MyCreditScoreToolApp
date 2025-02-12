"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logIn, googleSignIn } from "../config/firebase";
import { Eye, EyeOff, GalleryVerticalEnd, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      await logIn(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("❌ Login error:", err.message);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await googleSignIn();
      router.push("/dashboard");
    } catch (err: any) {
      console.error("❌ Google Login error:", err.message);
      setError(err.message || "Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBrandClick = () => {
    router.push("/"); // Redirect to app/page.tsx
  };

  const handleSignUpClick = () => {
    router.push("/signup"); // Redirect to signup/page.tsx
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 relative">
      {/* 🔹 Brand Section */}
      <div
        className="absolute top-6 left-6 flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
        onClick={handleBrandClick}
      >
        <GalleryVerticalEnd className="h-6 w-6 text-blue-600" />
        <span className="font-bold text-blue-600 text-lg">MyCreditScore</span>
      </div>

      {/* 🔹 Login Card */}
      <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-xl backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">Log In</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500 hover:text-blue-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Log In"}
          </button>
        </form>

        <div className="my-4 border-t border-gray-300"></div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition duration-300 flex justify-center items-center"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign in with Google"}
        </button>

        {/* 🔹 Sign-Up Link */}
        <div className="text-center mt-4">
          <span className="text-gray-600">Don’t have an account? </span>
          <button
            onClick={handleSignUpClick}
            className="text-blue-600 hover:underline font-semibold transition"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
