import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import CandidateSignup from "./pages/candidate/Signup";
import RecruiterSignup from "./pages/recruiter/Signup";
import ProfileSetup from "./pages/candidate/ProfileSetup";
import BasicInfo from "./pages/candidate/BasicInfo";
import Education from "./pages/candidate/Education";
import WorkExperience from "./pages/candidate/WorkExperience";
import Projects from "./pages/candidate/Projects";
import Certifications from "./pages/candidate/Certifications";
import JobPreferences from "./pages/candidate/JobPreferences";
import PortfolioPreview from "./pages/candidate/PortfolioPreview";
import CandidateDashboard from "./pages/candidate/Dashboard";
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import NotFound from "./pages/NotFound";
import RecruiterProfile from "./pages/recruiter/Profile";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            
            {/* Candidate Routes */}
            <Route path="/candidate/signup" element={<CandidateSignup />} />
            <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
            <Route path="/candidate/profile-setup" element={<ProfileSetup />} />
            <Route path="/candidate/basic-info" element={<BasicInfo />} />
            <Route path="/candidate/work-experience" element={<WorkExperience />} />
            <Route path="/candidate/education" element={<Education />} />
            <Route path="/candidate/projects" element={<Projects />} />
            <Route path="/candidate/certifications" element={<Certifications />} />
            <Route path="/candidate/job-preferences" element={<JobPreferences />} />
            <Route path="/candidate/portfolio-preview" element={<PortfolioPreview />} />
            
            {/* Recruiter Routes */}
            <Route path="/recruiter/signup" element={<RecruiterSignup />} />
            <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
            <Route path="/recruiter/profile" element={<RecruiterProfile />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
