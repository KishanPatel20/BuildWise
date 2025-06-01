import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Filter, X, Upload } from 'lucide-react';
import { RecruiterSearchFilters, GroqProcessedFilters } from '@/types/recruiter';
import { processFiltersWithGroq } from '@/services/groqService';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface ExtensiveFiltersProps {
  onFiltersApply: (filters: RecruiterSearchFilters) => void;
}

// Helper type for nested paths
type NestedKeyOf<T> = {
  [K in keyof T]: T[K] extends object
    ? `${K & string}.${NestedKeyOf<T[K]> & string}`
    : K;
}[keyof T];

// Helper type for getting nested value type
type NestedValueType<T, P extends string> = P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? NestedValueType<T[K], R>
    : never
  : P extends keyof T
  ? T[P]
  : never;

// Simplified type for filter updates
type FilterUpdate<T extends keyof RecruiterSearchFilters> = {
  category: T;
  subCategory: keyof RecruiterSearchFilters[T];
  value: unknown;
};

// Add types for request/response logging
interface FilterRequestLog {
  id: string;
  timestamp: Date;
  request: {
    filters: RecruiterSearchFilters;
    jobDescription?: string;
  };
  response?: GroqProcessedFilters;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  processingSteps: {
    step: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
    timestamp: Date;
  }[];
}

const ExtensiveFilters = ({ onFiltersApply }: ExtensiveFiltersProps) => {
  const [open, setOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [jobDescription, setJobDescription] = useState('');
  
  const [filters, setFilters] = useState<RecruiterSearchFilters>({
    location: {
      country: '',
      state: '',
      city: '',
      remote: false,
      hybrid: false,
      onsite: false,
      willingToRelocate: false
    },
    experience: {
      overallExperience: { min: 0, max: 20 },
      domainExperience: { min: 0, max: 15 },
      currentRoleExperience: { min: 0, max: 10 },
      averageTenure: { min: 0, max: 5 }
    },
    technicalSkills: {
      programmingLanguages: [],
      frameworks: [],
      databases: [],
      cloudPlatforms: [],
      devOpsTools: [],
      aiMlTools: [],
      otherTechnologies: []
    },
    domain: {
      primaryDomain: [],
      subDomains: [],
      industryExperience: [],
      preferredIndustries: []
    },
    company: {
      currentCompany: {
        type: [],
        size: { min: 0, max: 10000 }
      },
      pastCompanies: {
        minExperience: 0,
        preferredCompanies: [],
        excludeCompanies: []
      }
    },
    education: {
      degree: [],
      fieldOfStudy: [],
      minimumEducation: '',
      certifications: [],
      preferredInstitutions: []
    },
    role: {
      jobTitle: [],
      seniorityLevel: [],
      roleType: [],
      department: [],
      reportingTo: [],
      teamSize: { min: 0, max: 100 }
    },
    compensation: {
      salary: { min: 50000, max: 200000, currency: 'USD' },
      equity: false,
      bonus: { min: 0, max: 50000 },
      benefits: []
    },
    availability: {
      noticePeriod: { min: 0, max: 90 },
      startDate: '',
      availability: '',
      timezone: []
    },
    softSkills: {
      communication: [],
      leadership: [],
      problemSolving: [],
      teamwork: [],
      otherSkills: []
    },
    projects: {
      projectTypes: [],
      projectScale: [],
      teamSize: { min: 0, max: 50 },
      technologies: []
    },
    preferences: {
      matchScore: { min: 70, max: 100 },
      excludeContacted: false,
      excludeRejected: false,
      excludeShortlisted: false,
      activeInLastDays: 30
    }
  });

  // Helper function to handle nested state updates
  const updateNestedState = <T extends keyof RecruiterSearchFilters>(
    category: T,
    subCategory: keyof RecruiterSearchFilters[T],
    value: unknown
  ) => {
    setFilters(prev => {
      const newState = { ...prev };
      const categoryState = newState[category] as { [key: string]: unknown };
      categoryState[subCategory as string] = value;
      return newState;
    });
  };

  // Helper function to handle range updates (min/max objects)
  const updateRangeValue = <T extends keyof RecruiterSearchFilters>(
    category: T,
    subCategory: keyof RecruiterSearchFilters[T],
    value: [number, number]
  ) => {
    setFilters(prev => {
      const newState = { ...prev };
      const categoryState = newState[category] as { [key: string]: unknown };
      const rangeState = categoryState[subCategory as string] as { min: number; max: number };
      rangeState.min = value[0];
      rangeState.max = value[1];
      return newState;
    });
  };

  // Helper function to handle array updates
  const handleArrayToggle = <T extends keyof RecruiterSearchFilters>(
    category: T,
    subCategory: keyof RecruiterSearchFilters[T],
    item: string
  ) => {
    setFilters(prev => {
      const newState = { ...prev };
      const categoryState = newState[category] as { [key: string]: unknown };
      const currentArray = categoryState[subCategory as string] as string[];
      categoryState[subCategory as string] = currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item];
      return newState;
    });
  };

  // Helper function to handle boolean updates
  const handleBooleanToggle = <T extends keyof RecruiterSearchFilters>(
    category: T,
    subCategory: keyof RecruiterSearchFilters[T],
    value: boolean
  ) => {
    setFilters(prev => {
      const newState = { ...prev };
      const categoryState = newState[category] as { [key: string]: unknown };
      categoryState[subCategory as string] = value;
      return newState;
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setJobDescription(content);
      };
      reader.readAsText(file);
    }
  };

  const applyFilters = () => {
    try {
      // Create a summary of applied filters
      const appliedFilters = [];
      if (filters.role.jobTitle.length > 0) appliedFilters.push(`${filters.role.jobTitle.length} Job Titles`);
      if (filters.technicalSkills.programmingLanguages.length > 0) appliedFilters.push(`${filters.technicalSkills.programmingLanguages.length} Languages`);
      if (filters.experience.overallExperience.min > 0 || filters.experience.overallExperience.max < 20) appliedFilters.push('Experience Range');
      if (filters.domain.industryExperience.length > 0) appliedFilters.push(`${filters.domain.industryExperience.length} Industries`);

      setActiveFilters(appliedFilters);
      onFiltersApply(filters);
      
      setOpen(false);
      toast.success('Filters applied successfully');
    } catch (error) {
      console.error('Error applying filters:', error);
      toast.error('Failed to apply filters. Please try again.');
    }
  };

  const jobTitles = [
    'Machine Learning Engineer', 'Data Scientist', 'AI Researcher', 'NLP Specialist',
    'Computer Vision Engineer', 'Prompt Engineer', 'MLOps Engineer', 'AI Product Manager',
    'Robotics Engineer', 'Deep Learning Scientist', 'AI Architect', 'AI/ML Lead',
    'Applied Scientist', 'Ethical AI Specialist', 'Quantum AI Engineer'
  ];

  const seniorityLevels = [
    'Entry-Level', 'Junior', 'Mid-Level', 'Senior', 'Lead', 'Principal',
    'Staff', 'Architect', 'Manager', 'Director', 'VP', 'CTO/Head of AI'
  ];

  const programmingLanguages = [
    'Python', 'R', 'Java', 'C++', 'Scala', 'Go', 'Julia', 'Rust',
    'JavaScript', 'TypeScript', 'SQL', 'MATLAB', 'Bash', 'Ruby', 'PHP'
  ];

  const mlFrameworks = [
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'MXNet', 'JAX',
    'Hugging Face Transformers', 'Fast.ai', 'Optuna', 'Ray', 'Caffe', 'Theano'
  ];

  const deepLearningSpecifics = [
    'CNNs', 'RNNs', 'LSTMs', 'GANs', 'Transformers', 'Diffusion Models',
    'Reinforcement Learning', 'Graph Neural Networks', 'AutoML', 'Transfer Learning',
    'Federated Learning', 'Adversarial Networks'
  ];

  const generativeAI = [
    'LangChain', 'LlamaIndex', 'OpenAI API', 'Anthropic API', 'Google AI Studio/Gemini API',
    'Cohere', 'Pinecone', 'Weaviate', 'Milvus', 'Qdrant', 'Fine-tuning LLMs',
    'Prompt Engineering', 'RAG (Retrieval Augmented Generation)', 'Agentic AI',
    'Multimodal AI', 'Explainable AI (XAI) for LLMs'
  ];

  const dataScienceTools = [
    'Pandas', 'NumPy', 'SciPy', 'Dask', 'Spark (PySpark/Scala Spark)', 'Polars',
    'Tableau', 'Power BI', 'Looker', 'Jupyter', 'Zeppelin', 'RStudio', 'SAS', 'SPSS'
  ];

  const cloudPlatforms = [
    'AWS', 'Azure', 'GCP', 'Alibaba Cloud', 'IBM Cloud', 'Oracle Cloud'
  ];

  const industryExperience = [
    'FinTech', 'Healthcare', 'E-commerce', 'Autonomous Vehicles', 'Robotics',
    'Gaming', 'SaaS', 'Manufacturing', 'Aerospace', 'Education', 'Biotech',
    'Cybersecurity', 'Telecommunications', 'Media & Entertainment', 'Government', 'Retail'
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-12 relative">
            <Filter className="w-4 h-4 mr-2" />
            Extensive Filters
            {activeFilters.length > 0 && (
              <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                {activeFilters.length}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Extensive AI-Powered Filters</DialogTitle>
          </DialogHeader>
          
          {/* Job Description Upload */}
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Upload Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Input
                    type="file"
                    accept=".txt,.doc,.docx,.pdf"
                    onChange={handleFileUpload}
                    className="flex-1"
                  />
                  {jobDescription && (
                    <Button variant="outline" size="sm" onClick={() => setJobDescription('')}>
                      <X className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  )}
                </div>
                {jobDescription && (
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Or paste job description here..."
                    className="mt-4 h-32"
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="role-experience" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="role-experience">Role & Experience</TabsTrigger>
              <TabsTrigger value="technical-skills">Technical Skills</TabsTrigger>
              <TabsTrigger value="soft-skills">Soft Skills</TabsTrigger>
              <TabsTrigger value="background">Background</TabsTrigger>
              <TabsTrigger value="refinement">Refinement</TabsTrigger>
            </TabsList>

            <TabsContent value="role-experience" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Job Title/Role Type</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                      {jobTitles.map((title) => (
                        <div key={title} className="flex items-center space-x-2">
                          <Checkbox
                            id={`job-${title}`}
                            checked={filters.role.jobTitle.includes(title)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleArrayToggle('role', 'jobTitle', title);
                              } else {
                                handleArrayToggle('role', 'jobTitle', title);
                              }
                            }}
                          />
                          <Label htmlFor={`job-${title}`} className="text-xs cursor-pointer">
                            {title}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Seniority Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                      {seniorityLevels.map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox
                            id={`seniority-${level}`}
                            checked={filters.role.seniorityLevel.includes(level)}
                            onCheckedChange={(checked) => handleArrayToggle('role', 'seniorityLevel', level)}
                          />
                          <Label htmlFor={`seniority-${level}`} className="text-xs cursor-pointer">
                            {level}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Years of Experience</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-xs">Overall Experience: {filters.experience.overallExperience.min}-{filters.experience.overallExperience.max} years</Label>
                      <Slider
                        value={[filters.experience.overallExperience.min, filters.experience.overallExperience.max]}
                        onValueChange={(value) => updateRangeValue('experience', 'overallExperience', value as [number, number])}
                        max={25}
                        step={1}
                        className="w-full mt-2"
                        data-radix-collection-item
                      />
                    </div>
                    <div>
                      <Label className="text-xs">AI/ML Specific: {filters.experience.domainExperience.min}-{filters.experience.domainExperience.max} years</Label>
                      <Slider
                        value={[filters.experience.domainExperience.min, filters.experience.domainExperience.max]}
                        onValueChange={(value) => updateRangeValue('experience', 'domainExperience', value as [number, number])}
                        max={20}
                        step={1}
                        className="w-full mt-2"
                        data-radix-collection-item
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Leadership & Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="team-management"
                        checked={filters.role.roleType.includes('Manager')}
                        onCheckedChange={(checked) => handleArrayToggle('role', 'roleType', 'Manager')}
                      />
                      <Label htmlFor="team-management" className="text-xs">Has managed a team</Label>
                    </div>
                    {filters.role.roleType.includes('Manager') && (
                      <div>
                        <Label className="text-xs">Team Size: {filters.role.teamSize.min}-{filters.role.teamSize.max} people</Label>
                        <Slider
                          value={[filters.role.teamSize.min, filters.role.teamSize.max]}
                          onValueChange={(value) => updateRangeValue('role', 'teamSize', value as [number, number])}
                          max={100}
                          step={1}
                          className="w-full mt-2"
                          data-radix-collection-item
                        />
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="project-leadership"
                        checked={filters.role.roleType.includes('Lead')}
                        onCheckedChange={(checked) => handleArrayToggle('role', 'roleType', 'Lead')}
                      />
                      <Label htmlFor="project-leadership" className="text-xs">Led end-to-end projects</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="technical-skills" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Programming Languages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                      {programmingLanguages.map((lang) => (
                        <div key={lang} className="flex items-center space-x-2">
                          <Checkbox
                            id={`lang-${lang}`}
                            checked={filters.technicalSkills.programmingLanguages.includes(lang)}
                            onCheckedChange={(checked) => handleArrayToggle('technicalSkills', 'programmingLanguages', lang)}
                          />
                          <Label htmlFor={`lang-${lang}`} className="text-xs cursor-pointer">
                            {lang}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">ML Frameworks/Libraries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                      {mlFrameworks.map((framework) => (
                        <div key={framework} className="flex items-center space-x-2">
                          <Checkbox
                            id={`framework-${framework}`}
                            checked={filters.technicalSkills.frameworks.includes(framework)}
                            onCheckedChange={(checked) => handleArrayToggle('technicalSkills', 'frameworks', framework)}
                          />
                          <Label htmlFor={`framework-${framework}`} className="text-xs cursor-pointer">
                            {framework}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Deep Learning Specifics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                      {deepLearningSpecifics.map((dl) => (
                        <div key={dl} className="flex items-center space-x-2">
                          <Checkbox
                            id={`dl-${dl}`}
                            checked={filters.technicalSkills.otherTechnologies.includes(dl)}
                            onCheckedChange={(checked) => handleArrayToggle('technicalSkills', 'otherTechnologies', dl)}
                          />
                          <Label htmlFor={`dl-${dl}`} className="text-xs cursor-pointer">
                            {dl}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Generative AI/LLM Specifics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                      {generativeAI.map((ai) => (
                        <div key={ai} className="flex items-center space-x-2">
                          <Checkbox
                            id={`ai-${ai}`}
                            checked={filters.technicalSkills.aiMlTools.includes(ai)}
                            onCheckedChange={(checked) => handleArrayToggle('technicalSkills', 'aiMlTools', ai)}
                          />
                          <Label htmlFor={`ai-${ai}`} className="text-xs cursor-pointer">
                            {ai}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Data Science & Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                      {dataScienceTools.map((tool) => (
                        <div key={tool} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tool-${tool}`}
                            checked={filters.technicalSkills.devOpsTools.includes(tool)}
                            onCheckedChange={(checked) => handleArrayToggle('technicalSkills', 'devOpsTools', tool)}
                          />
                          <Label htmlFor={`tool-${tool}`} className="text-xs cursor-pointer">
                            {tool}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Cloud Platforms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2">
                      {cloudPlatforms.map((platform) => (
                        <div key={platform} className="flex items-center space-x-2">
                          <Checkbox
                            id={`cloud-${platform}`}
                            checked={filters.technicalSkills.cloudPlatforms.includes(platform)}
                            onCheckedChange={(checked) => handleArrayToggle('technicalSkills', 'cloudPlatforms', platform)}
                          />
                          <Label htmlFor={`cloud-${platform}`} className="text-xs cursor-pointer">
                            {platform}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="soft-skills" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Communication Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {['Written Documentation', 'Verbal Presentations', 'Stakeholder Management', 'Cross-functional Communication'].map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={`comm-${skill}`}
                            checked={filters.softSkills.communication.includes(skill)}
                            onCheckedChange={(checked) => handleArrayToggle('softSkills', 'communication', skill)}
                          />
                          <Label htmlFor={`comm-${skill}`} className="text-xs cursor-pointer">
                            {skill}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Problem-Solving & Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="analytical-skills"
                        checked={filters.softSkills.problemSolving.includes('Strong Analytical Skills')}
                        onCheckedChange={(checked) => handleArrayToggle('softSkills', 'problemSolving', 'Strong Analytical Skills')}
                      />
                      <Label htmlFor="analytical-skills" className="text-xs">Strong Analytical Skills</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cross-functional"
                        checked={filters.softSkills.problemSolving.includes('Cross-functional Team Experience')}
                        onCheckedChange={(checked) => handleArrayToggle('softSkills', 'problemSolving', 'Cross-functional Team Experience')}
                      />
                      <Label htmlFor="cross-functional" className="text-xs">Cross-functional Team Experience</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="background" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Employment Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {['Employed Full-time', 'Employed Part-time', 'Unemployed', 'Freelancer/Contractor', 'Student'].map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={`emp-${status}`}
                            checked={filters.role.roleType.includes(status)}
                            onCheckedChange={(checked) => handleArrayToggle('role', 'roleType', status)}
                          />
                          <Label htmlFor={`emp-${status}`} className="text-xs cursor-pointer">
                            {status}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Location & Work Model</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Country"
                      value={filters.location.country}
                      onChange={(e) => updateNestedState('location', 'country', e.target.value)}
                    />
                    <Input
                      placeholder="State/Province"
                      value={filters.location.state}
                      onChange={(e) => updateNestedState('location', 'state', e.target.value)}
                    />
                    <Input
                      placeholder="City"
                      value={filters.location.city}
                      onChange={(e) => updateNestedState('location', 'city', e.target.value)}
                    />
                    <RadioGroup
                      value={filters.location.remote ? 'Remote' : filters.location.hybrid ? 'Hybrid' : 'On-site'}
                      onValueChange={(value) => updateNestedState('location', 'remote', value === 'Remote')}
                    >
                      {['Remote', 'Hybrid', 'On-site'].map((model) => (
                        <div key={model} className="flex items-center space-x-2">
                          <RadioGroupItem value={model} id={`work-${model}`} />
                          <Label htmlFor={`work-${model}`} className="text-xs">{model}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Industry Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                      {industryExperience.map((industry) => (
                        <div key={industry} className="flex items-center space-x-2">
                          <Checkbox
                            id={`industry-${industry}`}
                            checked={filters.domain.industryExperience.includes(industry)}
                            onCheckedChange={(checked) => handleArrayToggle('domain', 'industryExperience', industry)}
                          />
                          <Label htmlFor={`industry-${industry}`} className="text-xs cursor-pointer">
                            {industry}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="refinement" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Match Score Range</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label className="text-xs">Match Score: {filters.preferences.matchScore.min}% - {filters.preferences.matchScore.max}%</Label>
                      <Slider
                        value={[filters.preferences.matchScore.min, filters.preferences.matchScore.max]}
                        onValueChange={(value) => updateRangeValue('preferences', 'matchScore', value as [number, number])}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full mt-2"
                        data-radix-collection-item
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Salary Expectation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label className="text-xs">Salary Range: ${filters.compensation.salary.min.toLocaleString()} - ${filters.compensation.salary.max.toLocaleString()}</Label>
                      <Slider
                        value={[filters.compensation.salary.min, filters.compensation.salary.max]}
                        onValueChange={(value) => updateRangeValue('compensation', 'salary', value as [number, number])}
                        min={30000}
                        max={500000}
                        step={10000}
                        className="w-full mt-2"
                        data-radix-collection-item
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Notice Period</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label className="text-xs">Notice Period: {filters.availability.noticePeriod.min} - {filters.availability.noticePeriod.max} days</Label>
                      <Slider
                        value={[filters.availability.noticePeriod.min, filters.availability.noticePeriod.max]}
                        onValueChange={(value) => updateRangeValue('availability', 'noticePeriod', value as [number, number])}
                        min={0}
                        max={120}
                        step={7}
                        className="w-full mt-2"
                        data-radix-collection-item
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Contact History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="exclude-contacted"
                        checked={filters.preferences.excludeContacted}
                        onCheckedChange={(checked) => handleBooleanToggle('preferences', 'excludeContacted', !!checked)}
                      />
                      <Label htmlFor="exclude-contacted" className="text-xs">Exclude previously contacted candidates</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setFilters({
                location: {
                  country: '',
                  state: '',
                  city: '',
                  remote: false,
                  hybrid: false,
                  onsite: false,
                  willingToRelocate: false
                },
                experience: {
                  overallExperience: { min: 0, max: 20 },
                  domainExperience: { min: 0, max: 15 },
                  currentRoleExperience: { min: 0, max: 10 },
                  averageTenure: { min: 0, max: 5 }
                },
                technicalSkills: {
                  programmingLanguages: [],
                  frameworks: [],
                  databases: [],
                  cloudPlatforms: [],
                  devOpsTools: [],
                  aiMlTools: [],
                  otherTechnologies: []
                },
                domain: {
                  primaryDomain: [],
                  subDomains: [],
                  industryExperience: [],
                  preferredIndustries: []
                },
                company: {
                  currentCompany: {
                    type: [],
                    size: { min: 0, max: 10000 }
                  },
                  pastCompanies: {
                    minExperience: 0,
                    preferredCompanies: [],
                    excludeCompanies: []
                  }
                },
                education: {
                  degree: [],
                  fieldOfStudy: [],
                  minimumEducation: '',
                  certifications: [],
                  preferredInstitutions: []
                },
                role: {
                  jobTitle: [],
                  seniorityLevel: [],
                  roleType: [],
                  department: [],
                  reportingTo: [],
                  teamSize: { min: 0, max: 100 }
                },
                compensation: {
                  salary: { min: 50000, max: 200000, currency: 'USD' },
                  equity: false,
                  bonus: { min: 0, max: 50000 },
                  benefits: []
                },
                availability: {
                  noticePeriod: { min: 0, max: 90 },
                  startDate: '',
                  availability: '',
                  timezone: []
                },
                softSkills: {
                  communication: [],
                  leadership: [],
                  problemSolving: [],
                  teamwork: [],
                  otherSkills: []
                },
                projects: {
                  projectTypes: [],
                  projectScale: [],
                  teamSize: { min: 0, max: 50 },
                  technologies: []
                },
                preferences: {
                  matchScore: { min: 70, max: 100 },
                  excludeContacted: false,
                  excludeRejected: false,
                  excludeShortlisted: false,
                  activeInLastDays: 30
                }
              });
              setActiveFilters([]);
              setJobDescription('');
            }}>
              Clear All Filters
            </Button>
            <Button 
              onClick={applyFilters} 
              className="bg-blue-600 hover:bg-blue-700"
            >
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

export default ExtensiveFilters;
