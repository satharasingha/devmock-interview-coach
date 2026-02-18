export default function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
            &lt;/&gt;
          </div>
          <span>DevMock</span>
        </div>

        <div className="flex space-x-6">
          <a href="#" className="hover:text-gray-900">Privacy Policy</a>
          <a href="#" className="hover:text-gray-900">Terms of Service</a>
          <a href="#" className="hover:text-gray-900">Contact</a>
          <a href="#" className="hover:text-gray-900">Blog</a>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 pb-6">
        © 2025 All Rights Reserved — DevMock
      </div>
    </footer>
  );
}
