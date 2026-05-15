import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isValidToken, setIsValidToken] = useState(true);

  // Verify token on load
  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(
          `http://localhost:3000/api/auth/verify-reset-token/${token}`,
        );
      } catch (error) {
        setIsValidToken(false);
        setError("Invalid or expired reset link. Please request a new one.");
      }
    };
    if (token) verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `http://localhost:3000/api/auth/reset-password/${token}`,
        { password },
      );
      setMessage(data.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-[#f8faff] to-white flex flex-col pt-16">
          <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Invalid Reset Link
              </h2>
              <p className="text-gray-500 mb-6">{error}</p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold"
              >
                Back to Login
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#f8faff] to-white flex flex-col pt-16">
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
          <div className="w-full max-w-md relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-20"></div>

            <form
              onSubmit={handleSubmit}
              className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-200"
            >
              <h2 className="text-2xl font-bold text-center mb-2">
                Create New Password
              </h2>
              <p className="text-center text-gray-500 text-sm mb-6">
                Enter your new password below
              </p>

              {message && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {message}
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Type password again"
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <p className="text-center mt-6 text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Back to Login
                </Link>
              </p>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
