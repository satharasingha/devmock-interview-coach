import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  Users,
  Target,
  Shield,
  Globe,
  Mail,
  MapPin,
  Sparkles,
  Briefcase,
  GraduationCap,
  TrendingUp,
  ChevronRight,
  Heart,
  Lightbulb,
  Award,
  ArrowRight,
  User,
  Star,
  Zap,
  Rocket,
  Clock,
  Quote,
} from "lucide-react";

export default function AboutUs() {
  const teamMembers = [
    {
      name: "Satharasingha Sathsarani",
      role: "Project Lead & Full Stack Developer",
      bio: "Final year Software Engineering student passionate about AI and educational technology.",
      initials: "SS",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Ms. Hiruni Weerasinghe",
      role: "Academic Supervisor",
      bio: "Experienced academic supervisor guiding the project with expertise in software engineering.",
      initials: "HW",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const values = [
    {
      icon: Users,
      title: "Student First",
      description:
        "Every feature is designed with student success as the primary goal.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description:
        "Zero audio/video storage. Your data stays private and secure.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Lightbulb,
      title: "Explainable AI",
      description:
        "Transparent feedback showing exactly what you did right or wrong.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Target,
      title: "Career Focused",
      description: "Real interview questions from top tech companies.",
      color: "from-rose-500 to-pink-500",
    },
  ];

  const stats = [
    {
      value: "500+",
      label: "Interview Questions",
      icon: Briefcase,
      trend: "+12%",
    },
    {
      value: "8+",
      label: "Career Paths",
      icon: GraduationCap,
      trend: "+2",
    },
    {
      value: "82%",
      label: "Student Confidence",
      icon: TrendingUp,
      trend: "+15%",
    },
    {
      value: "24/7",
      label: "Available Anytime",
      icon: Clock,
      trend: "Always",
    },
  ];

  const milestones = [
    {
      year: "2024",
      title: "Project Initiated",
      description: "Started development of DevMock platform",
      icon: Rocket,
    },
    {
      year: "2024",
      title: "MVP Launch",
      description: "Released core interview practice features",
      icon: Zap,
    },
    {
      year: "2025",
      title: "AI Integration",
      description: "Added intelligent answer evaluation",
      icon: Sparkles,
    },
    {
      year: "2025",
      title: "Student Success",
      description: "Helped 500+ students prepare for interviews",
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-medium text-white/90">
                INNOVATING INTERVIEW PREPARATION
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              About{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
                DevMock
              </span>
            </h1>

            <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
              We're building the future of interview preparation with
              AI-powered technology that helps students showcase their true
              potential.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-3 py-1 mb-4">
                <Target className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-medium text-blue-700 uppercase tracking-wider">
                  OUR MISSION
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                Empowering Students to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                  Excel in Interviews
                </span>
              </h2>

              <p className="text-slate-500 mb-6 leading-relaxed">
                DevMock was born from a simple observation: talented IT students
                were struggling to articulate their technical knowledge during
                interviews.
              </p>

              <p className="text-slate-500 mb-8 leading-relaxed">
                We built DevMock to democratize interview preparation, making it
                accessible, affordable, and effective for every student
                worldwide.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/interviewlibrary"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Start Free Practice
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/interviewlibrary"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                >
                  View Interview Library
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-30"></div>

              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl">
                <Quote className="w-10 h-10 text-cyan-400 mb-6 opacity-50" />

                <p className="text-slate-200 text-xl italic leading-relaxed">
                  "We love helping students succeed and land their dream jobs."
                </p>

                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-700">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>

                  <div>
                    <p className="text-white font-semibold">DevMock Team</p>
                    <p className="text-slate-400 text-sm">
                      AI-Powered Interview Platform
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 text-center shadow-lg border border-slate-100"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-blue-600" />
                  </div>

                  <p className="text-4xl font-bold text-slate-900">
                    {stat.value}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    {stat.label}
                  </p>

                  <div className="inline-flex items-center gap-1 mt-3 px-2 py-1 bg-emerald-50 rounded-full">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700">
                      {stat.trend}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-3 py-1 mb-4">
              <Heart className="w-3 h-3 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700 uppercase tracking-wider">
                CORE VALUES
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What Drives Us
            </h2>

            <p className="text-slate-500 text-lg">
              These principles guide everything we do at DevMock.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100"
                >
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    {value.title}
                  </h3>

                  <p className="text-slate-500 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}