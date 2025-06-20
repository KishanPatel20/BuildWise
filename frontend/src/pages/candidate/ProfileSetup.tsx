import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, User, ArrowRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useCandidate } from '@/context/CandidateContext';

const API_BASE_URL = '';  // Empty string for relative paths

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fetchCandidateData } = useCandidate();
  
  const steps = [
    { title: 'Resume Upload', icon: Upload },
    { title: 'Basic Info', icon: User },
    { title: 'Complete Profile', icon: FileText }
  ];

  useEffect(() => {
    const checkProfileStatus = async () => {
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

        // If profile exists and is complete, redirect to dashboard
        if (response.data && response.data.id && response.data.status !== 'new') {
          navigate('/candidate/dashboard');
        }
      } catch (error) {
        // If unauthorized or other error, redirect to login
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          toast.error('Session expired. Please login again.');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkProfileStatus();
  }, [navigate]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && 
          file.type !== 'application/msword' && 
          file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setUploadError('Please upload a PDF or Word document');
        return;
      }
      setUploadedFile(file);
      setUploadError(null);
    }
  };

  const handleResumeUpload = async () => {
    if (!uploadedFile) {
      setUploadError('Please select a file to upload');
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('resume', uploadedFile);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/candidates/upload_resume/`,
        formData,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.profile_updated) {
        toast.success('Resume uploaded successfully!');
        // Fetch the updated candidate data
        await fetchCandidateData();
        setCurrentStep(1);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setUploadError(error.response?.data?.message || 'Failed to upload resume. Please try again.');
        toast.error('Failed to upload resume');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleManualEntry = () => {
    navigate('/candidate/basic-info');
  };

  const progressValue = ((currentStep + 1) / steps.length) * 100;

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
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <div className="space-y-4">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      size="lg"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {uploadedFile ? 'Change File' : 'Choose File'}
                      <Upload className="ml-2 w-4 h-4" />
                    </Button>
                    
                    {uploadedFile && (
                      <div className="text-sm text-gray-600">
                        Selected: {uploadedFile.name}
                      </div>
                    )}
                    
                    {uploadError && (
                      <div className="text-sm text-red-600">
                        {uploadError}
                      </div>
                    )}
                    
                    {uploadedFile && (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700" 
                        size="lg"
                        onClick={handleResumeUpload}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          'Upload Resume'
                        )}
                      </Button>
                    )}
                  </div>
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
                      <h3 className="font-semibold text-gray-800">{uploadedFile?.name || 'Resume'}</h3>
                      <p className="text-sm text-gray-600">
                        {uploadedFile ? `Processed • ${(uploadedFile.size / 1024).toFixed(0)} KB` : 'Processed'}
                      </p>
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
