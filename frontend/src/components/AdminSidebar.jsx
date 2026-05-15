import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  Briefcase,
  Award,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  FileText,
  HelpCircle,
} from "lucide-react";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // Navigation items
  const navItems = {
    main: [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin",
        color: "text-blue-600",
      },
      {
        name: "Users",
        icon: Users,
        path: "/admin/users",
        color: "text-green-600",
      },
      {
        name: "Interviews",
        icon: Briefcase,
        path: "/admin/interviews",
        color: "text-purple-600",
      },
      {
        name: "Analytics",
        icon: BarChart3,
        path: "/admin/analytics",
        color: "text-orange-600",
      },
      {
        name: "Questions",
        icon: FileText,
        path: "/admin/add-question",
        color: "text-cyan-600",
      },
    ],
    settings: [
      {
        name: "Platform Settings",
        icon: Settings,
        path: "/admin/settings",
        color: "text-gray-600",
      },
      {
        name: "Help & Support",
        icon: HelpCircle,
        path: "/admin/help",
        color: "text-gray-600",
      },
    ],
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100%-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-40 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 ${collapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        <div className="h-full flex flex-col">
          {/* Collapse Toggle Button (Desktop only) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center hover:bg-gray-50 transition-colors z-50"
          >
            <Menu size={14} className="text-gray-600" />
          </button>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Main Menu */}
            <div>
              {!collapsed && (
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                  Main Menu
                </p>
              )}
              <nav className="space-y-1">
                {navItems.main.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                        ${
                          active
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:bg-gray-50"
                        }
                        ${collapsed ? "justify-center" : ""}`}
                    >
                      <Icon
                        size={20}
                        className={`${active ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"} 
                          ${collapsed ? "mx-auto" : ""}`}
                      />
                      {!collapsed && (
                        <span className="text-sm font-medium">{item.name}</span>
                      )}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                          {item.name}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Settings Menu */}
            <div>
              {!collapsed && (
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                  Settings
                </p>
              )}
              <nav className="space-y-1">
                {navItems.settings.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                        ${
                          active
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:bg-gray-50"
                        }
                        ${collapsed ? "justify-center" : ""}`}
                    >
                      <Icon
                        size={20}
                        className={`${active ? "text-blue-600" : "text-gray-500"} 
                          ${collapsed ? "mx-auto" : ""}`}
                      />
                      {!collapsed && (
                        <span className="text-sm font-medium">{item.name}</span>
                      )}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                          {item.name}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Logout Button Section - Always visible at bottom */}
          <div className="p-4 border-t border-gray-200 mt-auto">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors group
                ${collapsed ? "justify-center" : ""}`}
            >
              <LogOut size={20} className={collapsed ? "mx-auto" : ""} />
              {!collapsed && <span className="text-sm font-medium">Logout</span>}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                  Logout
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;