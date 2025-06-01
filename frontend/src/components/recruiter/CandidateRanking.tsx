
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Upload, Star, MapPin, Briefcase, GraduationCap, Filter, Users, MessageSquare, Brain, Zap } from 'lucide-react';
import CandidateProfileParser from './candidate-ranking/CandidateProfileParser';
import AIMatchingEngine from './candidate-ranking/AIMatchingEngine';
import PreScreeningSystem from './candidate-ranking/PreScreeningSystem';
import PersonalizedOutreach from './candidate-ranking/PersonalizedOutreach';
import CandidateComparison from './candidate-ranking/CandidateComparison';
import WorkflowManagement from './candidate-ranking/WorkflowManagement';

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
  notes?: string[];
  redFlags?: string[];
  strengths?: string[];
}

const CandidateRanking = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<any>({});
  const [sortBy, setSortBy] = useState('matchScore');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const [mockCandidates] = useState<Candidate[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      title: 'Senior Frontend Developer',
      experience: '5 years',
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Docker'],
      education: 'BS Computer Science, Stanford University',
      company: 'TechCorp Inc.',
      matchScore: 95,
      avatar: '/placeholder.svg',
      summary: 'Experienced frontend developer with expertise in React ecosystem and modern web technologies. Led multiple high-impact projects.',
      status: 'new',
      source: 'LinkedIn',
      appliedDate: '2024-01-15',
      strengths: ['Strong React expertise', 'Leadership experience', 'Modern tech stack'],
      redFlags: []
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      email: 'michael.r@email.com',
      location: 'Austin, TX',
      title: 'Full Stack Engineer',
      experience: '4 years',
      skills: ['React', 'Python', 'PostgreSQL', 'AWS', 'Kubernetes'],
      education: 'MS Software Engineering, UT Austin',
      company: 'StartupXYZ',
      matchScore: 92,
      avatar: '/placeholder.svg',
      summary: 'Full-stack engineer with strong background in modern web applications and cloud infrastructure.',
      status: 'shortlisted',
      source: 'Company Website',
      appliedDate: '2024-01-14',
      strengths: ['Full-stack capability', 'Cloud expertise', 'Startup experience'],
      redFlags: []
    },
    {
      id: '3',
      name: 'Emily Johnson',
      email: 'emily.johnson@email.com',
      location: 'Seattle, WA',
      title: 'Frontend Developer',
      experience: '3 years',
      skills: ['React', 'JavaScript', 'CSS', 'Redux', 'Jest'],
      education: 'BS Information Systems, UW',
      company: 'MediumCorp',
      matchScore: 88,
      avatar: '/placeholder.svg',
      summary: 'Creative frontend developer passionate about user experience and modern web design.',
      status: 'screened',
      source: 'Referral',
      appliedDate: '2024-01-13',
      strengths: ['UX focus', 'Testing expertise', 'Team collaboration'],
      redFlags: ['Limited backend experience']
    }
  ]);

  const handleCandidateSelect = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-yellow-100 text-yellow-800',
      screened: 'bg-purple-100 text-purple-800',
      interviewing: 'bg-orange-100 text-orange-800',
      offer: 'bg-green-100 text-green-800',
      hired: 'bg-green-200 text-green-900',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const sortedCandidates = [...mockCandidates].sort((a, b) => {
    switch (sortBy) {
      case 'matchScore':
        return b.matchScore - a.matchScore;
      case 'appliedDate':
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      case 'experience':
        return parseInt(b.experience) - parseInt(a.experience);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI-Powered Candidate Ranking</h1>
          <p className="text-gray-600">Intelligent matching, pre-screening, and personalized outreach</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Resumes
          </Button>
          <Button variant="outline" size="sm">
            <Brain className="w-4 h-4 mr-2" />
            AI Insights
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Zap className="w-4 h-4 mr-2" />
            Bulk Actions
          </Button>
        </div>
      </div>

      <Tabs defaultValue="ranking" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="ranking">Candidate Ranking</TabsTrigger>
          <TabsTrigger value="parser">Profile Parser</TabsTrigger>
          <TabsTrigger value="matching">AI Matching</TabsTrigger>
          <TabsTrigger value="screening">Pre-Screening</TabsTrigger>
          <TabsTrigger value="outreach">Outreach</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
        </TabsList>

        <TabsContent value="ranking" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Smart Search & Filtering</CardTitle>
                  <CardDescription>AI-powered semantic search with advanced filtering</CardDescription>
                </div>
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{sortedCandidates.length} candidates</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search candidates with natural language (e.g., 'React developer with 3+ years in fintech')"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filters
                </Button>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matchScore">Match Score</SelectItem>
                    <SelectItem value="appliedDate">Application Date</SelectItem>
                    <SelectItem value="experience">Experience Level</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                  React <span className="ml-1 text-xs">(24)</span>
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                  Senior Level <span className="ml-1 text-xs">(12)</span>
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                  Remote <span className="ml-1 text-xs">(8)</span>
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                  Available <span className="ml-1 text-xs">(15)</span>
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Candidate List */}
          <div className="space-y-4">
            {sortedCandidates.map((candidate) => (
              <Card key={candidate.id} className="hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => handleCandidateSelect(candidate.id)}
                        className="rounded"
                      />
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={candidate.avatar} />
                        <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold">{candidate.name}</h3>
                            <Badge className={getStatusColor(candidate.status)}>
                              {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-gray-600 flex items-center space-x-4 mt-1">
                            <span className="flex items-center">
                              <Briefcase className="w-4 h-4 mr-1" />
                              {candidate.title} at {candidate.company}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {candidate.location}
                            </span>
                            <span className="flex items-center">
                              <GraduationCap className="w-4 h-4 mr-1" />
                              {candidate.experience} experience
                            </span>
                          </p>
                        </div>

                        <div className="text-right space-y-2">
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-lg font-bold text-green-600">{candidate.matchScore}%</span>
                          </div>
                          <Progress value={candidate.matchScore} className="w-24" />
                        </div>
                      </div>

                      <p className="text-sm text-gray-600">{candidate.summary}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 6).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 6 && (
                            <Badge variant="outline" className="text-xs">
                              +{candidate.skills.length - 6} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            View Profile
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            AI Outreach
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Shortlist
                          </Button>
                        </div>
                      </div>

                      {/* Strengths and Red Flags */}
                      {(candidate.strengths?.length || candidate.redFlags?.length) && (
                        <div className="flex space-x-4 pt-2 border-t">
                          {candidate.strengths?.length && (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-medium text-green-600">Strengths:</span>
                              <div className="flex flex-wrap gap-1">
                                {candidate.strengths.map((strength, index) => (
                                  <Badge key={index} variant="outline" className="text-xs text-green-600 border-green-200">
                                    {strength}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {candidate.redFlags?.length && (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-medium text-red-600">Areas to Explore:</span>
                              <div className="flex flex-wrap gap-1">
                                {candidate.redFlags.map((flag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs text-red-600 border-red-200">
                                    {flag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bulk Actions */}
          {selectedCandidates.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
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
        </TabsContent>

        <TabsContent value="parser">
          <CandidateProfileParser />
        </TabsContent>

        <TabsContent value="matching">
          <AIMatchingEngine />
        </TabsContent>

        <TabsContent value="screening">
          <PreScreeningSystem />
        </TabsContent>

        <TabsContent value="outreach">
          <PersonalizedOutreach />
        </TabsContent>

        <TabsContent value="workflow">
          <WorkflowManagement />
        </TabsContent>
      </Tabs>

      {/* Comparison Tool */}
      {selectedCandidates.length >= 2 && (
        <CandidateComparison selectedCandidates={selectedCandidates} candidates={mockCandidates} />
      )}
    </div>
  );
};

export default CandidateRanking;
