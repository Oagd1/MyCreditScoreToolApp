"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logIn, googleSignIn } from "../config/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await logIn(email, password);
      alert("Login Successful!");
      router.push("/dashboard"); // Redirect after login
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await googleSignIn();
      alert("Login Successful with Google!");
      router.push("/dashboard"); // Redirect after login
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {/* Email/Password Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-4 border-t border-gray-300"></div>

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}
