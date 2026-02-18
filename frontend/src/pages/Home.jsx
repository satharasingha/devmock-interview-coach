import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StanfordLogo from "../assets/stanford-logo.png";
import MITLogo from "../assets/MIT-logo.png";
import BerkeleyLogo from "../assets/Berkeley-logo.png";
import CambridgeLogo from "../assets/cambridge-logo.png";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="bg-gray-200">

        {/* HERO SECTION */}
        <section className="pt-24 pb-28">
          <div className="max-w-7xl mx-auto px-6 text-center">

            {/* Blinking Badge */}
            <div className="flex justify-center mb-8">
              <span className="animate-pulse text-xs font-semibold text-blue-600 bg-blue-100 px-4 py-1.5 rounded-full">
                NEW: AI GRADING ENGINE v2.0
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Master Your Technical <br className="hidden md:block" />
              Interview with{" "}
              <span className="text-blue-600">AI Intelligence.</span>
            </h1>

            {/* Subheading */}
            <p className="max-w-2xl mx-auto text-gray-600 text-lg mb-10">
              The smartest way for university students and graduates to practice
              coding interviews. Get real-time feedback and track your growth with
              academic precision.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <button className="bg-blue-600 hover:bg-blue-700 transition text-white font-medium px-8 py-3 rounded-lg">
                Get Started →
              </button>
              <button className="border border-gray-300 hover:bg-gray-50 transition px-8 py-3 rounded-lg flex items-center justify-center gap-2">
                ▶ Watch Demo
              </button>
            </div>

            {/* Code Preview */}
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl border border-gray-100 p-6 text-left font-mono text-sm text-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                <span className="ml-4 text-gray-400 text-xs">two_sum.py</span>
              </div>

              <p className="text-purple-600">
                def <span className="text-blue-600">twoSum</span>(nums, target):
              </p>
              <p className="ml-4">seen = {`{}`}</p>
              <p className="ml-4">for i, num in enumerate(nums):</p>
              <p className="ml-8">complement = target - num</p>
              <p className="ml-8">if complement in seen:</p>
              <p className="ml-12">return [seen[complement], i]</p>
              <p className="ml-8">seen[num] = i</p>
            </div>

          </div>
        </section>

        {/*TRUSTED BY*/}
        <section className="pb-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">

              <div className="text-left">
                <p className="text-xs font-semibold text-blue-600 mb-1">
                  ACADEMIC PARTNERSHIP
                </p>
                <h3 className="text-xl font-bold text-gray-900">
                  Trusted Globally.
                </h3>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-8">
                <div className="flex items-center gap-3">
                  <img src={StanfordLogo} alt="Stanford" className="h-6 object-contain" />
                  <span className="font-medium text-gray-700">Stanford</span>
                </div>

                <div className="flex items-center gap-3">
                  <img src={MITLogo} alt="MIT" className="h-6 object-contain" />
                  <span className="font-medium text-gray-700">MIT</span>
                </div>

                <div className="flex items-center gap-3">
                  <img src={BerkeleyLogo} alt="Berkeley" className="h-6 object-contain" />
                  <span className="font-medium text-gray-700">Berkeley</span>
                </div>

                <div className="flex items-center gap-3">
                  <img src={CambridgeLogo} alt="Cambridge" className="h-6 object-contain" />
                  <span className="font-medium text-gray-700">Cambridge</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* WHY CHOOSE */}
        <section className="pb-32">
          <div className="max-w-7xl mx-auto px-6 text-center">

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose DevMock?
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto mb-16">
              Designed for students and graduates to excel in technical
              assessments with structured guidance.
            </p>

            <div className="grid gap-8 md:grid-cols-3">

              {/* Card 1 */}
              <div className="bg-blue-200 rounded-xl p-8 text-left shadow-md hover:shadow-lg transition">
                <div className="w-10 h-10 bg-white/20 text-black rounded-lg flex items-center justify-center mb-6">
                  🤖
                </div>
                <h3 className="font-semibold text-lg mb-3 text-white">
                  AI Practice
                </h3>
                <p className="text-black-100 text-sm leading-relaxed">
                  Simulate real-world coding scenarios with our adaptive AI
                  interviewer that adjusts difficulty based on your performance.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-blue-600 rounded-xl p-8 text-left shadow-md hover:shadow-lg transition">
                <div className="w-10 h-10 bg-white/20 text-white rounded-lg flex items-center justify-center mb-6">
                  📋
                </div>
                <h3 className="font-semibold text-lg mb-3 text-white">
                  Structured Feedback
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Receive instant, academic-grade grading on code efficiency,
                  space complexity, and clarity immediately after submission.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-blue-600 rounded-xl p-8 text-left shadow-md hover:shadow-lg transition">
                <div className="w-10 h-10 bg-white/20 text-white rounded-lg flex items-center justify-center mb-6">
                  📈
                </div>
                <h3 className="font-semibold text-lg mb-3 text-white">
                  Progress Tracking
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Visualize your improvement over time with detailed performance
                  analytics and benchmark yourself against peers.
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
