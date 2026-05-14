import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  Award, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Edit2,
  Save,
  X,
  Briefcase,
  Activity,
  BarChart,
  Eye,
  ChevronRight,
  Target,
  Zap,
  Users as UsersIcon,
  FileText,
  Star
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    passedCount: 0,
    failedCount: 0,
    totalDuration: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [updating, setUpdating] = useState(false);
  const [selectedTab, setSelectedTab] = useState("history");

  useEffect(() => {
    fetchProfile();
    fetchInterviewHistory();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:3000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setFormData({
          fullName: data.user.fullName,
          email: data.user.email,
        });
      } else if (response.status === 401) {
        localStorage.removeItem("userInfo");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchInterviewHistory = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const response = await fetch("http://localhost:3000/api/auth/interview/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setInterviews(data.interviews || []);
        setStats(data.stats || {
          totalInterviews: 0,
          averageScore: 0,
          passedCount: 0,
          failedCount: 0,
          totalDuration: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching interview history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: "", text: "" });

    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const response = await fetch("http://localhost:3000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser({ ...user, fullName: formData.fullName, email: formData.email });
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        userInfo.user.fullName = formData.fullName;
        userInfo.user.email = formData.email;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setEditing(false);
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update profile" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Server error. Please try again." });
    } finally {
      setUpdating(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "text-emerald-600";
    if (score >= 50) return "text-amber-600";
    return "text-rose-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 70) return "bg-emerald-50";
    if (score >= 50) return "bg-amber-50";
    return "bg-rose-50";
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs} sec`;
    return `${mins} min ${secs} sec`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Your Profile</h1>
            <p className="text-slate-500 mt-1">Manage your account and track your interview progress</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                {/* Cover Image Area */}
                <div className="h-24 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
                
                <div className="px-6 pb-6">
                  {/* Avatar */}
                  <div className="flex justify-center -mt-12 mb-4">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center ring-4 ring-white shadow-lg">
                        <span className="text-3xl font-bold text-white">
                          {user?.fullName?.charAt(0) || "U"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!editing ? (
                    <>
                      <div className="text-center">
                        <h2 className="text-xl font-semibold text-slate-800">{user?.fullName}</h2>
                        <p className="text-slate-500 text-sm mt-1">{user?.email}</p>
                        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-3">
                          <Calendar size={12} />
                          <span>Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="mt-6 space-y-3">
                        <button
                          onClick={() => setEditing(true)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition"
                        >
                          <Edit2 size={16} />
                          Edit Profile
                        </button>
                      </div>
                    </>
                  ) : (
                    <form onSubmit={handleUpdateProfile} className="mt-4">
                      {message.text && (
                        <div className={`mb-4 p-3 rounded-xl text-sm ${
                          message.type === "success" 
                            ? "bg-emerald-50 text-emerald-700" 
                            : "bg-rose-50 text-rose-700"
                        }`}>
                          {message.text}
                        </div>
                      )}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={updating}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-md transition disabled:opacity-50"
                        >
                          {updating ? "Saving..." : <><Save size={16} /> Save</>}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(false);
                            setFormData({ fullName: user?.fullName, email: user?.email });
                            setMessage({ type: "", text: "" });
                          }}
                          className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Briefcase size={18} />
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{stats.totalInterviews}</p>
                  <p className="text-xs text-slate-500">Total Interviews</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <Star size={18} />
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{stats.averageScore}%</p>
                  <p className="text-xs text-slate-500">Average Score</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <CheckCircle size={18} />
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{stats.passedCount}</p>
                  <p className="text-xs text-slate-500">Passed</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 text-rose-600 mb-2">
                    <XCircle size={18} />
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{stats.failedCount}</p>
                  <p className="text-xs text-slate-500">Failed</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 text-purple-600 mb-2">
                    <Clock size={18} />
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{stats.totalDuration}</p>
                  <p className="text-xs text-slate-500">Minutes Practiced</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex border-b border-slate-200">
                  <button
                    onClick={() => setSelectedTab("history")}
                    className={`px-6 py-3 text-sm font-medium transition-all ${
                      selectedTab === "history"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Interview History
                  </button>
                  <button
                    onClick={() => setSelectedTab("insights")}
                    className={`px-6 py-3 text-sm font-medium transition-all ${
                      selectedTab === "insights"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Performance Insights
                  </button>
                </div>

                {/* Interview History Tab */}
                {selectedTab === "history" && (
                  <div className="p-6">
                    {interviews.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Briefcase className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-800 mb-2">No interviews yet</h3>
                        <p className="text-slate-500 mb-6">Start practicing to build your interview history</p>
                        <button
                          onClick={() => navigate("/interviewlibrary")}
                          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-md transition"
                        >
                          Start an Interview
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {interviews.map((interview) => (
                          <div
                            key={interview._id}
                            className="border border-slate-100 rounded-xl p-4 hover:shadow-md transition-all hover:border-slate-200"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-xl ${getScoreBgColor(interview.score)} flex items-center justify-center`}>
                                  <Target size={18} className={getScoreColor(interview.score)} />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-slate-800">{interview.role}</h3>
                                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                                    <div className="flex items-center gap-1">
                                      <Calendar size={12} />
                                      <span>{new Date(interview.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock size={12} />
                                      <span>{formatDuration(interview.duration)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <FileText size={12} />
                                      <span>{interview.answers?.length || 0} questions</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreBgColor(interview.score)} ${getScoreColor(interview.score)}`}>
                                  {interview.score}/100
                                </div>
                                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                                  interview.passed 
                                    ? "bg-emerald-50 text-emerald-600" 
                                    : "bg-rose-50 text-rose-600"
                                }`}>
                                  {interview.passed ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                  {interview.passed ? "Passed" : "Failed"}
                                </span>
                              </div>
                            </div>
                            
                            {/* Feedback Preview */}
                            {(interview.feedback?.strengths?.length > 0 || interview.feedback?.improvements?.length > 0) && (
                              <div className="mt-3 pt-3 border-t border-slate-100">
                                <div className="flex flex-wrap gap-4 text-xs">
                                  {interview.feedback.strengths?.slice(0, 1).map((s, i) => (
                                    <span key={i} className="text-emerald-600">✓ {s}</span>
                                  ))}
                                  {interview.feedback.improvements?.slice(0, 1).map((imp, i) => (
                                    <span key={i} className="text-amber-600">⚠ {imp}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Performance Insights Tab */}
                {selectedTab === "insights" && interviews.length > 0 && (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Score Progress */}
                      <div className="bg-slate-50 rounded-xl p-5">
                        <h3 className="font-medium text-slate-800 mb-3">Score Trend</h3>
                        <div className="space-y-3">
                          {interviews.slice(0, 5).reverse().map((interview, idx) => (
                            <div key={idx}>
                              <div className="flex justify-between text-xs text-slate-600 mb-1">
                                <span>{new Date(interview.date).toLocaleDateString()}</span>
                                <span className="font-medium">{interview.score}%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${getScoreBgColor(interview.score)}`}
                                  style={{ width: `${interview.score}%`, backgroundColor: interview.score >= 70 ? '#10b981' : interview.score >= 50 ? '#f59e0b' : '#ef4444' }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Top Strengths */}
                      <div className="bg-slate-50 rounded-xl p-5">
                        <h3 className="font-medium text-slate-800 mb-3">Top Strengths</h3>
                        <div className="space-y-2">
                          {interviews.flatMap(i => i.feedback?.strengths || []).slice(0, 5).map((s, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                              <CheckCircle size={14} className="text-emerald-500" />
                              <span>{s}</span>
                            </div>
                          ))}
                          {interviews.flatMap(i => i.feedback?.strengths || []).length === 0 && (
                            <p className="text-slate-500 text-sm">Complete more interviews to see insights</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === "insights" && interviews.length === 0 && (
                  <div className="p-12 text-center">
                    <BarChart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Complete an interview to see your performance insights</p>
                    <button
                      onClick={() => navigate("/interviewlibrary")}
                      className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-md transition"
                    >
                      Start First Interview
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}