import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminNavbar from "../../components/AdminNavbar";
import {
  TrendingUp,
  Users,
  Briefcase,
  Award,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Download,
  Filter,
  RefreshCw,
  ChevronRight,
  Star,
  Target,
  Zap,
  Brain,
  Code,
  Database,
  Shield,
  UserCheck,
  TrendingDown,
  Eye,
} from "lucide-react";

export default function AdminAnalytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 0,
      totalInterviews: 0,
      averageScore: 0,
      passRate: 0,
      totalQuestions: 0,
      activeUsers: 0,
    },
    userGrowth: [],
    scoreDistribution: [],
    popularTopics: [],
    dailyActivity: [],
    topPerformers: [],
    recentActivity: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      
      if (!token) {
        console.log("No token found");
        setLoading(false);
        return;
      }

      // 1. Fetch all users
      const usersResponse = await fetch('http://localhost:3000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      let usersData = [];
      if (usersResponse.ok) {
        const usersResult = await usersResponse.json();
        usersData = usersResult.users || usersResult || [];
      }

      // 2. Fetch all interviews
      const interviewsResponse = await fetch('http://localhost:3000/api/auth/interviews/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      let interviewsData = [];
      if (interviewsResponse.ok) {
        const interviewsResult = await interviewsResponse.json();
        interviewsData = interviewsResult.interviews || [];
      }

      // 3. Fetch questions
      const questionsResponse = await fetch('http://localhost:3000/api/questions');
      const questionsData = await questionsResponse.json();

      // Calculate overview metrics
      const totalUsers = usersData.length;
      const activeUsers = usersData.filter(u => {
        const lastLogin = new Date(u.lastLogin);
        const daysSinceLogin = (Date.now() - lastLogin) / (1000 * 60 * 60 * 24);
        return daysSinceLogin <= 30;
      }).length;
      const totalInterviews = interviewsData.length;
      const totalQuestions = questionsData.length;
      
      let averageScore = 0;
      if (interviewsData.length > 0) {
        const totalScore = interviewsData.reduce((sum, i) => sum + (i.score || 0), 0);
        averageScore = Math.round(totalScore / interviewsData.length);
      }
      
      const passedCount = interviewsData.filter(i => i.passed).length;
      const passRate = interviewsData.length > 0 ? Math.round((passedCount / interviewsData.length) * 100) : 0;

      // User growth over time
      const userGrowth = [];
      const usersByMonth = {};
      usersData.forEach(user => {
        const date = new Date(user.createdAt);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        usersByMonth[monthKey] = (usersByMonth[monthKey] || 0) + 1;
      });
      
      let cumulative = 0;
      Object.keys(usersByMonth).sort().forEach(month => {
        cumulative += usersByMonth[month];
        userGrowth.push({ month, count: cumulative });
      });

      // Score distribution
      const scoreRanges = [
        { range: "0-20", count: 0, color: "bg-red-500" },
        { range: "21-40", count: 0, color: "bg-orange-500" },
        { range: "41-60", count: 0, color: "bg-yellow-500" },
        { range: "61-80", count: 0, color: "bg-blue-500" },
        { range: "81-100", count: 0, color: "bg-green-500" },
      ];
      
      interviewsData.forEach(interview => {
        const score = interview.score || 0;
        if (score <= 20) scoreRanges[0].count++;
        else if (score <= 40) scoreRanges[1].count++;
        else if (score <= 60) scoreRanges[2].count++;
        else if (score <= 80) scoreRanges[3].count++;
        else scoreRanges[4].count++;
      });

      // Popular topics (by role)
      const topicsMap = new Map();
      interviewsData.forEach(interview => {
        const role = interview.role || "Unknown";
        topicsMap.set(role, (topicsMap.get(role) || 0) + 1);
      });
      const popularTopics = Array.from(topicsMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Daily activity (last 30 days)
      const dailyActivity = [];
      const today = new Date();
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const count = interviewsData.filter(i => {
          if (!i.createdAt) return false;
          const interviewDate = new Date(i.createdAt).toISOString().split('T')[0];
          return interviewDate === dateStr;
        }).length;
        
        dailyActivity.push({ date: `${date.getMonth()+1}/${date.getDate()}`, count });
      }

      // Top performers
      const userPerformance = new Map();
      interviewsData.forEach(interview => {
        if (!userPerformance.has(interview.userId)) {
          userPerformance.set(interview.userId, { total: 0, count: 0, name: "" });
        }
        const perf = userPerformance.get(interview.userId);
        perf.total += interview.score || 0;
        perf.count++;
      });
      
      // Get user names
      const topPerformers = Array.from(userPerformance.entries())
        .map(([userId, data]) => {
          const user = usersData.find(u => u._id === userId);
          return {
            name: user?.fullName || "Unknown",
            email: user?.email || "",
            avgScore: Math.round(data.total / data.count),
            interviews: data.count,
          };
        })
        .sort((a, b) => b.avgScore - a.avgScore)
        .slice(0, 5);

      // Recent activity
      const recentActivity = interviewsData
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
        .map(interview => {
          const user = usersData.find(u => u._id === interview.userId);
          return {
            user: user?.fullName || "Unknown",
            role: interview.role || "Unknown",
            score: interview.score || 0,
            passed: interview.passed,
            date: interview.createdAt,
          };
        });

      setAnalytics({
        overview: {
          totalUsers,
          totalInterviews,
          averageScore,
          passRate,
          totalQuestions,
          activeUsers,
        },
        userGrowth,
        scoreDistribution: scoreRanges,
        popularTopics,
        dailyActivity,
        topPerformers,
        recentActivity,
      });

    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const maxDailyActivity = Math.max(...analytics.dailyActivity.map(d => d.count), 1);
  const maxUserGrowth = Math.max(...analytics.userGrowth.map(g => g.count), 1);
  const maxPopularTopics = Math.max(...analytics.popularTopics.map(t => t.count), 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar setSidebarOpen={setSidebarOpen} />
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="lg:pl-64 pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading analytics...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar setSidebarOpen={setSidebarOpen} />
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="lg:pl-64 pt-16">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Track platform performance and user engagement metrics</p>
            </div>
            <div className="flex gap-3">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={fetchAnalytics}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm hover:shadow-md transition flex items-center gap-2">
                <Download size={16} />
                Export Report
              </button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Users size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalUsers}</p>
              <p className="text-xs text-gray-500">Total Users</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <Briefcase size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalInterviews}</p>
              <p className="text-xs text-gray-500">Total Interviews</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <Award size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.averageScore}</p>
              <p className="text-xs text-gray-500">Avg Score</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <CheckCircle size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.passRate}%</p>
              <p className="text-xs text-gray-500">Pass Rate</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <Database size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalQuestions}</p>
              <p className="text-xs text-gray-500">Questions</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-cyan-600 mb-2">
                <UserCheck size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.activeUsers}</p>
              <p className="text-xs text-gray-500">Active (30d)</p>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* User Growth Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">User Growth</h3>
                  <p className="text-sm text-gray-500">Cumulative user registrations over time</p>
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="mt-4">
                <div className="h-48 relative">
                  <div className="flex items-end justify-between h-full gap-1">
                    {analytics.userGrowth.map((point, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-blue-500 rounded-t transition-all"
                          style={{ height: `${(point.count / maxUserGrowth) * 160}px` }}
                        />
                        <span className="text-xs text-gray-400 mt-2 rotate-45 origin-left">
                          {point.month}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Score Distribution Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Score Distribution</h3>
                  <p className="text-sm text-gray-500">Distribution of interview scores</p>
                </div>
                <BarChart3 className="w-5 h-5 text-purple-500" />
              </div>
              <div className="space-y-3 mt-4">
                {analytics.scoreDistribution.map((range, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{range.range}</span>
                      <span className="font-medium text-gray-800">{range.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${range.color}`}
                        style={{ width: `${(range.count / (analytics.overview.totalInterviews || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Popular Topics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Popular Topics</h3>
                  <p className="text-sm text-gray-500">Most frequently practiced interview roles</p>
                </div>
                <PieChart className="w-5 h-5 text-orange-500" />
              </div>
              <div className="space-y-3 mt-4">
                {analytics.popularTopics.map((topic, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{topic.name}</span>
                      <span className="font-medium text-gray-800">{topic.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        style={{ width: `${(topic.count / (analytics.overview.totalInterviews || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                {analytics.popularTopics.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No data available</p>
                )}
              </div>
            </div>

            {/* Daily Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Daily Activity</h3>
                  <p className="text-sm text-gray-500">Interviews per day (last 30 days)</p>
                </div>
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              <div className="mt-4">
                <div className="h-48 relative">
                  <div className="flex items-end justify-between h-full gap-1">
                    {analytics.dailyActivity.map((day, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-cyan-500 rounded-t transition-all"
                          style={{ height: `${(day.count / maxDailyActivity) * 160}px` }}
                        />
                        <span className="text-xs text-gray-400 mt-2 rotate-45 origin-left">
                          {day.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performers Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Top Performers</h3>
                  <p className="text-sm text-gray-500">Students with highest average scores</p>
                </div>
                <Star className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Avg Score</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Interviews</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analytics.topPerformers.map((performer, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">{performer.name.charAt(0)}</span>
                          </div>
                          <span className="font-medium text-gray-900">{performer.name}</span>
                        </div>
                       </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{performer.email}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-green-600">{performer.avgScore}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{performer.interviews}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Active
                        </span>
                      </td>
                     </tr>
                  ))}
                  {analytics.topPerformers.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                  <p className="text-sm text-gray-500">Latest interview sessions on the platform</p>
                </div>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Topic</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Score</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analytics.recentActivity.map((activity, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{activity.user}</td>
                      <td className="px-6 py-4 text-gray-500">{activity.role}</td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${activity.score >= 70 ? "text-green-600" : "text-red-600"}`}>
                          {activity.score}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {activity.passed ? "Passed" : "Failed"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(activity.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {analytics.recentActivity.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500">
                        No recent activity
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}