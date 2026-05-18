import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Mic,
  Clock,
  Calendar,
  Briefcase,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Award,
  XCircle,
  Target,
  Zap,
  Brain,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function FeedbackPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("analysis");
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [isSavingPdf, setIsSavingPdf] = useState(false);

  useEffect(() => {
    if (location.state) {
      setSessionData(location.state);
    } else {
      setSessionData({
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        duration: "00:00",
        topic: "Unknown",
        score: 0,
        relevance: 0,
        fluency: 0,
        structure: 0,
        fillerWords: 0,
        strengths: ["No data available"],
        improvements: ["Please complete an interview session"],
        questions: [],
        allAnswers: [],
        passed: false,
      });
    }
    setLoading(false);
  }, [location.state]);

  const isPassed = (sessionData?.score || 0) > 50;
  const passStatus = isPassed ? "Passed" : "Failed";
  const passStatusColor = isPassed
    ? "text-emerald-600 bg-emerald-50"
    : "text-red-600 bg-red-50";
  const passStatusIcon = isPassed ? (
    <Award className="w-5 h-5" />
  ) : (
    <XCircle className="w-5 h-5" />
  );

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-emerald-50";
    if (score >= 60) return "bg-blue-50";
    if (score >= 50) return "bg-yellow-50";
    return "bg-red-50";
  };

  const getScoreRingColor = (score) => {
    if (score >= 80) return "stroke-emerald-500";
    if (score >= 60) return "stroke-blue-500";
    if (score >= 50) return "stroke-yellow-500";
    return "stroke-red-500";
  };

  const getPerformanceLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Very Good";
    if (score >= 60) return "Good";
    if (score >= 50) return "Satisfactory";
    return "Needs Improvement";
  };

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = ((sessionData?.score || 0) / 100) * circumference;
  const offset = circumference - progress;

  const toggleQuestionExpand = (index) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Check if answer was "I don't know"
  const isIDontKnowAnswer = (answerText) => {
    if (!answerText) return false;
    const lowerAnswer = answerText.toLowerCase();
    const idkPhrases = [
      "i don't know",
      "i dont know",
      "i don\'t know",
      "i do not know",
      "not sure",
      "no idea",
      "i have no idea",
      "dont know",
      "dk",
      "no clue",
    ];
    return idkPhrases.some((phrase) => lowerAnswer.includes(phrase));
  };

  // Save as PDF function
  const saveAsPDF = () => {
    setIsSavingPdf(true);

    // Create a temporary div for the PDF content
    const printContent = document.createElement("div");
    printContent.className = "pdf-content";
    printContent.style.padding = "20px";
    printContent.style.fontFamily = "Arial, sans-serif";
    printContent.style.backgroundColor = "white";
    printContent.style.color = "black";

    // Build HTML content for PDF
    const allAnswersList =
      sessionData.allAnswers || sessionData.questions || [];
    const totalScore = sessionData.score || 0;
    const passed = totalScore > 50;

    printContent.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1a2a5e; margin-bottom: 10px;">DevMock Interview Feedback Report</h1>
        <p style="color: #666;">Generated on ${new Date().toLocaleString()}</p>
        <hr style="border: 1px solid #ddd;">
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1a2a5e; border-bottom: 2px solid #f5c518; padding-bottom: 5px;">Session Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0;"><strong>Date:</strong></td><td>${sessionData.date}</td></tr>
          <tr><td style="padding: 8px 0;"><strong>Duration:</strong></td><td>${sessionData.duration}</td></tr>
          <tr><td style="padding: 8px 0;"><strong>Topic:</strong></td><td>${sessionData.topic?.replace(/%20/g, " ") || "Unknown"}</td></tr>
          <tr><td style="padding: 8px 0;"><strong>Status:</strong></td><td style="color: ${passed ? "green" : "red"}; font-weight: bold;">${passed ? "PASSED ✓" : "FAILED ✗"}</td></tr>
        </table>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1a2a5e; border-bottom: 2px solid #f5c518; padding-bottom: 5px;">Overall Score</h2>
        <div style="text-align: center; margin: 20px 0;">
          <div style="font-size: 48px; font-weight: bold; color: ${totalScore >= 60 ? "#10b981" : "#ef4444"};">${totalScore}/100</div>
          <div style="font-size: 18px; margin-top: 10px;">${getPerformanceLabel(totalScore)}</div>
        </div>
        
        <h3 style="margin-top: 20px;">Breakdown:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0;">Relevance:</td><td><progress value="${sessionData.relevance}" max="100" style="width: 70%;"></progress> ${sessionData.relevance}%</td></tr>
          <tr><td style="padding: 8px 0;">Fluency:</td><td><progress value="${sessionData.fluency}" max="100" style="width: 70%;"></progress> ${sessionData.fluency}%</td></tr>
          <tr><td style="padding: 8px 0;">Structure:</td><td><progress value="${sessionData.structure}" max="100" style="width: 70%;"></progress> ${sessionData.structure}%</td></tr>
          <tr><td style="padding: 8px 0;">Filler Words:</td><td>${sessionData.fillerWords} detected</td></tr>
        </table>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1a2a5e; border-bottom: 2px solid #f5c518; padding-bottom: 5px;">Strengths & Improvements</h2>
        <div style="margin: 15px 0;">
          <h3 style="color: #10b981;">✓ Strengths:</h3>
          <ul>${sessionData.strengths?.map((s) => `<li style="margin: 5px 0;">${s}</li>`).join("") || "<li>None</li>"}</ul>
        </div>
        <div style="margin: 15px 0;">
          <h3 style="color: #f59e0b;">⚠ Areas to Improve:</h3>
          <ul>${sessionData.improvements?.map((i) => `<li style="margin: 5px 0;">${i}</li>`).join("") || "<li>None</li>"}</ul>
        </div>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1a2a5e; border-bottom: 2px solid #f5c518; padding-bottom: 5px;">Detailed Answers</h2>
        ${allAnswersList
          .map(
            (q, i) => `
          <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0;">Question ${i + 1}: ${q.question}</h3>
            <p><strong>Score:</strong> ${q.score || q.questionScore || 0}/100</p>
            <p><strong>Your Answer:</strong> ${q.answer || q.userAnswer || "No answer provided"}</p>
            ${q.matchedKeywords?.length ? `<p><strong>✓ Matched Keywords:</strong> ${q.matchedKeywords.join(", ")}</p>` : ""}
            ${q.missingKeywords?.length ? `<p><strong>⚠ Missing Keywords:</strong> ${q.missingKeywords.join(", ")}</p>` : ""}
            ${q.perfectAnswer ? `<div style="margin-top: 10px; padding: 10px; background-color: #e8f5e9; border-radius: 5px;"><strong>📚 Perfect Answer to Learn:</strong><br>${q.perfectAnswer}</div>` : ""}
          </div>
        `,
          )
          .join("")}
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #666; font-size: 12px;">
        Generated by DevMock - AI-Powered Interview Coach
      </div>
    `;

    // Create a new window for printing/PDF
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>DevMock Interview Feedback Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            progress { vertical-align: middle; }
            @media print {
              body { margin: 0; padding: 15px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <div style="text-align: center; margin-top: 30px;">
            <button onclick="window.print();" style="padding: 10px 20px; background: #1a2a5e; color: white; border: none; border-radius: 5px; cursor: pointer;">Print / Save as PDF</button>
          </div>
          <script>
            // Auto-trigger print dialog for "Save as PDF"
            setTimeout(() => {
              window.print();
            }, 500);
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();

    setIsSavingPdf(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading feedback...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No Feedback Data
            </h2>
            <p className="text-gray-600 mb-6">
              Please complete an interview session first.
            </p>
            <button
              onClick={() => navigate("/interviewlibrary")}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition"
            >
              Go to Interview Library
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const allQuestions = sessionData.allAnswers || sessionData.questions || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate("/interviewlibrary")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium hidden sm:inline">
              Back to Library
            </span>
          </button>
        </div>

        {/* Session Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className={`p-2.5 sm:p-3 rounded-xl ${isPassed ? "bg-emerald-50" : "bg-red-50"}`}
              >
                <Briefcase
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${isPassed ? "text-emerald-600" : "text-red-600"}`}
                />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Performance Analysis
                  </h1>
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${passStatusColor}`}
                  >
                    {passStatusIcon}
                    <span>{passStatus}</span>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-1">
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                    <Calendar size={12} className="sm:w-4 sm:h-4" />
                    <span>{sessionData.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                    <Clock size={12} className="sm:w-4 sm:h-4" />
                    <span>{sessionData.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                    <Briefcase size={12} className="sm:w-4 sm:h-4" />
                    <span className="capitalize">
                      {sessionData.topic?.replace(/%20/g, " ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() =>
                navigate(`/interview/${encodeURIComponent(sessionData.topic)}`)
              }
              className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Retake Interview
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab("analysis")}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium transition-all relative whitespace-nowrap ${
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
            onClick={() => setActiveTab("answers")}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium transition-all relative whitespace-nowrap ${
              activeTab === "answers"
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Your Answers
            {activeTab === "answers" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("insights")}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium transition-all relative whitespace-nowrap ${
              activeTab === "insights"
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Insights
            {activeTab === "insights" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Analysis Tab */}
        {activeTab === "analysis" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                <div className="relative shrink-0">
                  <svg
                    className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48"
                    viewBox="0 0 200 200"
                  >
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
                      y="90"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-2xl sm:text-3xl font-bold fill-gray-900"
                    >
                      {sessionData.score}
                    </text>
                    <text
                      x="100"
                      y="115"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[10px] sm:text-xs fill-gray-500"
                    >
                      out of 100
                    </text>
                  </svg>
                </div>

                <div className="flex-1 text-center lg:text-left">
                  <div className="mb-3">
                    <h3
                      className={`text-lg sm:text-xl font-semibold mb-1 ${getScoreColor(sessionData.score)}`}
                    >
                      {getPerformanceLabel(sessionData.score)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {isPassed
                        ? "🎉 Congratulations! You've passed this interview assessment."
                        : "📚 Keep practicing! Review the feedback below to improve your score."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                      <div className="flex justify-between text-xs sm:text-sm mb-1">
                        <span className="text-gray-600">Relevance</span>
                        <span className="font-medium text-gray-900">
                          {sessionData.relevance}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                        <div
                          className="bg-emerald-500 rounded-full h-1.5 sm:h-2"
                          style={{ width: `${sessionData.relevance}%` }}
                        />
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                      <div className="flex justify-between text-xs sm:text-sm mb-1">
                        <span className="text-gray-600">Fluency</span>
                        <span className="font-medium text-gray-900">
                          {sessionData.fluency}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                        <div
                          className="bg-blue-500 rounded-full h-1.5 sm:h-2"
                          style={{ width: `${sessionData.fluency}%` }}
                        />
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                      <div className="flex justify-between text-xs sm:text-sm mb-1">
                        <span className="text-gray-600">Structure</span>
                        <span className="font-medium text-gray-900">
                          {sessionData.structure}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                        <div
                          className="bg-purple-500 rounded-full h-1.5 sm:h-2"
                          style={{ width: `${sessionData.structure}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-700">
                      {sessionData.fillerWords > 0 ? (
                        <>
                          🎤 Detected{" "}
                          <span className="font-semibold">
                            {sessionData.fillerWords}
                          </span>{" "}
                          filler words. Try pausing instead of using "um" or
                          "like".
                        </>
                      ) : (
                        <>🎯 Excellent fluency with no filler words detected!</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-emerald-50 rounded-2xl p-5 sm:p-6 border border-emerald-100">
                <div className="flex items-center gap-2 mb-4">
                  <ThumbsUp className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-semibold text-emerald-800">Strengths</h3>
                </div>
                <ul className="space-y-3">
                  {sessionData.strengths?.map((strength, idx) => (
                    <li
                      key={idx}
                      className="flex gap-2 text-sm text-emerald-700"
                    >
                      <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 rounded-2xl p-5 sm:p-6 border border-amber-100">
                <div className="flex items-center gap-2 mb-4">
                  <ThumbsDown className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-amber-800">
                    Areas to Improve
                  </h3>
                </div>
                <ul className="space-y-3">
                  {sessionData.improvements?.map((improvement, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-amber-700">
                      <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-blue-50 rounded-2xl p-5 sm:p-6 border border-blue-100">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    Pro Tip
                  </p>
                  <p className="text-sm text-blue-700">
                    ❌ Don't say "I don't know" - instead, share what you DO
                    know and build from there. For example: "I'm not fully sure
                    about X, but based on my understanding of Y..." This shows
                    engagement and willingness to learn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Answers Tab - Shows all answers with perfect answer */}
        {activeTab === "answers" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Answers
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Review all your answers with detailed feedback
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {allQuestions.map((item, idx) => {
                const isExpanded = expandedQuestions[idx];
                const questionScore = item.score || item.questionScore || 0;
                const isIDK = isIDontKnowAnswer(item.answer || item.userAnswer);

                return (
                  <div key={idx} className="p-5 sm:p-6">
                    <button
                      onClick={() => toggleQuestionExpand(idx)}
                      className="w-full text-left flex items-start justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-gray-500">
                            Question {idx + 1}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getScoreBgColor(questionScore)} ${getScoreColor(questionScore)}`}
                          >
                            Score: {questionScore}/100
                          </span>
                          {isIDK && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
                              Said "I don't know"
                            </span>
                          )}
                        </div>
                        <p className="text-sm sm:text-base font-medium text-gray-800">
                          {item.question}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp
                          size={18}
                          className="text-gray-400 flex-shrink-0"
                        />
                      ) : (
                        <ChevronDown
                          size={18}
                          className="text-gray-400 flex-shrink-0"
                        />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        {/* PERFECT ANSWER SECTION */}
                        {(item.perfectAnswer || item.feedback) && (
                          <div className="mb-4">
                            <p className="text-xs font-medium text-green-600 mb-1 flex items-center gap-1">
                              <Lightbulb size={12} />
                              📚 PERFECT ANSWER (Study This):
                            </p>
                            <div className="bg-green-50 rounded-xl p-3 sm:p-4 border border-green-200">
                              <p className="text-sm text-gray-700">
                                {item.perfectAnswer || item.feedback}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* "I DON'T KNOW" TIP */}
                        {isIDK && (
                          <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-200">
                            <p className="text-xs font-medium text-red-700 mb-1 flex items-center gap-1">
                              <AlertCircle size={12} />
                              💡 Tip for Next Time:
                            </p>
                            <p className="text-sm text-red-700">
                              Instead of saying "I don't know", try saying:
                              <span className="font-medium block mt-1 text-red-800">
                                "I'm not fully sure about that, but based on my
                                understanding..."
                              </span>
                              This shows confidence and willingness to learn!
                            </p>
                          </div>
                        )}

                        {/* User's Original Answer */}
                        <div className="mb-3">
                          <p className="text-xs font-medium text-blue-600 mb-1">
                            Your Answer:
                          </p>
                          <div
                            className={`rounded-xl p-3 sm:p-4 ${isIDK ? "bg-red-50 border border-red-100" : "bg-blue-50"}`}
                          >
                            <p className="text-sm text-gray-700">
                              {item.answer ||
                                item.userAnswer ||
                                "No answer provided"}
                            </p>
                          </div>
                        </div>

                        {/* Keywords */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.matchedKeywords?.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1">
                              <span className="text-xs text-emerald-600">
                                ✓ Matched:
                              </span>
                              {item.matchedKeywords.map((kw, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full"
                                >
                                  {kw}
                                </span>
                              ))}
                            </div>
                          )}
                          {item.missingKeywords?.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1">
                              <span className="text-xs text-amber-600">
                                ⚠ Missing:
                              </span>
                              {item.missingKeywords.map((kw, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full"
                                >
                                  {kw}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === "insights" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Performance Metrics
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Relevance</span>
                      <span className="font-medium text-gray-900">
                        {sessionData.relevance}%
                      </span>
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
                      <span className="font-medium text-gray-900">
                        {sessionData.fluency}%
                      </span>
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
                      <span className="font-medium text-gray-900">
                        {sessionData.structure}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 rounded-full h-2"
                        style={{ width: `${sessionData.structure}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-700 uppercase">
                      Key Takeaway
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {isPassed
                      ? "Great job! Your response demonstrates good technical knowledge. Continue practicing to maintain this level."
                      : "Focus on addressing the key concepts. Never say 'I don't know' - instead, share what you DO know and build from there."}
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-5">
                <Zap className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Recommendations
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3 p-3 sm:p-4 bg-blue-50 rounded-xl">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm sm:text-base">
                      Never Say "I Don't Know"
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                      Instead of saying "I don't know", say: "I'm not fully
                      sure, but based on my understanding..." This shows
                      confidence and willingness to learn.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 sm:p-4 bg-emerald-50 rounded-xl">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mic size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm sm:text-base">
                      Practice Pacing
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                      Slow down your speech. Pause between key points to let
                      answers resonate.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 sm:p-4 bg-purple-50 rounded-xl">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm sm:text-base">
                      Use the STAR Method
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                      Structure answers: Situation → Task → Action → Result.
                      This makes your answers clear and impactful.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-3 justify-between items-center">
          <button
            onClick={() => navigate("/interviewlibrary")}
            className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition text-sm"
          >
            Try Another Interview
          </button>
          <div className="flex gap-3">
            <button
              onClick={saveAsPDF}
              disabled={isSavingPdf}
              className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition text-sm disabled:opacity-50"
            >
              {isSavingPdf ? "Preparing PDF..." : "Save Feedback"}
            </button>
            <button
              onClick={() => navigate("/interviewlibrary")}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-md transition text-sm"
            >
              Return to Library
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
