import { useState, useEffect } from "react";

import {
  Users,
  Briefcase,
  TrendingUp,
  Activity,
  ChevronRight,
  Calendar,
  Download,
  Filter,
  Search,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  Minus,
  UserCheck,
  Clock,
  Award,
  BarChart3,
  LineChart,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  // Mock data - replace with API calls
  const metrics = [
    {
      title: "Total Students",
      value: "12,450",
      change: "+12%",
      changeType: "up",
      vs: "vs last month",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total Interviews",
      value: "3,200",
      change: "+5%",
      changeType: "up",
      vs: "vs last month",
      icon: Briefcase,
      color: "bg-green-500",
    },
    {
      title: "Avg. User Score",
      value: "76/100",
      change: "+2%",
      changeType: "up",
      vs: "vs last month",
      icon: Award,
      color: "bg-purple-500",
    },
    {
      title: "Active Sessions",
      value: "85",
      change: "Stable",
      changeType: "neutral",
      vs: "vs last hour",
      icon: Activity,
      color: "bg-orange-500",
    },
  ];

  const recentInterviews = [
    {
      name: "Alex Johnson",
      university: "MIT",
      topic: "System Design",
      score: 88,
      status: "Passed",
      date: "2 mins ago",
    },
    {
      name: "Sarah Chen",
      university: "Stanford",
      topic: "Algorithms",
      score: 92,
      status: "Passed",
      date: "15 mins ago",
    },
    {
      name: "Michael Smith",
      university: "Oxford",
      topic: "Behavioral",
      score: 55,
      status: "Failed",
      date: "45 mins ago",
    },
    {
      name: "Emily Davis",
      university: "Harvard",
      topic: "System Design",
      score: 78,
      status: "Passed",
      date: "1 hour ago",
    },
    {
      name: "James Wilson",
      university: "Cambridge",
      topic: "Algorithms",
      score: 45,
      status: "Failed",
      date: "2 hours ago",
    },
  ];

  const getChangeIcon = (changeType) => {
    if (changeType === "up")
      return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (changeType === "down")
      return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getChangeColor = (changeType) => {
    if (changeType === "up") return "text-green-600";
    if (changeType === "down") return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= TOP NAVBAR ================= */}
      <nav className="bg-white border-b border-gray-200 fixed top-0 w-full z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  DevMock
                </span>
                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  Admin
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Download size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Settings size={20} />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500">admin@devmock.com</p>
                </div>
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

   

      {/* ================= MAIN CONTENT ================= */}
      <main className="lg:pl-64 pt-16">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back. Here is the latest performance data for the
              platform.
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${metric.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-gray-400">{metric.vs}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    {getChangeIcon(metric.changeType)}
                    <span className={`text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                      {metric.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      {metric.vs}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{metric.title}</p>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Interview Volume Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Interview Volume Trends
                  </h3>
                  <p className="text-sm text-gray-500">
                    Daily completed sessions over the last 30 days
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-lg font-medium">
                    +15% Growth
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Chart Area - Replace with actual chart library */}
              <div className="mt-6">
                <div className="h-64 relative">
                  {/* Simple bar chart representation */}
                  <div className="flex items-end justify-between h-full gap-1">
                    {[
                      45, 52, 48, 61, 58, 65, 70, 68, 72, 75, 78, 80, 82, 85,
                      88, 90, 87, 92, 95, 98, 100, 102, 105, 108, 110, 112,
                      115, 118, 120, 125,
                    ].map((height, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
                          style={{ height: `${(height / 130) * 180}px` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between mt-4 text-xs text-gray-500">
                  <span>Nov 01</span>
                  <span>Nov 05</span>
                  <span>Nov 10</span>
                  <span>Nov 15</span>
                  <span>Nov 20</span>
                  <span>Nov 25</span>
                  <span>Nov 30</span>
                </div>
              </div>
            </div>

            {/* Skill Proficiency Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Skill Proficiency
                  </h3>
                  <p className="text-sm text-gray-500">
                    Distribution across user base
                  </p>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical size={16} />
                </button>
              </div>

              <div className="space-y-4 mt-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Algorithms</span>
                    <span className="font-medium text-gray-900">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 rounded-full h-2"
                      style={{ width: "78%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">System Design</span>
                    <span className="font-medium text-gray-900">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 rounded-full h-2"
                      style={{ width: "65%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Behavioral</span>
                    <span className="font-medium text-gray-900">82%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 rounded-full h-2"
                      style={{ width: "82%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Databases</span>
                    <span className="font-medium text-gray-900">71%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 rounded-full h-2"
                      style={{ width: "71%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Interviews Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Recent Interviews
                  </h3>
                  <p className="text-sm text-gray-500">
                    Latest interview sessions from students
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
                    <Filter size={16} />
                    Filter
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2">
                    <Download size={16} />
                    Export
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      University
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Topic
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentInterviews.map((interview, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {interview.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {interview.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {interview.university}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {interview.topic}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-semibold ${
                            interview.score >= 70
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {interview.score}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            interview.status === "Passed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {interview.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {interview.date}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {recentInterviews.length} of 156 interviews
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                  1
                </button>
                <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}