import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const roles = [
  {
    title: "Software Engineer",
    description:
      "Practice technical questions for system design, algorithms, and high-performance coding.",
    path: "/setup/software-engineer",
  },
  {
    title: "Data Engineer",
    description:
      "Master ETL pipelines, Big Data concepts, SQL optimization, and data architecture.",
  },
  {
    title: "Frontend Developer",
    description:
      "Focus on React patterns, CSS mastery, JavaScript fundamentals, and modern UI.",
  },
  {
    title: "Backend Developer",
    description:
      "Build robust APIs, handle server-side logic, concurrency, and database management.",
  },
  {
    title: "Data Scientist",
    description:
      "Dive deep into statistics, machine learning models, Python, and predictive analytics.",
  },
  {
    title: "UI/UX Designer",
    description:
      "Practice user research, wireframing, prototyping, and accessibility principles.",
  },
  {
    title: "Product Manager",
    description:
      "Refine strategy, roadmap planning, product lifecycle, and business metrics.",
  },
  {
    title: "DevOps Engineer",
    description:
      "Master CI/CD pipelines, cloud infrastructure, and containerization.",
  },
  {
    title: "Mobile Developer",
    description:
      "Practice native iOS/Android or cross-platform Flutter/React Native development.",
  },
  {
    title: "Cybersecurity Analyst",
    description:
      "Focus on network defense, encryption, threat modeling, and incident response.",
  },
];

export default function InterviewLibrary() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Interview Library
        </h1>
        <p className="text-gray-600 max-w-3xl mb-12">
          Choose your career path to begin a tailored, AI-driven mock interview.
          Practice real-world scenarios, receive instant feedback, and sharpen
          your technical skills.
        </p>

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {role.title}
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  {role.description}
                </p>
              </div>

              <button
                onClick={() => role.path && navigate(role.path)}
                className="mt-auto inline-flex items-center justify-center gap-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg px-4 py-2 hover:bg-blue-50 transition"
              >
                Start Mock Interview →
              </button>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
