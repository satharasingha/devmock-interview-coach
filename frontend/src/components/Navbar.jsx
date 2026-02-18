import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-100 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ================= LOGO ================= */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
            &lt;/&gt;
          </div>
          <span className="font-semibold text-lg text-gray-900">
            DevMock
          </span>
        </Link>

        {/* ================= NAV LINKS ================= */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <Link to="/interviewlibrary" className="hover:text-gray-900 transition">
            Interviews
          </Link>
          <Link to="/resources" className="hover:text-gray-900 transition">
            Resources
          </Link>
          <Link to="/about" className="hover:text-gray-900 transition">
            About us
          </Link>
          <Link to="/contact" className="hover:text-gray-900 transition">
            Contact us
          </Link>
          
        </div>

        {/* ================= AUTH ================= */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            Log In
          </Link>

          <Link
            to="/register"
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
        </div>

      </div>
    </nav>
  );
}
