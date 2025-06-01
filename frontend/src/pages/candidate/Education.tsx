import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, GraduationCap, Plus, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isCurrentlyStudying: boolean;
  grade: string;
  description?: string;
}

const Education = () => {
  const navigate = useNavigate();
  const [educations, setEducations] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEducations = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/education/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      const transformedEducation = response.data.map((edu: any) => ({
        id: edu.id.toString(),
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.field_of_study || '',
        startDate: edu.start_date,
        endDate: edu.end_date || '',
        isCurrentlyStudying: !edu.end_date,
        grade: edu.gpa || '',
        description: edu.activities_achievements || ''
      }));

      if (transformedEducation.length === 0) {
        // Initialize with empty education if no data
        setEducations([{
          id: 'new',
          institution: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          isCurrentlyStudying: false,
          grade: '',
          description: ''
        }]);
      } else {
        setEducations(transformedEducation);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to fetch education details');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  const addEducation = () => {
    const newEducation: Education = {
      id: 'new',
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      isCurrentlyStudying: false,
      grade: '',
      description: ''
    };
    setEducations([...educations, newEducation]);
  };

  const removeEducation = async (id: string) => {
    if (id === 'new') {
      setEducations(educations.filter(edu => edu.id !== id));
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/education/${id}/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setEducations(educations.filter(edu => edu.id !== id));
      toast.success('Education entry removed successfully');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to remove education entry');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  const updateEducation = (id: string, field: keyof Education, value: string | boolean) => {
    setEducations(educations.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
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
      // Handle both new and existing education entries
      const promises = educations.map(async (education) => {
        const educationData = {
          institution: education.institution,
          degree: education.degree,
          field_of_study: education.fieldOfStudy,
          start_date: education.startDate,
          end_date: education.isCurrentlyStudying ? null : education.endDate || null,
          gpa: education.grade || null,
          activities_achievements: education.description || null
        };

        if (education.id === 'new') {
          // Create new education entry
          return axios.post(`${API_BASE_URL}/api/education/`, educationData, {
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } else {
          // Update existing education entry
          return axios.patch(`${API_BASE_URL}/api/education/${education.id}/`, educationData, {
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
            }
          });
        }
      });

      await Promise.all(promises);
      toast.success('Education details updated successfully');
      navigate('/candidate/work-experience');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to update education details');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStep = 3;
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
            <h1 className="text-2xl font-bold text-gray-800">Education</h1>
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {educations.map((education, index) => (
            <Card key={education.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>Education {index + 1}</CardTitle>
                      <CardDescription>Add your educational background</CardDescription>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(education.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`institution-${education.id}`}>Institution *</Label>
                    <Input
                      id={`institution-${education.id}`}
                      placeholder="University/College name"
                      value={education.institution}
                      onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`degree-${education.id}`}>Degree *</Label>
                    <Input
                      id={`degree-${education.id}`}
                      placeholder="Bachelor's, Master's, PhD, etc."
                      value={education.degree}
                      onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`fieldOfStudy-${education.id}`}>Field of Study *</Label>
                  <Input
                    id={`fieldOfStudy-${education.id}`}
                    placeholder="Computer Science, Engineering, etc."
                    value={education.fieldOfStudy}
                    onChange={(e) => updateEducation(education.id, 'fieldOfStudy', e.target.value)}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${education.id}`}>Start Date *</Label>
                    <Input
                      id={`startDate-${education.id}`}
                      type="date"
                      value={education.startDate}
                      onChange={(e) => updateEducation(education.id, 'startDate', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${education.id}`}>
                      End Date {education.isCurrentlyStudying ? '(Currently Studying)' : ''}
                    </Label>
                    <Input
                      id={`endDate-${education.id}`}
                      type="date"
                      value={education.endDate}
                      onChange={(e) => updateEducation(education.id, 'endDate', e.target.value)}
                      disabled={education.isCurrentlyStudying}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`grade-${education.id}`}>Grade/CGPA</Label>
                    <Input
                      id={`grade-${education.id}`}
                      placeholder="3.8/4.0 or 85%"
                      value={education.grade}
                      onChange={(e) => updateEducation(education.id, 'grade', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`currentlyStudying-${education.id}`}
                    checked={education.isCurrentlyStudying}
                    onChange={(e) => {
                      updateEducation(education.id, 'isCurrentlyStudying', e.target.checked);
                      if (e.target.checked) {
                        updateEducation(education.id, 'endDate', '');
                      }
                    }}
                    className="rounded"
                  />
                  <Label htmlFor={`currentlyStudying-${education.id}`}>I am currently studying here</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${education.id}`}>Activities & Achievements</Label>
                  <Textarea
                    id={`description-${education.id}`}
                    placeholder="Describe your academic achievements, activities, and relevant coursework..."
                    value={education.description}
                    onChange={(e) => updateEducation(education.id, 'description', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addEducation}
            className="w-full border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Education
          </Button>

          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/candidate/basic-info')}
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
      </div>
    </div>
  );
};

export default Education;
