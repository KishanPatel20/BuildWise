
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Upload, MessageSquare, Star, MapPin, Calendar, Briefcase, BarChart3 } from 'lucide-react';
import RecruiterFilters from '@/components/RecruiterFilters';
import AnalyticsDashboard from '@/components/recruiter/AnalyticsDashboard';

const RecruiterDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<any>(null);
  const [chatHistory] = useState([
    'Frontend developer with React expertise',
    'Backend engineers with 3+ years Python',
    'Full-stack developers in fintech'
  ]);

  const [mockCandidates] = useState([
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Senior Frontend Developer',
      experience: '5 years',
      location: 'San Francisco, CA',
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
      score: 95,
      avatar: '/placeholder.svg',
      summary: 'Experienced frontend developer with expertise in React ecosystem and modern web technologies.'
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      role: 'Full Stack Engineer',
      experience: '4 years',
      location: 'Austin, TX',
      skills: ['React', 'Python', 'PostgreSQL', 'AWS'],
      score: 92,
      avatar: '/placeholder.svg',
      summary: 'Full-stack engineer with strong background in modern web applications and cloud infrastructure.'
    },
    {
      id: 3,
      name: 'Emily Johnson',
      role: 'Frontend Developer',
      experience: '3 years',
      location: 'Seattle, WA',
      skills: ['React', 'JavaScript', 'CSS', 'Redux'],
      score: 88,
      avatar: '/placeholder.svg',
      summary: 'Creative frontend developer passionate about user experience and modern web design.'
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'React Developer',
      experience: '6 years',
      location: 'New York, NY',
      skills: ['React', 'Next.js', 'TypeScript', 'MongoDB'],
      score: 94,
      avatar: '/placeholder.svg',
      summary: 'Senior React developer with extensive experience in building scalable web applications.'
    }
  ]);

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    console.log('Applied filters:', appliedFilters);
  };

  const handleFiltersApply = (filters: any) => {
    setAppliedFilters(filters);
    console.log('Filters applied:', filters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              HireAI
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome back, Recruiter!</span>
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>R</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4">Search History</h2>
            <div className="space-y-2">
              {chatHistory.map((query, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{query}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6">
            <Button variant="outline" className="w-full mb-4">
              <Upload className="w-4 h-4 mr-2" />
              Upload Job Description
            </Button>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Quick Filters</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200">
                  Frontend
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200">
                  Backend
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200">
                  Full Stack
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200">
                  Remote
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="search" className="flex-1 flex flex-col">
            <div className="border-b bg-white px-6 py-4">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="search" className="flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Search Candidates</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="search" className="flex-1 flex flex-col">
              {/* Search Section */}
              <div className="p-6 bg-white border-b">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-2xl font-bold text-gray-800 mb-6">Find Your Perfect Candidate</h1>
                  
                  <div className="flex space-x-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Try: 'React developer with 3+ years experience in fintech'"
                        className="pl-10 h-12 text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      />
                    </div>
                    <Button onClick={handleSearch} className="h-12 px-8 bg-blue-600 hover:bg-blue-700">
                      Search
                    </Button>
                    <RecruiterFilters onFiltersApply={handleFiltersApply} />
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Top Candidates ({mockCandidates.length} found)
                    </h2>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>Sorted by match score</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {mockCandidates.map((candidate) => (
                      <Card key={candidate.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer border hover:border-blue-200">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={candidate.avatar} />
                                <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-lg">{candidate.name}</CardTitle>
                                <CardDescription className="flex items-center space-x-4 text-sm">
                                  <span className="flex items-center">
                                    <Briefcase className="w-3 h-3 mr-1" />
                                    {candidate.role}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {candidate.experience}
                                  </span>
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium">{candidate.score}%</span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4">{candidate.summary}</p>
                          
                          <div className="flex items-center space-x-2 mb-4">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{candidate.location}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {candidate.skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                              View Profile
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              Contact
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="flex-1 p-6 overflow-y-auto">
              <AnalyticsDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
