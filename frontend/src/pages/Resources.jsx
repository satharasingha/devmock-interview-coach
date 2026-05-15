import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  BookOpen,
  Code,
  Briefcase,
  Wrench,
  Users,
  FileText,
  Download,
  ExternalLink,
  Search,
  Clock,
  Award,
  ChevronRight,
  GraduationCap,
  Target,
  Calendar,
  Mail,
  Play,
  FileCheck,
  Sparkles,
  Globe,
} from "lucide-react";

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    {
      id: "all",
      name: "All Resources",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "guides",
      name: "Interview Guides",
      icon: FileText,
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: "learning",
      name: "Learning Materials",
      icon: GraduationCap,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "career",
      name: "Career Development",
      icon: Briefcase,
      color: "from-amber-500 to-orange-500",
    },
    {
      id: "tools",
      name: "Tools & Software",
      icon: Wrench,
      color: "from-rose-500 to-red-500",
    },
    {
      id: "community",
      name: "Community",
      icon: Users,
      color: "from-indigo-500 to-blue-500",
    },
  ];

  // Helper function to render icon
  const renderIcon = (resource) => {
    // Handle SVG files from public folder
    if (resource.useSvg) {
      return (
        <img
          src={`/${resource.svgName}`}
          alt={resource.title}
          className="w-6 h-6 object-contain"
        />
      );
    }
    // Handle Lucide icons
    const IconComponent = resource.icon;
    return <IconComponent className="w-6 h-6 text-blue-600" />;
  };

  const resources = [
    // INTERVIEW GUIDES
    {
      id: 1,
      title: "STAR Method Guide for Behavioral Interviews",
      description:
        "Learn how to structure your answers using Situation, Task, Action, Result framework. Includes examples and practice templates.",
      category: "guides",
      type: "PDF",
      icon: FileText,
      link: "https://www.themuse.com/advice/star-interview-method",
      external: true,
      readTime: "10 min read",
      difficulty: "Beginner",
      featured: true,
    },
    {
      id: 2,
      title: "Top 100 Technical Interview Questions",
      description:
        "Most commonly asked technical questions for Software Engineering roles with answer frameworks and tips.",
      category: "guides",
      type: "Article",
      icon: FileText,
      link: "https://www.interviewbit.com/technical-interview-questions/",
      external: true,
      readTime: "20 min read",
      difficulty: "Intermediate",
      featured: true,
    },
    {
      id: 3,
      title: "System Design Interview Guide",
      description:
        "Master system design interviews with proven frameworks, case studies, and architecture patterns.",
      category: "guides",
      type: "Guide",
      icon: FileText,
      link: "https://github.com/donnemartin/system-design-primer",
      external: true,
      readTime: "15 min read",
      difficulty: "Advanced",
      featured: false,
    },
    {
      id: 4,
      title: "Behavioral Interview Questions & Answers",
      description:
        "Common behavioral questions with sample answers using the STAR framework.",
      category: "guides",
      type: "Guide",
      icon: FileText,
      link: "https://www.indeed.com/career-advice/interviewing/behavioral-interview-questions-and-answers",
      external: true,
      readTime: "12 min read",
      difficulty: "Beginner",
      featured: false,
    },
    {
      id: 5,
      title: "LeetCode Patterns for Coding Interviews",
      description:
        "Common coding patterns and algorithms to master for technical interviews.",
      category: "guides",
      type: "Guide",
      icon: Code,
      link: "https://github.com/seanprashad/leetcode-patterns",
      external: true,
      readTime: "25 min read",
      difficulty: "Intermediate",
      featured: false,
    },

    // ==================== LEARNING MATERIALS ====================
    {
      id: 6,
      title: "freeCodeCamp - Full Stack Web Development",
      description:
        "Free, self-paced coding curriculum covering HTML, CSS, JavaScript, React, Node.js, and MongoDB.",
      category: "learning",
      type: "Course",
      icon: Play,
      link: "https://www.freecodecamp.org/learn",
      external: true,
      platform: "freeCodeCamp",
      duration: "300+ hours",
      difficulty: "Beginner",
      featured: true,
    },
    {
      id: 7,
      title: "The Odin Project - Full Stack JavaScript",
      description:
        "Free, open-source curriculum for learning full-stack web development.",
      category: "learning",
      type: "Course",
      icon: GraduationCap,
      link: "https://www.theodinproject.com/",
      external: true,
      platform: "The Odin Project",
      duration: "200+ hours",
      difficulty: "Beginner",
      featured: true,
    },
    {
      id: 8,
      title: "CS50 - Harvard University (Free)",
      description:
        "Introduction to Computer Science from Harvard University. Covers algorithms, data structures, and web development.",
      category: "learning",
      type: "Course",
      icon: Play,
      link: "https://cs50.harvard.edu/x/",
      external: true,
      platform: "Harvard",
      duration: "12 weeks",
      difficulty: "Beginner",
      featured: false,
    },
    {
      id: 9,
      title: "MIT OpenCourseWare - Introduction to Algorithms",
      description:
        "MIT's undergraduate course on algorithms with video lectures and assignments.",
      category: "learning",
      type: "Course",
      icon: GraduationCap,
      link: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
      external: true,
      platform: "MIT",
      duration: "20 hours",
      difficulty: "Advanced",
      featured: false,
    },
    {
      id: 10,
      title: "Roadmap.sh - Developer Roadmaps",
      description:
        "Community-driven roadmaps for Frontend, Backend, DevOps, and more.",
      category: "learning",
      type: "Guide",
      icon: Target,
      link: "https://roadmap.sh/",
      external: true,
      readTime: "5 min read",
      difficulty: "Beginner",
      featured: false,
    },
    {
      id: 11,
      title: "YouTube - FreeCodeCamp JavaScript Tutorial",
      description:
        "Complete JavaScript tutorial for beginners to advanced concepts.",
      category: "learning",
      type: "Video",
      useSvg: true,
      svgName: "youtube.png",
      link: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
      external: true,
      platform: "YouTube",
      duration: "10 hours",
      difficulty: "Beginner",
      featured: false,
    },

    // CAREER DEVELOPMENT
    {
      id: 12,
      title: "Resume Template for Software Engineers (LaTeX)",
      description:
        "ATS-friendly resume template for software engineers with LaTeX source code.",
      category: "career",
      type: "Template",
      icon: FileCheck,
      link: "https://www.overleaf.com/latex/templates/software-engineer-resume-template/gkqmynnqjnjz",
      external: true,
      downloadable: true,
      readTime: "5 min read",
      difficulty: "Beginner",
      featured: true,
    },
    {
      id: 13,
      title: "LinkedIn Profile Optimization Guide",
      description:
        "Complete guide to optimizing your LinkedIn profile for recruiters.",
      category: "career",
      type: "Guide",
      useSvg: true,
      svgName: "linkedin.svg",
      link: "https://www.linkedin.com/business/talent/blog/talent-acquisition/how-to-optimize-your-linkedin-profile",
      external: true,
      readTime: "15 min read",
      difficulty: "Beginner",
      featured: false,
    },
    {
      id: 14,
      title: "Job Search Strategies for Fresh Graduates",
      description:
        "Effective job search techniques, networking tips, and interview preparation strategies.",
      category: "career",
      type: "Article",
      icon: Target,
      link: "https://www.indeed.com/career-advice/finding-a-job/job-search-strategies",
      external: true,
      readTime: "12 min read",
      difficulty: "Beginner",
      featured: false,
    },
    {
      id: 15,
      title: "Salary Negotiation Guide for Tech Professionals",
      description:
        "Learn how to negotiate salary, benefits, and job offers effectively.",
      category: "career",
      type: "Guide",
      icon: Briefcase,
      link: "https://www.levels.fyi/blog/salary-negotiation-guide.html",
      external: true,
      readTime: "20 min read",
      difficulty: "Intermediate",
      featured: false,
    },

    // ==================== TOOLS & SOFTWARE ====================
    {
      id: 16,
      title: "VS Code Essential Extensions for Developers",
      description:
        "Best extensions for productivity: Prettier, ESLint, GitLens, Thunder Client, and more.",
      category: "tools",
      type: "Guide",
      icon: Code,
      link: "https://code.visualstudio.com/docs/editor/extension-gallery",
      external: true,
      readTime: "10 min read",
      difficulty: "Beginner",
      featured: true,
    },
    {
      id: 17,
      title: "GitHub - Git Cheat Sheet",
      description:
        "Official Git cheat sheet with common commands and workflows.",
      category: "tools",
      type: "Guide",
      useSvg: true,
      svgName: "github.svg",
      link: "https://training.github.com/downloads/github-git-cheat-sheet/",
      external: true,
      readTime: "5 min read",
      difficulty: "Beginner",
      featured: false,
    },
    {
      id: 18,
      title: "Postman API Testing Tool",
      description: "Download Postman for API testing and collaboration.",
      category: "tools",
      type: "Tool",
      icon: Wrench,
      link: "https://www.postman.com/downloads/",
      external: true,
      downloadable: true,
      readTime: "5 min read",
      difficulty: "Beginner",
      featured: false,
    },
    {
      id: 19,
      title: "Figma - Free Design Tool",
      description: "Create UI/UX designs, wireframes, and prototypes for free.",
      category: "tools",
      type: "Tool",
      icon: Wrench,
      link: "https://www.figma.com/",
      external: true,
      readTime: "10 min read",
      difficulty: "Beginner",
      featured: false,
    },

    //  COMMUNITY
    {
      id: 20,
      title: "Dev.to - Developer Community",
      description:
        "Join the largest developer community for articles, discussions, and networking.",
      category: "community",
      type: "Link",
      icon: Users,
      link: "https://dev.to/",
      external: true,
      platform: "DEV",
      difficulty: "Beginner",
      featured: true,
    },
    {
      id: 21,
      title: "r/cscareerquestions on Reddit",
      description:
        "Active community discussing careers, interviews, and job offers in tech.",
      category: "community",
      type: "Link",
      icon: Globe,
      link: "https://www.reddit.com/r/cscareerquestions/",
      external: true,
      platform: "Reddit",
      difficulty: "Beginner",
      featured: false,
    },
    {
      id: 22,
      title: "Stack Overflow",
      description:
        "Q&A community for programmers. Ask questions and get answers from experts.",
      category: "community",
      type: "Link",
      icon: Globe,
      link: "https://stackoverflow.com/",
      external: true,
      platform: "Stack Overflow",
      difficulty: "Beginner",
      featured: false,
    },
    {
      id: 23,
      title: "Tech Events & Hackathons 2025 - DevPost",
      description: "Calendar of upcoming virtual and in-person hackathons.",
      category: "community",
      type: "Calendar",
      icon: Calendar,
      link: "https://devpost.com/hackathons",
      external: true,
      platform: "DevPost",
      readTime: "5 min read",
      difficulty: "Beginner",
      featured: false,
    },
    {
      id: 24,
      title: "Women Who Code",
      description:
        "Global nonprofit dedicated to inspiring women to excel in technology careers.",
      category: "community",
      type: "Link",
      icon: Users,
      link: "https://www.womenwhocode.com/",
      external: true,
      platform: "Women Who Code",
      difficulty: "Beginner",
      featured: false,
    },
  ];

  const getDifficultyBadge = (difficulty) => {
    const styles = {
      Beginner: "bg-emerald-100 text-emerald-700",
      Intermediate: "bg-amber-100 text-amber-700",
      Advanced: "bg-rose-100 text-rose-700",
    };
    return styles[difficulty] || "bg-gray-100 text-gray-700";
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredResources = resources.filter((r) => r.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">
                FREE LEARNING RESOURCES
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-800 mb-6">
              Learning{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                Resources
              </span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed">
              Curated guides, courses, and tools to help you master technical
              interviews and advance your career in tech.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-semibold text-slate-800">
              Featured Resources
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResources.map((resource) => {
              return (
                <div
                  key={resource.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center">
                      {renderIcon(resource)}
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyBadge(resource.difficulty)}`}
                    >
                      {resource.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock size={12} />
                      <span>
                        {resource.readTime || resource.duration || "10 min"}
                      </span>
                      {resource.type && (
                        <>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span>{resource.type}</span>
                        </>
                      )}
                      {resource.platform && (
                        <>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span>{resource.platform}</span>
                        </>
                      )}
                    </div>
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                    >
                      Visit Resource
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories & Search */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Search Bar */}
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                      : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  <Icon size={16} />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Resources Grid */}
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                return (
                  <div
                    key={resource.id}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all hover:-translate-y-1 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        {renderIcon(resource)}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyBadge(resource.difficulty)}`}
                      >
                        {resource.difficulty}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                      {resource.description}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock size={12} />
                        <span>
                          {resource.readTime || resource.duration || "10 min"}
                        </span>
                        {resource.type && (
                          <>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span>{resource.type}</span>
                          </>
                        )}
                        {resource.platform && (
                          <>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span>{resource.platform}</span>
                          </>
                        )}
                      </div>
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                      >
                        Visit Resource
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4 opacity-50">📚</div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                No resources found
              </h3>
              <p className="text-slate-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 p-8 md:p-10 text-center">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <Mail className="w-12 h-12 text-white mx-auto mb-4 opacity-80" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Stay Updated
              </h2>
              <p className="text-blue-100 mb-6">
                Get the latest interview tips and resources delivered to your
                inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-lg transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
