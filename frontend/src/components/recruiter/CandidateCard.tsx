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
  ThumbsDown, Zap, Award, Building, ChevronDown, ChevronUp, X, User, GitCompare
} from 'lucide-react';
import { cn } from "@/lib/utils";

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
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [localIsShortlisted, setLocalIsShortlisted] = useState(isShortlisted);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  useEffect(() => {
    const storedCandidates = getShortlistedCandidates();
    const isStoredShortlisted = storedCandidates.some(c => c.user_token === candidate.id);
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
    onShortlist(candidate.id);
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
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

  return (
    <Card className={cn(
      "hover:shadow-xl transition-all duration-300 cursor-pointer border group bg-white",
      localIsShortlisted && "border-green-200 hover:border-green-300"
    )}>
      <CardContent className={cn(
        "p-6",
        localIsShortlisted && "py-3"
      )}>
        <div className="flex items-start space-x-4">
          {/* Checkbox and Avatar - Always visible */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(candidate.id)}
              className="rounded w-4 h-4 border-2 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Avatar className="w-14 h-14 border-2 border-white shadow-md">
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1">
            {/* Header Section - Always visible */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <DrawerTrigger asChild>
                      <h3 
                        className="text-xl font-bold hover:text-blue-600 cursor-pointer transition-colors"
                        onClick={handleProfileClick}
                      >
                        {candidate.name}
                      </h3>
                    </DrawerTrigger>
                    
                    <DrawerContent className="max-h-[90vh]">
                      {isProfileLoaded ? (
                        <>
                          <DrawerHeader>
                            <DrawerTitle className="flex items-center space-x-4">
                              <Avatar className="w-16 h-16">
                                <AvatarImage src={candidate.avatar} />
                                <AvatarFallback className="text-lg">
                                  {candidate.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h2 className="text-2xl font-bold">{candidate.name}</h2>
                                <p className="text-gray-600">{candidate.title} at {candidate.company}</p>
                              </div>
                            </DrawerTitle>
                          </DrawerHeader>

                          <div className="p-6 overflow-y-auto">
                            <Tabs defaultValue="overview" className="space-y-6">
                              <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="experience">Experience</TabsTrigger>
                                <TabsTrigger value="skills">Skills Deep Dive</TabsTrigger>
                                <TabsTrigger value="projects">Projects</TabsTrigger>
                                <TabsTrigger value="notes">Notes & History</TabsTrigger>
                              </TabsList>

                              <TabsContent value="overview" className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-semibold mb-3">Contact Information</h4>
                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">{candidate.email}</span>
                                      </div>
                                      {candidate.phone && (
                                        <div className="flex items-center space-x-2">
                                          <Phone className="w-4 h-4 text-gray-400" />
                                          <span className="text-sm">{candidate.phone}</span>
                                        </div>
                                      )}
                                      <div className="flex items-center space-x-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">{candidate.location}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Enhanced Match Explanation Box */}
                                  <div className={`${getMatchScoreBackground(candidate.matchScore)} rounded-lg p-4 border`}>
                                    <div className="flex items-center space-x-2 mb-3">
                                      <Target className="w-5 h-5 text-blue-600" />
                                      <h4 className="font-semibold text-blue-800">Match Analysis</h4>
                                      <Badge className={`${getMatchScoreColor(candidate.matchScore)} ml-auto text-lg px-3 py-1`}>
                                        {candidate.matchScore}% Match
                                      </Badge>
                                    </div>
                                    
                                    <div className="space-y-3">
                                      <div>
                                        <h5 className="text-sm font-medium text-green-600 mb-1">Top Reasons for Match:</h5>
                                        <ul className="text-sm space-y-1">
                                          {candidate.matchReasons.map((reason, index) => (
                                            <li key={index} className="flex items-start space-x-1">
                                              <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                              <span>{reason}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      
                                      {candidate.considerations.length > 0 && (
                                        <div>
                                          <h5 className="text-sm font-medium text-orange-600 mb-1">Areas for Consideration:</h5>
                                          <ul className="text-sm space-y-1">
                                            {candidate.considerations.map((consideration, index) => (
                                              <li key={index} className="flex items-start space-x-1">
                                                <AlertTriangle className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                                                <span>{consideration}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-3">
                                  <div className="flex items-start space-x-2">
                                    <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                                    <div>
                                      <p className="text-sm font-medium text-blue-800">AI Insight</p>
                                      <p className="text-sm text-blue-700">{candidate.aiInsight}</p>
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent value="experience" className="space-y-4">
                                <div className="space-y-4">
                                  <h4 className="font-semibold">Professional Experience</h4>
                                  <div className="bg-white rounded-lg border p-4">
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <h5 className="font-medium">{candidate.title}</h5>
                                        <p className="text-gray-600">{candidate.company}</p>
                                      </div>
                                      <Badge variant="outline">{candidate.experience}</Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">{candidate.summary}</p>
                                    <div className="flex flex-wrap gap-1">
                                      {candidate.skills.slice(0, 8).map((skill, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent value="skills" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-semibold text-green-600 mb-3">Matched Skills</h4>
                                    <div className="space-y-2">
                                      {candidate.topMatchedSkills.map((skill, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                                          <span className="text-sm font-medium">{skill}</span>
                                          <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span className="text-xs text-green-600">Strong Match</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  {candidate.skillGaps.length > 0 && (
                                    <div>
                                      <h4 className="font-semibold text-orange-600 mb-3">Skill Gaps</h4>
                                      <div className="space-y-2">
                                        {candidate.skillGaps.map((skill, index) => (
                                          <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                                            <span className="text-sm font-medium">{skill}</span>
                                            <div className="flex items-center space-x-2">
                                              <AlertTriangle className="w-4 h-4 text-orange-500" />
                                              <span className="text-xs text-orange-600">To Explore</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </TabsContent>

                              <TabsContent value="projects" className="space-y-4">
                                <h4 className="font-semibold">Key Projects</h4>
                                <div className="space-y-4">
                                  {candidate.projects.map((project, index) => (
                                    <div key={index} className="bg-white rounded-lg border p-4">
                                      <h5 className="font-medium mb-2">{project.name}</h5>
                                      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                                      <div className="flex flex-wrap gap-1">
                                        {project.technologies.map((tech, techIndex) => (
                                          <Badge key={techIndex} variant="outline" className="text-xs">
                                            {tech}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </TabsContent>

                              <TabsContent value="notes" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-semibold mb-3">Contact History</h4>
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <span className="text-sm">Last Contact</span>
                                        <span className="text-sm text-gray-600">
                                          {candidate.lastContact || 'Never contacted'}
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <span className="text-sm">Source</span>
                                        <span className="text-sm text-gray-600">{candidate.source}</span>
                                      </div>
                                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <span className="text-sm">Applied Date</span>
                                        <span className="text-sm text-gray-600">{candidate.appliedDate}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-semibold mb-3">Internal Notes</h4>
                                    <div className="bg-gray-50 rounded p-3 min-h-[100px]">
                                      <p className="text-sm text-gray-500">No notes yet...</p>
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center p-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      )}
                    </DrawerContent>
                  </Drawer>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant={localIsShortlisted ? "default" : "outline"}
                      onClick={handleShortlist}
                      className={cn(
                        "flex items-center space-x-1 transition-all",
                        localIsShortlisted ? "bg-green-500 hover:bg-green-600" : "hover:bg-green-50 hover:border-green-300"
                      )}
                    >
                      <Heart className={cn("w-4 h-4", localIsShortlisted && "fill-current")} />
                      <span>{localIsShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
                    </Button>
                    
                    {!localIsShortlisted && (
                      <>
                        <Button size="sm" variant="outline" className="hover:bg-purple-50 hover:border-purple-300">
                          <UserCheck className="w-4 h-4 mr-1" />
                          Screen
                        </Button>
                        
                        <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:border-blue-300">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                      </>
                    )}
                  </div>
                  
                  {/* Status and Match Score - Always visible */}
                  <div className="flex items-center space-x-2 ml-auto">
                    <Badge className={cn(
                      "px-2 py-1 text-xs font-medium",
                      localIsShortlisted ? "bg-green-50 text-green-700 border-green-200" : getStatusColor(candidate.status)
                    )}>
                      {localIsShortlisted ? 'Shortlisted' : candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                    </Badge>
                    <Badge 
                      className={cn(
                        "px-2 py-1 text-xs font-medium",
                        getMatchScoreColor(candidate.matchScore)
                      )}
                    >
                      {candidate.matchScore}% Match
                    </Badge>
                  </div>
                </div>
                
                {/* Role and Company - Always visible */}
                <div className="mt-1">
                  <p className="text-gray-600 flex items-center space-x-4">
                    <span className="flex items-center font-medium">
                      <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                      {candidate.title}
                    </span>
                    {!localIsShortlisted && (
                      <span className="flex items-center">
                        <Building className="w-4 h-4 mr-1 text-green-500" />
                        {candidate.company}
                      </span>
                    )}
                  </p>
                  <p className="text-gray-500 flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-orange-500" />
                    {candidate.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Collapsible Content - Only visible when not shortlisted */}
            {!localIsShortlisted && (
              <>
                {/* AI Insight */}
                <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-800 mb-1">AI Insight</p>
                      <p className="text-sm text-blue-700">{candidate.aiInsight}</p>
                    </div>
                  </div>
                </div>

                {/* Top Matched Skills */}
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Top Matched Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {candidate.topMatchedSkills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        className="bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer transition-colors border border-green-300 shadow-sm"
                        onClick={() => console.log(`Filter by ${skill}`)}
                      >
                        <span className="mr-1">{getSkillIcon(skill)}</span>
                        ✓ {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Quick Facts */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">{candidate.experience}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="font-medium">{candidate.availability}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">{candidate.seniorityLevel}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <span className="font-medium">{formatDate(candidate.appliedDate)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-between items-center pt-4 border-t opacity-70 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="hover:bg-gray-50">
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      Decline
                    </Button>
                    <Button size="sm" variant="outline" className="hover:bg-green-50 hover:border-green-300">
                      <Eye className="w-4 h-4 mr-1" />
                      Profile
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-md">
                      Compare
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;
