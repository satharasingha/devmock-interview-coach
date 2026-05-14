export default function Footer() {
  return (
    <footer className="mt-24 border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col md:flex-row items-center justify-between text-sm">

        {/* Logo Section with Image */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 md:mb-0 group">
          <img 
            src="/logo.png" 
            alt="DevMock Logo" 
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <span className="font-semibold text-base sm:text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
            DevMock
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
          <a 
            href="#" 
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          >
            Privacy Policy
          </a>
          <a 
            href="#" 
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          >
            Terms of Service
          </a>
          <a 
            href="/contact" 
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          >
            Contact
          </a>
          <a 
            href="#" 
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
          >
            Blog
          </a>
        </div>

        {/* Social Media Icons using SVG from public folder */}
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <a 
            href="#" 
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="Twitter"
          >
            <img src="/twitter.svg" alt="Twitter" className="w-4 h-4" />
          </a>
          <a 
            href="#" 
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="GitHub"
          >
            <img src="/github.svg" alt="GitHub" className="w-4 h-4" />
          </a>
          <a 
            href="#" 
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="LinkedIn"
          >
            <img src="/linkedin.svg" alt="LinkedIn" className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 pb-6 sm:pb-8">
        © 2026 DevMock. All rights reserved.
      </div>

    </footer>
  );
}