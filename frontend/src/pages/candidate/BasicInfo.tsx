import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, User, Linkedin, Github, Globe } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useCandidate } from '@/context/CandidateContext';
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BasicInfo = () => {
  const navigate = useNavigate();
  const { candidateData, isLoading, fetchCandidateData } = useCandidate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    gender: '',
    dateOfBirth: '',
    linkedinProfile: '',
    githubProfile: '',
    portfolioLink: '',
    currentJobTitle: '',
    currentCompany: '',
    skills: '',
    experience: ''
  });

  useEffect(() => {
    if (candidateData) {
      setForm({
        firstName: candidateData.first_name || '',
        lastName: candidateData.last_name || '',
        email: candidateData.email || '',
        phone: candidateData.phone || '',
        location: candidateData.location || '',
        gender: candidateData.gender || '',
        dateOfBirth: candidateData.date_of_birth || '',
        linkedinProfile: candidateData.linkedin_profile || '',
        githubProfile: candidateData.github_profile || '',
        portfolioLink: candidateData.portfolio_link || '',
        currentJobTitle: candidateData.current_job_title || '',
        currentCompany: candidateData.current_company || '',
        skills: candidateData.skills || '',
        experience: candidateData.experience?.toString() || ''
      });
    }
  }, [candidateData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = sessionStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/candidates/me/`,
        {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          phone: form.phone,
          location: form.location,
          gender: form.gender,
          date_of_birth: form.dateOfBirth,
          linkedin_profile: form.linkedinProfile,
          github_profile: form.githubProfile,
          portfolio_link: form.portfolioLink,
          current_job_title: form.currentJobTitle,
          current_company: form.currentCompany,
          skills: form.skills,
          experience: parseInt(form.experience) || 0
        },
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        toast.success('Profile updated successfully!');
        await fetchCandidateData(); // Refresh the candidate data
        navigate('/candidate/education');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStep = 2;
  const totalSteps = 7;
  const progressValue = (currentStep / totalSteps) * 100;

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
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Exit Setup
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-3xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Basic Information</h1>
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Personal Details</CardTitle>
                <CardDescription>Tell us about yourself</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="City, State/Province, Country"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentJobTitle">Current Job Title</Label>
                  <Input
                    id="currentJobTitle"
                    placeholder="e.g., Software Engineer"
                    value={form.currentJobTitle}
                    onChange={(e) => setForm({ ...form, currentJobTitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentCompany">Current Company</Label>
                  <Input
                    id="currentCompany"
                    placeholder="e.g., Tech Corp"
                    value={form.currentCompany}
                    onChange={(e) => setForm({ ...form, currentCompany: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <Input
                    id="skills"
                    placeholder="e.g., Python, Django, React"
                    value={form.skills}
                    onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    placeholder="e.g., 5"
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Gender</Label>
                <RadioGroup value={form.gender} onValueChange={(value) => setForm({ ...form, gender: value })}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
                    <Label htmlFor="prefer-not-to-say">Prefer not to say</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Professional Links</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedinProfile" className="flex items-center space-x-2">
                      <Linkedin className="w-4 h-4 text-blue-600" />
                      <span>LinkedIn Profile</span>
                    </Label>
                    <Input
                      id="linkedinProfile"
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={form.linkedinProfile}
                      onChange={(e) => setForm({ ...form, linkedinProfile: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="githubProfile" className="flex items-center space-x-2">
                      <Github className="w-4 h-4 text-gray-800" />
                      <span>GitHub Profile</span>
                    </Label>
                    <Input
                      id="githubProfile"
                      type="url"
                      placeholder="https://github.com/yourusername"
                      value={form.githubProfile}
                      onChange={(e) => setForm({ ...form, githubProfile: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolioLink" className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-green-600" />
                      <span>Portfolio Website</span>
                    </Label>
                    <Input
                      id="portfolioLink"
                      type="url"
                      placeholder="https://yourportfolio.com"
                      value={form.portfolioLink}
                      onChange={(e) => setForm({ ...form, portfolioLink: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/candidate/profile-setup')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BasicInfo;
