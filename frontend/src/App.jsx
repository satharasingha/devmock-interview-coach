import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import InterviewLibrary from "./pages/InterviewLibrary";
import InterviewSetup from "./pages/InterviewSetup";
import LiveInterview from "./pages/LiveInterview";
import Login from "./pages/Login";
import Regsiter from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/interviewlibrary" element={<InterviewLibrary />} />
        <Route path="/setup/:role" element={<InterviewSetup />} />
        <Route path="/interview/:role" element={<LiveInterview />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Regsiter />} />
      </Routes>
    </Router>
  );
}

export default App;
