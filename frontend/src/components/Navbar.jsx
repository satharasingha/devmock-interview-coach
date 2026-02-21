import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full fixed top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* ================= LOGO ================= */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform duration-300">
            &lt;/&gt;
          </div>
          <span className="font-semibold text-base sm:text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
            DevMock
          </span>
        </Link>

        {/* ================= NAV LINKS ================= */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-gray-600">
          <Link
            to="/interviewlibrary"
            className="hover:text-blue-600 transition-colors duration-300"
          >
            Interviews
          </Link>
          <Link
            to="/resources"
            className="hover:text-blue-600 transition-colors duration-300"
          >
            Resources
          </Link>
          <Link
            to="/about"
            className="hover:text-blue-600 transition-colors duration-300"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="hover:text-blue-600 transition-colors duration-300"
          >
            Contact Us
          </Link>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Log In */}
          <Link
            to="/login"
            className="hidden sm:block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-300"
          >
            Log In
          </Link>

          {/* Sign Up */}
          <Link
            to="/register"
            className="text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-cyan-600 hover:to-blue-600 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            Sign Up
          </Link>

          {/* Mobile Menu Button (Optional Placeholder) */}
          <button className="md:hidden p-2 rounded-lg bg-gray-100 text-gray-600">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

        </div>
      </div>
    </nav>
  );
}