
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const JobPreferences = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    jobTitle: '',
    preferredLocations: '',
    jobType: '',
    workMode: '',
    expectedSalary: '',
    salaryType: '',
    availability: '',
    skills: '',
    industries: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('candidateJobPreferences', JSON.stringify(preferences));
    navigate('/candidate/portfolio-preview');
  };

  const currentStep = 7;
  const totalSteps = 7;
  const progressValue = (currentStep / totalSteps) * 100;

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
            <h1 className="text-2xl font-bold text-gray-800">Job Preferences</h1>
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle>Job Preferences</CardTitle>
                <CardDescription>Tell us what kind of opportunities you're looking for</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Desired Job Title *</Label>
                <Input
                  id="jobTitle"
                  placeholder="Software Engineer, Data Scientist, etc."
                  value={preferences.jobTitle}
                  onChange={(e) => setPreferences({ ...preferences, jobTitle: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredLocations">Preferred Locations *</Label>
                <Input
                  id="preferredLocations"
                  placeholder="San Francisco, New York, Remote, etc."
                  value={preferences.preferredLocations}
                  onChange={(e) => setPreferences({ ...preferences, preferredLocations: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Job Type *</Label>
                <RadioGroup 
                  value={preferences.jobType} 
                  onValueChange={(value) => setPreferences({ ...preferences, jobType: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full-time" id="full-time" />
                    <Label htmlFor="full-time">Full-time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="part-time" id="part-time" />
                    <Label htmlFor="part-time">Part-time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="contract" id="contract" />
                    <Label htmlFor="contract">Contract</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="internship" id="internship" />
                    <Label htmlFor="internship">Internship</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Work Mode *</Label>
                <RadioGroup 
                  value={preferences.workMode} 
                  onValueChange={(value) => setPreferences({ ...preferences, workMode: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="remote" id="remote" />
                    <Label htmlFor="remote">Remote</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hybrid" id="hybrid" />
                    <Label htmlFor="hybrid">Hybrid</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="onsite" id="onsite" />
                    <Label htmlFor="onsite">On-site</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expectedSalary">Expected Salary</Label>
                  <Input
                    id="expectedSalary"
                    type="number"
                    placeholder="80000"
                    value={preferences.expectedSalary}
                    onChange={(e) => setPreferences({ ...preferences, expectedSalary: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Salary Type</Label>
                  <RadioGroup 
                    value={preferences.salaryType} 
                    onValueChange={(value) => setPreferences({ ...preferences, salaryType: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="annual" id="annual" />
                      <Label htmlFor="annual">Annual</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly">Monthly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hourly" id="hourly" />
                      <Label htmlFor="hourly">Hourly</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Availability *</Label>
                <RadioGroup 
                  value={preferences.availability} 
                  onValueChange={(value) => setPreferences({ ...preferences, availability: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="immediately" id="immediately" />
                    <Label htmlFor="immediately">Available immediately</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2-weeks" id="2-weeks" />
                    <Label htmlFor="2-weeks">2 weeks notice</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-month" id="1-month" />
                    <Label htmlFor="1-month">1 month notice</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2-months" id="2-months" />
                    <Label htmlFor="2-months">2+ months notice</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Key Skills *</Label>
                <Input
                  id="skills"
                  placeholder="JavaScript, React, Python, Machine Learning, etc."
                  value={preferences.skills}
                  onChange={(e) => setPreferences({ ...preferences, skills: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industries">Preferred Industries</Label>
                <Input
                  id="industries"
                  placeholder="Technology, Healthcare, Finance, E-commerce, etc."
                  value={preferences.industries}
                  onChange={(e) => setPreferences({ ...preferences, industries: e.target.value })}
                />
              </div>

              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/candidate/certifications')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Complete Profile
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobPreferences;
