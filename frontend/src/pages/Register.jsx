import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Register() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-200 flex flex-col">
        {/*TOP BAR*/}
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
                &lt;/&gt;
              </div>
              <span className="font-semibold text-gray-900">DevMock</span>
            </div>

            <div className="text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-medium">
                Log In
              </Link>
            </div>
          </div>
        </header>

        {/* ================= REGISTER CARD ================= */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
              Create your account
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Master your technical interviews with AI-driven practice.
            </p>

            {/* Full Name */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Jane Doe"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div className="mb-5">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
              </div>
              <input
                type="email"
                placeholder="john@gmail.com"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 mb-6">
              <input type="checkbox" className="mt-1" />
              <p className="text-sm text-gray-600">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-blue-600">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600">
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            {/* Button */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-medium py-3 rounded-lg mb-8">
              Create Account
            </button>

            {/* Trusted */}
            <div className="text-center text-sm text-gray-400">
              TRUSTED BY STUDENTS AT
              <div className="flex justify-center gap-6 mt-2 font-medium">
                <span>STANFORD</span>
                <span>MIT</span>
                <span>BERKELEY</span>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
