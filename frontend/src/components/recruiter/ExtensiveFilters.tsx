
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
import { Filter, X } from 'lucide-react';

interface ExtensiveFiltersProps {
  onFiltersApply: (filters: any) => void;
}

const ExtensiveFilters = ({ onFiltersApply }: ExtensiveFiltersProps) => {
  const [open, setOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const [filters, setFilters] = useState({
    // Role & Experience
    jobTitles: [] as string[],
    customTitle: '',
    seniorityLevel: [] as string[],
    overallExperience: [0, 20],
    aiMlExperience: [0, 15],
    teamManagement: false,
    teamSize: [0, 50],
    projectLeadership: false,
    projectsLed: [0, 20],
    
    // Technical Skills
    programmingLanguages: [] as string[],
    mlFrameworks: [] as string[],
    deepLearningSpecifics: [] as string[],
    generativeAI: [] as string[],
    dataScienceTools: [] as string[],
    cloudPlatforms: [] as string[],
    bigDataTech: [] as string[],
    databases: [] as string[],
    mlopsDevops: [] as string[],
    
    // Non-Technical Skills
    communicationSkills: [] as string[],
    projectManagement: [] as string[],
    analyticalSkills: false,
    crossFunctionalTeams: false,
    
    // Background
    employmentStatus: [] as string[],
    availability: '',
    noticePeriod: [0, 90],
    workAuthorization: [] as string[],
    location: { country: '', state: '', city: '' },
    workModel: '',
    willingToRelocate: false,
    industryExperience: [] as string[],
    companySize: [] as string[],
    educationLevel: [] as string[],
    fieldOfStudy: [] as string[],
    certifications: [] as string[],
    languages: [] as string[],
    
    // Search Refinement
    matchScoreRange: [70, 100],
    salaryRange: [50000, 200000],
    excludeContacted: false
  });

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

  const handleMultiSelectToggle = (category: keyof typeof filters, item: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: (prev[category] as string[]).includes(item)
        ? (prev[category] as string[]).filter((i: string) => i !== item)
        : [...(prev[category] as string[]), item]
    }));
  };

  const applyFilters = () => {
    const appliedFilters = [];
    if (filters.jobTitles.length > 0) appliedFilters.push(`${filters.jobTitles.length} Job Titles`);
    if (filters.programmingLanguages.length > 0) appliedFilters.push(`${filters.programmingLanguages.length} Languages`);
    if (filters.mlFrameworks.length > 0) appliedFilters.push(`${filters.mlFrameworks.length} ML Frameworks`);
    if (filters.overallExperience[0] > 0 || filters.overallExperience[1] < 20) appliedFilters.push('Experience Range');
    if (filters.industryExperience.length > 0) appliedFilters.push(`${filters.industryExperience.length} Industries`);

    setActiveFilters(appliedFilters);
    onFiltersApply(filters);
    setOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      jobTitles: [],
      customTitle: '',
      seniorityLevel: [],
      overallExperience: [0, 20],
      aiMlExperience: [0, 15],
      teamManagement: false,
      teamSize: [0, 50],
      projectLeadership: false,
      projectsLed: [0, 20],
      programmingLanguages: [],
      mlFrameworks: [],
      deepLearningSpecifics: [],
      generativeAI: [],
      dataScienceTools: [],
      cloudPlatforms: [],
      bigDataTech: [],
      databases: [],
      mlopsDevops: [],
      communicationSkills: [],
      projectManagement: [],
      analyticalSkills: false,
      crossFunctionalTeams: false,
      employmentStatus: [],
      availability: '',
      noticePeriod: [0, 90],
      workAuthorization: [],
      location: { country: '', state: '', city: '' },
      workModel: '',
      willingToRelocate: false,
      industryExperience: [],
      companySize: [],
      educationLevel: [],
      fieldOfStudy: [],
      certifications: [],
      languages: [],
      matchScoreRange: [70, 100],
      salaryRange: [50000, 200000],
      excludeContacted: false
    });
    setActiveFilters([]);
  };

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
                            checked={filters.jobTitles.includes(title)}
                            onCheckedChange={() => handleMultiSelectToggle('jobTitles', title)}
                          />
                          <Label htmlFor={`job-${title}`} className="text-xs cursor-pointer">
                            {title}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <Input
                      placeholder="Custom job title"
                      value={filters.customTitle}
                      onChange={(e) => setFilters(prev => ({ ...prev, customTitle: e.target.value }))}
                    />
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
                            checked={filters.seniorityLevel.includes(level)}
                            onCheckedChange={() => handleMultiSelectToggle('seniorityLevel', level)}
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
                      <Label className="text-xs">Overall Experience: {filters.overallExperience[0]}-{filters.overallExperience[1]} years</Label>
                      <Slider
                        value={filters.overallExperience}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, overallExperience: value }))}
                        max={25}
                        step={1}
                        className="w-full mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">AI/ML Specific: {filters.aiMlExperience[0]}-{filters.aiMlExperience[1]} years</Label>
                      <Slider
                        value={filters.aiMlExperience}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, aiMlExperience: value }))}
                        max={20}
                        step={1}
                        className="w-full mt-2"
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
                        checked={filters.teamManagement}
                        onCheckedChange={(checked) => setFilters(prev => ({ ...prev, teamManagement: !!checked }))}
                      />
                      <Label htmlFor="team-management" className="text-xs">Has managed a team</Label>
                    </div>
                    {filters.teamManagement && (
                      <div>
                        <Label className="text-xs">Team Size: {filters.teamSize[0]}-{filters.teamSize[1]} people</Label>
                        <Slider
                          value={filters.teamSize}
                          onValueChange={(value) => setFilters(prev => ({ ...prev, teamSize: value }))}
                          max={100}
                          step={1}
                          className="w-full mt-2"
                        />
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="project-leadership"
                        checked={filters.projectLeadership}
                        onCheckedChange={(checked) => setFilters(prev => ({ ...prev, projectLeadership: !!checked }))}
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
                            checked={filters.programmingLanguages.includes(lang)}
                            onCheckedChange={() => handleMultiSelectToggle('programmingLanguages', lang)}
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
                            checked={filters.mlFrameworks.includes(framework)}
                            onCheckedChange={() => handleMultiSelectToggle('mlFrameworks', framework)}
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
                            checked={filters.deepLearningSpecifics.includes(dl)}
                            onCheckedChange={() => handleMultiSelectToggle('deepLearningSpecifics', dl)}
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
                            checked={filters.generativeAI.includes(ai)}
                            onCheckedChange={() => handleMultiSelectToggle('generativeAI', ai)}
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
                            checked={filters.dataScienceTools.includes(tool)}
                            onCheckedChange={() => handleMultiSelectToggle('dataScienceTools', tool)}
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
                            checked={filters.cloudPlatforms.includes(platform)}
                            onCheckedChange={() => handleMultiSelectToggle('cloudPlatforms', platform)}
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
                            checked={filters.communicationSkills.includes(skill)}
                            onCheckedChange={() => handleMultiSelectToggle('communicationSkills', skill)}
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
                        checked={filters.analyticalSkills}
                        onCheckedChange={(checked) => setFilters(prev => ({ ...prev, analyticalSkills: !!checked }))}
                      />
                      <Label htmlFor="analytical-skills" className="text-xs">Strong Analytical Skills</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cross-functional"
                        checked={filters.crossFunctionalTeams}
                        onCheckedChange={(checked) => setFilters(prev => ({ ...prev, crossFunctionalTeams: !!checked }))}
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
                            checked={filters.employmentStatus.includes(status)}
                            onCheckedChange={() => handleMultiSelectToggle('employmentStatus', status)}
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
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, country: e.target.value } 
                      }))}
                    />
                    <Input
                      placeholder="State/Province"
                      value={filters.location.state}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, state: e.target.value } 
                      }))}
                    />
                    <Input
                      placeholder="City"
                      value={filters.location.city}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, city: e.target.value } 
                      }))}
                    />
                    <RadioGroup
                      value={filters.workModel}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, workModel: value }))}
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
                            checked={filters.industryExperience.includes(industry)}
                            onCheckedChange={() => handleMultiSelectToggle('industryExperience', industry)}
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
                      <Label className="text-xs">Match Score: {filters.matchScoreRange[0]}% - {filters.matchScoreRange[1]}%</Label>
                      <Slider
                        value={filters.matchScoreRange}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, matchScoreRange: value }))}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full mt-2"
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
                      <Label className="text-xs">Salary Range: ${filters.salaryRange[0].toLocaleString()} - ${filters.salaryRange[1].toLocaleString()}</Label>
                      <Slider
                        value={filters.salaryRange}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, salaryRange: value }))}
                        min={30000}
                        max={500000}
                        step={10000}
                        className="w-full mt-2"
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
                      <Label className="text-xs">Notice Period: {filters.noticePeriod[0]} - {filters.noticePeriod[1]} days</Label>
                      <Slider
                        value={filters.noticePeriod}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, noticePeriod: value }))}
                        min={0}
                        max={120}
                        step={7}
                        className="w-full mt-2"
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
                        checked={filters.excludeContacted}
                        onCheckedChange={(checked) => setFilters(prev => ({ ...prev, excludeContacted: !!checked }))}
                      />
                      <Label htmlFor="exclude-contacted" className="text-xs">Exclude previously contacted candidates</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
            <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700">
              Apply Extensive Filters
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
