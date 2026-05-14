import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/");

    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Login failed");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetMessage("");
    setResetLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/auth/forgot-password",
        { email: resetEmail }
      );
      setResetMessage(data.message);
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetEmail("");
        setResetMessage("");
      }, 3000);
    } catch (error) {
      setResetError(error.response?.data?.message || "Failed to send reset email");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#f8faff] to-white flex flex-col pt-16">
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
          <div className="w-full max-w-md relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-300"></div>

            {/* Login Form */}
            {!showForgotPassword ? (
              <form onSubmit={submitHandler} className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <div className="flex border-b border-gray-200 mb-8">
                  <button className="flex-1 text-center font-semibold text-blue-600 border-b-2 border-blue-600 pb-3">
                    Log In
                  </button>
                  <Link to="/register" className="flex-1 text-center font-semibold text-gray-400 hover:text-blue-600 pb-3">
                    Sign Up
                  </Link>
                </div>

                <h2 className="text-3xl font-bold text-center mb-6">Welcome back</h2>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                    className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div className="text-right mb-6">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>

                <p className="text-center mt-6 text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                    Sign up
                  </Link>
                </p>
              </form>
            ) : (
              /* Forgot Password Form */
              <form onSubmit={handleForgotPassword} className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
                >
                  ← Back to Login
                </button>

                <h2 className="text-2xl font-bold text-center mb-2">Reset Password</h2>
                <p className="text-center text-gray-500 text-sm mb-6">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                {resetMessage && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
                    {resetMessage}
                  </div>
                )}

                {resetError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {resetError}
                  </div>
                )}

                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                    className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50"
                >
                  {resetLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}