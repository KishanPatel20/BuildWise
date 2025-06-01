import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Code, 
  Award, 
  Target, 
  Edit, 
  Share, 
  Eye,
  TrendingUp,
  Users,
  FileText,
  Settings,
  Download,
  Linkedin,
  Github,
  Globe
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface WorkExperience {
  id: number;
  company_name: string;
  role_designation: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  responsibilities: string;
  technologies_used: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string;
  role_in_project: string;
  github_link: string | null;
  live_link: string | null;
}

interface CandidateProfile {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  work_experiences: WorkExperience[];
  projects: Project[];
  certifications: any[];
  name: string;
  email: string;
  phone: string;
  gender: string | null;
  date_of_birth: string | null;
  linkedin_profile: string;
  github_profile: string;
  portfolio_link: string;
  resume: string;
  skills: string;
  experience: number;
  current_job_title: string | null;
  current_company: string;
  desired_roles: string | null;
  preferred_industry_sector: string | null;
  employment_type_preferences: string;
  preferred_locations: string | null;
  desired_salary_range: string | null;
  willingness_to_relocate: boolean;
  is_actively_looking: boolean;
  status: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    profileViews: 0,
    recruiterContacts: 0,
    jobMatches: 0,
    profileCompleteness: 0
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error('Please login to continue');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/candidates/me/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });

        setProfileData(response.data);
        
        // Calculate profile completeness
        let score = 0;
        const data = response.data;
        if (data.name) score += 15;
        if (data.work_experiences?.length > 0) score += 20;
        if (data.projects?.length > 0) score += 25;
        if (data.certifications?.length > 0) score += 10;
        if (data.skills) score += 15;
        if (data.desired_roles) score += 15;

        setStats(prev => ({
          ...prev,
          profileViews: data.view_count || 0,
          profileCompleteness: score
        }));

      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          toast.error('Session expired. Please login again.');
          navigate('/login');
        } else {
          toast.error('Failed to load profile data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleDownloadResume = () => {
    if (profileData?.resume) {
      window.open(profileData.resume, '_blank');
    } else {
      toast.error('No resume available');
    }
  };

  const handleShareProfile = () => {
    // TODO: Implement share functionality
    toast.info('Share functionality coming soon!');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  const sections = [
    {
      title: 'Basic Information',
      icon: User,
      route: '/candidate/basic-info',
      completed: !!profileData?.name,
      color: 'blue'
    },
    {
      title: 'Work Experience',
      icon: Briefcase,
      route: '/candidate/work-experience',
      completed: profileData?.work_experiences?.length > 0,
      color: 'green'
    },
    {
      title: 'Projects',
      icon: Code,
      route: '/candidate/projects',
      completed: profileData?.projects?.length > 0,
      color: 'purple'
    },
    {
      title: 'Certifications',
      icon: Award,
      route: '/candidate/certifications',
      completed: profileData?.certifications?.length > 0,
      color: 'yellow'
    },
    {
      title: 'Job Preferences',
      icon: Target,
      route: '/candidate/job-preferences',
      completed: !!profileData?.desired_roles,
      color: 'green'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  HireAI
                </span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-800">
                  Welcome back, {profileData?.user?.first_name || 'Candidate'}!
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={handleShareProfile}>
                <Share className="w-4 h-4 mr-2" />
                Share Profile
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profile Views</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.profileViews}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Work Experience</p>
                  <p className="text-2xl font-bold text-gray-900">{profileData?.work_experiences?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{profileData?.projects?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profile Complete</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.profileCompleteness}%</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={stats.profileCompleteness} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Sections */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Sections</CardTitle>
                <CardDescription>
                  Manage and edit different sections of your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {sections.map((section, index) => {
                    const IconComponent = section.icon;
                    return (
                      <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 bg-${section.color}-100 rounded-lg flex items-center justify-center`}>
                                <IconComponent className={`w-5 h-5 text-${section.color}-600`} />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{section.title}</h3>
                                <p className="text-sm text-gray-500">
                                  {section.completed ? 'Completed' : 'Incomplete'}
                                </p>
                              </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full ${
                              section.completed 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-gray-100 text-gray-400'
                            } flex items-center justify-center`}>
                              {section.completed ? '✓' : '!'}
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => navigate(section.route)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            {section.completed ? 'Edit' : 'Complete'}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Profile Summary */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate('/candidate/portfolio-preview')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Portfolio
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleShareProfile}
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleDownloadResume}
                  disabled={!profileData?.resume}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
              </CardContent>
            </Card>

            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-xl">
                      {profileData?.user?.first_name?.[0]}{profileData?.user?.last_name?.[0]}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">
                    {profileData?.user?.first_name} {profileData?.user?.last_name}
                  </h3>
                  <p className="text-gray-600">{profileData?.current_job_title || 'Not specified'}</p>
                  <p className="text-sm text-gray-500">{profileData?.email}</p>
                  
                  {/* Social Links */}
                  <div className="flex justify-center space-x-3 mt-3">
                    {profileData?.linkedin_profile && (
                      <a 
                        href={`https://linkedin.com/${profileData.linkedin_profile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {profileData?.github_profile && (
                      <a 
                        href={profileData.github_profile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {profileData?.portfolio_link && (
                      <a 
                        href={profileData.portfolio_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">{profileData?.work_experiences?.length || 0} positions</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projects:</span>
                    <span className="font-medium">{profileData?.projects?.length || 0} projects</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Certifications:</span>
                    <span className="font-medium">{profileData?.certifications?.length || 0} certifications</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      profileData?.is_actively_looking ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {profileData?.is_actively_looking ? 'Actively Looking' : 'Not Looking'}
                    </span>
                  </div>
                </div>

                {/* Skills */}
                {profileData?.skills && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.split(',').map((skill, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
