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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

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
  workflow?: {
    id: string;
    search_query: string;
    matched_summary: string;
    created_at: string;
    updated_at: string;
    recruiter: number;
    associated_role: string | null;
    matched_candidates: Array<{
      id: number;
      name: string;
      email: string;
      current_role: string;
      company: string;
      match_score: number;
      is_shortlisted: boolean;
      candidate_token: string;
    }>;
  };
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

interface RecruiterDetails {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  company_name: string;
  phone_number: string | null;
  bio: string | null;
  industry: string | null;
  website: string | null;
  company_size: string | null;
  founded: string | null;
  headquarters: string | null;
  company_description: string | null;
  job_title: string | null;
  years_of_experience: string | null;
  linkedin_profile: string | null;
  created_at: string;
  updated_at: string;
}

interface Workflow {
  id: string;
  search_query: string;
  matched_summary: string;
  created_at: string;
  updated_at: string;
  recruiter: number;
  associated_role: string | null;
  matched_candidates: Array<{
    id: number;
    name: string;
    email: string;
    current_role: string;
    company: string;
    match_score: number;
    is_shortlisted: boolean;
    candidate_token: string;
  }>;
}

interface WorkflowDetails {
  workflow_id: string;
  workflow_name: string;
  candidates: Array<{
    id: number;
    name: string;
    email: string;
    current_role: string;
    company: string;
    match_score: number;
    is_shortlisted: boolean;
    candidate_token: string;
  }>;
}

const SHORTLISTED_CANDIDATES_KEY = 'shortlisted_candidates';

const getShortlistedCandidates = (): ShortlistedCandidate[] => {
  const stored = sessionStorage.getItem(SHORTLISTED_CANDIDATES_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveShortlistedCandidates = (candidates: ShortlistedCandidate[]) => {
  sessionStorage.setItem(SHORTLISTED_CANDIDATES_KEY, JSON.stringify(candidates));
};

const API_BASE_URL = '';  // Empty string for relative paths

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
  const [recruiterDetails, setRecruiterDetails] = useState<RecruiterDetails | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [workflowDetails, setWorkflowDetails] = useState<Record<string, WorkflowDetails>>({});
  const [isLoadingWorkflows, setIsLoadingWorkflows] = useState(true);
  const [isNamingDialogOpen, setIsNamingDialogOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [pendingSearch, setPendingSearch] = useState<{query: string, filters: RecruiterSearchFilters} | null>(null);
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null);

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
      const response = await fetch(`${API_BASE_URL}/api/candidates/me/`, {
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

      // Store the search parameters and open naming dialog
      setPendingSearch({
        query: searchQuery,
        filters: searchFilters
      });
      setIsNamingDialogOpen(true);
      setIsSearching(false);
      return;

    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to process search. Please try again.');
      updateSearchProgress('Search failed', 0, error instanceof Error ? error.message : 'Unknown error occurred');
      setIsSearching(false);
    }
  };

  const executeSearch = async () => {
    if (!pendingSearch) return;

    try {
      setIsSearching(true);
      updateSearchProgress('Initializing search...', 10);

      const recruiterToken = sessionStorage.getItem('recruiterToken');
      if (!recruiterToken) {
        throw new Error('No authorization token found. Please login again.');
      }

      if (!recruiterDetails?.id) {
        throw new Error('Recruiter details not loaded. Please try again.');
      }

      const searchResponse = await fetch(`/recruiter/recruiters/${recruiterDetails.id}/create-workflow/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${recruiterToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: workflowName,
          search_query: pendingSearch.query
        })
      });
      
      if (!searchResponse.ok) {
        throw new Error(`Search failed with status: ${searchResponse.status}`);
      }

      const searchResults = await searchResponse.json();
      console.log('Search Results:', searchResults);

      // Store the workflow ID from the response
      if (searchResults.workflow?.id) {
        setCurrentWorkflowId(searchResults.workflow.id);
      }

      // Add the new workflow to the workflows list
      if (searchResults.workflow) {
        setWorkflows(prevWorkflows => [searchResults.workflow, ...prevWorkflows]);
        
        // Add workflow details
        setWorkflowDetails(prevDetails => ({
          ...prevDetails,
          [searchResults.workflow.id]: {
            workflow_id: searchResults.workflow.id,
            workflow_name: workflowName,
            candidates: searchResults.workflow.matched_candidates
          }
        }));
      }

      // Process search results through Groq for refined match scores
      updateSearchProgress('Analyzing matches...', 70, 'Using AI to refine match scores');
      const refinedScores = await processSearchResultsWithGroq(searchResults);

      // Process candidates with refined scores and workflow candidate IDs
      const processedCandidates = await Promise.all(
        searchResults.results.map(async (result, index) => {
          const refinedScore = refinedScores[index];
          const candidateDetails = await fetchCandidateDetails(result.user_token);
          
          // Find matching candidate from workflow response to get the ID
          const workflowCandidate = searchResults.workflow?.matched_candidates.find(
            c => c.candidate_token === result.user_token
          );
          
          // If we have detailed candidate information, use it with refined score
          if (candidateDetails) {
            return {
              ...candidateDetails,
              id: result.user_token,
              candidate_token: result.user_token,
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
            candidate_token: result.user_token,
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
        filters: pendingSearch.filters,
        processedFilters: {
          confidence: refinedScores.reduce((acc, score) => acc + score.matchScore, 0) / refinedScores.length / 100,
          reasoning: `Matched based on refined AI analysis with average score of ${
            (refinedScores.reduce((acc, score) => acc + score.matchScore, 0) / refinedScores.length).toFixed(1)
          }%`
        },
        timestamp: new Date(),
        workflow: searchResults.workflow
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
      setIsNamingDialogOpen(false);
      setWorkflowName('');
      setPendingSearch(null);
    }
  };

  const toggleFilter = (filterName: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterName) 
        ? prev.filter(f => f !== filterName)
        : [...prev, filterName]
    );
  };

  const toggleShortlist = async (candidateId: string) => {
    try {
      const recruiterToken = sessionStorage.getItem('recruiterToken');
      if (!recruiterToken) {
        throw new Error('No authorization token found');
      }

      const candidate = filteredCandidates.find(c => c.id === candidateId);
      if (!candidate) return;

      const isCurrentlyShortlisted = shortlistedCandidates.some(c => c.user_token === candidateId);

      if (!isCurrentlyShortlisted) {
        // Use the stored workflow ID
        if (!currentWorkflowId) {
          throw new Error('No active workflow found');
        }

        // Call API to shortlist the candidate
        const shortlistResponse = await fetch('/recruiter/selected-candidates/', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${recruiterToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            candidate_token: candidate.candidate_token,
            workflow_id: currentWorkflowId
          })
        });

        if (!shortlistResponse.ok) {
          throw new Error('Failed to shortlist candidate');
        }

        const shortlistData = await shortlistResponse.json();
        console.log('Shortlist response:', shortlistData);

        // Update local state
        setShortlistedCandidates(prev => {
          const newShortlisted = [...prev, {
            user_token: candidate.candidate_token,
            name: candidate.name,
            role: candidate.title,
            matchScore: candidate.matchScore
          }];
          saveShortlistedCandidates(newShortlisted);
          return newShortlisted;
        });

        toast.success('Candidate shortlisted successfully');
      } else {
        // Remove from shortlist
        setShortlistedCandidates(prev => {
          const newShortlisted = prev.filter(c => c.user_token !== candidate.candidate_token);
          saveShortlistedCandidates(newShortlisted);
          return newShortlisted;
        });
        toast.success('Candidate removed from shortlist');
      }
    } catch (error) {
      console.error('Error toggling shortlist:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update shortlist status');
    }
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

  const fetchRecruiterDetails = async () => {
    try {
      const recruiterToken = sessionStorage.getItem('recruiterToken');
      if (!recruiterToken) {
        throw new Error('No authorization token found');
      }

      const response = await fetch(`/recruiter/recruiters/me`, {
        headers: {
          'Authorization': `Token ${recruiterToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recruiter details');
      }

      const data = await response.json();
      setRecruiterDetails(data);
      setRecruiterName(`${data.user.first_name} ${data.user.last_name}`);
    } catch (error) {
      console.error('Error fetching recruiter details:', error);
      toast.error('Failed to load recruiter details');
    }
  };

  const fetchWorkflows = async () => {
    try {
      const recruiterToken = sessionStorage.getItem('recruiterToken');
      if (!recruiterToken) {
        throw new Error('No authorization token found');
      }

      const response = await fetch(`/recruiter/workflows/`, {
        headers: {
          'Authorization': `Token ${recruiterToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch workflows');
      }

      const data = await response.json();
      setWorkflows(data);

      // Fetch details for each workflow
      const detailsPromises = data.map(async (workflow: Workflow) => {
        const detailsResponse = await fetch(
          `/recruiter/workflows/${workflow.id}/candidates`,
          {
            headers: {
              'Authorization': `Token ${recruiterToken}`
            }
          }
        );

        if (!detailsResponse.ok) {
          throw new Error(`Failed to fetch details for workflow ${workflow.id}`);
        }

        const details = await detailsResponse.json();
        return [workflow.id, details];
      });

      const detailsResults = await Promise.all(detailsPromises);
      const detailsMap = Object.fromEntries(detailsResults);
      setWorkflowDetails(detailsMap);
    } catch (error) {
      console.error('Error fetching workflows:', error);
      toast.error('Failed to load workflows');
    } finally {
      setIsLoadingWorkflows(false);
    }
  };

  useEffect(() => {
    fetchRecruiterDetails();
    fetchWorkflows();
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
                <DropdownMenuItem onClick={() => window.location.href = '/web/recruiter/profile'}>
                  <UserCheck className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/web/recruiter/settings'}>
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
                {isLoadingWorkflows ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                ) : workflows.length === 0 ? (
                  <div className="text-center py-4 text-sm text-gray-500">
                    No active workflows
                  </div>
                ) : (
                  workflows.map((workflow) => {
                    const details = workflowDetails[workflow.id];
                    const workflowName = details?.workflow_name || 'Unnamed Workflow';
                    const candidateCount = workflow.matched_candidates.length;
                    const shortlistedCount = workflow.matched_candidates.filter(c => c.is_shortlisted).length;
                    const progress = candidateCount > 0 ? (shortlistedCount / candidateCount) * 100 : 0;

                    return (
                      <Card key={workflow.id} className="p-3 hover:bg-gray-50 cursor-pointer group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Grip className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                            <h4 className="text-sm font-medium truncate">{workflowName}</h4>
                          </div>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center space-x-1">
                              <div className="w-2 h-2 rounded-full bg-blue-400" />
                              <span>Active</span>
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {shortlistedCount}/{candidateCount}
                            </Badge>
                          </div>
                          <Progress value={progress} className="h-1" />
                        </div>
                      </Card>
                    );
                  })
                )}
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
                  <DropdownMenuItem onClick={() => window.location.href = '/web/recruiter/profile'}>
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

      {/* Add Workflow Naming Dialog */}
      <Dialog open={isNamingDialogOpen} onOpenChange={setIsNamingDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-lg border-0">
          <DialogHeader className="space-y-3 pb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mx-auto mb-2">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-center text-gray-900">
              Name Your Search
            </DialogTitle>
            <p className="text-sm text-gray-500 text-center">
              Give your search a memorable name to easily find it later
            </p>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="e.g., Senior Frontend Engineers - React"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="w-full h-12 px-4 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors"
              autoFocus
            />
            <p className="mt-2 text-xs text-gray-500">
              Tip: Use a descriptive name that includes role, skills, or location
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsNamingDialogOpen(false);
                setWorkflowName('');
                setPendingSearch(null);
              }}
              className="w-full sm:w-auto hover:bg-gray-50 border-gray-200"
            >
              Cancel
            </Button>
            <Button
              onClick={executeSearch}
              disabled={!workflowName.trim() || isSearching}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 min-w-[120px] transition-all duration-200"
            >
              {isSearching ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Start Search</span>
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecruiterDashboard;
