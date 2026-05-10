import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useInterviewQuestions from "../hooks/useInterviewQuestions.js";
import { useMediaPipeTracking } from "../hooks/useMediaPipeTracking.js";
import { evaluateAnswerAPI } from "../services/api.js";

export default function LiveInterview() {
  const { role } = useParams();
  const navigate = useNavigate();

  // Questions - Added loading and error states
  const {
    question,
    index,
    total,
    nextQuestion,
    loading: questionsLoading,
    error: questionsError,
  } = useInterviewQuestions(role);

  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const recognitionRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // State
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // MediaPipe Tracking
  const {
    eyeContact,
    posture,
    eyeContactHistory,
    postureHistory,
    eyeContactWarning,
    postureWarning,
    faceDetected,
  } = useMediaPipeTracking(
    videoRef,
    canvasRef,
    isSessionActive && cameraEnabled,
  );

  // Stats
  const [sessionStats, setSessionStats] = useState({
    duration: 0,
    wordsSpoken: 0,
    fillerWords: 0,
    avgConfidence: 0,
  });

  // Helper function to format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Helper function for performance label
  const getPerformanceLabel = (score) => {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    return "Needs Improvement";
  };

  // Count filler words in transcript
  const countFillerWords = (text) => {
    const fillerWords = [
      "um",
      "uh",
      "like",
      "actually",
      "basically",
      "literally",
      "you know",
      "sort of",
      "kind of",
    ];
    const lowerText = text.toLowerCase();
    let count = 0;
    fillerWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "g");
      const matches = lowerText.match(regex);
      if (matches) count += matches.length;
    });
    return count;
  };

  // Function to start camera
  const startCamera = async () => {
    setCameraError(null);
    setPermissionDenied(false);

    try {
      // First, check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Camera API not supported in this browser");
        setCameraEnabled(false);
        return;
      }

      // Stop any existing stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      // Request camera access with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
        setCameraEnabled(true);
        setCameraError(null);
        console.log("Camera started successfully");
      }
    } catch (err) {
      console.error("Camera error:", err);
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setPermissionDenied(true);
        setCameraError(
          "Camera permission denied. Please allow camera access and refresh.",
        );
      } else if (err.name === "NotFoundError") {
        setCameraError("No camera found on this device");
      } else {
        setCameraError(`Camera error: ${err.message}`);
      }
      setCameraEnabled(false);
    }
  };

  // Function to stop camera
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraEnabled(false);
  };

  /* Webcam Setup - Auto start on component mount */
  useEffect(() => {
    if (isSessionActive) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        startCamera();
      }, 500);

      return () => clearTimeout(timer);
    }

    return () => {
      stopCamera();
    };
  }, [isSessionActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  /* Session Timer */
  useEffect(() => {
    if (!isSessionActive) return;

    const timer = setInterval(() => {
      setSessionStats((prev) => ({
        ...prev,
        duration: prev.duration + 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [isSessionActive]);

  /* Update word count and filler words when transcript changes */
  useEffect(() => {
    const cleanTranscript = transcript.replace(/\s*\[.*?\]\s*/g, "");
    const words = cleanTranscript
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
    const fillerCount = countFillerWords(cleanTranscript);

    setSessionStats((prev) => ({
      ...prev,
      wordsSpoken: words,
      fillerWords: fillerCount,
    }));
  }, [transcript]);

  /* Speech Recognition */
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.",
      );
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptText = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptText + " ";
        } else {
          interimTranscript += transcriptText;
        }
      }

      setTranscript((prev) => {
        const base = prev.replace(/\s*\[.*?\]\s*$/, "");
        const interimDisplay = interimTranscript
          ? ` [${interimTranscript}]`
          : "";
        return base + finalTranscript + interimDisplay;
      });
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
      if (event.error === "not-allowed") {
        alert("Microphone permission denied. Please allow microphone access.");
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      setTranscript((prev) => prev.replace(/\s*\[.*?\]\s*$/, "").trim());
    }
  };

  /* End Session */
  const endSession = () => {
    stopCamera();

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    setListening(false);
    setIsSessionActive(false);
    setCameraEnabled(false);

    // Navigate back to library after ending session
    setTimeout(() => {
      navigate("/interviewlibrary");
    }, 1500);
  };

  /* Submit Answer - Now calls backend API */
  const submitAnswer = async () => {
    if (!question || !transcript.trim()) return;

    const cleanTranscript = transcript.replace(/\s*\[.*?\]\s*/g, "");
    setLoading(true);

    try {
      // Handle core_keywords - could be array or semicolon-separated string
      let keywords = [];
      if (Array.isArray(question.core_keywords)) {
        keywords = question.core_keywords;
      } else if (question.core_keywords) {
        keywords = question.core_keywords.split(";");
      }

      // Call backend API (which handles Gemini + local fallback)
      const result = await evaluateAnswerAPI(
        cleanTranscript,
        question.ideal_answer,
        keywords
      );

      // Calculate metrics for feedback
      const relevanceScore = result.semantic_similarity || 85;
      const fluencyScore = Math.max(
        0,
        Math.min(100, 100 - sessionStats.fillerWords * 2),
      );
      const structureScore = result.final_score * 10;

      // Prepare questions array with timestamps
      const questionTimestamp = Math.max(0, sessionStats.duration - 45);

      // Navigate to feedback page with data
      navigate("/feedback", {
        state: {
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          duration: formatTime(sessionStats.duration),
          topic: role,
          score: result.final_score * 10,
          relevance: relevanceScore,
          fluency: fluencyScore,
          structure: structureScore,
          fillerWords: sessionStats.fillerWords,
          strengths: result.strengths || [
            "Good understanding of the technical concept",
            "Clear communication of key ideas",
          ],
          improvements: result.improvements || [
            "Add more specific examples to strengthen your answer",
            "Quantify your results with metrics when possible",
          ],
          questions: [
            {
              question: question.question,
              answer: cleanTranscript,
              timestamp: formatTime(questionTimestamp),
            },
          ],
        },
      });
    } catch (err) {
      console.error("Evaluation failed:", err);
      alert("Error evaluating answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (questionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f8faff] to-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">
              Loading interview questions...
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Please wait while we prepare your session
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error State
  if (questionsError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f8faff] to-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Unable to Load Questions
            </h2>
            <p className="text-gray-600 mb-4">{questionsError}</p>
            <p className="text-gray-500 text-sm mb-6">
              Please make sure your backend server is running on port 3000
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // No questions found
  if (!question && !questionsLoading && !questionsError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f8faff] to-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No Questions Available
            </h2>
            <p className="text-gray-600 mb-4">
              No interview questions found for {role}. Please add questions to
              the database.
            </p>
            <button
              onClick={() => navigate("/interviewlibrary")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Library
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8faff] to-white flex flex-col">
      <Navbar />

      {/* Top Bar - Fixed positioning with proper z-index */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          {/* Session Info */}
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-slate-500">ACTIVE SESSION</p>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-slate-800 capitalize">
                  {role?.replace(/%20/g, " ")} Interview
                </h2>
                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Live
                </span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <span className="text-sm text-slate-500 whitespace-nowrap">
              Q{index + 1}/{total}
            </span>
            <div className="flex-1 sm:w-48 bg-slate-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${total ? ((index + 1) / total) * 100 : 0}%` }}
              />
            </div>
            <button
              onClick={endSession}
              className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-all duration-300 shadow-sm hover:shadow whitespace-nowrap"
            >
              End Session
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Added top padding to account for fixed header */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Camera & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Camera Section */}
            <div className="bg-slate-900 rounded-2xl overflow-hidden relative group aspect-video">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* MediaPipe Canvas Overlay */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                width={640}
                height={480}
              />

              {/* Camera Controls Overlay */}
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                {cameraEnabled ? (
                  <button
                    onClick={stopCamera}
                    className="bg-red-500/80 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm transition"
                  >
                    Turn Off Camera
                  </button>
                ) : (
                  <button
                    onClick={startCamera}
                    className="bg-green-500/80 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm transition"
                  >
                    Enable Camera
                  </button>
                )}
              </div>

              {!cameraEnabled && !cameraError && !permissionDenied && (
                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📹</div>
                    <p className="text-white text-lg">Camera Disabled</p>
                    <button
                      onClick={startCamera}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                    >
                      Enable Camera
                    </button>
                    <p className="text-slate-400 text-sm mt-2">
                      Camera required for eye contact tracking
                    </p>
                  </div>
                </div>
              )}

              {cameraError && (
                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                  <div className="text-center max-w-xs">
                    <div className="text-4xl mb-2">⚠️</div>
                    <p className="text-yellow-400 text-sm font-medium mb-2">
                      {cameraError}
                    </p>
                    {permissionDenied && (
                      <p className="text-slate-400 text-xs mb-3">
                        Please allow camera access in your browser settings,
                        then refresh the page.
                      </p>
                    )}
                    <button
                      onClick={startCamera}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Face Detection Status */}
              {cameraEnabled && !faceDetected && !cameraError && (
                <div className="absolute top-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-lg animate-pulse">
                  ⚠️ No face detected - Position yourself in frame
                </div>
              )}

              {/* Live Tracking Overlay */}
              {cameraEnabled && faceDetected && !cameraError && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center justify-between text-white">
                    {/* Eye Contact Indicator */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">👀</span>
                        <span className="text-xs font-medium">Eye Contact</span>
                      </div>
                      <div className="w-20 bg-white/20 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            eyeContact > 80
                              ? "bg-green-400"
                              : eyeContact > 60
                                ? "bg-yellow-400"
                                : "bg-red-400"
                          }`}
                          style={{ width: `${eyeContact}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {Math.round(eyeContact)}%
                      </span>
                    </div>

                    {/* Posture Indicator */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">🧍</span>
                        <span className="text-xs font-medium">Posture</span>
                      </div>
                      <div className="w-20 bg-white/20 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            posture > 85
                              ? "bg-green-400"
                              : posture > 70
                                ? "bg-yellow-400"
                                : "bg-red-400"
                          }`}
                          style={{ width: `${posture}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {Math.round(posture)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Warning Overlays */}
              {cameraEnabled && eyeContactWarning && (
                <div className="absolute top-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-lg animate-pulse">
                  ⚠️ Make eye contact with the camera
                </div>
              )}
              {cameraEnabled && postureWarning && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg animate-pulse">
                  ⚠️ Sit up straight
                </div>
              )}
            </div>

            {/* Session Stats Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Duration</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">
                  {formatTime(sessionStats.duration)}
                </p>
                <p className="text-xs text-slate-400 mt-1">Session time</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Words</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">
                  {sessionStats.wordsSpoken}
                </p>
                <p className="text-xs text-slate-400 mt-1">Spoken</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Avg Eye Contact</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-800">
                  {eyeContactHistory.length
                    ? Math.round(
                        eyeContactHistory.reduce((a, b) => a + b, 0) /
                          eyeContactHistory.length,
                      )
                    : 0}
                  %
                </p>
                <p className="text-xs text-slate-400 mt-1">Last 30 seconds</p>
              </div>
            </div>
          </div>

          {/* Right Column - Question & Answer */}
          <div className="space-y-6">
            {/* Question Card */}
            {question && (
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span className="text-xs font-medium text-blue-600">
                    CURRENT QUESTION
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-3">
                  {question.question}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {/* Handle both array and string formats */}
                  {(Array.isArray(question.core_keywords)
                    ? question.core_keywords
                    : question.core_keywords?.split(";") || []
                  ).map((keyword, i) => (
                    <span
                      key={i}
                      className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100"
                    >
                      #{keyword.trim()}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-4">
                  💡 Speak naturally. Your answer will be evaluated for keywords
                  and clarity.
                </p>
              </div>
            )}

            {/* Answer Section */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  <span className="text-xs font-medium text-emerald-600">
                    YOUR ANSWER
                  </span>
                </div>
                {listening && (
                  <span className="flex items-center gap-1.5 text-emerald-600 text-xs bg-emerald-50 px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Recording...
                  </span>
                )}
              </div>

              <textarea
                value={transcript}
                readOnly
                rows={5}
                className="w-full border border-slate-200 rounded-xl p-3 sm:p-4 font-mono text-sm text-slate-700 bg-slate-50 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all"
                placeholder="Start speaking... Your words will appear here as you talk..."
              />

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={listening ? stopListening : startListening}
                  disabled={!isSessionActive || loading}
                  className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md ${
                    listening
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-green-500 hover:to-emerald-500"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {listening ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                      Stop Recording
                    </span>
                  ) : (
                    "Start Speaking"
                  )}
                </button>

                <button
                  onClick={() => {
                    setTranscript("");
                    setFeedback(null);
                    if (recognitionRef.current) {
                      recognitionRef.current.stop();
                      setListening(false);
                    }
                  }}
                  disabled={loading || !transcript}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium transition-all duration-300 disabled:opacity-50"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Feedback Section */}
            {loading && (
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-blue-700 text-sm">
                    Evaluating your answer...
                  </p>
                </div>
              </div>
            )}

            {feedback && (
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                    <span className="text-xs font-medium text-purple-600">
                      FEEDBACK
                    </span>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      feedback.final_score >= 8
                        ? "bg-emerald-100 text-emerald-700"
                        : feedback.final_score >= 6
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {getPerformanceLabel(feedback.final_score)}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">Score</span>
                    <span className="text-2xl font-bold text-slate-800">
                      {feedback.final_score}/10
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        feedback.final_score >= 8
                          ? "bg-emerald-500"
                          : feedback.final_score >= 6
                            ? "bg-blue-500"
                            : "bg-amber-500"
                      }`}
                      style={{ width: `${feedback.final_score * 10}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {feedback.matched_keywords?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-emerald-600 mb-1">
                        ✓ Key Terms Found
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {feedback.matched_keywords.map((k, i) => (
                          <span
                            key={i}
                            className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full border border-emerald-100"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {feedback.missing_keywords?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-amber-600 mb-1">
                        ⚠️ Consider Adding
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {feedback.missing_keywords.map((k, i) => (
                          <span
                            key={i}
                            className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-100"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                disabled={!isSessionActive || loading}
                onClick={() => {
                  if (recognitionRef.current) {
                    recognitionRef.current.stop();
                    setListening(false);
                  }
                  setTranscript("");
                  setFeedback(null);
                }}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium transition-all duration-300 disabled:opacity-50"
              >
                Reset
              </button>

              <button
                disabled={!isSessionActive || loading || !transcript.trim()}
                onClick={() => {
                  stopListening();
                  submitAnswer();
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50"
              >
                Submit
              </button>

              <button
                onClick={() => {
                  stopListening();
                  setTranscript("");
                  setFeedback(null);
                  nextQuestion();
                }}
                disabled={!isSessionActive || loading}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}