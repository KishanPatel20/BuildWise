import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, MapPin, Briefcase, GraduationCap, Heart, Phone, Mail, 
  MessageSquare, UserCheck, Eye, Calendar, Clock, CheckCircle, 
  AlertTriangle, ExternalLink, FileText, Users, Target, Lightbulb,
  ThumbsDown, Zap, Award, Building, ChevronDown, ChevronUp, X, User, GitCompare,
  Linkedin, Github, Globe, Code
} from 'lucide-react';
import { cn } from "@/lib/utils";
import CandidatePortfolio from './CandidatePortfolio';

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  title: string;
  experience: number;
  skills: string | string[];
  education?: string;
  company?: string;
  matchScore?: number;
  avatar?: string;
  summary?: string;
  status: 'new' | 'shortlisted' | 'screened' | 'interviewing' | 'offer' | 'hired' | 'rejected';
  source: string | null;
  appliedDate: string;
  lastContact?: string;
  availability?: string;
  seniorityLevel?: string;
  topMatchedSkills: string[];
  skillGaps: string[];
  projects: Array<{
    id?: number;
    title?: string;
    name?: string;
    description: string;
    tech_stack?: string;
    technologies?: string[];
    role_in_project?: string;
    github_link?: string | null;
    live_link?: string | null;
  }>;
  aiInsight: string;
  matchReasons: string[];
  considerations: string[];
  work_experiences?: Array<{
    id: number;
    company_name: string;
    role_designation: string;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    responsibilities: string;
    technologies_used: string;
  }>;
  current_job_title?: string;
  current_company?: string;
  linkedin_profile?: string;
  github_profile?: string;
  portfolio_link?: string;
  resume?: string;
  employment_type_preferences?: string;
  preferred_locations?: string;
  is_actively_looking?: boolean;
}

const SHORTLISTED_CANDIDATES_KEY = 'shortlisted_candidates';

interface ShortlistedCandidate {
  name: string;
  role: string;
  matchScore: number;
  user_token: string;
}

interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onSelect: (candidateId: string) => void;
  onShortlist: (candidateId: string) => void;
  isShortlisted: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isSelected,
  onSelect,
  onShortlist,
  isShortlisted
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [localIsShortlisted, setLocalIsShortlisted] = useState(isShortlisted);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);

  useEffect(() => {
    const storedCandidates = getShortlistedCandidates();
    const isStoredShortlisted = storedCandidates.some(c => c.user_token === candidate.id.toString());
    setLocalIsShortlisted(isStoredShortlisted);
    if (isStoredShortlisted) {
      setIsCollapsed(true);
    }
  }, [candidate.id]);

  useEffect(() => {
    setLocalIsShortlisted(isShortlisted);
    if (isShortlisted) {
      setIsCollapsed(true);
    }
  }, [isShortlisted]);

  const handleShortlist = () => {
    onShortlist(candidate.id.toString());
    const newShortlistedStatus = !localIsShortlisted;
    setLocalIsShortlisted(newShortlistedStatus);
    setIsCollapsed(newShortlistedStatus);
  };

  const getShortlistedCandidates = (): ShortlistedCandidate[] => {
    const stored = sessionStorage.getItem(SHORTLISTED_CANDIDATES_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  const saveShortlistedCandidates = (candidates: ShortlistedCandidate[]) => {
    sessionStorage.setItem(SHORTLISTED_CANDIDATES_KEY, JSON.stringify(candidates));
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-600 text-white border-green-600';
    if (score >= 70) return 'bg-yellow-500 text-white border-yellow-500';
    return 'bg-red-500 text-white border-red-500';
  };

  const getMatchScoreBackground = (score: number) => {
    if (score >= 85) return 'bg-green-50 border-green-200';
    if (score >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      shortlisted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      screened: 'bg-purple-100 text-purple-800 border-purple-200',
      interviewing: 'bg-orange-100 text-orange-800 border-orange-200',
      offer: 'bg-green-100 text-green-800 border-green-200',
      hired: 'bg-green-200 text-green-900 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getSkillIcon = (skill: string) => {
    const skillIcons: { [key: string]: string } = {
      'React': '⚛️',
      'TypeScript': '📘',
      'JavaScript': '🟨',
      'Python': '🐍',
      'GraphQL': '📊',
      'AWS': '☁️',
      'Docker': '🐳',
      'Kubernetes': '⎈',
    };
    return skillIcons[skill] || '🔧';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatExperienceDuration = (startDate: string, endDate: string | null, isCurrent: boolean) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    
    let duration = '';
    if (diffYears > 0) {
      duration += `${diffYears} ${diffYears === 1 ? 'year' : 'years'}`;
    }
    if (diffMonths > 0) {
      duration += `${duration ? ' ' : ''}${diffMonths} ${diffMonths === 1 ? 'month' : 'months'}`;
    }
    return duration;
  };

  const formatResponsibilities = (responsibilities: string) => {
    return responsibilities.split('\n').map((line, index) => (
      <div key={index} className="flex items-start space-x-2">
        <span className="text-gray-400 mt-1">•</span>
        <span>{line.trim()}</span>
      </div>
    ));
  };

  const toggleExpanded = () => {
    if (localIsShortlisted) {
      setIsCollapsed(!isCollapsed);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleProfileClick = () => {
    setIsDrawerOpen(true);
    setIsProfileLoaded(true);
  };

  // Add null checks for arrays before mapping
  const topMatchedSkills = candidate.topMatchedSkills || [];
  const skillGaps = candidate.skillGaps || [];
  const projects = candidate.projects || [];
  const matchReasons = candidate.matchReasons || [];
  const considerations = candidate.considerations || [];
  const skills = typeof candidate.skills === 'string' 
    ? candidate.skills.split(',').map(s => s.trim()) 
    : candidate.skills || [];

  // Helper function to get technologies array
  const getTechnologies = (project: Candidate['projects'][0]): string[] => {
    if (project.technologies) return project.technologies;
    if (project.tech_stack) return project.tech_stack.split(',').map(t => t.trim());
    return [];
  };

  const handleCardClick = () => {
    setIsPortfolioOpen(true);
  };

  return (
    <>
      <Card className={cn(
        "hover:shadow-xl transition-all duration-300 cursor-pointer border group bg-white",
        localIsShortlisted && "border-green-200 hover:border-green-300"
      )}>
        <CardContent className="p-6">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <Avatar className="h-12 w-12 border-2 border-gray-100">
                <AvatarImage src={candidate.avatar} />
                <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{candidate.name}</h3>
                <p className="text-gray-600">{candidate.current_job_title || candidate.title}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{candidate.location || 'Location not specified'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge 
                variant="outline" 
                className={cn(
                  "px-3 py-1 text-sm",
                  getMatchScoreColor(candidate.matchScore || 0)
                )}
              >
                {candidate.matchScore ? `${candidate.matchScore}% Match` : 'No Match Score'}
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">{candidate.experience} </span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">{candidate.work_experiences?.length || 0} roles</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">{candidate.projects?.length || 0} projects</span>
              </div>
            </div>
          </div>

          {/* Top Skills */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Top Skills</h4>
            <div className="flex flex-wrap gap-2">
              {typeof candidate.skills === 'string' 
                ? candidate.skills.split(',').slice(0, 5).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill.trim()}
                    </Badge>
                  ))
                : candidate.skills.slice(0, 5).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))
              }
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-3">
              {candidate.aiInsight && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 hover:bg-blue-50 hover:border-blue-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                >
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <span>AI Insight</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              )}
              <Button 
                size="sm" 
                variant={localIsShortlisted ? "default" : "outline"}
                className={cn(
                  "transition-colors",
                  localIsShortlisted 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "hover:bg-green-50 hover:border-green-300"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleShortlist();
                }}
              >
                <Star className={cn("w-4 h-4 mr-1", localIsShortlisted && "fill-white")} />
                <span>{localIsShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="hover:bg-blue-50 hover:border-blue-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPortfolioOpen(true);
                }}
              >
                <Eye className="w-4 h-4 mr-1" />
                Profile
              </Button>
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-md">
                <GraduationCap className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">{candidate.experience} </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {candidate.linkedin_profile && (
                <Button size="sm" variant="ghost" className="hover:bg-blue-50" asChild>
                  <a href={candidate.linkedin_profile} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4 text-blue-600" />
                  </a>
                </Button>
              )}
              {candidate.github_profile && (
                <Button size="sm" variant="ghost" className="hover:bg-gray-50" asChild>
                  <a href={candidate.github_profile} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {candidate.portfolio_link && (
                <Button size="sm" variant="ghost" className="hover:bg-purple-50" asChild>
                  <a href={candidate.portfolio_link} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-4 h-4 text-purple-600" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* AI Insight Content */}
          {candidate.aiInsight && isExpanded && (
            <div className="mt-3 bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm text-blue-800">{candidate.aiInsight}</p>
                  {/* Match Reasons */}
                  {candidate.matchReasons && candidate.matchReasons.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-xs font-medium text-blue-900 mb-2">Why They Match:</h5>
                      <ul className="space-y-1">
                        {candidate.matchReasons.map((reason, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Considerations */}
                  {candidate.considerations && candidate.considerations.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-xs font-medium text-blue-900 mb-2">Considerations:</h5>
                      <ul className="space-y-1">
                        {candidate.considerations.map((consideration, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span>{consideration}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <CandidatePortfolio
        isOpen={isPortfolioOpen}
        onClose={() => setIsPortfolioOpen(false)}
        candidate={candidate}
        onShortlist={onShortlist}
        isShortlisted={isShortlisted}
      />
    </>
  );
};

export default CandidateCard;
