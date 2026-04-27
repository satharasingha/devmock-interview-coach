import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ArrowLeft,
  Download,
  Share2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Mic,
  Clock,
  Calendar,
  Briefcase,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  FileText,
  ChevronRight,
  Printer,
  Copy,
} from "lucide-react";

export default function FeedbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get session data from navigation state or use mock data
  const [sessionData] = useState(location.state || {
    date: "Oct 24, 2023",
    duration: "45m",
    topic: "Behavioral",
    score: 82,
    relevance: 90,
    fluency: 75,
    structure: 80,
    fillerWords: 12,
    strengths: [
      "Situation Clarity: You effectively set the context, describing the engineering challenge with the legacy API integration clearly.",
      "Action Orientation: Your use of active verbs (\"refactored,\" \"initiated,\" \"deployed\") demonstrated ownership of the solution."
    ],
    improvements: [
      "Quantify the Results: While you mentioned the system became \"faster,\" specific metrics would strengthen your answer.",
      "Reduce Filler Words: You used \"like\" and \"um\" frequently during the transition from Task to Action. Pausing silently is more effective than filling the space."
    ],
    questions: [
      {
        question: "Tell me about a time you had to optimize a slow process. What was your approach?",
        answer: "Sure. In my last internship at TechCorp, we had a legacy data pipeline that was taking about 4 hours to run every night. This was delaying our reporting dashboard updates.",
        timestamp: "0:05"
      },
      {
        question: null,
        answer: "My task was to, um, like, figure out why it was slow. I initiated a deep dive into the logs and found that multiple redundant API calls were being made.",
        timestamp: "0:22"
      },
      {
        question: null,
        answer: "I refactored the Python script to batch these requests. I also implemented Redis caching for static data. The result was that the pipeline ran much faster, finishing before the team arrived in the morning.",
        timestamp: "0:45"
      }
    ]
  });

  const [activeTab, setActiveTab] = useState("analysis");

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-blue-600";
    return "text-amber-600";
  };

  const getScoreRingColor = (score) => {
    if (score >= 80) return "stroke-emerald-500";
    if (score >= 60) return "stroke-blue-500";
    return "stroke-amber-500";
  };

  // Calculate circle circumference
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (sessionData.score / 100) * circumference;
  const offset = circumference - progress;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
          
          <div className="flex gap-3">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Printer size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Copy size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 size={20} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download size={16} />
              <span className="text-sm font-medium">Download Report</span>
            </button>
          </div>
        </div>

        {/* Session Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Performance Analysis</h1>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>{sessionData.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock size={14} />
                    <span>{sessionData.duration} Duration</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Briefcase size={14} />
                    <span>{sessionData.topic}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                View Recording
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Retake Interview
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("analysis")}
            className={`px-6 py-3 text-sm font-medium transition-all relative ${
              activeTab === "analysis"
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Analysis
            {activeTab === "analysis" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("transcript")}
            className={`px-6 py-3 text-sm font-medium transition-all relative ${
              activeTab === "transcript"
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Transcript
            {activeTab === "transcript" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("insights")}
            className={`px-6 py-3 text-sm font-medium transition-all relative ${
              activeTab === "insights"
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            AI Insights
            {activeTab === "insights" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Analysis Tab */}
        {activeTab === "analysis" && (
          <div className="space-y-6">
            {/* Overall Score Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Score Circle */}
                <div className="relative">
                  <svg className="w-48 h-48" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeLinecap="round"
                      className={getScoreRingColor(sessionData.score)}
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      transform="rotate(-90 100 100)"
                    />
                    <text
                      x="100"
                      y="100"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-3xl font-bold fill-gray-900"
                    >
                      {sessionData.score}
                    </text>
                  </svg>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 whitespace-nowrap">
                    <span className="text-sm text-gray-500">out of 100</span>
                  </div>
                </div>

                {/* Score Details */}
                <div className="flex-1">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      Strong Proficiency
                    </h3>
                    <p className="text-sm text-gray-500">
                      High alignment with question intent and core competencies.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Relevance</span>
                        <span className="font-medium text-gray-900">{sessionData.relevance}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-emerald-500 rounded-full h-2"
                          style={{ width: `${sessionData.relevance}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Fluency</span>
                        <span className="font-medium text-gray-900">{sessionData.fluency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 rounded-full h-2"
                          style={{ width: `${sessionData.fluency}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Structure</span>
                        <span className="font-medium text-gray-900">{sessionData.structure}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 rounded-full h-2"
                          style={{ width: `${sessionData.structure}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      Moderate pacing. Detected <span className="font-semibold">{sessionData.fillerWords}</span> filler words ("um", "like").
                      Clear STAR method usage. Result section could be stronger.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Qualitative Analysis */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Qualitative Analysis</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-3">
                    <ThumbsUp className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-semibold text-emerald-800">Strengths</h3>
                  </div>
                  <ul className="space-y-3">
                    {sessionData.strengths.map((strength, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-emerald-700">
                        <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                  <div className="flex items-center gap-2 mb-3">
                    <ThumbsDown className="w-5 h-5 text-amber-600" />
                    <h3 className="font-semibold text-amber-800">Areas for Improvement</h3>
                  </div>
                  <ul className="space-y-3">
                    {sessionData.improvements.map((improvement, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-amber-700">
                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                        <div>
                          <span>{improvement.split(":")[0]}:</span>
                          <span className="text-amber-600"> {improvement.split(":")[1]}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Suggestions */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-1">Pro Tip</p>
                    <p className="text-sm text-blue-700">
                      Practice using the STAR method (Situation, Task, Action, Result) for behavioral questions. 
                      Your answers will be more structured and impactful.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transcript Tab */}
        {activeTab === "transcript" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Session Transcript</h2>
              <p className="text-sm text-gray-500 mt-1">Complete recording of your interview response</p>
            </div>
            
            <div className="p-6 space-y-6">
              {sessionData.questions.map((item, idx) => (
                <div key={idx} className="space-y-3">
                  {item.question && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Briefcase size={14} className="text-purple-600" />
                        </div>
                        <span className="text-xs font-medium text-purple-600 uppercase">Question</span>
                      </div>
                      <p className="text-gray-800 italic">"{item.question}"</p>
                    </div>
                  )}
                  
                  <div className="pl-4 border-l-3 border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Mic size={14} className="text-blue-600" />
                        </div>
                        <span className="text-xs font-medium text-blue-600">Your Answer</span>
                      </div>
                      <span className="text-xs text-gray-400">{item.timestamp}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <p className="text-xs text-center text-gray-500">
                © 2023 DevMock Inc. All rights reserved.
              </p>
            </div>
          </div>
        )}

        {/* AI Insights Tab */}
        {activeTab === "insights" && (
          <div className="space-y-6">
            {/* Communication Analysis */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Communication Analysis</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Speech Clarity</span>
                      <span className="font-medium text-gray-900">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 rounded-full h-2" style={{ width: "85%" }} />
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Vocabulary Range</span>
                      <span className="font-medium text-gray-900">72%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 rounded-full h-2" style={{ width: "72%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Confidence Score</span>
                      <span className="font-medium text-gray-900">68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 rounded-full h-2" style={{ width: "68%" }} />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-100 text-blue-700">
                          Key Takeaway
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-700 mt-2">
                        Your response demonstrates good technical knowledge. Focus on adding 
                        quantifiable results and reducing filler words to improve impact.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">AI Recommendations</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3 p-4 bg-blue-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Add Specific Metrics</p>
                    <p className="text-sm text-gray-600">
                      Quantify your achievements with numbers. Instead of "made it faster," say 
                      "reduced processing time by 40%."
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3 p-4 bg-emerald-50 rounded-xl">
                  <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mic size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Practice Pacing</p>
                    <p className="text-sm text-gray-600">
                      Slow down your speech slightly. Pause between key points to let your 
                      answers resonate and avoid filler words.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4 justify-between items-center">
          <button
            onClick={() => navigate("/practice")}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Try Another Interview
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Save Feedback
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}