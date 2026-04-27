 {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed left-0 top-16 h-full bg-white border-r border-gray-200 transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64`}
      >
        <div className="p-4 space-y-6">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Main Menu
            </p>
            <nav className="mt-2 space-y-1">
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-700 bg-blue-50 rounded-lg font-medium"
              >
                <BarChart3 size={20} className="text-blue-600" />
                Dashboard
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <Users size={20} />
                Users
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <Briefcase size={20} />
                Interviews
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <Award size={20} />
                Analytics
              </a>
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Settings
            </p>
            <nav className="mt-2 space-y-1">
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <Settings size={20} />
                Platform Settings
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <Users size={20} />
                User Management
              </a>
            </nav>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <button className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>