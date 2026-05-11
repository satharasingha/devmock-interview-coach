import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// Using ONLY verified icons that exist in lucide-react
import {
  BookOpen,
  Code,
  Briefcase,
  Wrench,
  Users,
  FileText,
  Youtube,
  Link,
  Download,
  ExternalLink,
  Search,
  Star,
  Clock,
  Award,
  ChevronRight,
  GraduationCap,
  Lightbulb,
  Target,
  TrendingUp,
  Calendar,
  Mail,
  UserPlus,
  PlayCircle,
  FileCheck,
  Sparkles,
  Globe,
  Bookmark,
  Headphones,
  Shield,
  Zap,
} from "lucide-react";

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Resources", icon: BookOpen, color: "from-blue-500 to-cyan-500" },
    { id: "guides", name: "Interview Guides", icon: FileText, color: "from-emerald-500 to-teal-500" },
    { id: "learning", name: "Learning Materials", icon: GraduationCap, color: "from-purple-500 to-pink-500" },
    { id: "career", name: "Career Development", icon: Briefcase, color: "from-amber-500 to-orange-500" },
    { id: "tools", name: "Tools & Software", icon: Wrench, color: "from-rose-500 to-red-500" },
    { id: "community", name: "Community", icon: Users, color: "from-indigo-500 to-blue-500" },
  ];

  const resources = [
    // Interview Guides
    {
      id: 1,
      title: "STAR Method Guide for Behavioral Interviews",
      description: "Learn how to structure your answers using Situation, Task, Action, Result framework. Includes examples and practice templates.",
      category: "guides",
      type: "PDF",
      icon: FileText,
      link: "/resources/star-method-guide.pdf",
      downloadable: true,
      readTime: "10 min read",
      difficulty: "Beginner",
      featured: true,
    },
    {
      id: 2,
      title: "Top 100 Technical Interview Questions",
      description: "Most commonly asked technical questions for Software Engineering roles with answer frameworks and tips.",
      category: "guides",
      type: "Article",
      icon: FileText,
      link: "#",
      downloadable: false,
      readTime: "20 min read",
      difficulty: "Intermediate",
      featured: true,
    },
    {
      id: 3,
      title: "System Design Interview Guide",
      description: "Master system design interviews with proven frameworks, case studies, and architecture patterns.",
      category: "guides",
      type: "Guide",
      icon: FileText,
      link: "#",
      downloadable: true,
      readTime: "15 min read",
      difficulty: "Advanced",
      featured: false,
    },
    {
      id: 4,
      title: "Behavioral Interview Questions & Answers",
      description: "Common behavioral questions with sample answers using the STAR framework.",
      category: "guides",
      type: "Guide",
      icon: FileText,
      link: "#",
      downloadable: true,
      readTime: "12 min read",
      difficulty: "Beginner",
      featured: false,
    },

    // Learning Materials
    {
      id: 5,
      title: "React.js Complete Tutorial",
      description: "Free YouTube playlist covering React from basics to advanced concepts with projects.",
      category: "learning",
      type: "Video",
      icon: Youtube,
      link: "https://youtube.com",
      external: true,
      platform: "YouTube",
      duration: "8 hours",
      difficulty: "Beginner",
      featured: true,
    },
    {
      id: 6,
      title: "Node.js & Express.js Masterclass",
      description: "Comprehensive course on building backend APIs with Node.js, Express, and MongoDB.",
      category: "learning",
      type: "Course",
      icon: PlayCircle,
      link: "https://coursera.org",
      external: true,
      platform: "Coursera",
      duration: "12 hours",
      difficulty: "Intermediate",
      featured: false,
    },
    {
      id: 7,
      title: "Database Design & SQL Optimization",
      description: "Learn database normalization, indexing, query optimization, and best practices.",
      category: "learning",
      type: "Article",
      icon: BookOpen,
      link: "#",
      external: false,
      readTime: "25 min read",
      difficulty: "Intermediate",
      featured: false,
    },
    {
      id: 8,
      title: "Data Structures & Algorithms Crash Course",
      description: "Master essential data structures and algorithms for technical interviews.",
      category: "learning",
      type: "Course",
      icon: GraduationCap,
      link: "#",
      external: false,
      duration: "15 hours",
      difficulty: "Intermediate",
      featured: false,
    },

    // Career Development
    {
      id: 9,
      title: "Software Engineer Resume Template",
      description: "ATS-friendly resume template for IT professionals with formatting tips and examples.",
      category: "career",
      type: "Template",
      icon: FileCheck,
      link: "/resources/resume-template.docx",
      downloadable: true,
      readTime: "5 min read",
      difficulty: "Beginner",
      featured: true,
    },
    {
      id: 10,
      title: "LinkedIn Profile Optimization Guide",
      description: "How to optimize your LinkedIn profile to attract recruiters and showcase your skills.",
      category: "career",
      type: "Guide",
      icon: UserPlus,
      link: "#",
      external: false,
      readTime: "15 min read",
      difficulty: "Beginner",
      featured: false,
    },
    {
      id: 11,
      title: "Job Search Strategies for Fresh Graduates",
      description: "Effective job search techniques, networking tips, and interview preparation strategies.",
      category: "career",
      type: "Article",
      icon: Target,
      link: "#",
      external: false,
      readTime: "12 min read",
      difficulty: "Beginner",
      featured: false,
    },
    {
      id: 12,
      title: "Negotiation Skills for Tech Professionals",
      description: "Learn how to negotiate salary, benefits, and job offers effectively.",
      category: "career",
      type: "Guide",
      icon: TrendingUp,
      link: "#",
      external: false,
      readTime: "10 min read",
      difficulty: "Intermediate",
      featured: false,
    },

    // Tools & Software
    {
      id: 13,
      title: "VS Code Setup for Developers",
      description: "Best extensions, themes, and settings for productive development environment.",
      category: "tools",
      type: "Guide",
      icon: Code,
      link: "#",
      external: false,
      readTime: "8 min read",
      difficulty: "Beginner",
      featured: true,
    },
    {
      id: 14,
      title: "Git & GitHub Workflow Guide",
      description: "Complete guide to version control, branching strategies, and collaboration best practices.",
      category: "tools",
      type: "Guide",
      icon: Code,
      link: "#",
      external: false,
      readTime: "20 min read",
      difficulty: "Beginner",
      featured: false,
    },
    {
      id: 15,
      title: "Portfolio Website Templates",
      description: "Free HTML/CSS templates for building your developer portfolio.",
      category: "tools",
      type: "Template",
      icon: Code,
      link: "#",
      downloadable: true,
      readTime: "5 min read",
      difficulty: "Beginner",
      featured: false,
    },
    {
      id: 16,
      title: "Debugging Tools & Techniques",
      description: "Essential debugging tools and techniques for frontend and backend development.",
      category: "tools",
      type: "Guide",
      icon: Wrench,
      link: "#",
      external: false,
      readTime: "15 min read",
      difficulty: "Intermediate",
      featured: false,
    },

    // Community
    {
      id: 17,
      title: "Developer Discord Communities",
      description: "Join active developer communities for networking, help, and collaboration.",
      category: "community",
      type: "Link",
      icon: Users,
      link: "#",
      external: true,
      platform: "Discord",
      difficulty: "Beginner",
      featured: true,
    },
    {
      id: 18,
      title: "Tech Events & Hackathons 2025",
      description: "Calendar of upcoming virtual and in-person tech events and hackathons.",
      category: "community",
      type: "Calendar",
      icon: Calendar,
      link: "#",
      external: false,
      readTime: "5 min read",
      difficulty: "Beginner",
      featured: false,
    },
    {
      id: 19,
      title: "Stack Overflow Community",
      description: "Join the largest developer community for Q&A and knowledge sharing.",
      category: "community",
      type: "Link",
      icon: Globe,
      link: "#",
      external: true,
      platform: "Stack Overflow",
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
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredResources = resources.filter(r => r.featured);

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
              <span className="text-xs font-medium text-blue-700">FREE LEARNING RESOURCES</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-800 mb-6">
              Learning{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                Resources
              </span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed">
              Curated guides, courses, and tools to help you master technical interviews
              and advance your career in tech.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-semibold text-slate-800">Featured Resources</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResources.map((resource) => {
              const Icon = resource.icon;
              return (
                <div key={resource.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyBadge(resource.difficulty)}`}>
                      {resource.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{resource.title}</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock size={12} />
                      <span>{resource.readTime || resource.duration || "10 min"}</span>
                      {resource.type && (
                        <>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span>{resource.type}</span>
                        </>
                      )}
                    </div>
                    <a
                      href={resource.link}
                      target={resource.external ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                    >
                      {resource.downloadable ? "Download" : "View Resource"}
                      {resource.external ? <ExternalLink size={14} /> : <ChevronRight size={14} />}
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
                const Icon = resource.icon;
                return (
                  <div key={resource.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all hover:-translate-y-1 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyBadge(resource.difficulty)}`}>
                        {resource.difficulty}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{resource.title}</h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{resource.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock size={12} />
                        <span>{resource.readTime || resource.duration || "10 min"}</span>
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
                        target={resource.external ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                      >
                        {resource.downloadable ? (
                          <>
                            <Download size={14} />
                            Download
                          </>
                        ) : resource.external ? (
                          <>
                            Visit
                            <ExternalLink size={14} />
                          </>
                        ) : (
                          <>
                            Read More
                            <ChevronRight size={14} />
                          </>
                        )}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4 opacity-50">📚</div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No resources found</h3>
              <p className="text-slate-500">Try adjusting your search or filter criteria</p>
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
              <h2 className="text-2xl font-bold text-white mb-2">Stay Updated</h2>
              <p className="text-blue-100 mb-6">
                Get the latest interview tips and resources delivered to your inbox.
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