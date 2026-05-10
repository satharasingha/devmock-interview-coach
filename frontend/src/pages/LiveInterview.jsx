import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useInterviewQuestions from "../hooks/useInterviewQuestions.js";
import { useMediaPipeTracking } from "../hooks/useMediaPipeTracking.js";
import { evaluateAnswerAPI } from "../services/api.js";

// Correction service
const correctTranscript = async (text, context) => {
  try {
    const response = await fetch("http://localhost:3000/api/correct/correct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, context }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.corrected;
    }
  } catch (error) {
    console.error("Correction API error:", error);
  }
  return text; // Return original if correction fails
};

// Quick local correction (as fallback)
const quickLocalCorrect = (text) => {
  const corrections = {
    'froent': 'frontend',
    'fro-end': 'frontend',
    'frond': 'frontend',
    'fontend': 'frontend',
    'back': 'backend',
    'back-end': 'backend',
    'bacend': 'backend',
    'reack': 'React',
    'reacted': 'React',
    'reac': 'React',
    'javashit': 'JavaScript',
    'java script': 'JavaScript',
    'type script': 'TypeScript',
    'typescript': 'TypeScript',
    'nodejs': 'Node.js',
    'expressjs': 'Express.js',
    'mongodb': 'MongoDB',
    'postgresql': 'PostgreSQL',
    'mysql': 'MySQL',
  };
  
  let corrected = text;
  for (const [wrong, correct] of Object.entries(corrections)) {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    corrected = corrected.replace(regex, correct);
  }
  return corrected;
};

export default function LiveInterview() {
  const { role } = useParams();
  const navigate = useNavigate();

  const {
    question,
    index,
    total,
    nextQuestion,
    loading: questionsLoading,
    error: questionsError,
  } = useInterviewQuestions(role);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const recognitionRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const correctionTimeoutRef = useRef(null);

  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [pendingCorrection, setPendingCorrection] = useState(null);

  const {
    eyeContact,
    posture,
    eyeContactHistory,
    postureHistory,
    eyeContactWarning,
    postureWarning,
    faceDetected,
  } = useMediaPipeTracking(videoRef, canvasRef, isSessionActive && cameraEnabled);

  const [sessionStats, setSessionStats] = useState({
    duration: 0,
    wordsSpoken: 0,
    fillerWords: 0,
    avgConfidence: 0,
  });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getPerformanceLabel = (score) => {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    return "Needs Improvement";
  };

  const countFillerWords = (text) => {
    const fillerWords = ["um", "uh", "like", "actually", "basically", "literally", "you know", "sort of", "kind of"];
    const lowerText = text.toLowerCase();
    let count = 0;
    fillerWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "g");
      const matches = lowerText.match(regex);
      if (matches) count += matches.length;
    });
    return count;
  };

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    setPermissionDenied(false);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Camera API not supported in this browser");
        setCameraEnabled(false);
        return;
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
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
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setPermissionDenied(true);
        setCameraError("Camera permission denied. Please allow camera access and refresh.");
      } else if (err.name === "NotFoundError") {
        setCameraError("No camera found on this device");
      } else {
        setCameraError(`Camera error: ${err.message}`);
      }
      setCameraEnabled(false);
    }
  };

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

  useEffect(() => {
    if (isSessionActive) {
      const timer = setTimeout(() => startCamera(), 500);
      return () => clearTimeout(timer);
    }
    return () => stopCamera();
  }, [isSessionActive]);

  useEffect(() => {
    return () => {
      stopCamera();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  useEffect(() => {
    if (!isSessionActive) return;
    const timer = setInterval(() => {
      setSessionStats((prev) => ({ ...prev, duration: prev.duration + 1 }));
    }, 1000);
    return () => clearInterval(timer);
  }, [isSessionActive]);

  useEffect(() => {
    const cleanTranscript = transcript.replace(/\s*\[.*?\]\s*/g, "");
    const words = cleanTranscript.split(/\s+/).filter((w) => w.length > 0).length;
    const fillerCount = countFillerWords(cleanTranscript);
    setSessionStats((prev) => ({ ...prev, wordsSpoken: words, fillerWords: fillerCount }));
  }, [transcript]);

  // ENHANCED: Speech Recognition with Groq Correction
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (recognitionRef.current) recognitionRef.current.stop();

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListening(true);
      console.log("🎤 Listening...");
    };
    
    recognition.onend = () => {
      setListening(false);
      console.log("🎤 Stopped listening");
    };

    recognition.onresult = async (event) => {
      let finalSegment = "";
      let interimSegment = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptText = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalSegment += transcriptText + " ";
        } else {
          interimSegment += transcriptText;
        }
      }

      // Show interim results immediately
      if (interimSegment) {
        setInterimTranscript(` [${interimSegment}]`);
      } else {
        setInterimTranscript("");
      }

      // Process final segment with correction
      if (finalSegment) {
        // Clear any pending correction timeout
        if (correctionTimeoutRef.current) {
          clearTimeout(correctionTimeoutRef.current);
        }

        // Show what was heard before correction
        setPendingCorrection(finalSegment.trim());
        setIsCorrecting(true);

        // Send to Groq for correction
        correctionTimeoutRef.current = setTimeout(async () => {
          try {
            const context = `Question: ${question?.question || "technical interview"} - Role: ${role}`;
            let corrected = await correctTranscript(finalSegment, context);
            
            // Apply quick local correction as additional safety
            corrected = quickLocalCorrect(corrected);
            
            setTranscript((prev) => {
              const base = prev.replace(/\s*\[.*?\]\s*$/, "");
              return base + corrected + " ";
            });
            
            setIsCorrecting(false);
            setPendingCorrection(null);
          } catch (error) {
            // Fallback to local correction if Groq fails
            const localCorrected = quickLocalCorrect(finalSegment);
            setTranscript((prev) => prev + localCorrected + " ");
            setIsCorrecting(false);
            setPendingCorrection(null);
          }
        }, 800); // Wait 800ms for speech pause
      }
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
      setInterimTranscript("");
      setIsCorrecting(false);
      setPendingCorrection(null);
      if (correctionTimeoutRef.current) {
        clearTimeout(correctionTimeoutRef.current);
      }
    }
  };

  const endSession = () => {
    stopCamera();
    if (recognitionRef.current) recognitionRef.current.stop();
    setListening(false);
    setIsSessionActive(false);
    setCameraEnabled(false);
    setTimeout(() => navigate("/interviewlibrary"), 1500);
  };

  const submitAnswer = async () => {
    if (!question || !transcript.trim()) return;

    const cleanTranscript = transcript.replace(/\s*\[.*?\]\s*/g, "").replace(/\s*groq\.\.\.\s*/g, "");
    setLoading(true);

    try {
      let keywords = [];
      if (Array.isArray(question.core_keywords)) {
        keywords = question.core_keywords;
      } else if (question.core_keywords) {
        keywords = question.core_keywords.split(";");
      }

      const result = await evaluateAnswerAPI(cleanTranscript, question.ideal_answer, keywords);

      const relevanceScore = result.semantic_similarity || 85;
      const fluencyScore = Math.max(0, Math.min(100, 100 - sessionStats.fillerWords * 2));
      const structureScore = result.final_score * 10;
      const finalScore = result.final_score * 10;
      const questionTimestamp = Math.max(0, sessionStats.duration - 45);

      navigate("/feedback", {
        state: {
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          duration: formatTime(sessionStats.duration),
          topic: role,
          score: finalScore,
          relevance: relevanceScore,
          fluency: fluencyScore,
          structure: structureScore,
          fillerWords: sessionStats.fillerWords,
          strengths: result.strengths || ["Good understanding of the technical concept", "Clear communication of key ideas"],
          improvements: result.improvements || ["Add more specific examples", "Quantify your results"],
          questions: [{ question: question.question, answer: cleanTranscript, timestamp: formatTime(questionTimestamp) }],
        },
      });
    } catch (err) {
      console.error("Evaluation failed:", err);
      alert("Error evaluating answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Loading States (keep your existing loading, error, and no questions states)
  if (questionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f8faff] to-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading interview questions...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (questionsError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f8faff] to-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Questions</h2>
            <p className="text-gray-600 mb-4">{questionsError}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!question && !questionsLoading && !questionsError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f8faff] to-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Questions Available</h2>
            <p className="text-gray-600 mb-4">No interview questions found for {role}. Please add questions to the database.</p>
            <button onClick={() => navigate("/interviewlibrary")} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Return to Library
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Main UI - Keep your existing JSX but update the Answer Section
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8faff] to-white flex flex-col">
      <Navbar />

      {/* Top Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-slate-500">ACTIVE SESSION</p>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-slate-800 capitalize">{role?.replace(/%20/g, " ")} Interview</h2>
                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Live
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <span className="text-sm text-slate-500 whitespace-nowrap">Q{index + 1}/{total}</span>
            <div className="flex-1 sm:w-48 bg-slate-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: `${total ? ((index + 1) / total) * 100 : 0}%` }} />
            </div>
            <button onClick={endSession} className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">
              End Session
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Camera (keep your existing camera section) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Camera Section - Keep your existing camera JSX */}
            <div className="bg-slate-900 rounded-2xl overflow-hidden relative group aspect-video">
              <video ref={videoRef} autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover" />
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" width={640} height={480} />
              
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                {cameraEnabled ? (
                  <button onClick={stopCamera} className="bg-red-500/80 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg">Turn Off Camera</button>
                ) : (
                  <button onClick={startCamera} className="bg-green-500/80 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg">Enable Camera</button>
                )}
              </div>

              {!cameraEnabled && !cameraError && !permissionDenied && (
                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📹</div>
                    <p className="text-white text-lg">Camera Disabled</p>
                    <button onClick={startCamera} className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg">Enable Camera</button>
                  </div>
                </div>
              )}

              {cameraEnabled && !faceDetected && !cameraError && (
                <div className="absolute top-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-lg animate-pulse">⚠️ No face detected</div>
              )}

              {cameraEnabled && faceDetected && !cameraError && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <span className="text-xs">👀 Eye Contact</span>
                      <div className="w-20 bg-white/20 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${eyeContact > 80 ? "bg-green-400" : eyeContact > 60 ? "bg-yellow-400" : "bg-red-400"}`} style={{ width: `${eyeContact}%` }} />
                      </div>
                      <span className="text-xs">{Math.round(eyeContact)}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs">🧍 Posture</span>
                      <div className="w-20 bg-white/20 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${posture > 85 ? "bg-green-400" : posture > 70 ? "bg-yellow-400" : "bg-red-400"}`} style={{ width: `${posture}%` }} />
                      </div>
                      <span className="text-xs">{Math.round(posture)}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Session Stats Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <p className="text-xs text-slate-500 mb-1">Duration</p>
                <p className="text-xl font-bold text-slate-800">{formatTime(sessionStats.duration)}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <p className="text-xs text-slate-500 mb-1">Words</p>
                <p className="text-xl font-bold text-slate-800">{sessionStats.wordsSpoken}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <p className="text-xs text-slate-500 mb-1">Avg Eye Contact</p>
                <p className="text-xl font-bold text-slate-800">
                  {eyeContactHistory.length ? Math.round(eyeContactHistory.reduce((a, b) => a + b, 0) / eyeContactHistory.length) : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Question & Answer */}
          <div className="space-y-6">
            {/* Question Card */}
            {question && (
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span className="text-xs font-medium text-blue-600">CURRENT QUESTION</span>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-3">{question.question}</h2>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(question.core_keywords) ? question.core_keywords : question.core_keywords?.split(";") || []).map((keyword, i) => (
                    <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">#{keyword.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Answer Section - WITH GROQ CORRECTION FEEDBACK */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  <span className="text-xs font-medium text-emerald-600">YOUR ANSWER</span>
                </div>
                <div className="flex items-center gap-2">
                  {listening && (
                    <span className="flex items-center gap-1.5 text-emerald-600 text-xs bg-emerald-50 px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      Recording...
                    </span>
                  )}
                  {isCorrecting && (
                    <span className="flex items-center gap-1.5 text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-spin"></div>
                      AI Correcting...
                    </span>
                  )}
                </div>
              </div>

              <textarea
                value={transcript + (interimTranscript || (pendingCorrection ? ` [${pendingCorrection}]` : ""))}
                readOnly
                rows={5}
                className="w-full border border-slate-200 rounded-xl p-3 sm:p-4 font-mono text-sm text-slate-700 bg-slate-50"
                placeholder="Start speaking... Words will appear here and AI will correct technical terms..."
              />

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={listening ? stopListening : startListening}
                  disabled={!isSessionActive || loading}
                  className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-white text-sm font-medium transition ${
                    listening ? "bg-red-500 hover:bg-red-600" : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-green-500 hover:to-emerald-500"
                  } disabled:opacity-50`}
                >
                  {listening ? "Stop Recording" : "Start Speaking"}
                </button>

                <button
                  onClick={() => {
                    setTranscript("");
                    setPendingCorrection(null);
                    setInterimTranscript("");
                    if (recognitionRef.current) recognitionRef.current.stop();
                    setListening(false);
                    if (correctionTimeoutRef.current) clearTimeout(correctionTimeoutRef.current);
                  }}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium disabled:opacity-50"
                >
                  Clear
                </button>
              </div>

              {/* Accuracy Tip */}
              <div className="mt-3 p-2 bg-blue-50 rounded-lg text-xs text-blue-600 text-center">
                💡 Speaking clearly improves accuracy. AI automatically corrects technical terms like "froent" → "frontend"
              </div>
            </div>

            {/* Feedback Section */}
            {loading && (
              <div className="bg-blue-50 rounded-xl p-5 border">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-blue-700 text-sm">Evaluating your answer...</p>
                </div>
              </div>
            )}

            {feedback && (
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                    <span className="text-xs font-medium text-purple-600">FEEDBACK</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    feedback.final_score >= 8 ? "bg-emerald-100 text-emerald-700" :
                    feedback.final_score >= 6 ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {getPerformanceLabel(feedback.final_score)}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">Score</span>
                    <span className="text-2xl font-bold text-slate-800">{feedback.final_score}/10</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${feedback.final_score >= 8 ? "bg-emerald-500" : feedback.final_score >= 6 ? "bg-blue-500" : "bg-amber-500"}`} style={{ width: `${feedback.final_score * 10}%` }} />
                  </div>
                </div>

                <div className="space-y-3">
                  {feedback.matched_keywords?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-emerald-600 mb-1">✓ Key Terms Found</p>
                      <div className="flex flex-wrap gap-1">
                        {feedback.matched_keywords.map((k, i) => (
                          <span key={i} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">{k}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {feedback.missing_keywords?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-amber-600 mb-1">⚠️ Consider Adding</p>
                      <div className="flex flex-wrap gap-1">
                        {feedback.missing_keywords.map((k, i) => (
                          <span key={i} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">{k}</span>
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
                  if (recognitionRef.current) recognitionRef.current.stop();
                  setTranscript("");
                  setFeedback(null);
                  setListening(false);
                  setPendingCorrection(null);
                  setInterimTranscript("");
                }}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium disabled:opacity-50"
              >
                Reset
              </button>
              <button
                disabled={!isSessionActive || loading || !transcript.trim()}
                onClick={() => { stopListening(); submitAnswer(); }}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-medium disabled:opacity-50"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  stopListening();
                  setTranscript("");
                  setFeedback(null);
                  setPendingCorrection(null);
                  setInterimTranscript("");
                  nextQuestion();
                }}
                disabled={!isSessionActive || loading}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium disabled:opacity-50"
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