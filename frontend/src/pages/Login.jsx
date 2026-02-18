import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-200 flex flex-col">

        {/* ================= TOP BAR ================= */}
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
                &lt;/&gt;
              </div>
              <span className="font-semibold text-gray-900">DevMock</span>
            </div>

            <Link
              to="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              Back to Home →
            </Link>
          </div>
        </header>

        {/* ================= LOGIN CARD ================= */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

            {/* Tabs */}
            <div className="flex border-b mb-8">
              <button className="flex-1 text-center font-medium text-blue-600 border-b-2 border-blue-600 pb-3">
                Log In
              </button>
              <Link
                to="/register"
                className="flex-1 text-center font-medium text-gray-400 pb-3"
              >
                Sign Up
              </Link>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Join thousands of students acing their AI interviews.
            </p>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
              </label>
              <div className="relative">
                
                <input
                  type="email"
                  placeholder="john@gmail.com"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
              </div>
            </div>

            {/* Button */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-medium py-3 rounded-lg mb-6">
              Log In
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-400">Or continue with</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Social Login */}
            <div className="flex gap-4">
              <button className="flex-1 border rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50">
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="h-5"
                />
                Google
              </button>

              <button className="flex-1 border rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50">
                <img
                  src="https://www.svgrepo.com/show/512317/github-142.svg"
                  alt="GitHub"
                  className="h-5"
                />
                GitHub
              </button>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
