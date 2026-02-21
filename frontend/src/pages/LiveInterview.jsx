import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useInterviewQuestions from "../hooks/useInterviewQuestions.js";

export default function LiveInterview() {
  const { role } = useParams();

  // Questions
  const { question, index, total, nextQuestion } =
    useInterviewQuestions(role);

  // Refs
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // State
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(true);

  /* Webcam Setup & Cleanup */
  useEffect(() => {
    if (!isSessionActive) return;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        mediaStreamRef.current = stream;
      })
      .catch(() => {
        console.warn("Camera access denied");
      });

    // Cleanup function
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSessionActive]);

  /*  Speech Recognition  */
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    // Stop any existing recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true; // Enable interim results for live typing

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      // Update transcript: final + interim
      setTranscript(prev => {
        // Remove previous interim results and add new ones
        const base = prev.replace(/\s*\[.*?\]\s*$/, '');
        const interimDisplay = interimTranscript ? ` [${interimTranscript}]` : '';
        return base + finalTranscript + interimDisplay;
      });
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      
      // Clean up interim results brackets
      setTranscript(prev => prev.replace(/\s*\[.*?\]\s*$/, '').trim());
    }
  };

  /*  End Session  */
  const endSession = () => {
    // Stop webcam
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Update states
    setListening(false);
    setIsSessionActive(false);
    
    // Navigate or show message
    alert("Session ended. You will be redirected shortly.");
    //navigate('/dashboard');
  };

  /*  Submit Answer  */
  const submitAnswer = async () => {
    if (!question || !transcript.trim()) return;

    // Clean transcript (remove interim brackets)
    const cleanTranscript = transcript.replace(/\s*\[.*?\]\s*/g, '');

    setLoading(true);
    setFeedback(null);

    try {
      const result = await evaluateAnswer({
        userAnswer: cleanTranscript,
        referenceAnswer: question.ideal_answer,
        coreKeywords: question.core_keywords.split(";"),
      });

      setFeedback(result);
    } catch (err) {
      console.error("Evaluation failed", err);
      alert("Error evaluating answer");
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceLabel = (score) => {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/*  TOP  */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">SESSION</p>
          <p className="font-medium capitalize">{role} Interview</p>
          <p className="text-xs text-gray-500">
            Status: {isSessionActive ? "Active" : "Ended"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Question {index + 1} of {total}
          </span>

          <div className="w-40 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${total ? ((index + 1) / total) * 100 : 0}%`,
              }}
            />
          </div>

          <button
            onClick={endSession}
            className="px-4 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
          >
            End Session
          </button>
        </div>
      </div>

      {/*  MAIN  */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-10 space-y-6">

        {/* Question */}
        {question && (
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-lg font-semibold mb-2">
              {question.question}
            </h2>
            <p className="text-sm text-gray-500">
              Answer verbally. Your response will be evaluated.
            </p>
          </div>
        )}

        {/* Camera */}
        <div className="bg-black rounded-xl overflow-hidden h-80 relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
          {!isSessionActive && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <p className="text-white text-lg">Camera Disabled</p>
            </div>
          )}
        </div>

        {/* Speech-to-text */}
        <div className="bg-white rounded-xl p-6 shadow space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-700">
              Your Answer (Live Speech-to-Text)
            </p>
            {listening && (
              <span className="flex items-center gap-1 text-green-600 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Listening...
              </span>
            )}
          </div>

          <textarea
            value={transcript}
            readOnly
            rows={4}
            className="w-full border rounded-lg p-3 font-mono"
            placeholder="Start speaking... Words will appear here as you talk..."
          />

          <div className="flex gap-3">
            <button
              onClick={listening ? stopListening : startListening}
              disabled={!isSessionActive || loading}
              className={`px-4 py-2 rounded text-white ${
                listening ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {listening ? "Stop Speaking" : "Start Speaking"}
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
              className="px-4 py-2 rounded border hover:bg-gray-50 disabled:opacity-50"
            >
              Clear
            </button>
          </div>

          <p className="text-xs text-gray-500">
            Tip: Words in [brackets] are being transcribed live. They'll be finalized when you pause.
          </p>
        </div>

        {/* Feedback */}
        {loading && (
          <div className="bg-blue-50 p-4 rounded-lg text-blue-700">
            Evaluating your answer…
          </div>
        )}

        {feedback && (
          <div className="bg-green-50 border rounded-xl p-4 space-y-1">
            <p className="font-semibold">
              Final Score: {feedback.final_score}/10 (
              {getPerformanceLabel(feedback.final_score)})
            </p>
            <p>Semantic Similarity: {feedback.semantic_similarity}</p>
            <p className="text-green-700">
              Matched Keywords: {feedback.matched_keywords.join(", ") || "None"}
            </p>
            <p className="text-red-600">
              Missing Keywords: {feedback.missing_keywords.join(", ") || "None"}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-xl p-6 shadow flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <strong>Live Session</strong> • {isSessionActive ? "Active" : "Ended"}
          </div>

          <div className="flex gap-4">
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
              className="px-4 py-2 rounded border hover:bg-gray-50 disabled:opacity-50"
            >
              Reset
            </button>

            <button
              disabled={!isSessionActive || loading || !transcript.trim()}
              onClick={() => {
                stopListening();
                submitAnswer();
              }}
              className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>

            <button
              onClick={() => {
                stopListening();
                setTranscript("");
                setFeedback(null);
                nextQuestion();
              }}
              disabled={!isSessionActive || loading}
              className="px-6 py-2 rounded bg-gray-700 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              Next Question →
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}