
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, X } from 'lucide-react';

interface FilterState {
  jobTitles: string[];
  skills: string[];
  experience: { min: string; max: string };
  education: string[];
  location: string;
  workType: string[];
  employmentType: string[];
  languages: string[];
  availability: string;
  salaryRange: { min: string; max: string };
}

interface RecruiterFiltersProps {
  onFiltersApply: (filters: FilterState) => void;
}

const RecruiterFilters = ({ onFiltersApply }: RecruiterFiltersProps) => {
  const [open, setOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const [filters, setFilters] = useState<FilterState>({
    jobTitles: [],
    skills: [],
    experience: { min: '', max: '' },
    education: [],
    location: '',
    workType: [],
    employmentType: [],
    languages: [],
    availability: '',
    salaryRange: { min: '', max: '' }
  });

  const jobTitles = [
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'DevOps Engineer', 'Data Scientist', 'Product Manager', 'UX/UI Designer',
    'Marketing Manager', 'Sales Representative', 'Business Analyst', 'Project Manager'
  ];

  const skills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes',
    'Machine Learning', 'SQL', 'NoSQL', 'GraphQL', 'TypeScript', 'Java', 'C++',
    'Leadership', 'Communication', 'Problem Solving', 'Team Management'
  ];

  const educationLevels = [
    'High School', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree',
    'MBA', 'PhD', 'Professional Certification'
  ];

  const workTypes = ['Remote', 'On-site', 'Hybrid', 'Willing to Relocate'];
  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Portuguese'];

  const handleSkillToggle = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleJobTitleToggle = (title: string) => {
    setFilters(prev => ({
      ...prev,
      jobTitles: prev.jobTitles.includes(title)
        ? prev.jobTitles.filter(t => t !== title)
        : [...prev.jobTitles, title]
    }));
  };

  const handleEducationToggle = (education: string) => {
    setFilters(prev => ({
      ...prev,
      education: prev.education.includes(education)
        ? prev.education.filter(e => e !== education)
        : [...prev.education, education]
    }));
  };

  const handleWorkTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      workType: prev.workType.includes(type)
        ? prev.workType.filter(t => t !== type)
        : [...prev.workType, type]
    }));
  };

  const handleEmploymentTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      employmentType: prev.employmentType.includes(type)
        ? prev.employmentType.filter(t => t !== type)
        : [...prev.employmentType, type]
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const applyFilters = () => {
    const appliedFilters = [];
    if (filters.jobTitles.length > 0) appliedFilters.push(`${filters.jobTitles.length} Job Titles`);
    if (filters.skills.length > 0) appliedFilters.push(`${filters.skills.length} Skills`);
    if (filters.experience.min || filters.experience.max) appliedFilters.push('Experience Range');
    if (filters.education.length > 0) appliedFilters.push(`${filters.education.length} Education Levels`);
    if (filters.location) appliedFilters.push('Location');
    if (filters.workType.length > 0) appliedFilters.push(`${filters.workType.length} Work Types`);
    if (filters.employmentType.length > 0) appliedFilters.push(`${filters.employmentType.length} Employment Types`);
    if (filters.languages.length > 0) appliedFilters.push(`${filters.languages.length} Languages`);
    if (filters.availability) appliedFilters.push('Availability');
    if (filters.salaryRange.min || filters.salaryRange.max) appliedFilters.push('Salary Range');

    setActiveFilters(appliedFilters);
    onFiltersApply(filters);
    setOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      jobTitles: [],
      skills: [],
      experience: { min: '', max: '' },
      education: [],
      location: '',
      workType: [],
      employmentType: [],
      languages: [],
      availability: '',
      salaryRange: { min: '', max: '' }
    });
    setActiveFilters([]);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-12 relative">
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {activeFilters.length > 0 && (
              <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                {activeFilters.length}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Advanced Filters</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="basics" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="compensation">Compensation</TabsTrigger>
            </TabsList>

            <TabsContent value="basics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Job Titles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {jobTitles.map((title) => (
                      <div key={title} className="flex items-center space-x-2">
                        <Checkbox
                          id={`job-${title}`}
                          checked={filters.jobTitles.includes(title)}
                          onCheckedChange={() => handleJobTitleToggle(title)}
                        />
                        <Label htmlFor={`job-${title}`} className="text-sm cursor-pointer">
                          {title}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Skills & Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {skills.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={filters.skills.includes(skill)}
                          onCheckedChange={() => handleSkillToggle(skill)}
                        />
                        <Label htmlFor={`skill-${skill}`} className="text-sm cursor-pointer">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {educationLevels.map((education) => (
                      <div key={education} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edu-${education}`}
                          checked={filters.education.includes(education)}
                          onCheckedChange={() => handleEducationToggle(education)}
                        />
                        <Label htmlFor={`edu-${education}`} className="text-sm cursor-pointer">
                          {education}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Years of Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="exp-min" className="text-sm">Minimum</Label>
                      <Input
                        id="exp-min"
                        placeholder="0"
                        value={filters.experience.min}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          experience: { ...prev.experience, min: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="exp-max" className="text-sm">Maximum</Label>
                      <Input
                        id="exp-max"
                        placeholder="10+"
                        value={filters.experience.max}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          experience: { ...prev.experience, max: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {languages.map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox
                          id={`lang-${language}`}
                          checked={filters.languages.includes(language)}
                          onCheckedChange={() => handleLanguageToggle(language)}
                        />
                        <Label htmlFor={`lang-${language}`} className="text-sm cursor-pointer">
                          {language}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={filters.availability}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, availability: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="immediate" id="immediate" />
                      <Label htmlFor="immediate">Immediately Available</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2weeks" id="2weeks" />
                      <Label htmlFor="2weeks">2 Weeks Notice</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1month" id="1month" />
                      <Label htmlFor="1month">1 Month Notice</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3months" id="3months" />
                      <Label htmlFor="3months">3+ Months Notice</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="City, State, Country"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Work Arrangement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {workTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`work-${type}`}
                          checked={filters.workType.includes(type)}
                          onCheckedChange={() => handleWorkTypeToggle(type)}
                        />
                        <Label htmlFor={`work-${type}`} className="text-sm cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Employment Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {employmentTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`emp-${type}`}
                          checked={filters.employmentType.includes(type)}
                          onCheckedChange={() => handleEmploymentTypeToggle(type)}
                        />
                        <Label htmlFor={`emp-${type}`} className="text-sm cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compensation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Salary Range (Annual)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="salary-min" className="text-sm">Minimum ($)</Label>
                      <Input
                        id="salary-min"
                        placeholder="50000"
                        value={filters.salaryRange.min}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          salaryRange: { ...prev.salaryRange, min: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="salary-max" className="text-sm">Maximum ($)</Label>
                      <Input
                        id="salary-max"
                        placeholder="150000"
                        value={filters.salaryRange.max}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          salaryRange: { ...prev.salaryRange, max: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
            <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700">
              Apply Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {filter}
              <X className="w-3 h-3 cursor-pointer" onClick={() => {
                const newFilters = activeFilters.filter((_, i) => i !== index);
                setActiveFilters(newFilters);
              }} />
            </Badge>
          ))}
        </div>
      )}
    </>
  );
};

export default RecruiterFilters;
