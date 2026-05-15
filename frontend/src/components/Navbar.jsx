import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    if (user) {
      setUserInfo(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    navigate("/");
    window.location.reload();
  };

  const getUserInitials = (fullName) => {
    if (!fullName) return "U";
    const names = fullName.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <nav className="w-full fixed top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* ================= LOGO WITH IMAGE ================= */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
          {/* Logo Image from public folder */}
          <img 
            src="/logo.png" 
            alt="DevMock Logo" 
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-md group-hover:scale-105 transition-transform duration-300"
          />
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
          {userInfo ? (
            // Logged In State
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                {/* User Avatar */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {getUserInitials(userInfo.user?.fullName)}
                </div>
                
                {/* User Name */}
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {userInfo.user?.fullName?.split(" ")[0]}
                </span>
                
                {/* Dropdown Arrow */}
                <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">
                        {userInfo.user?.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {userInfo.user?.email}
                      </p>
                    </div>
                    
                    {/* Admin Link (only for admins) */}
                    {userInfo.user?.isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    
                    {/* Profile Link */}
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    
                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            // Logged Out State
            <>
              <Link
                to="/login"
                className="hidden sm:block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                Log In
              </Link>

              <Link
                to="/register"
                className="text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-cyan-600 hover:to-blue-600 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 whitespace-nowrap"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
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