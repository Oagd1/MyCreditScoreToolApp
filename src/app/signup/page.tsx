"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
import { Eye, EyeOff, GalleryVerticalEnd, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/popover";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

export default function SignUp() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!userName.trim() || !fullName.trim() || !dateOfBirth || !email.trim()) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

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
        userName,
        fullName,
        dateOfBirth: dateOfBirth.toISOString(),
        email,
        createdAt: new Date(),
      });

      alert("✅ Sign-up successful! Redirecting to onboarding...");
      router.push("/onboarding");
    } catch (err: any) {
      console.error("❌ Sign-up error:", err.message);
      setError(err.message || "Sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBrandClick = () => {
    router.push("/");
  };

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 p-4 relative">
      <div
        onClick={handleBrandClick}
        className="absolute top-4 left-4 flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
      >
        <GalleryVerticalEnd className="h-6 w-6 text-blue-600" />
        <span className="text-xl font-bold text-blue-600">MyCreditScore</span>
      </div>

      <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">Sign Up</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          {/* 🎯 Enhanced Date of Birth Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="w-full p-3 border rounded-lg flex justify-between items-center text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 hover:bg-gray-50"
              >
                {dateOfBirth ? format(dateOfBirth, "dd/MM/yyyy") : "Select Date of Birth"}
                <CalendarIcon className="h-5 w-5 text-gray-500" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0 shadow-lg rounded-md bg-white">
              <DayPicker
                mode="single"
                selected={dateOfBirth}
                onSelect={setDateOfBirth}
                fromYear={1900}
                toYear={new Date().getFullYear()}
                captionLayout="dropdown"
                modifiersClassNames={{
                  selected: "bg-blue-500 text-white",
                  today: "bg-gray-200",
                }}
                className="rounded-md border shadow-md"
                classNames={{
                  caption_label: "text-sm font-medium text-blue-700",
                  nav_button: "text-gray-500 hover:text-blue-600",
                  table: "w-full mt-2",
                  head_cell: "text-gray-600 text-xs",
                  cell: "w-9 h-9 p-1 hover:bg-gray-100 rounded-md cursor-pointer transition",
                }}
              />
            </PopoverContent>
          </Popover>

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
              placeholder="Password (6+ characters)"
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

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full p-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            onClick={handleLoginRedirect}
            className="text-blue-600 font-semibold cursor-pointer hover:underline hover:text-blue-700"
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}
