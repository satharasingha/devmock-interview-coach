import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";

export default function InterviewLibrary() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [jobRoles, setJobRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch job roles from database
  useEffect(() => {
    fetchJobRoles();
  }, []);

  const fetchJobRoles = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/questions/distinct-roles");
      if (response.ok) {
        const roles = await response.json();
        setJobRoles(roles);
      }
    } catch (error) {
      console.error("Error fetching job roles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get question count for each role
  const getQuestionCount = async (role) => {
    try {
      const response = await fetch(`http://localhost:3000/api/questions?role=${encodeURIComponent(role)}`);
      if (response.ok) {
        const questions = await response.json();
        return questions.length;
      }
    } catch (error) {
      console.error("Error fetching question count:", error);
    }
    return 0;
  };

  // Role metadata configuration
  const getRoleMetadata = (roleTitle) => {
    const metadata = {
      "Software Engineer": {
        description: "Practice technical questions for system design, algorithms, and high-performance coding.",
        color: "from-blue-500 to-indigo-500",
        level: "Junior - Mid",
        type: "full-time",
        path: "/interview/Software%20Engineer"
      },
      "Frontend Developer": {
        description: "Master React, CSS, JavaScript, and modern frontend frameworks.",
        color: "from-sky-500 to-blue-500",
        level: "Junior - Mid",
        type: "full-time",
        path: "/interview/Frontend%20Developer"
      },
      "Backend Developer": {
        description: "Focus on API design, databases, server architecture, and system optimization.",
        color: "from-indigo-500 to-purple-500",
        level: "Junior - Mid",
        type: "full-time",
        path: "/interview/Backend%20Developer"
      },
      "Data Scientist": {
        description: "Practice statistical analysis, machine learning, and data visualization techniques.",
        color: "from-emerald-500 to-teal-500",
        level: "Mid - Senior",
        type: "full-time",
        path: "/interview/Data%20Scientist"
      },
      "DevOps Engineer": {
        description: "Master CI/CD pipelines, containerization, cloud infrastructure, and automation.",
        color: "from-orange-500 to-red-500",
        level: "Mid - Senior",
        type: "full-time",
        path: "/interview/DevOps%20Engineer"
      },
      "Product Manager": {
        description: "Learn product strategy, roadmap planning, stakeholder management, and agile methodologies.",
        color: "from-rose-500 to-pink-500",
        level: "Mid - Senior",
        type: "full-time",
        path: "/interview/Product%20Manager"
      }
    };

    // Default metadata for any role
    return metadata[roleTitle] || {
      description: `Practice ${roleTitle} interview questions and improve your technical skills.`,
      color: "from-blue-500 to-cyan-500",
      level: "Junior",
      type: "full-time",
      path: `/interview/${encodeURIComponent(roleTitle)}`
    };
  };

  // Get role icon based on title
  const getRoleIcon = (title) => {
    const icons = {
      "Software Engineer": "💻",
      "Frontend Developer": "🎨",
      "Backend Developer": "⚙️",
      "Data Scientist": "📊",
      "DevOps Engineer": "🔧",
      "Product Manager": "📋"
    };
    return icons[title] || "📁";
  };

  const types = [
    { value: "all", label: "All Positions" },
    { value: "intern", label: "Internships" },
    { value: "full-time", label: "Full Time" },
  ];

  const levels = [
    { value: "all", label: "All Levels" },
    { value: "intern", label: "Intern" },
    { value: "junior", label: "Junior" },
    { value: "mid", label: "Mid-Level" },
    { value: "senior", label: "Senior" },
  ];

  // Build roles array with metadata
  const rolesWithMetadata = jobRoles.map(role => ({
    title: role,
    ...getRoleMetadata(role),
    icon: getRoleIcon(role),
    questions: `${Math.floor(Math.random() * 30) + 20}+ questions`
  }));

  // Filter roles based on search, type, and level
  const filteredRoles = rolesWithMetadata.filter(role => {
    const matchesSearch = role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || role.type === selectedType;
    const matchesLevel = selectedLevel === "all" || role.level.toLowerCase().includes(selectedLevel.toLowerCase());
    return matchesSearch && matchesType && matchesLevel;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading career paths...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 pt-24 sm:pt-28">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-md"></div>
              <span className="relative text-xs font-medium text-blue-700 bg-blue-50/80 backdrop-blur-sm px-4 py-2 rounded-full inline-block border border-blue-100">
                ✦ INTERVIEW LIBRARY
              </span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-800 mb-4 sm:mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
              Interview Library
            </span>
          </h1>
          
          <p className="text-slate-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Choose your career path to begin a tailored, AI-driven mock interview.
            From internships to senior roles, we've got you covered.
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-8 sm:mt-10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-slate-500">{jobRoles.length} Career Paths</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-slate-500">AI-Powered Feedback</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-slate-500">Real-time Evaluation</span>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 sm:mb-10">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search career paths..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition text-slate-700 placeholder-slate-400"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {types.map(type => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 ${
                  selectedType === type.value
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition text-slate-700 lg:w-48"
          >
            {levels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6 text-sm text-slate-500">
          Showing {filteredRoles.length} {filteredRoles.length === 1 ? 'career path' : 'career paths'}
        </div>

        {filteredRoles.length > 0 ? (
          <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRoles.map((role, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
                onClick={() => role.path && navigate(role.path)}
              >
                <div className={`h-1.5 bg-gradient-to-r ${role.color}`}></div>
                
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${role.color} bg-opacity-10 flex items-center justify-center text-xl transform group-hover:scale-110 transition-transform duration-300`}>
                      {role.icon}
                    </div>
                    
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      role.type === "intern" 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-blue-50 text-blue-600 border border-blue-100"
                    }`}>
                      {role.type === "intern" ? "Intern" : "Full Time"}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {role.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                    {role.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {role.questions}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      role.level === "Intern" ? "bg-emerald-50 text-emerald-600" :
                      role.level.includes("Junior") ? "bg-sky-50 text-sky-600" :
                      role.level.includes("Mid") ? "bg-blue-50 text-blue-600" :
                      "bg-violet-50 text-violet-600"
                    }`}>
                      {role.level}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      role.path && navigate(role.path);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 rounded-xl px-4 py-2.5 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Start Interview
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20 bg-white rounded-2xl border border-slate-100">
            <div className="text-5xl mb-4 opacity-50">📋</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No career paths found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedType("all");
                setSelectedLevel("all");
              }}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-cyan-600 transition-colors"
            >
              Clear all filters
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="mt-16 sm:mt-20 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-50 to-white px-6 py-3 rounded-full border border-slate-200">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-slate-600">
              New career paths added weekly • AI feedback in real-time
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}