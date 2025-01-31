"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, googleSignIn } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Password strength validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // Redirect after successful sign-up
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please log in.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters.");
      } else {
        setError("Sign-up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await googleSignIn();
      router.push("/dashboard"); // Redirect after Google sign-in
    } catch (err) {
      setError("Google Sign-In failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-blue-600">Sign Up</h2>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form onSubmit={handleSignUp} className="mt-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (6+ characters)"
            className="w-full p-3 border rounded-lg mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="my-4 border-t border-gray-300"></div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
          disabled={loading}
        >
          {loading ? "Signing in with Google..." : "Sign Up with Google"}
        </button>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => router.push("/login")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
