
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, User, ArrowRight, ArrowLeft } from 'lucide-react';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { title: 'Resume Upload', icon: Upload },
    { title: 'Basic Info', icon: User },
    { title: 'Complete Profile', icon: FileText }
  ];

  const handleResumeUpload = () => {
    setCurrentStep(1);
  };

  const handleManualEntry = () => {
    navigate('/candidate/basic-info');
  };

  const progressValue = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              HireAI
            </span>
          </div>
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Exit Setup
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Progress Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Profile Setup</h1>
            <span className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</span>
          </div>
          <Progress value={progressValue} className="h-2 mb-6" />
          
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  <step.icon className="w-4 h-4" />
                </div>
                <span className={`text-sm ${
                  index <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 0 && (
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Let's Get Started</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Choose how you'd like to create your professional profile
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 cursor-pointer group">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-800">Upload Resume</CardTitle>
                  <CardDescription className="text-gray-600">
                    Upload your existing resume and let our AI extract the information
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    size="lg"
                    onClick={handleResumeUpload}
                  >
                    Choose File
                    <Upload className="ml-2 w-4 h-4" />
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">Supports PDF, DOC, DOCX</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-green-200 cursor-pointer group">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-800">Manual Entry</CardTitle>
                  <CardDescription className="text-gray-600">
                    Fill out your information step by step with our guided form
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    size="lg"
                    onClick={handleManualEntry}
                  >
                    Start Form
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">Takes about 10 minutes</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Resume Uploaded Successfully!</h2>
              <p className="text-lg text-gray-600 mb-8">
                Our AI is processing your resume. You can now review and complete your profile.
              </p>
              
              <Card className="text-left mb-8">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">resume_john_doe.pdf</h3>
                      <p className="text-sm text-gray-600">Processed • 245 KB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex space-x-4 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(0)}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate('/candidate/basic-info')}
                >
                  Review & Complete Profile
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSetup;
