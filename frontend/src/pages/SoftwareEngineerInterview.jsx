import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InterviewTest from "./InterviewEngine"; // or InterviewEngine

export default function SoftwareEngineerInterview() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Software Engineering Interview
        </h1>

        <p className="text-gray-600 mb-8">
          Answer technical interview questions verbally or in text. Your
          responses will be evaluated using keyword matching and semantic
          similarity.
        </p>

        {/* ✅ REAL INTERVIEW LOGIC */}
        <InterviewEngine />
      </main>

      <Footer />
    </div>
  );
}
