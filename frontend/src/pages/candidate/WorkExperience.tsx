import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Briefcase, Plus, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrentJob: boolean;
  description: string;
  location: string;
  technologiesUsed?: string;
}

const WorkExperience = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchWorkExperiences = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/work-experiences/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      const transformedExperience = response.data.map((exp: any) => ({
        id: exp.id.toString(),
        company: exp.company_name,
        position: exp.role_designation,
        startDate: exp.start_date || '',
        endDate: exp.end_date || '',
        isCurrentJob: exp.is_current,
        description: exp.responsibilities || '',
        location: '', // API doesn't provide location
        technologiesUsed: exp.technologies_used || ''
      }));

      setExperiences(transformedExperience);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to fetch work experience');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkExperiences();
  }, []);

  const addExperience = () => {
    const newExperience: WorkExperience = {
      id: 'new',
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrentJob: false,
      description: '',
      location: '',
      technologiesUsed: ''
    };
    setExperiences([...experiences, newExperience]);
  };

  const removeExperience = async (id: string) => {
    if (id === 'new') {
      setExperiences(experiences.filter(exp => exp.id !== id));
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/work-experiences/${id}/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setExperiences(experiences.filter(exp => exp.id !== id));
      toast.success('Work experience removed successfully');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to remove work experience');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: string | boolean) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

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
      // Handle both new and existing work experiences
      const promises = experiences.map(async (experience) => {
        const experienceData = {
          company_name: experience.company,
          role_designation: experience.position,
          start_date: experience.startDate || null,
          end_date: experience.isCurrentJob ? null : experience.endDate || null,
          is_current: experience.isCurrentJob,
          responsibilities: experience.description,
          technologies_used: experience.technologiesUsed
        };

        if (experience.id === 'new') {
          // Create new work experience
          return axios.post(`${API_BASE_URL}/api/work-experiences/`, experienceData, {
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } else {
          // Update existing work experience
          return axios.patch(`${API_BASE_URL}/api/work-experiences/${experience.id}/`, experienceData, {
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
            }
          });
        }
      });

      await Promise.all(promises);
      toast.success('Work experience updated successfully');
      navigate('/candidate/projects');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to update work experience');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const skipStep = () => {
    navigate('/candidate/projects');
  };

  const currentStep = 4;
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

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Work Experience</h1>
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        {experiences.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Add Your Work Experience</h3>
                  <p className="text-gray-600 mb-6">
                    Add your professional experience to showcase your career journey. This section is optional for freshers.
                  </p>
                </div>
                <div className="flex space-x-4 justify-center">
                  <Button onClick={addExperience} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Work Experience
                  </Button>
                  <Button variant="outline" onClick={skipStep}>
                    Skip for Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {experiences.map((experience, index) => (
              <Card key={experience.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle>Experience {index + 1}</CardTitle>
                        <CardDescription>Add your work experience details</CardDescription>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(experience.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`company-${experience.id}`}>Company *</Label>
                      <Input
                        id={`company-${experience.id}`}
                        placeholder="Company name"
                        value={experience.company}
                        onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`position-${experience.id}`}>Position *</Label>
                      <Input
                        id={`position-${experience.id}`}
                        placeholder="Job title"
                        value={experience.position}
                        onChange={(e) => updateExperience(experience.id, 'position', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`location-${experience.id}`}>Location</Label>
                    <Input
                      id={`location-${experience.id}`}
                      placeholder="City, State/Province, Country"
                      value={experience.location}
                      onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`startDate-${experience.id}`}>Start Date *</Label>
                      <Input
                        id={`startDate-${experience.id}`}
                        type="date"
                        value={experience.startDate}
                        onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`endDate-${experience.id}`}>
                        End Date {experience.isCurrentJob ? '(Current Job)' : '*'}
                      </Label>
                      <Input
                        id={`endDate-${experience.id}`}
                        type="date"
                        value={experience.endDate}
                        onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                        disabled={experience.isCurrentJob}
                        required={!experience.isCurrentJob}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`currentJob-${experience.id}`}
                      checked={experience.isCurrentJob}
                      onChange={(e) => {
                        updateExperience(experience.id, 'isCurrentJob', e.target.checked);
                        if (e.target.checked) {
                          updateExperience(experience.id, 'endDate', '');
                        }
                      }}
                      className="rounded"
                    />
                    <Label htmlFor={`currentJob-${experience.id}`}>I currently work here</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`description-${experience.id}`}>Responsibilities & Achievements</Label>
                    <Textarea
                      id={`description-${experience.id}`}
                      placeholder="Describe your responsibilities and achievements..."
                      rows={4}
                      value={experience.description}
                      onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`technologies-${experience.id}`}>Technologies Used</Label>
                    <Input
                      id={`technologies-${experience.id}`}
                      placeholder="e.g., React, Node.js, Python, etc."
                      value={experience.technologiesUsed}
                      onChange={(e) => updateExperience(experience.id, 'technologiesUsed', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addExperience}
              className="w-full border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Experience
            </Button>

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/candidate/education')}
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
                    Saving...
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
        )}
      </div>
    </div>
  );
};

export default WorkExperience;
