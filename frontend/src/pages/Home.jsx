import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StanfordLogo from "../assets/stanford-logo.png";
import MITLogo from "../assets/mit-logo.png";
import BerkeleyLogo from "../assets/berkeley-logo.jpg";
import CambridgeLogo from "../assets/cambridge-logo.png";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const codeRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Typewriter effect for code preview
    if (codeRef.current) {
      const codeLines = [
        'def twoSum(nums, target):',
        '    seen = {}',
        '    for i, num in enumerate(nums):',
        '        complement = target - num',
        '        if complement in seen:',
        '            return [seen[complement], i]',
        '        seen[num] = i',
        '    return []'
      ];
      
      let lineIndex = 0;
      let charIndex = 0;
      let currentLine = '';
      
      // Get all line elements
      const lineElements = Array.from(codeRef.current.children);
      
      const typeLine = () => {
        if (lineIndex < codeLines.length) {
          if (charIndex < codeLines[lineIndex].length) {
            currentLine += codeLines[lineIndex][charIndex];
            // Safely update the element if it exists
            if (lineElements[lineIndex]) {
              lineElements[lineIndex].textContent = currentLine;
            }
            charIndex++;
            setTimeout(typeLine, 20);
          } else {
            lineIndex++;
            charIndex = 0;
            currentLine = '';
            if (lineIndex < codeLines.length && lineElements[lineIndex]) {
              lineElements[lineIndex].style.opacity = '1';
            }
            setTimeout(typeLine, 150);
          }
        }
      };
      
      // Initialize all lines as empty
      lineElements.forEach(child => {
        if (child) {
          child.textContent = '';
        }
      });
      
      // Start typing
      const timer = setTimeout(typeLine, 500);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <>
      <Navbar />

      <main className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* HERO SECTION - Dark Theme */}
        <section className="relative pt-20 md:pt-24 lg:pt-28 pb-20 md:pb-24 lg:pb-32 overflow-hidden">
          {/* Subtle background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full filter blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            {/* Centered content */}
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="flex justify-center mb-6 md:mb-8">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-60 group-hover:opacity-80 transition duration-200"></div>
                  <span className="relative text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full inline-block whitespace-nowrap">
                    ✦ NEW: AI MENTOR ENGINE v2.0
                  </span>
                </div>
              </div>

              {/* Main heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-tight mb-4 sm:mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-cyan-200 block">
                  Your Personal
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 block mt-2">
                  AI Career Mentor
                </span>
              </h1>

              {/* Subheading */}
              <p className="max-w-2xl mx-auto text-gray-300 text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 leading-relaxed px-4">
                The intelligent way for students and graduates to master technical interviews. Get personalized guidance, real time feedback, and track your progress with academic precision.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 sm:mb-12 w-full sm:w-auto px-4">
                <Link 
                  to="/interview/software-engineer"
                  className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto text-center"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Learning Free
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                
                <button 
                  onClick={() => {
                    const featuresSection = document.getElementById('features');
                    if (featuresSection) {
                      featuresSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-xl flex items-center justify-center gap-2 sm:gap-3 text-gray-300 hover:text-white transition-all duration-300 w-full sm:w-auto"
                >
                  <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20">
                    ▶
                  </span>
                  <span className="font-medium">See How It Works</span>
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm text-gray-400 justify-center px-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span>10K+ students mentored</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                  </svg>
                  <span>4.9/5 rating</span>
                </div>
              </div>
            </div>

            {/* Code Preview - Dark Theme */}
            <div className="mt-16 md:mt-20 lg:mt-24 max-w-3xl mx-auto px-4 sm:px-6">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                
                <div className="relative bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 text-left font-mono text-xs sm:text-sm shadow-2xl border border-gray-700">
                  {/* Window controls */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500/80 rounded-full"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500/80 rounded-full"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500/80 rounded-full"></div>
                    <span className="ml-2 sm:ml-3 text-gray-400 text-[10px] sm:text-xs bg-gray-700 px-2 sm:px-3 py-1 rounded-full">
                      mentor_analysis.py
                    </span>
                  </div>

                  {/* Code with syntax highlighting */}
                  <div ref={codeRef} className="space-y-0.5 sm:space-y-1 pl-4 sm:pl-8 overflow-x-auto">
                    <div className="text-purple-400 font-medium whitespace-nowrap"></div>
                    <div className="text-gray-300 ml-4 opacity-0 transition-opacity duration-500 whitespace-nowrap"></div>
                    <div className="text-gray-300 ml-4 opacity-0 transition-opacity duration-500 whitespace-nowrap"></div>
                    <div className="text-blue-400 ml-8 opacity-0 transition-opacity duration-500 whitespace-nowrap"></div>
                    <div className="text-gray-300 ml-8 opacity-0 transition-opacity duration-500 whitespace-nowrap"></div>
                    <div className="text-green-400 ml-12 opacity-0 transition-opacity duration-500 whitespace-nowrap"></div>
                    <div className="text-gray-300 ml-8 opacity-0 transition-opacity duration-500 whitespace-nowrap"></div>
                  </div>

                  {/* Line numbers */}
                  <div className="absolute left-2 sm:left-4 top-12 sm:top-16 bottom-0 flex flex-col items-end pr-2 sm:pr-3 text-gray-500 text-[10px] sm:text-xs select-none">
                    {[1,2,3,4,5,6,7].map(num => (
                      <div key={num} className="h-5 sm:h-6 leading-5 sm:leading-6">{num}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUSTED BY SECTION - Dark Theme */}
        <section className="pb-16 md:pb-20 lg:pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
              
              <div className="relative bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 shadow-xl border border-gray-700">
                <div className="text-center lg:text-left">
                  <p className="text-xs sm:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-1 sm:mb-2">
                    ✦ ACADEMIC PARTNERS
                  </p>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                    Trusted by leading universities
                  </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                  {[
                    { logo: StanfordLogo, name: "Stanford" },
                    { logo: MITLogo, name: "MIT" },
                    { logo: BerkeleyLogo, name: "Berkeley" },
                    { logo: CambridgeLogo, name: "Cambridge" }
                  ].map((university, index) => (
                    <div key={index} className="flex items-center gap-2 sm:gap-3 hover:scale-105 transition-transform duration-300">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-700/50 rounded-lg sm:rounded-xl flex items-center justify-center p-1.5 sm:p-2">
                        <img 
                          src={university.logo} 
                          alt={university.name} 
                          className="max-h-5 sm:max-h-6 md:max-h-8 max-w-5 sm:max-w-6 md:max-w-8 object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                      <span className="font-medium text-gray-300 text-xs sm:text-sm">
                        {university.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION - Dark Theme Cards */}
        <section id="features" className="pb-20 md:pb-24 lg:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Section header */}
            <div className="text-center mb-10 md:mb-12 lg:mb-16">
              <span className="text-xs sm:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                WHY DEVMOCK
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2 mb-3 sm:mb-4">
                Your AI Career Mentor
              </h2>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
                Designed specifically for students to excel in technical assessments with intelligent, personalized guidance.
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {/* Card 1 - Dark */}
              <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-700 hover:border-blue-500/30">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-4 sm:mb-6 transform group-hover:scale-110 group-hover:rotate-1 transition-all duration-300">
                  <span className="text-2xl sm:text-3xl">🤖</span>
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-white">
                  AI Mentor Guidance
                </h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  Get personalized coaching from our AI mentor that adapts to your skill level and learning pace, just like a real career advisor.
                </p>
              </div>

              {/* Card 2 - Dark */}
              <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-700 hover:border-blue-500/30">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-4 sm:mb-6 transform group-hover:scale-110 group-hover:-rotate-1 transition-all duration-300">
                  <span className="text-2xl sm:text-3xl">📋</span>
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-white">
                  Smart Feedback
                </h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  Receive detailed, academic grade analysis on your code quality, approach, and optimization strategies.
                </p>
              </div>

              {/* Card 3 - Dark */}
              <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-700 hover:border-blue-500/30">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-4 sm:mb-6 transform group-hover:scale-110 group-hover:rotate-1 transition-all duration-300">
                  <span className="text-2xl sm:text-3xl">📈</span>
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-white">
                  Growth Analytics
                </h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  Track your improvement with detailed metrics and compare your progress with peers in your field.
                </p>
              </div>
            </div>

            {/* Stats Section - Dark */}
            <div className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6 sm:p-8 bg-gray-800/30 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-700">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">10K+</div>
                <div className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">Active Students</div>
              </div>
              <div className="text-center p-6 sm:p-8 bg-gray-800/30 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-700">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">95%</div>
                <div className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">Success Rate</div>
              </div>
              <div className="text-center p-6 sm:p-8 bg-gray-800/30 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-700 sm:col-span-2 md:col-span-1">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">500+</div>
                <div className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">Partner Companies</div>
              </div>
            </div>

            {/* Additional Feature Highlight - Dark */}
            <div className="mt-16 sm:mt-20 md:mt-24 text-center">
              <div className="inline-flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg border border-gray-700">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm sm:text-base text-gray-300">98% of students recommend DevMock</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}