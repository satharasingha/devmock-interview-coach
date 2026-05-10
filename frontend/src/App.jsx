import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import InterviewLibrary from "./pages/InterviewLibrary";
import InterviewSetup from "./pages/InterviewSetup";
import LiveInterview from "./pages/LiveInterview";
import Login from "./pages/Login";
import Register from "./pages/Register"; // Fixed typo: Regsiter -> Register
import AdminDashboard from "./pages/admin/AdminDashboard";
import FeedbackPage from "./pages/FeedbackPage";
import AdminAddQuestion from "./pages/admin/AdminAddQuestion";
import AdminManageJobRoles from "./pages/admin/AdminManageRoles";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/Contact";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/interviewlibrary" element={<InterviewLibrary />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        
        {/* Interview Routes */}
        <Route path="/setup/:role" element={<InterviewSetup />} />
        <Route path="/interview/:role" element={<LiveInterview />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-question" element={<AdminAddQuestion />} />
        <Route path="/admin/interviews" element={<AdminManageJobRoles />} />
        
        {/* 404 Catch-all route - optional */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

// Optional: Create a simple NotFound component
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Go Home
        </a>
      </div>
    </div>
  );
}

export default App;