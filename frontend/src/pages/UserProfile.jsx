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
  Star,
  Activity,
  BarChart3,
  ChevronRight,
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
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 70) return "bg-green-100";
    if (score >= 50) return "bg-yellow-100";
    return "bg-red-100";
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 mt-1">Manage your account and view interview history</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      {user?.fullName?.charAt(0) || "U"}
                    </span>
                  </div>
                  {!editing ? (
                    <>
                      <h2 className="text-xl font-semibold text-gray-800">{user?.fullName}</h2>
                      <p className="text-gray-500 text-sm mb-4">{user?.email}</p>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                        <Calendar size={14} />
                        <span>Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={() => setEditing(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition"
                      >
                        <Edit2 size={16} />
                        Edit Profile
                      </button>
                    </>
                  ) : (
                    <form onSubmit={handleUpdateProfile} className="text-left">
                      {message.text && (
                        <div className={`mb-4 p-3 rounded-lg text-sm ${
                          message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}>
                          {message.text}
                        </div>
                      )}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={updating}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Interview History Section */}
            <div className="lg:col-span-2">
              {/* Stats Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Performance Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalInterviews}</div>
                    <p className="text-xs text-gray-600">Total Interviews</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.averageScore}%</div>
                    <p className="text-xs text-gray-600">Avg Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{stats.passedCount}</div>
                    <p className="text-xs text-gray-600">Passed</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.failedCount}</div>
                    <p className="text-xs text-gray-600">Failed</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.totalDuration} min</div>
                    <p className="text-xs text-gray-600">Total Time</p>
                  </div>
                </div>
              </div>

              {/* Interview History List */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Interview History</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Activity size={16} />
                    <span>{interviews.length} interviews completed</span>
                  </div>
                </div>

                {interviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No interviews yet</h3>
                    <p className="text-gray-500">Start practicing to see your interview history here.</p>
                    <button
                      onClick={() => navigate("/interviewlibrary")}
                      className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-md transition"
                    >
                      Start an Interview
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {interviews.map((interview, index) => (
                      <div
                        key={interview._id}
                        className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-800">{interview.role}</h3>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                              <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                <span>{new Date(interview.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{Math.floor(interview.duration / 60)} min {interview.duration % 60} sec</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Briefcase size={12} />
                                <span>{interview.answers?.length || 0} questions</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${getScoreBgColor(interview.score)} ${getScoreColor(interview.score)}`}>
                              Score: {interview.score}/100
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              {interview.passed ? (
                                <span className="flex items-center gap-1 text-xs text-green-600">
                                  <CheckCircle size={12} /> Passed
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs text-red-600">
                                  <XCircle size={12} /> Failed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {interview.feedback && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex flex-wrap gap-4">
                              {interview.feedback.strengths?.length > 0 && (
                                <div className="flex-1">
                                  <p className="text-xs font-medium text-green-600 mb-1">💪 Strengths</p>
                                  <ul className="text-xs text-gray-600 space-y-1">
                                    {interview.feedback.strengths.slice(0, 2).map((s, i) => (
                                      <li key={i}>• {s}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {interview.feedback.improvements?.length > 0 && (
                                <div className="flex-1">
                                  <p className="text-xs font-medium text-amber-600 mb-1">📈 Areas to Improve</p>
                                  <ul className="text-xs text-gray-600 space-y-1">
                                    {interview.feedback.improvements.slice(0, 2).map((i, idx) => (
                                      <li key={idx}>• {i}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
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