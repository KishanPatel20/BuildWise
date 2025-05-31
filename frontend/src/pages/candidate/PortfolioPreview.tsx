
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Eye, Share, User, GraduationCap, Briefcase, Code, Award, Target, CheckCircle } from 'lucide-react';

const PortfolioPreview = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>({});

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
  }, []);

  const handleGoToDashboard = () => {
    navigate('/candidate/dashboard');
  };

  const calculateCompleteness = () => {
    let score = 0;
    if (profileData.basicInfo?.firstName) score += 15;
    if (profileData.education?.length > 0) score += 20;
    if (profileData.workExperience?.length > 0) score += 20;
    if (profileData.projects?.length > 0) score += 25;
    if (profileData.certifications?.length > 0) score += 10;
    if (profileData.jobPreferences?.jobTitle) score += 10;
    return score;
  };

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
          
          {/* Completeness Score */}
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-md">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-sm">{completeness}%</span>
            </div>
            <span className="text-gray-700 font-medium">Profile Completeness</span>
          </div>
        </div>

        {/* Profile Preview */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold text-2xl text-gray-800">
                    {profileData.basicInfo?.firstName} {profileData.basicInfo?.lastName}
                  </h3>
                  <p className="text-gray-600">{profileData.jobPreferences?.jobTitle || 'Software Developer'}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Email:</span> {profileData.basicInfo?.email}</p>
                  <p><span className="font-medium">Phone:</span> {profileData.basicInfo?.phone}</p>
                  <p><span className="font-medium">Location:</span> {profileData.basicInfo?.location}</p>
                </div>
              </CardContent>
            </Card>

            {/* Job Preferences */}
            {profileData.jobPreferences?.jobTitle && (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-green-600" />
                    <CardTitle className="text-lg">Job Preferences</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Role:</span> {profileData.jobPreferences.jobTitle}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span> {profileData.jobPreferences.jobType}
                  </div>
                  <div>
                    <span className="font-medium">Work Mode:</span> {profileData.jobPreferences.workMode}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span> {profileData.jobPreferences.preferredLocations}
                  </div>
                  {profileData.jobPreferences.expectedSalary && (
                    <div>
                      <span className="font-medium">Salary:</span> ${profileData.jobPreferences.expectedSalary} {profileData.jobPreferences.salaryType}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Skills:</span> {profileData.jobPreferences.skills}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            {/* Education */}
            {profileData.education?.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-5 h-5 text-green-600" />
                    <CardTitle className="text-lg">Education</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileData.education.map((edu: any, index: number) => (
                    <div key={index} className="border-l-2 border-green-200 pl-4">
                      <h4 className="font-semibold">{edu.degree} in {edu.fieldOfStudy}</h4>
                      <p className="text-blue-600 font-medium">{edu.institution}</p>
                      <p className="text-sm text-gray-600">{edu.startYear} - {edu.endYear}</p>
                      {edu.grade && <p className="text-sm text-gray-600">Grade: {edu.grade}</p>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Work Experience */}
            {profileData.workExperience?.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">Work Experience</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileData.workExperience.map((exp: any, index: number) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-4">
                      <h4 className="font-semibold">{exp.position}</h4>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                      <p className="text-sm text-gray-600">
                        {exp.startDate} - {exp.isCurrentJob ? 'Present' : exp.endDate}
                      </p>
                      {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
                      {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Projects */}
            {profileData.projects?.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Code className="w-5 h-5 text-purple-600" />
                    <CardTitle className="text-lg">Projects</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileData.projects.map((project: any, index: number) => (
                    <div key={index} className="border-l-2 border-purple-200 pl-4">
                      <h4 className="font-semibold">{project.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                      <p className="text-sm"><span className="font-medium">Tech:</span> {project.technologies}</p>
                      {project.projectUrl && (
                        <a href={project.projectUrl} className="text-blue-600 text-sm hover:underline">
                          View Project
                        </a>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Certifications */}
            {profileData.certifications?.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <CardTitle className="text-lg">Certifications</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileData.certifications.map((cert: any, index: number) => (
                    <div key={index} className="border-l-2 border-yellow-200 pl-4">
                      <h4 className="font-semibold">{cert.name}</h4>
                      <p className="text-yellow-600 font-medium">{cert.issuingOrganization}</p>
                      <p className="text-sm text-gray-600">Issued: {cert.issueDate}</p>
                      {cert.credentialId && (
                        <p className="text-sm text-gray-600">ID: {cert.credentialId}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-12">
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
      </div>
    </div>
  );
};

export default PortfolioPreview;
