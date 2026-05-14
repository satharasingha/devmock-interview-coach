import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminNavbar from "../../components/AdminNavbar";
import { Trash2, Eye, Briefcase, AlertCircle, Clock } from "lucide-react";

export default function AdminInterviews() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch interview data (questions grouped by job role)
  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/questions');
      if (response.ok) {
        const allQuestions = await response.json();
        
        // Group questions by job role
        const groupedByRole = allQuestions.reduce((acc, question) => {
          const role = question.job_role;
          if (!acc[role]) {
            acc[role] = {
              id: role.replace(/\s/g, '-').toLowerCase(),
              title: role,
              questions: [],
              totalQuestions: 0,
            };
          }
          acc[role].questions.push(question);
          acc[role].totalQuestions++;
          return acc;
        }, {});
        
        // Convert to array and add metadata
        const interviewsArray = Object.values(groupedByRole).map(role => ({
          ...role,
          color: getRoleColor(role.title),
          type: role.title.toLowerCase().includes('intern') ? 'intern' : 'full-time',
          level: getRoleLevel(role.title)
        }));
        
        setInterviews(interviewsArray);
      }
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (title) => {
    if (title.includes("Intern")) return "from-green-400 to-emerald-400";
    if (title.includes("Software Engineer")) return "from-blue-500 to-indigo-500";
    if (title.includes("Full Stack")) return "from-cyan-500 to-blue-500";
    if (title.includes("Frontend")) return "from-sky-400 to-blue-400";
    if (title.includes("Backend")) return "from-indigo-400 to-blue-400";
    if (title.includes("Data")) return "from-purple-400 to-violet-400";
    if (title.includes("DevOps")) return "from-orange-400 to-red-400";
    return "from-gray-500 to-gray-600";
  };

  const getRoleLevel = (title) => {
    if (title.includes("Intern")) return "Intern";
    if (title.includes("Senior")) return "Senior";
    if (title.includes("Lead")) return "Lead";
    return "Junior - Mid";
  };

  const handleDeleteInterview = async (interview) => {
    try {
      const response = await fetch(`http://localhost:3000/api/questions/role/${encodeURIComponent(interview.title)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setInterviews(interviews.filter(i => i.id !== interview.id));
        setMessage({ type: "success", text: `${interview.title} has been deleted successfully.` });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: "Failed to delete interview. Please try again." });
      }
    } catch (error) {
      console.error("Error deleting interview:", error);
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    }
    setShowDeleteModal(null);
  };

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || interview.type === selectedType;
    return matchesSearch && matchesType;
  });

  const types = [
    { value: "all", label: "All Positions" },
    { value: "intern", label: "Internships" },
    { value: "full-time", label: "Full Time" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar setSidebarOpen={setSidebarOpen} />
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="lg:pl-64 pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading interviews...</p>
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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Manage Interviews</h1>
            <p className="text-gray-600 mt-1">View and manage all interview categories</p>
          </div>

          {/* Message Alert */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === "success" 
                ? "bg-green-50 border border-green-200 text-green-700" 
                : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              <AlertCircle size={20} />
              <span>{message.text}</span>
            </div>
          )}

          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search interviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition"
              />
            </div>

            <div className="flex gap-2">
              {types.map(type => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200 ${
                    selectedType === type.value
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="mb-6 text-sm text-gray-500">
            Showing {filteredInterviews.length} {filteredInterviews.length === 1 ? 'interview' : 'interviews'}
          </div>

          {/* Interviews Grid */}
          {filteredInterviews.length > 0 ? (
            <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Top gradient bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${interview.color}`}></div>
                  
                  <div className="p-5 sm:p-6">
                    {/* Header with title and type badge */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {interview.title}
                      </h3>
                      
                      {/* Type badge */}
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        interview.type === "intern" 
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-blue-50 text-blue-600 border border-blue-100"
                      }`}>
                        {interview.type === "intern" ? "Intern" : "Full Time"}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {/* Total Questions */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase size={14} className="text-gray-400" />
                        <span>{interview.totalQuestions} Questions</span>
                      </div>
                      
                      {/* Level */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={14} className="text-gray-400" />
                        <span>Level: {interview.level}</span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500">Total Questions</p>
                        <p className="text-lg font-semibold text-gray-800">{interview.totalQuestions}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500">Categories</p>
                        <p className="text-lg font-semibold text-gray-800">Multiple</p>
                      </div>
                    </div>

                    {/* Action Buttons - Side by side */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/questions?role=${encodeURIComponent(interview.title)}`)}
                        className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 rounded-lg px-3 py-2 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <Eye size={16} />
                        View Questions
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(interview)}
                        className="inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg px-3 py-2 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // No results state
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No interviews found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Interview</h3>
            </div>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{showDeleteModal.title}</span>?
            </p>
            <p className="text-gray-500 text-sm mb-6">
              This will permanently remove all {showDeleteModal.totalQuestions} questions associated with this interview. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteInterview(showDeleteModal)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}