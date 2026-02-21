import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-[#f8faff] to-white flex flex-col pt-16">
        
        {/* ================= LOGIN CARD ================= */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
          <div className="w-full max-w-md relative group">

            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-300"></div>

            <div className="relative bg-white backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 border border-gray-200">

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6 sm:mb-8">
                <button className="flex-1 text-center font-semibold text-blue-600 border-b-2 border-blue-600 pb-3 text-sm sm:text-base">
                  Log In
                </button>
                <Link
                  to="/register"
                  className="flex-1 text-center font-semibold text-gray-400 hover:text-blue-600 pb-3 transition-colors text-sm sm:text-base"
                >
                  Sign Up
                </Link>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2 sm:mb-3">
                Welcome back
              </h2>
              <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8 md:mb-10">
                Join thousands of students acing their AI interviews.
              </p>

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
              <div className="mb-5 sm:mb-6">
                <div className="flex justify-between mb-1.5 sm:mb-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs sm:text-sm text-blue-600 hover:text-cyan-600 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                />
              </div>

              {/* Remember me */}
              <div className="flex items-center mb-5 sm:mb-6">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 text-xs sm:text-sm text-gray-600">
                  Remember me
                </label>
              </div>

              {/* Login Button */}
              <button className="w-full py-2.5 sm:py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg mb-5 sm:mb-6 md:mb-8 text-sm sm:text-base">
                Log In
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6 md:mb-8">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-xs sm:text-sm text-gray-400">
                  Or continue with
                </span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Social Login */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button className="flex-1 border border-gray-200 rounded-xl py-2.5 sm:py-3 flex items-center justify-center gap-2 hover:border-blue-400 hover:shadow-md transition bg-white">
                  <img
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    alt="Google"
                    className="h-4 sm:h-5"
                  />
                  <span className="text-xs sm:text-sm text-gray-700 font-medium">
                    Google
                  </span>
                </button>

                <button className="flex-1 border border-gray-200 rounded-xl py-2.5 sm:py-3 flex items-center justify-center gap-2 hover:border-blue-400 hover:shadow-md transition bg-white">
                  <img
                    src="https://www.svgrepo.com/show/512317/github-142.svg"
                    alt="GitHub"
                    className="h-4 sm:h-5"
                  />
                  <span className="text-xs sm:text-sm text-gray-700 font-medium">
                    GitHub
                  </span>
                </button>
              </div>

              {/* Mobile Sign Up */}
              <p className="text-center mt-5 sm:hidden text-xs text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign up
                </Link>
              </p>

            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}