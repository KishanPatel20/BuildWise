
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
  Settings
} from 'lucide-react';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>({});
  const [stats, setStats] = useState({
    profileViews: 23,
    recruiterContacts: 5,
    jobMatches: 12,
    profileCompleteness: 0
  });

  useEffect(() => {
    // Load all profile data from localStorage
    const basicInfo = JSON.parse(localStorage.getItem('candidateBasicInfo') || '{}');
    const education = JSON.parse(localStorage.getItem('candidateEducation') || '[]');
    const workExperience = JSON.parse(localStorage.getItem('candidateWorkExperience') || '[]');
    const projects = JSON.parse(localStorage.getItem('candidateProjects') || '[]');
    const certifications = JSON.parse(localStorage.getItem('candidateCertifications') || '[]');
    const jobPreferences = JSON.parse(localStorage.getItem('candidateJobPreferences') || '{}');

    setProfileData({
      basicInfo,
      education,
      workExperience,
      projects,
      certifications,
      jobPreferences
    });

    // Calculate profile completeness
    let score = 0;
    if (basicInfo?.firstName) score += 15;
    if (education?.length > 0) score += 20;
    if (workExperience?.length > 0) score += 20;
    if (projects?.length > 0) score += 25;
    if (certifications?.length > 0) score += 10;
    if (jobPreferences?.jobTitle) score += 10;

    setStats(prev => ({ ...prev, profileCompleteness: score }));
  }, []);

  const sections = [
    {
      title: 'Basic Information',
      icon: User,
      route: '/candidate/basic-info',
      completed: !!profileData.basicInfo?.firstName,
      color: 'blue'
    },
    {
      title: 'Education',
      icon: GraduationCap,
      route: '/candidate/education',
      completed: profileData.education?.length > 0,
      color: 'green'
    },
    {
      title: 'Work Experience',
      icon: Briefcase,
      route: '/candidate/work-experience',
      completed: profileData.workExperience?.length > 0,
      color: 'blue'
    },
    {
      title: 'Projects',
      icon: Code,
      route: '/candidate/projects',
      completed: profileData.projects?.length > 0,
      color: 'purple'
    },
    {
      title: 'Certifications',
      icon: Award,
      route: '/candidate/certifications',
      completed: profileData.certifications?.length > 0,
      color: 'yellow'
    },
    {
      title: 'Job Preferences',
      icon: Target,
      route: '/candidate/job-preferences',
      completed: !!profileData.jobPreferences?.jobTitle,
      color: 'green'
    }
  ];

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
                  Welcome back, {profileData.basicInfo?.firstName || 'Candidate'}!
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
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
                onClick={() => navigate('/login')}
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
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">+12% from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recruiter Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.recruiterContacts}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">+2 this week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Job Matches</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.jobMatches}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <FileText className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-blue-600">3 new today</span>
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
                <Button variant="outline" className="w-full">
                  <Share className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
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
                      {profileData.basicInfo?.firstName?.[0]}{profileData.basicInfo?.lastName?.[0]}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">
                    {profileData.basicInfo?.firstName} {profileData.basicInfo?.lastName}
                  </h3>
                  <p className="text-gray-600">{profileData.jobPreferences?.jobTitle || 'Software Developer'}</p>
                  <p className="text-sm text-gray-500">{profileData.basicInfo?.location}</p>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Education:</span>
                    <span className="font-medium">{profileData.education?.length || 0} entries</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">{profileData.workExperience?.length || 0} entries</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projects:</span>
                    <span className="font-medium">{profileData.projects?.length || 0} entries</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Certifications:</span>
                    <span className="font-medium">{profileData.certifications?.length || 0} entries</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
