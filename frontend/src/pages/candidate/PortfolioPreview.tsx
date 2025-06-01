import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Eye, Share, User, GraduationCap, Briefcase, Code, Award, Target, CheckCircle, Link, FileText, Calendar, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface PortfolioData {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  work_experiences: Array<{
    id: number;
    company_name: string;
    role_designation: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    responsibilities: string;
    technologies_used: string;
  }>;
  projects: Array<{
    id: number;
    title: string;
    description: string;
    tech_stack: string;
    role_in_project: string;
    github_link: string | null;
    live_link: string | null;
  }>;
  certifications: any[];
  name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  linkedin_profile: string;
  github_profile: string;
  portfolio_link: string;
  resume: string;
  skills: string;
  experience: number;
  current_job_title: string;
  current_company: string;
  employment_type_preferences: string;
  is_actively_looking: boolean;
  status: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

const PortfolioPreview = () => {
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>({});

  useEffect(() => {
    const fetchPortfolioData = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error('Please login to continue');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/candidates/portfolio_data/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        setPortfolioData(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || 'Failed to fetch portfolio data');
        } else {
          toast.error('An unexpected error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Load job preferences from localStorage
    const jobPreferences = JSON.parse(localStorage.getItem('candidateJobPreferences') || '{}');
    setProfileData({ jobPreferences });

    fetchPortfolioData();
  }, [navigate]);

  const handleGoToDashboard = () => {
    navigate('/candidate/dashboard');
  };

  const calculateCompleteness = () => {
    if (!portfolioData) return 0;
    let score = 0;
    if (portfolioData.name) score += 15;
    if (portfolioData.work_experiences?.length > 0) score += 20;
    if (portfolioData.projects?.length > 0) score += 25;
    if (portfolioData.certifications?.length > 0) score += 10;
    if (portfolioData.current_job_title) score += 10;
    if (portfolioData.skills) score += 10;
    if (portfolioData.linkedin_profile || portfolioData.github_profile) score += 10;
    return score;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const completeness = calculateCompleteness();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              HireAI
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Profile Complete!</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your professional profile has been created successfully. Here's a preview of how recruiters will see your information.
          </p>

          {/* Action Buttons - Moved to top */}
          <div className="flex justify-center space-x-4 mb-12">
            <Button
              variant="outline"
              onClick={() => navigate('/candidate/job-preferences')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
              onClick={handleGoToDashboard}
            >
              <Eye className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Button>
          </div>
          
          {/* Profile Stats */}
          <div className="flex justify-center space-x-4 mb-8">
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-md">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">{completeness}%</span>
              </div>
              <span className="text-gray-700 font-medium">Profile Completeness</span>
            </div>
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-md">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-gray-700 font-medium">{portfolioData?.view_count || 0} Profile Views</span>
            </div>
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-md">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-gray-700 font-medium">Member since {new Date(portfolioData?.created_at || '').toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Profile Preview */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="break-words">
                  <h3 className="font-semibold text-2xl text-gray-800">
                    {portfolioData?.name}
                  </h3>
                  <p className="text-gray-600 break-words">{portfolioData?.current_job_title} at {portfolioData?.current_company}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 break-words">
                    <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="truncate">{portfolioData?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 break-words">
                    <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="truncate">{portfolioData?.phone}</span>
                  </div>
                  {portfolioData?.linkedin_profile && (
                    <a href={portfolioData.linkedin_profile} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-blue-600 hover:underline break-words">
                      <Link className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">LinkedIn Profile</span>
                    </a>
                  )}
                  {portfolioData?.github_profile && (
                    <a href={portfolioData.github_profile} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gray-600 hover:underline break-words">
                      <Link className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">GitHub Profile</span>
                    </a>
                  )}
                  {portfolioData?.portfolio_link && (
                    <a href={portfolioData.portfolio_link} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-purple-600 hover:underline break-words">
                      <Link className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">Portfolio Website</span>
                    </a>
                  )}
                  {portfolioData?.resume && (
                    <a href={portfolioData.resume} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-green-600 hover:underline break-words">
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">View Resume</span>
                    </a>
                  )}
                </div>
                {portfolioData?.skills && (
                  <div className="pt-2">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {portfolioData.skills.split(',').map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs truncate max-w-[200px]">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Preferences */}
            {profileData.jobPreferences?.jobTitle && (
              <Card className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-green-600" />
                    <CardTitle className="text-lg">Job Preferences</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="break-words">
                    <span className="font-medium">Role:</span> {profileData.jobPreferences.jobTitle}
                  </div>
                  <div className="break-words">
                    <span className="font-medium">Types:</span> {profileData.jobPreferences.jobTypes?.join(', ')}
                  </div>
                  <div className="break-words">
                    <span className="font-medium">Work Modes:</span> {profileData.jobPreferences.workModes?.join(', ')}
                  </div>
                  <div className="break-words">
                    <span className="font-medium">Location:</span> {profileData.jobPreferences.preferredLocations}
                  </div>
                  {profileData.jobPreferences.expectedSalary && (
                    <div>
                      <span className="font-medium">Salary:</span> ${profileData.jobPreferences.expectedSalary} {profileData.jobPreferences.salaryType}
                    </div>
                  )}
                  <div className="break-words">
                    <span className="font-medium">Skills:</span> {profileData.jobPreferences.skills}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            {/* Work Experience */}
            {portfolioData?.work_experiences?.length > 0 && (
              <Card className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">Work Experience</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {portfolioData.work_experiences.map((exp) => (
                    <div key={exp.id} className="border-l-2 border-blue-200 pl-4 break-words">
                      <h4 className="font-semibold">{exp.role_designation}</h4>
                      <p className="text-blue-600 font-medium">{exp.company_name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(exp.start_date).toLocaleDateString()} - {exp.is_current ? 'Present' : new Date(exp.end_date).toLocaleDateString()}
                      </p>
                      {exp.responsibilities && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 mb-1">Responsibilities:</p>
                          <p className="text-sm text-gray-600 whitespace-pre-line break-words">{exp.responsibilities}</p>
                        </div>
                      )}
                      {exp.technologies_used && (
                        <p className="text-sm mt-2 break-words">
                          <span className="font-medium">Technologies:</span> {exp.technologies_used}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Projects */}
            {portfolioData?.projects?.length > 0 && (
              <Card className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Code className="w-5 h-5 text-purple-600" />
                    <CardTitle className="text-lg">Projects</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {portfolioData.projects.map((project) => (
                    <div key={project.id} className="border-l-2 border-purple-200 pl-4 break-words">
                      <h4 className="font-semibold">{project.title}</h4>
                      <p className="text-sm text-gray-600 mb-2 break-words">{project.description}</p>
                      <p className="text-sm break-words"><span className="font-medium">Tech Stack:</span> {project.tech_stack}</p>
                      {project.role_in_project && project.role_in_project !== 'Not specified' && (
                        <p className="text-sm break-words"><span className="font-medium">Role:</span> {project.role_in_project}</p>
                      )}
                      <div className="flex space-x-4 mt-2">
                        {project.github_link && (
                          <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-gray-900 flex items-center break-words">
                            <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">GitHub</span>
                          </a>
                        )}
                        {project.live_link && (
                          <a href={project.live_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 flex items-center break-words">
                            <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">Live Demo</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPreview;
