import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { Search, Upload, MessageSquare, Star, MapPin, Calendar, Briefcase, BarChart3, Brain, Menu, Settings, LogOut, ChevronDown, Plus, X, Users, Target, Clock, Heart, Phone, Mail, UserCheck, ChevronUp, Bell, HelpCircle, Sparkles, Grip, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { RecruiterSearchFilters } from '@/types/recruiter';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { processSearchResultsWithGroq } from '@/services/groqService';
import CommunicationPipeline from '@/components/recruiter/CommunicationPipeline';

interface SearchAPIResponse {
  results: Array<{
    email: string;
    name: string;
    current_role: string;
    company: string;
    total_similarity_score: number;
    aspect_scores: {
      profile: number;
      skills: number;
      experience: number;
      projects: number;
      education: number;
      location: number;
      additional: number;
    };
    aspect_queries: {
      profile: string;
      skills: string;
      experience: string;
      projects: string;
      education: string;
      location: string;
      additional: string;
    };
    user_token: string;
  }>;
  query: string;
  count: number;
  weights: {
    profile: number;
    skills: number;
    experience: number;
    projects: number;
    education: number;
    location: number;
    additional: number;
  };
}

interface SearchProcessedFilters {
  confidence: number;
  reasoning: string;
}

interface LastSearchResults {
  filters: RecruiterSearchFilters;
  processedFilters: SearchProcessedFilters;
  timestamp: Date;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  title: string;
  experience: string;
  skills: string[];
  education: string;
  company: string;
  matchScore: number;
  avatar?: string;
  summary: string;
  status: 'new' | 'shortlisted' | 'screened' | 'interviewing' | 'offer' | 'hired' | 'rejected';
  source: string;
  appliedDate: string;
  lastContact?: string;
  availability: string;
  seniorityLevel: string;
  topMatchedSkills: string[];
  skillGaps: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
  aiInsight: string;
  matchReasons: string[];
  considerations: string[];
}

interface ShortlistedCandidate {
  user_token: string;
  name: string;
  role: string;
  matchScore: number;
}

const SHORTLISTED_CANDIDATES_KEY = 'shortlisted_candidates';

const getShortlistedCandidates = (): ShortlistedCandidate[] => {
  const stored = sessionStorage.getItem(SHORTLISTED_CANDIDATES_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveShortlistedCandidates = (candidates: ShortlistedCandidate[]) => {
  sessionStorage.setItem(SHORTLISTED_CANDIDATES_KEY, JSON.stringify(candidates));
};

const RecruiterDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [workflowsOpen, setWorkflowsOpen] = useState(true);
  const [filteredCandidates, setFilteredCandidates] = useState<any[]>([]);
  const [shortlistedCandidates, setShortlistedCandidates] = useState<ShortlistedCandidate[]>(() => getShortlistedCandidates());
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('matchScore');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState({
    step: '',
    progress: 0,
    details: ''
  });
  const [lastSearchResults, setLastSearchResults] = useState<LastSearchResults | null>(null);
  const [recruiterName, setRecruiterName] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  const updateSearchProgress = (step: string, progress: number, details: string = '') => {
    setSearchProgress({ step, progress, details });
  };

  const handleExtensiveFiltersApply = (filters: RecruiterSearchFilters) => {
    console.log('Extensive filters applied:', filters);
    // Store the filters for use in search
    setSelectedFilters(Object.values(filters.role.jobTitle));
  };

  const fetchCandidateDetails = async (userToken: string): Promise<Candidate | null> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/candidates/me/`, {
        headers: {
          'Authorization': `Token ${userToken}`
        }
      });

      if (!response.ok) {
        console.warn(`Failed to fetch details for candidate ${userToken}`);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      return null;
    }
  };

  const handleSearch = async () => {
    try {
      setIsSearching(true);
      updateSearchProgress('Initializing search...', 10);

      // Prepare search filters based only on what user has explicitly selected
      const searchFilters: RecruiterSearchFilters = {
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
          overallExperience: { min: 0, max: 0 },
          domainExperience: { min: 0, max: 0 },
          currentRoleExperience: { min: 0, max: 0 },
          averageTenure: { min: 0, max: 0 }
        },
        technicalSkills: {
          programmingLanguages: selectedFilters.filter(f => 
            ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++'].includes(f)
          ),
          frameworks: selectedFilters.filter(f => 
            ['React', 'Angular', 'Vue', 'Node.js', 'Django'].includes(f)
          ),
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
            size: { min: 0, max: 0 }
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
          jobTitle: selectedFilters.filter(f => 
            ['Frontend', 'Backend', 'Full Stack', 'Senior'].includes(f)
          ),
          seniorityLevel: [],
          roleType: [],
          department: [],
          reportingTo: [],
          teamSize: { min: 0, max: 0 }
        },
        compensation: {
          salary: { min: 0, max: 0, currency: 'USD' },
          equity: false,
          bonus: { min: 0, max: 0 },
          benefits: []
        },
        availability: {
          noticePeriod: { min: 0, max: 0 },
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
          teamSize: { min: 0, max: 0 },
          technologies: []
        },
        preferences: {
          matchScore: { min: 0, max: 0 },
          excludeContacted: false,
          excludeRejected: false,
          excludeShortlisted: false,
          activeInLastDays: 0
        },
        jobDescription: searchQuery
      };

      // Combine search parameters into a single string
      const searchParams = new URLSearchParams();
      
      // Combine search query, filters, and job description
      const combinedSearchString = [
        searchQuery,
        selectedFilters.join(' '),
        JSON.stringify(searchFilters)
      ].filter(Boolean).join(' ');

      searchParams.append('q', combinedSearchString);
      searchParams.append('k', '5'); // Number of results to return

      updateSearchProgress('Searching candidates...', 50, 'Using AI to find matching candidates');

      // Make API call to embeddings search endpoint
      const recruiterToken = sessionStorage.getItem('recruiterToken');
      if (!recruiterToken) {
        throw new Error('No authorization token found. Please login again.');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/embeddings/search/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${recruiterToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q: combinedSearchString,
          k: 5
        })
      });
      
      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }

      const searchResults = await response.json() as SearchAPIResponse;
      console.log('Search Results:', searchResults);

      // Process search results through Groq for refined match scores
      updateSearchProgress('Analyzing matches...', 70, 'Using AI to refine match scores');
      const refinedScores = await processSearchResultsWithGroq(searchResults);

      // Process candidates with refined scores
      const processedCandidates = await Promise.all(
        searchResults.results.map(async (result, index) => {
          const refinedScore = refinedScores[index];
          const candidateDetails = await fetchCandidateDetails(result.user_token);
          
          // If we have detailed candidate information, use it with refined score
          if (candidateDetails) {
            return {
              ...candidateDetails,
              matchScore: refinedScore.matchScore,
              aiInsight: refinedScore.reasoning,
              matchReasons: refinedScore.topMatches,
              considerations: refinedScore.considerations,
              status: 'new' as const,
              source: 'AI Search'
            };
          }

          // Fallback to basic information with refined score
          return {
            id: result.user_token,
            name: result.name,
            role: result.current_role,
            title: result.current_role,
            experience: 'Not specified',
            location: 'Not specified',
            skills: [],
            topMatchedSkills: refinedScore.topMatches,
            skillGaps: [],
            score: refinedScore.matchScore,
            matchScore: refinedScore.matchScore,
            avatar: '/placeholder.svg',
            summary: refinedScore.reasoning,
            aiInsight: refinedScore.reasoning,
            email: result.email,
            phone: '',
            status: 'new' as const,
            company: result.company || 'Not specified',
            education: '',
            source: 'AI Search',
            appliedDate: new Date().toISOString().split('T')[0],
            availability: 'Not specified',
            seniorityLevel: 'Not specified',
            lastContact: undefined,
            matchReasons: refinedScore.topMatches,
            considerations: refinedScore.considerations,
            projects: []
          };
        })
      );

      setFilteredCandidates(processedCandidates);

      // Store search results with refined scores
      setLastSearchResults({
        filters: searchFilters,
        processedFilters: {
          confidence: refinedScores.reduce((acc, score) => acc + score.matchScore, 0) / refinedScores.length / 100,
          reasoning: `Matched based on refined AI analysis with average score of ${
            (refinedScores.reduce((acc, score) => acc + score.matchScore, 0) / refinedScores.length).toFixed(1)
          }%`
        },
        timestamp: new Date()
      });

      updateSearchProgress('Search complete!', 100, `Found ${processedCandidates.length} matching candidates`);
      
      // Show success message with refined scores
      toast.success(
        <div className="space-y-2">
          <p>Search completed successfully!</p>
          <p className="text-sm text-gray-600">
            Found {processedCandidates.length} matching candidates
          </p>
          <p className="text-xs text-gray-500">
            Average match score: {
              (refinedScores.reduce((acc, score) => acc + score.matchScore, 0) / refinedScores.length).toFixed(1)
            }%
          </p>
        </div>
      );

    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to process search. Please try again.');
      updateSearchProgress('Search failed', 0, error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsSearching(false);
    }
  };

  const toggleFilter = (filterName: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterName) 
        ? prev.filter(f => f !== filterName)
        : [...prev, filterName]
    );
  };

  const toggleShortlist = (candidateId: string) => {
    setShortlistedCandidates(prev => {
      const candidate = filteredCandidates.find(c => c.id === candidateId);
      if (!candidate) return prev;

      const isCurrentlyShortlisted = prev.some(c => c.user_token === candidateId);
      let newShortlisted: ShortlistedCandidate[];

      if (isCurrentlyShortlisted) {
        // Remove from shortlist
        newShortlisted = prev.filter(c => c.user_token !== candidateId);
      } else {
        // Add to shortlist with full details
        newShortlisted = [...prev, {
          user_token: candidateId,
          name: candidate.name,
          role: candidate.title,
          matchScore: candidate.matchScore
        }];
      }
      
      // Save to session storage
      saveShortlistedCandidates(newShortlisted);
      return newShortlisted;
    });
  };

  const handleCandidateSelect = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const candidatesToShow = (searchQuery || selectedFilters.length > 0) ? filteredCandidates : [];

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

  const getShortlistedCandidatesData = () => {
    return candidatesToShow.filter(candidate => 
      shortlistedCandidates.some(c => c.user_token === candidate.id)
    );
  };

  const shortlistedCount = shortlistedCandidates.length;

  useEffect(() => {
    const recruiterUser = sessionStorage.getItem('recruiterUser');
    if (recruiterUser) {
      const userData = JSON.parse(recruiterUser);
      setRecruiterName(`${userData.first_name} ${userData.last_name}`);
    }
  }, []);

  useEffect(() => {
    // Load shortlisted candidates from session storage on component mount
    const storedShortlisted = getShortlistedCandidates();
    setShortlistedCandidates(storedShortlisted);
  }, []);

  const handleSearchFocus = () => {
    const searchInput = document.querySelector('input[placeholder*="job description"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
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
          
          {/* Enhanced Right Side with User Dropdown */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500">
                3
              </Badge>
            </Button>
            
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
                  <span className="text-sm font-medium">{recruiterName}</span>
                  <Avatar className="h-8 w-8 border-2 border-gray-200">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{recruiterName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.href = '/recruiter/profile'}>
                  <UserCheck className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/recruiter/settings'}>
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => window.location.href = '/login'}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Enhanced Sidebar with collapse feature */}
        <div className={`relative bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-16' : 'w-80'
        }`}>
          {/* Sidebar Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute -right-3 top-6 z-50 h-6 w-6 rounded-full border bg-white shadow-sm hover:bg-gray-50"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>

          {/* Workflows Section */}
          <div className={`p-6 border-b ${isSidebarCollapsed ? 'hidden' : ''}`}>
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

          {/* Collapsed State Icons */}
          {isSidebarCollapsed && (
            <div className="flex flex-col items-center py-4 space-y-4">
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0" title="Workflows">
                <Grip className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0" title="AI Copilot">
                <Sparkles className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0" title="Settings">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Bottom Section - AI Copilot & Settings */}
          <div className={`p-6 border-t ${isSidebarCollapsed ? 'hidden' : ''}`}>
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
                <TabsTrigger value="outreach" className="flex items-center space-x-2 relative">
                  <MessageSquare className="w-4 h-4" />
                  <span>Communications</span>
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-xs bg-red-500">
                    2
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="ai-ranking" className="flex items-center space-x-2">
                  <Brain className="w-4 h-4" />
                  <span>AI Ranking</span>
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

            <TabsContent value="search" className="flex-1 flex flex-col data-[state=inactive]:hidden">
              {/* Enhanced Search Section */}
              <div className="p-6 bg-white border-b">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-2xl font-bold text-gray-800 mb-6">Find Your Perfect Candidate</h1>
                  
                  <div className="flex space-x-4 mb-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Enter job description or search terms..."
                        className="pl-10 h-12 text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      />
                    </div>
                    <ExtensiveFilters onFiltersApply={handleExtensiveFiltersApply} />
                    <Button variant="outline" className="h-12 px-6">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload JD
                    </Button>
                    <Button 
                      onClick={handleSearch} 
                      className="h-12 px-8 bg-blue-600 hover:bg-blue-700"
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Searching...</span>
                        </div>
                      ) : (
                        'Search'
                      )}
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
                  {candidatesToShow.length > 0 ? (
                    <>
                      <CandidateSortOptions
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        candidateCount={sortedCandidates.length}
                      />

                      <div className="space-y-4">
                        {sortedCandidates.map((candidate) => (
                          <CandidateCard
                            key={candidate.id}
                            candidate={candidate}
                            isSelected={selectedCandidates.includes(candidate.id)}
                            onSelect={handleCandidateSelect}
                            onShortlist={toggleShortlist}
                            isShortlisted={shortlistedCandidates.some(c => c.user_token === candidate.id)}
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
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-blue-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Search</h3>
                      <p className="text-gray-600 max-w-md mb-6">
                        Enter a job description or use the filters above to find matching candidates. Our AI will help you discover the best talent for your role.
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Button 
                          variant="outline" 
                          className="flex items-center space-x-2"
                          onClick={handleSearchFocus}
                        >
                          <Search className="w-4 h-4" />
                          <span>Search Candidates</span>
                        </Button>
                        <ExtensiveFilters onFiltersApply={handleExtensiveFiltersApply} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai-ranking" className="flex-1 p-6 overflow-y-auto">
              <AIPoweredRanking />
            </TabsContent>

            <TabsContent value="outreach" className="flex-1 overflow-y-auto">
              <CommunicationPipeline />
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

      {/* Add Search Progress Indicator */}
      {isSearching && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{searchProgress.step}</span>
              <span className="text-sm text-gray-500">{searchProgress.progress}%</span>
            </div>
            <Progress value={searchProgress.progress} className="h-2" />
            {searchProgress.details && (
              <p className="text-xs text-gray-500 mt-1">{searchProgress.details}</p>
            )}
          </div>
        </div>
      )}

      {/* Add Last Search Results Summary */}
      {lastSearchResults && !isSearching && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Search Results</span>
              <span className="text-xs text-gray-500">
                {format(lastSearchResults.timestamp, 'MMM d, HH:mm:ss')}
              </span>
            </div>
            <div className="text-sm space-y-1">
              <p>AI Confidence: {(lastSearchResults.processedFilters.confidence * 100).toFixed(1)}%</p>
              <p className="text-xs text-gray-500 truncate">
                {lastSearchResults.processedFilters.reasoning}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
