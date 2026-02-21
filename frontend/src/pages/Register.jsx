import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Register() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-[#f8faff] to-white flex flex-col pt-16">
        {/* REGISTER CARD */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
          <div className="w-full max-w-md relative group">
            {/* Glow effect - matching home page gradient */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-300"></div>

            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 border border-gray-200">
              
              {/* Back to login link for mobile */}
              <div className="sm:hidden mb-4 text-center">
                <Link
                  to="/login"
                  className="text-sm text-blue-600 hover:text-cyan-600 transition-colors"
                >
                  ← Already have an account? Log In
                </Link>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2 sm:mb-3">
                Create your account
              </h2>
              <p className="text-center text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 md:mb-10">
                Master your technical interviews with AI-driven practice.
              </p>

              {/* Full Name */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                />
              </div>

              {/* Last Name - Optional but recommended */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Last Name <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Smith"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                />
              </div>

              {/* Email */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="john@gmail.com"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                />
              </div>

              {/* Password */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                />
              </div>

              {/* Confirm Password - Added for better UX */}
              <div className="mb-5 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                />
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 sm:gap-3 mb-6 sm:mb-8">
                <input 
                  type="checkbox" 
                  className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  By creating an account, you agree to our{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-cyan-600 transition-colors font-medium"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-cyan-600 transition-colors font-medium"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>

              {/* Button */}
              <button className="w-full py-2.5 sm:py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg mb-6 sm:mb-8 text-sm sm:text-base">
                Create Account
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-xs sm:text-sm text-gray-400">
                  Or sign up with
                </span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Social Sign Up */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                <button className="flex-1 border border-gray-200 rounded-xl py-2.5 sm:py-3 flex items-center justify-center gap-2 hover:border-blue-400 hover:shadow-md transition bg-white">
                  <img
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    alt="Google"
                    className="h-4 sm:h-5"
                  />
                  <span className="text-xs sm:text-sm text-gray-700 font-medium">Google</span>
                </button>

                <button className="flex-1 border border-gray-200 rounded-xl py-2.5 sm:py-3 flex items-center justify-center gap-2 hover:border-blue-400 hover:shadow-md transition bg-white">
                  <img
                    src="https://www.svgrepo.com/show/512317/github-142.svg"
                    alt="GitHub"
                    className="h-4 sm:h-5"
                  />
                  <span className="text-xs sm:text-sm text-gray-700 font-medium">GitHub</span>
                </button>
              </div>

              {/* Trusted */}
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-3">TRUSTED BY STUDENTS AT</p>
                <div className="flex justify-center items-center gap-4 sm:gap-6">
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">STANFORD</span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">MIT</span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">BERKELEY</span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">CAMBRIDGE</span>
                </div>
              </div>

              {/* Login link for desktop */}
              <div className="hidden sm:block text-center mt-6 text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-cyan-600 transition-colors"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}