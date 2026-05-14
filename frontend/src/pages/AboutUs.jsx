import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useRef, useState } from "react";

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
  CheckCircle,
  PlayCircle,
  BookOpen,
  Code,
  Coffee,
} from "lucide-react";

export default function AboutUs() {
  const [isVisible, setIsVisible] = useState({});
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.3 }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const teamMembers = [
    {
      name: "Satharasingha Sathsarani",
      role: "Project Lead & Full Stack Developer",
      bio: "Final year Software Engineering student passionate about AI and educational technology. Built DevMock from the ground up.",
      initials: "SS",
      color: "from-blue-500 to-cyan-500",
      skills: ["React", "Node.js", "MongoDB", "AI Integration"],
    },
    {
      name: "Ms. Hiruni Weerasinghe",
      role: "Academic Supervisor",
      bio: "Experienced academic supervisor guiding the project with expertise in software engineering and research methodology.",
      initials: "HW",
      color: "from-purple-500 to-pink-500",
      skills: ["Research", "Guidance", "Software Engineering", "Academia"],
    },
  ];

  const values = [
    {
      icon: Users,
      title: "Student First",
      description: "Every feature is designed with student success as the primary goal.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Zero audio/video storage. Your data stays private and secure.",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
    },
    {
      icon: Lightbulb,
      title: "Explainable AI",
      description: "Transparent feedback showing exactly what you did right or wrong.",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
    },
    {
      icon: Target,
      title: "Career Focused",
      description: "Real interview questions from top tech companies.",
      color: "from-rose-500 to-pink-500",
      bgColor: "bg-rose-50",
    },
  ];

  const stats = [
    {
      value: "500+",
      label: "Interview Questions",
      icon: Briefcase,
      trend: "+12%",
      description: "Curated from real interviews",
    },
    {
      value: "8+",
      label: "Career Paths",
      icon: GraduationCap,
      trend: "+2",
      description: "From Intern to Senior",
    },
    {
      value: "82%",
      label: "Student Confidence",
      icon: TrendingUp,
      trend: "+15%",
      description: "Reported improvement",
    },
    {
      value: "24/7",
      label: "Available Anytime",
      icon: Clock,
      trend: "Always",
      description: "Practice on your schedule",
    },
  ];

  const milestones = [
    {
      year: "2024",
      title: "Project Initiated",
      description: "Started development of DevMock platform with a vision to help students",
      icon: Rocket,
      color: "from-blue-500 to-cyan-500",
    },
    {
      year: "2024",
      title: "MVP Launch",
      description: "Released core interview practice features with speech recognition",
      icon: Zap,
      color: "from-amber-500 to-orange-500",
    },
    {
      year: "2025",
      title: "AI Integration",
      description: "Added Groq API for intelligent answer evaluation and feedback",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
    },
    {
      year: "2025",
      title: "Student Success",
      description: "Helped 500+ students prepare for technical interviews",
      icon: Award,
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const testimonials = [
    {
      quote: "DevMock helped me prepare for my Amazon interview. The real-time feedback was invaluable!",
      author: "Ruchira Perera",
      role: "Software Engineer at Amazon",
      rating: 5,
    },
    {
      quote: "The AI feedback is surprisingly accurate. It caught things I never would have noticed on my own.",
      author: "Tharindu Silva",
      role: "Full Stack Developer",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-in fade-in slide-in-from-top-5 duration-500">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-medium text-white/90 uppercase tracking-wider">
                INNOVATING INTERVIEW PREPARATION
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-5 duration-500 delay-150">
              About{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
                DevMock
              </span>
            </h1>

            <p className="text-slate-300 text-lg md:text-xl leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-500 delay-300">
              We're building the future of interview preparation with AI-powered technology
              that helps students showcase their true potential.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8 animate-in fade-in slide-in-from-bottom-5 duration-500 delay-500">
              <Link
                to="/interviewlibrary"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:-translate-y-0.5"
              >
                Start Practicing Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll" id="mission-text">
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
                DevMock was born from a simple observation: talented IT students were struggling
                to articulate their technical knowledge during interviews.
              </p>

              <p className="text-slate-500 mb-8 leading-relaxed">
                We built DevMock to democratize interview preparation, making it accessible,
                affordable, and effective for every student worldwide.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/interviewlibrary"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:-translate-y-0.5"
                >
                  Start Free Practice
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/resources"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                >
                  Explore Resources
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative animate-on-scroll" id="mission-quote">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-30"></div>

              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl">
                <Quote className="w-10 h-10 text-cyan-400 mb-6 opacity-50" />

                <p className="text-slate-200 text-xl italic leading-relaxed">
                  "The only way to do great work is to love what you do. We love helping students succeed."
                </p>

                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-700">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>

                  <div>
                    <p className="text-white font-semibold">DevMock Team</p>
                    <p className="text-slate-400 text-sm">AI-Powered Interview Platform</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-3 py-1 mb-4">
              <TrendingUp className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-700 uppercase tracking-wider">
                OUR IMPACT
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">By the Numbers</h2>
            <p className="text-slate-500">Real results from real students</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const isVisibleStat = isVisible[`stat-${index}`];

              return (
                <div
                  key={index}
                  id={`stat-${index}`}
                  className="bg-white rounded-2xl p-6 text-center shadow-lg border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-blue-600" />
                  </div>

                  <p className="text-4xl font-bold text-slate-900">
                    {stat.value}
                  </p>

                  <p className="text-sm font-medium text-slate-700 mt-1">
                    {stat.label}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {stat.description}
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

      {/* Values Section */}
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
                  className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md`}
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

      {/* Milestones Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 mb-4">
              <Rocket className="w-3 h-3 text-cyan-400" />
              <span className="text-xs font-medium text-white uppercase tracking-wider">
                OUR JOURNEY
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Milestones
            </h2>

            <p className="text-slate-300 text-lg">
              Our journey of innovation and growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;

              return (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1 group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${milestone.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="text-cyan-400 text-sm font-semibold mb-2">
                    {milestone.year}
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">
                    {milestone.title}
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-3 py-1 mb-4">
              <Users className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-700 uppercase tracking-wider">
                THE TEAM
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Meet the Team
            </h2>

            <p className="text-slate-500 text-lg">
              Dedicated individuals passionate about student success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 text-center hover:shadow-2xl transition-all hover:-translate-y-1 group"
              >
                <div className={`w-28 h-28 rounded-full bg-gradient-to-r ${member.color} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-105 transition-transform`}>
                  <span className="text-3xl font-bold text-white">{member.initials}</span>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 mb-1">
                  {member.name}
                </h3>

                <p className="text-blue-600 font-medium text-sm mb-4">
                  {member.role}
                </p>

                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  {member.bio}
                </p>

                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {member.skills.map((skill, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 p-12 md:p-16 text-center">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-xs font-medium text-white uppercase tracking-wider">
                  READY TO START?
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Start Your Interview Journey Today
              </h2>

              <p className="text-blue-100 mb-8 max-w-md mx-auto text-lg">
                Join thousands of students preparing for their dream tech jobs.
              </p>

              <Link
                to="/interviewlibrary"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                Start Free Practice Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}