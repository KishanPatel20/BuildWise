
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Brain, Target, Users, Zap, Star, CheckCircle, AlertTriangle, BarChart3, Eye, MessageSquare, TrendingUp, Lightbulb, GitBranch, Award, MapPin, Briefcase } from 'lucide-react';

const AIPoweredRanking = () => {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [matchingEngineActive, setMatchingEngineActive] = useState(false);

  const [rankedCandidates] = useState([
    {
      id: '1',
      name: 'Sarah Chen',
      title: 'Senior ML Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      avatar: '/placeholder.svg',
      overallMatch: 96,
      semanticMatch: 94,
      skillAlignment: 98,
      experienceRelevance: 95,
      contextualFit: 92,
      topSkills: ['PyTorch', 'LangChain', 'Python', 'MLOps', 'Leadership'],
      missingSkills: ['Kubernetes'],
      strengths: ['Deep Learning expertise', 'Production ML systems', 'Team leadership'],
      insights: 'Perfect fit for senior role requiring both technical depth and leadership',
      projects: 3,
      publications: 2,
      yearsExperience: 6
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      title: 'AI Research Scientist',
      company: 'AI Labs',
      location: 'Austin, TX',
      avatar: '/placeholder.svg',
      overallMatch: 91,
      semanticMatch: 95,
      skillAlignment: 89,
      experienceRelevance: 88,
      contextualFit: 94,
      topSkills: ['TensorFlow', 'Research', 'NLP', 'Published Papers', 'Innovation'],
      missingSkills: ['Production Deployment', 'Team Management'],
      strengths: ['Research background', 'Novel algorithms', 'Academic publications'],
      insights: 'Strong research profile, may need support transitioning to production environment',
      projects: 5,
      publications: 8,
      yearsExperience: 4
    },
    {
      id: '3',
      name: 'Emily Johnson',
      title: 'ML Platform Engineer',
      company: 'ScaleAI',
      location: 'Seattle, WA',
      avatar: '/placeholder.svg',
      overallMatch: 88,
      semanticMatch: 86,
      skillAlignment: 92,
      experienceRelevance: 84,
      contextualFit: 90,
      topSkills: ['MLOps', 'Kubernetes', 'AWS', 'Infrastructure', 'Monitoring'],
      missingSkills: ['Deep Learning', 'Research Experience'],
      strengths: ['Infrastructure expertise', 'Scalable systems', 'DevOps integration'],
      insights: 'Excellent for platform/infrastructure-focused ML roles',
      projects: 4,
      publications: 0,
      yearsExperience: 5
    }
  ]);

  const [skillsBreakdown] = useState([
    { skill: 'Python', weight: 15, candidate1: 100, candidate2: 95, candidate3: 90 },
    { skill: 'Machine Learning', weight: 20, candidate1: 95, candidate2: 98, candidate3: 85 },
    { skill: 'Deep Learning', weight: 18, candidate1: 98, candidate2: 95, candidate3: 70 },
    { skill: 'MLOps/Production', weight: 12, candidate1: 92, candidate2: 65, candidate3: 95 },
    { skill: 'Leadership', weight: 10, candidate1: 90, candidate2: 60, candidate3: 75 },
    { skill: 'Research', weight: 8, candidate1: 80, candidate2: 98, candidate3: 50 },
    { skill: 'Cloud Platforms', weight: 10, candidate1: 88, candidate2: 70, candidate3: 95 },
    { skill: 'Communication', weight: 7, candidate1: 85, candidate2: 80, candidate3: 85 }
  ]);

  const toggleCandidateSelection = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const launchMatchingEngine = () => {
    setMatchingEngineActive(true);
    console.log('Launching AI Matching Engine...');
    // Simulate processing
    setTimeout(() => {
      setMatchingEngineActive(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI-Powered Candidate Ranking</h1>
          <p className="text-gray-600">Advanced semantic matching and intelligent insights beyond keyword search</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            onClick={launchMatchingEngine}
            disabled={matchingEngineActive}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Brain className="w-4 h-4 mr-2" />
            {matchingEngineActive ? 'Processing...' : 'Launch Matching Engine'}
          </Button>
          <Button variant="outline" disabled={selectedCandidates.length < 2}>
            <Users className="w-4 h-4 mr-2" />
            Compare Candidates ({selectedCandidates.length})
          </Button>
        </div>
      </div>

      <Tabs defaultValue="semantic-matching" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="semantic-matching">Semantic Matching</TabsTrigger>
          <TabsTrigger value="candidate-comparison">Candidate Comparison</TabsTrigger>
          <TabsTrigger value="insights-analytics">Insights & Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="semantic-matching" className="space-y-6">
          {/* Matching Engine Status */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span>SkillSync Engine Status</span>
              </CardTitle>
              <CardDescription>
                Advanced AI matching with semantic understanding and contextual analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">156</div>
                  <div className="text-sm text-gray-600">Candidates Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">25</div>
                  <div className="text-sm text-gray-600">Skills Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">94%</div>
                  <div className="text-sm text-gray-600">Semantic Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">0.8s</div>
                  <div className="text-sm text-gray-600">Avg. Processing Time</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ranked Candidates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Top Ranked Candidates</h3>
            {rankedCandidates.map((candidate, index) => (
              <Card key={candidate.id} className="hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => toggleCandidateSelection(candidate.id)}
                        className="rounded"
                      />
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={candidate.avatar} />
                          <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold">{candidate.name}</h3>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-lg font-bold text-green-600">{candidate.overallMatch}%</span>
                            </div>
                          </div>
                          <p className="text-gray-600 flex items-center space-x-4">
                            <span className="flex items-center">
                              <Briefcase className="w-4 h-4 mr-1" />
                              {candidate.title} at {candidate.company}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {candidate.location}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* AI Insights */}
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-800">AI Insight</p>
                            <p className="text-sm text-blue-700">{candidate.insights}</p>
                          </div>
                        </div>
                      </div>

                      {/* Matching Scores */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium">Semantic Match</span>
                            <span className="text-xs">{candidate.semanticMatch}%</span>
                          </div>
                          <Progress value={candidate.semanticMatch} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium">Skill Alignment</span>
                            <span className="text-xs">{candidate.skillAlignment}%</span>
                          </div>
                          <Progress value={candidate.skillAlignment} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium">Experience</span>
                            <span className="text-xs">{candidate.experienceRelevance}%</span>
                          </div>
                          <Progress value={candidate.experienceRelevance} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium">Context Fit</span>
                            <span className="text-xs">{candidate.contextualFit}%</span>
                          </div>
                          <Progress value={candidate.contextualFit} className="h-2" />
                        </div>
                      </div>

                      {/* Skills & Experience */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-green-600 mb-2">Top Matched Skills</h5>
                          <div className="flex flex-wrap gap-1">
                            {candidate.topSkills.map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-orange-600 mb-2">Areas for Development</h5>
                          <div className="flex flex-wrap gap-1">
                            {candidate.missingSkills.map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs text-orange-600 border-orange-200">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium mb-2">Key Metrics</h5>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span>Experience:</span>
                              <span>{candidate.yearsExperience} years</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Projects:</span>
                              <span>{candidate.projects}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Publications:</span>
                              <span>{candidate.publications}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-2 pt-2 border-t">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Full Analysis
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          AI Outreach
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Award className="w-4 h-4 mr-1" />
                          Shortlist
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="candidate-comparison" className="space-y-6">
          {selectedCandidates.length >= 2 ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Side-by-Side Comparison</span>
                  </CardTitle>
                  <CardDescription>
                    Detailed analysis comparing {selectedCandidates.length} selected candidates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Skills Breakdown Comparison */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Skill-by-Skill Analysis</h4>
                    <div className="space-y-3">
                      {skillsBreakdown.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{skill.skill}</span>
                            <Badge variant="outline" className="text-xs">
                              Weight: {skill.weight}%
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Sarah Chen</span>
                                <span>{skill.candidate1}%</span>
                              </div>
                              <Progress value={skill.candidate1} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Michael Rodriguez</span>
                                <span>{skill.candidate2}%</span>
                              </div>
                              <Progress value={skill.candidate2} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Emily Johnson</span>
                                <span>{skill.candidate3}%</span>
                              </div>
                              <Progress value={skill.candidate3} className="h-2" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Differentiators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rankedCandidates.slice(0, 3).map((candidate, index) => (
                  <Card key={candidate.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{candidate.name}</CardTitle>
                      <CardDescription>Key Differentiators</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {candidate.strengths.map((strength, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{strength}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select Candidates to Compare</h3>
                <p className="text-gray-600">Choose 2 or more candidates from the ranking to see detailed side-by-side comparison</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="insights-analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Matching Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Match Score</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Top 10% Candidates</span>
                    <span className="font-medium">15 candidates</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Perfect Skill Matches</span>
                    <span className="font-medium">3 candidates</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Semantic Understanding Accuracy</span>
                    <span className="font-medium">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>AI Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Pattern Detected:</strong> Candidates with both research and production experience show 23% higher overall performance
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Skill Gap Analysis:</strong> Most candidates excel in core ML but need MLOps upskilling
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-800">
                      <strong>Market Insight:</strong> Leadership experience is rare but highly valuable in current candidate pool
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIPoweredRanking;
