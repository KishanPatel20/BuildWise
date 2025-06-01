import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { Search, Upload, MessageSquare, Star, MapPin, Calendar, Briefcase, BarChart3, Brain, Menu, Settings, LogOut, ChevronDown, Plus, X, Users, Target, Clock, Heart, Phone, Mail, UserCheck, ChevronUp, Bell, HelpCircle, Sparkles, Grip } from 'lucide-react';
import AnalyticsDashboard from '@/components/recruiter/AnalyticsDashboard';
import PreScreeningSystem from '@/components/recruiter/candidate-ranking/PreScreeningSystem';
import PersonalizedOutreach from '@/components/recruiter/candidate-ranking/PersonalizedOutreach';
import WorkflowManagement from '@/components/recruiter/candidate-ranking/WorkflowManagement';
import ResumeParser from '@/components/recruiter/ai-tools/ResumeParser';
import SkillAssessment from '@/components/recruiter/ai-tools/SkillAssessment';
import InterviewQuestions from '@/components/recruiter/ai-tools/InterviewQuestions';
import BiasDetection from '@/components/recruiter/ai-tools/BiasDetection';
import ExtensiveFilters from '@/components/recruiter/ExtensiveFilters';
import AIPoweredRanking from '@/components/recruiter/AIPoweredRanking';
import CandidateCard from '@/components/recruiter/CandidateCard';
import CandidateSortOptions from '@/components/recruiter/CandidateSortOptions';

const RecruiterDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [workflowsOpen, setWorkflowsOpen] = useState(true);
  const [filteredCandidates, setFilteredCandidates] = useState<any[]>([]);
  const [shortlistedCandidates, setShortlistedCandidates] = useState<string[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('matchScore');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const [workflows] = useState([
    { id: '1', name: 'Frontend Developer Hiring', stage: 'Screening', candidates: 12, activeCount: 3, totalCount: 12, progress: 25 },
    { id: '2', name: 'Backend Engineer Pipeline', stage: 'Interview', candidates: 8, activeCount: 5, totalCount: 8, progress: 60 },
    { id: '3', name: 'Product Manager Search', stage: 'Offer', candidates: 3, activeCount: 2, totalCount: 3, progress: 85 },
    { id: '4', name: 'UX Designer Outreach', stage: 'Sourcing', candidates: 15, activeCount: 0, totalCount: 15, progress: 10 },
  ]);

  const [mockCandidates] = useState([
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Senior Frontend Developer',
      title: 'Senior Frontend Developer',
      experience: '5 years',
      location: 'San Francisco, CA',
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Docker'],
      topMatchedSkills: ['React', 'TypeScript', 'GraphQL'],
      skillGaps: ['Kubernetes'],
      score: 95,
      matchScore: 95,
      avatar: '/placeholder.svg',
      summary: 'Experienced frontend developer with expertise in React ecosystem and modern web technologies.',
      aiInsight: 'Perfect fit for senior role requiring both technical depth and leadership experience',
      email: 'sarah.chen@email.com',
      phone: '+1 (555) 123-4567',
      status: 'new' as const,
      company: 'TechCorp Inc.',
      education: 'BS Computer Science, Stanford',
      source: 'LinkedIn',
      appliedDate: '2024-01-15',
      availability: 'Immediately',
      seniorityLevel: 'Senior',
      lastContact: undefined,
      matchReasons: [
        'Strong React and TypeScript expertise matching role requirements',
        'Leadership experience managing frontend teams',
        'Modern tech stack experience with GraphQL and AWS'
      ],
      considerations: [
        'Limited Kubernetes experience for DevOps requirements'
      ],
      projects: [
        {
          name: 'E-commerce Platform Redesign',
          description: 'Led frontend rebuild using React and TypeScript, improving performance by 40%',
          technologies: ['React', 'TypeScript', 'Redux', 'Webpack']
        }
      ]
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      role: 'Full Stack Engineer',
      title: 'Full Stack Engineer',
      experience: '4 years',
      location: 'Austin, TX',
      skills: ['React', 'Python', 'PostgreSQL', 'AWS', 'Kubernetes'],
      topMatchedSkills: ['React', 'Python', 'AWS'],
      skillGaps: ['GraphQL', 'TypeScript'],
      score: 92,
      matchScore: 92,
      avatar: '/placeholder.svg',
      summary: 'Full-stack engineer with strong background in modern web applications and cloud infrastructure.',
      aiInsight: 'Strong full-stack capability with excellent cloud infrastructure experience',
      email: 'michael.r@email.com',
      phone: '+1 (555) 234-5678',
      status: 'shortlisted' as const,
      company: 'StartupXYZ',
      education: 'MS Software Engineering, UT Austin',
      source: 'Company Website',
      appliedDate: '2024-01-14',
      availability: '2 weeks',
      seniorityLevel: 'Mid-Level',
      lastContact: '2024-01-20',
      matchReasons: [
        'Full-stack experience with React and Python',
        'Strong cloud infrastructure background with AWS and Kubernetes',
        'Startup experience with rapid development cycles'
      ],
      considerations: [
        'May need GraphQL training for our API architecture',
        'TypeScript experience would strengthen frontend contributions'
      ],
      projects: [
        {
          name: 'Microservices Migration',
          description: 'Migrated monolithic application to microservices using Python and Kubernetes',
          technologies: ['Python', 'Kubernetes', 'Docker', 'PostgreSQL']
        }
      ]
    },
    {
      id: '3',
      name: 'Emily Johnson',
      role: 'Frontend Developer',
      title: 'Frontend Developer',
      experience: '3 years',
      location: 'Seattle, WA',
      skills: ['React', 'JavaScript', 'CSS', 'Redux', 'Jest'],
      topMatchedSkills: ['React', 'JavaScript', 'Redux'],
      skillGaps: ['TypeScript', 'GraphQL', 'AWS'],
      score: 88,
      matchScore: 88,
      avatar: '/placeholder.svg',
      summary: 'Creative frontend developer passionate about user experience and modern web design.',
      aiInsight: 'Strong frontend skills with excellent UX focus, needs backend exposure',
      email: 'emily.johnson@email.com',
      phone: '+1 (555) 345-6789',
      status: 'screened' as const,
      company: 'MediumCorp',
      education: 'BS Information Systems, UW',
      source: 'Referral',
      appliedDate: '2024-01-13',
      availability: '1 month',
      seniorityLevel: 'Mid-Level',
      lastContact: '2024-01-18',
      matchReasons: [
        'Solid React and JavaScript foundation',
        'Strong focus on user experience and design',
        'Good testing practices with Jest'
      ],
      considerations: [
        'Limited TypeScript experience',
        'No GraphQL or AWS cloud experience',
        'May need mentoring for backend integration'
      ],
      projects: [
        {
          name: 'Design System Implementation',
          description: 'Built comprehensive React component library with design tokens',
          technologies: ['React', 'JavaScript', 'Storybook', 'CSS-in-JS']
        }
      ]
    },
    {
      id: '4',
      name: 'David Kim',
      role: 'React Developer',
      title: 'React Developer',
      experience: '6 years',
      location: 'New York, NY',
      skills: ['React', 'Next.js', 'TypeScript', 'MongoDB', 'Node.js'],
      topMatchedSkills: ['React', 'TypeScript', 'Next.js'],
      skillGaps: ['GraphQL'],
      score: 94,
      matchScore: 94,
      avatar: '/placeholder.svg',
      summary: 'Senior React developer with extensive experience in building scalable web applications.',
      aiInsight: 'Excellent React specialist with modern framework expertise and scalability focus',
      email: 'david.kim@email.com',
      phone: '+1 (555) 456-7890',
      status: 'new' as const,
      company: 'WebTech Solutions',
      education: 'BS Computer Science, NYU',
      source: 'GitHub',
      appliedDate: '2024-01-16',
      availability: 'Immediately',
      seniorityLevel: 'Senior',
      lastContact: undefined,
      matchReasons: [
        'Deep React expertise with 6 years specialized experience',
        'Strong TypeScript skills for type-safe development',
        'Next.js experience for SSR and performance optimization'
      ],
      considerations: [
        'GraphQL experience would complement our API strategy'
      ],
      projects: [
        {
          name: 'Enterprise Dashboard Platform',
          description: 'Built scalable React dashboard serving 10k+ daily users with Next.js',
          technologies: ['React', 'Next.js', 'TypeScript', 'MongoDB']
        }
      ]
    }
  ]);

  const getContextualFilters = () => {
    if (searchQuery.toLowerCase().includes('ml') || searchQuery.toLowerCase().includes('machine learning')) {
      return [
        { name: 'Python', count: 28, active: false },
        { name: 'PyTorch', count: 15, active: false },
        { name: 'TensorFlow', count: 22, active: false },
        { name: 'AWS', count: 18, active: false },
        { name: 'Senior', count: 12, active: false },
        { name: 'Remote', count: 42, active: false },
      ];
    }
    return [
      { name: 'Frontend', count: 24, active: false },
      { name: 'Backend', count: 18, active: false },
      { name: 'Full Stack', count: 15, active: false },
      { name: 'Remote', count: 42, active: false },
      { name: 'Senior', count: 12, active: false },
      { name: 'Available', count: 38, active: false },
    ];
  };

  const quickFilters = getContextualFilters();

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    
    let results = mockCandidates;
    
    if (searchQuery.trim()) {
      results = mockCandidates.filter(candidate => 
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        candidate.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedFilters.length > 0) {
      results = results.filter(candidate => 
        selectedFilters.some(filter => 
          candidate.skills.some(skill => skill.toLowerCase().includes(filter.toLowerCase())) ||
          candidate.role.toLowerCase().includes(filter.toLowerCase()) ||
          candidate.status.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }
    
    setFilteredCandidates(results);
  };

  const toggleFilter = (filterName: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterName) 
        ? prev.filter(f => f !== filterName)
        : [...prev, filterName]
    );
  };

  const toggleShortlist = (candidateId: string) => {
    setShortlistedCandidates(prev => 
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleCandidateSelect = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const candidatesToShow = searchQuery || selectedFilters.length > 0 ? filteredCandidates : mockCandidates;

  // Sorting logic
  const sortedCandidates = [...candidatesToShow].sort((a, b) => {
    switch (sortBy) {
      case 'matchScore':
        return b.matchScore - a.matchScore;
      case 'lastUpdated':
        // Mock implementation - would use actual last_updated_timestamp
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      case 'dateAdded':
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      case 'lastContactedDesc':
        // Mock implementation - would use actual last_contacted_timestamp
        if (!a.lastContact && !b.lastContact) return 0;
        if (!a.lastContact) return 1;
        if (!b.lastContact) return -1;
        return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime();
      case 'lastContactedAsc':
        if (!a.lastContact && !b.lastContact) return 0;
        if (!a.lastContact) return -1;
        if (!b.lastContact) return 1;
        return new Date(a.lastContact).getTime() - new Date(b.lastContact).getTime();
      case 'experienceYears':
        return parseInt(b.experience) - parseInt(a.experience);
      case 'seniorityLevel':
        const seniorityOrder = { 'Principal': 5, 'Senior': 4, 'Mid-Level': 3, 'Junior': 2, 'Entry-Level': 1 };
        return (seniorityOrder[b.seniorityLevel as keyof typeof seniorityOrder] || 0) - 
               (seniorityOrder[a.seniorityLevel as keyof typeof seniorityOrder] || 0);
      case 'availability':
        const availabilityOrder = { 'Immediately': 1, '2 weeks': 2, '1 month': 3, '2+ months': 4 };
        return (availabilityOrder[a.availability as keyof typeof availabilityOrder] || 999) - 
               (availabilityOrder[b.availability as keyof typeof availabilityOrder] || 999);
      case 'nameAsc':
        return a.name.localeCompare(b.name);
      case 'nameDesc':
        return b.name.localeCompare(a.name);
      default:
        return b.matchScore - a.matchScore;
    }
  });

  const handleExtensiveFiltersApply = (filters: any) => {
    console.log('Extensive filters applied:', filters);
    // Apply extensive filtering logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              HireAI
            </span>
          </div>
          
          {/* Enhanced Right Side */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500">
                3
              </Badge>
            </Button>
            
            <Button variant="ghost" size="sm">
              <HelpCircle className="w-4 h-4" />
            </Button>
            
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Job
            </Button>
            
            <span className="text-sm font-medium">Hi Alex!</span>
            
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>AV</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Enhanced Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Workflows Section */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Workflows</h2>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-1" />
                Create New
              </Button>
            </div>
            
            <Collapsible open={workflowsOpen} onOpenChange={setWorkflowsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto mb-3">
                  <span className="text-sm font-medium">Active Workflows ({workflows.length})</span>
                  {workflowsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3">
                {workflows.map((workflow) => (
                  <Card key={workflow.id} className="p-3 hover:bg-gray-50 cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Grip className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                        <h4 className="text-sm font-medium truncate">{workflow.name}</h4>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${
                            workflow.stage === 'Screening' ? 'bg-yellow-400' :
                            workflow.stage === 'Interview' ? 'bg-blue-400' :
                            workflow.stage === 'Offer' ? 'bg-green-400' : 'bg-gray-400'
                          }`} />
                          <span>{workflow.stage}</span>
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {workflow.activeCount}/{workflow.totalCount}
                        </Badge>
                      </div>
                      <Progress value={workflow.progress} className="h-1" />
                    </div>
                  </Card>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          {/* Global Actions Section */}
          <div className="p-6 border-b">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Global Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Candidates
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Bulk Actions
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Target className="w-4 h-4 mr-2" />
                  Manage Goals
                </Button>
              </div>
            </div>
          </div>
          
          {/* Spacer */}
          <div className="flex-1"></div>
          
          {/* Bottom Section - AI Copilot & Settings */}
          <div className="p-6 border-t">
            <div className="space-y-3">
              {/* AI Copilot Status */}
              <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-700 font-medium">AI Copilot Active</span>
                <Sparkles className="w-4 h-4 text-blue-500" />
              </div>
              
              {/* User Settings */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem onClick={() => window.location.href = '/recruiter/profile'}>
                    <Settings className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.location.href = '/login'}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="search" className="flex-1 flex flex-col">
            {/* Enhanced Top Tabs */}
            <div className="border-b bg-white px-6 py-4">
              <TabsList className="grid w-full max-w-4xl grid-cols-5">
                <TabsTrigger value="search" className="flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Search Candidates</span>
                </TabsTrigger>
                <TabsTrigger value="ai-ranking" className="flex items-center space-x-2">
                  <Brain className="w-4 h-4" />
                  <span>AI Ranking</span>
                </TabsTrigger>
                <TabsTrigger value="outreach" className="flex items-center space-x-2 relative">
                  <MessageSquare className="w-4 h-4" />
                  <span>Communications</span>
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-xs bg-red-500">
                    2
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="ai-tools" className="flex items-center space-x-2">
                  <Brain className="w-4 h-4" />
                  <span>Copilot Features</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="search" className="flex-1 flex flex-col">
              {/* Enhanced Search Section */}
              <div className="p-6 bg-white border-b">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-2xl font-bold text-gray-800 mb-6">Find Your Perfect Candidate</h1>
                  
                  <div className="flex space-x-4 mb-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Try: 'React developer with 3+ years experience in fintech'"
                        className="pl-10 h-12 text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      />
                      {/* Search History Indicator */}
                      {searchQuery && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute right-12 top-2 h-8 w-8 p-0"
                        >
                          <Clock className="w-4 h-4 text-gray-400" />
                        </Button>
                      )}
                    </div>
                    <ExtensiveFilters onFiltersApply={handleExtensiveFiltersApply} />
                    <Button variant="outline" className="h-12 px-6">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload JD
                    </Button>
                    <Button onClick={handleSearch} className="h-12 px-8 bg-blue-600 hover:bg-blue-700">
                      Search
                    </Button>
                  </div>

                  {/* Enhanced Quick Filters */}
                  <div className="flex flex-wrap gap-2">
                    {quickFilters.map((filter, index) => (
                      <Badge
                        key={index}
                        variant={selectedFilters.includes(filter.name) ? "default" : "outline"}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedFilters.includes(filter.name) 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'hover:bg-blue-50 hover:border-blue-300'
                        }`}
                        onClick={() => toggleFilter(filter.name)}
                      >
                        {filter.name} ({filter.count})
                        {selectedFilters.includes(filter.name) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>

                  {/* Applied Filters Display */}
                  {selectedFilters.length > 0 && (
                    <div className="mt-3 flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Active filters:</span>
                      {selectedFilters.map((filter, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="cursor-pointer"
                          onClick={() => toggleFilter(filter)}
                        >
                          {filter}
                          <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Results Section */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                  <CandidateSortOptions
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    candidateCount={sortedCandidates.length}
                  />

                  <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}`}>
                    {sortedCandidates.map((candidate) => (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        isSelected={selectedCandidates.includes(candidate.id)}
                        onSelect={handleCandidateSelect}
                        onShortlist={toggleShortlist}
                        isShortlisted={shortlistedCandidates.includes(candidate.id)}
                      />
                    ))}
                  </div>

                  {/* Bulk Actions */}
                  {selectedCandidates.length > 0 && (
                    <Card className="bg-blue-50 border-blue-200 mt-6">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {selectedCandidates.length} candidate(s) selected
                          </span>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Bulk Email
                            </Button>
                            <Button size="sm" variant="outline">
                              Change Status
                            </Button>
                            <Button size="sm" variant="outline">
                              Export
                            </Button>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              AI Pre-Screen
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai-ranking" className="flex-1 p-6 overflow-y-auto">
              <AIPoweredRanking />
            </TabsContent>

            <TabsContent value="outreach" className="flex-1 overflow-y-auto">
              <Tabs defaultValue="prescreening" className="h-full">
                <div className="border-b bg-white px-6 py-4">
                  <TabsList className="grid w-full max-w-2xl grid-cols-3">
                    <TabsTrigger value="prescreening">Pre-Screening</TabsTrigger>
                    <TabsTrigger value="outreach">Outreach</TabsTrigger>
                    <TabsTrigger value="workflow">Workflow</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="prescreening" className="p-6">
                  <PreScreeningSystem />
                </TabsContent>

                <TabsContent value="outreach" className="p-6">
                  <PersonalizedOutreach />
                </TabsContent>

                <TabsContent value="workflow" className="p-6">
                  <WorkflowManagement />
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="analytics" className="flex-1 p-6 overflow-y-auto">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="ai-tools" className="flex-1 overflow-y-auto">
              <Tabs defaultValue="resume-parser" className="h-full">
                <div className="border-b bg-white px-6 py-4">
                  <TabsList className="grid w-full max-w-3xl grid-cols-4">
                    <TabsTrigger value="resume-parser">Resume Parser</TabsTrigger>
                    <TabsTrigger value="skill-assessment">Skill Assessment</TabsTrigger>
                    <TabsTrigger value="interview-questions">Interview Questions</TabsTrigger>
                    <TabsTrigger value="bias-detection">Bias Detection</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="resume-parser" className="p-6">
                  <ResumeParser />
                </TabsContent>

                <TabsContent value="skill-assessment" className="p-6">
                  <SkillAssessment />
                </TabsContent>

                <TabsContent value="interview-questions" className="p-6">
                  <InterviewQuestions />
                </TabsContent>

                <TabsContent value="bias-detection" className="p-6">
                  <BiasDetection />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
