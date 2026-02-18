import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function InterviewSetup() {
  const navigate = useNavigate();
  const { role } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Let’s get you set up
          </h1>
          <p className="text-gray-600">
            Please verify your audio and video settings before beginning your
            mock session.
          </p>

          {/* Camera Preview */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl h-72 flex items-center justify-center text-gray-400">
            Camera preview will appear here
          </div>

          {/* Status Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <StatusCard title="Camera Access" status="Granted" />
            <StatusCard title="Microphone" status="Detected" />
            <StatusCard title="Network" status="Stable" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-xl shadow p-6 space-y-6">
          <h2 className="font-semibold text-lg">Interview Flow</h2>

          <FlowStep step="1" title="Introduction" desc="Ice-breaker questions" />
          <FlowStep step="2" title="Technical Questions" desc="Core challenges" />
          <FlowStep step="3" title="Feedback" desc="AI-based evaluation" />

          <button
            onClick={() => navigate(`/interview/${role}`)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Start Interview →
          </button>

          <p className="text-xs text-gray-400 text-center">
            By clicking Start, you agree to our Terms of Service.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function StatusCard({ title, status }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow flex items-center gap-3">
      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-gray-500">{status}</p>
      </div>
    </div>
  );
}

function FlowStep({ step, title, desc }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
        {step}
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </div>
  );
}
