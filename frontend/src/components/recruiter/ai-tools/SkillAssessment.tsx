
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Target, AlertTriangle, TrendingUp, CheckCircle, X, Settings } from 'lucide-react';

const SkillAssessment = () => {
  const [selectedJob, setSelectedJob] = useState('frontend-dev');
  const [customWeights, setCustomWeights] = useState({
    skills: 40,
    experience: 30,
    education: 20,
    projects: 10
  });

  const [assessmentResults] = useState([
    {
      candidateId: '1',
      name: 'Sarah Chen',
      matchScore: 92,
      skillsMatch: 95,
      experienceMatch: 89,
      educationMatch: 88,
      matchedSkills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
      missingSkills: ['Kubernetes', 'Redis'],
      experienceRelevance: 94,
      redFlags: [],
      strengths: ['Strong frontend leadership', 'Modern tech stack', 'Scalable applications'],
      concerns: ['Limited DevOps experience']
    },
    {
      candidateId: '2', 
      name: 'Michael Rodriguez',
      matchScore: 85,
      skillsMatch: 88,
      experienceMatch: 82,
      educationMatch: 85,
      matchedSkills: ['React', 'Python', 'PostgreSQL', 'AWS'],
      missingSkills: ['TypeScript', 'GraphQL', 'Docker'],
      experienceRelevance: 79,
      redFlags: ['Short tenure at last role (8 months)'],
      strengths: ['Full-stack capability', 'Database expertise'],
      concerns: ['Job stability pattern', 'Frontend specialization gap']
    },
    {
      candidateId: '3',
      name: 'Emily Johnson',
      matchScore: 78,
      skillsMatch: 82,
      experienceMatch: 75,
      educationMatch: 76,
      matchedSkills: ['React', 'JavaScript', 'CSS', 'Redux'],
      missingSkills: ['TypeScript', 'Node.js', 'GraphQL', 'AWS'],
      experienceRelevance: 71,
      redFlags: ['Gap in employment (6 months in 2022)'],
      strengths: ['UI/UX focus', 'Creative problem solving'],
      concerns: ['Backend experience', 'Cloud platform knowledge']
    }
  ]);

  const updateWeight = (category: string, value: number[]) => {
    setCustomWeights(prev => ({
      ...prev,
      [category]: value[0]
    }));
  };

  const runAssessment = () => {
    console.log('Running skill assessment with weights:', customWeights);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>AI-Powered Skill Assessment</span>
            </CardTitle>
            <CardDescription>
              Semantic matching with customizable weighting for skills, experience, education, and projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend-dev">Senior Frontend Developer</SelectItem>
                  <SelectItem value="fullstack-eng">Full Stack Engineer</SelectItem>
                  <SelectItem value="backend-dev">Backend Developer</SelectItem>
                  <SelectItem value="devops-eng">DevOps Engineer</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={runAssessment} className="bg-blue-600 hover:bg-blue-700">
                <Target className="w-4 h-4 mr-2" />
                Run Assessment
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Customizable Weighting</span>
              </h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Skills Importance</label>
                    <span className="text-sm text-gray-600">{customWeights.skills}%</span>
                  </div>
                  <Slider
                    value={[customWeights.skills]}
                    onValueChange={(value) => updateWeight('skills', value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Experience Relevance</label>
                    <span className="text-sm text-gray-600">{customWeights.experience}%</span>
                  </div>
                  <Slider
                    value={[customWeights.experience]}
                    onValueChange={(value) => updateWeight('experience', value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Education Background</label>
                    <span className="text-sm text-gray-600">{customWeights.education}%</span>
                  </div>
                  <Slider
                    value={[customWeights.education]}
                    onValueChange={(value) => updateWeight('education', value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Projects & Portfolio</label>
                    <span className="text-sm text-gray-600">{customWeights.projects}%</span>
                  </div>
                  <Slider
                    value={[customWeights.projects]}
                    onValueChange={(value) => updateWeight('projects', value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Assessment Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Candidates Assessed</span>
                <Badge variant="outline">156</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg. Match Score</span>
                <Badge variant="outline">78%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Top 10% Threshold</span>
                <Badge variant="outline">90%+</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Red Flags Detected</span>
                <Badge variant="outline">23</Badge>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Embedding Analysis</h4>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>JD Embedding:</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex justify-between">
                  <span>Semantic Vectors:</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex justify-between">
                  <span>Similarity Calc:</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Results */}
      <Card>
        <CardHeader>
          <CardTitle>Candidate Assessment Results</CardTitle>
          <CardDescription>AI-powered semantic matching and skill gap analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {assessmentResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold">{result.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className="bg-blue-100 text-blue-800">
                        Overall Match: {result.matchScore}%
                      </Badge>
                      {result.redFlags.length > 0 && (
                        <Badge variant="outline" className="text-orange-600 border-orange-200">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {result.redFlags.length} Red Flag{result.redFlags.length > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{result.matchScore}%</div>
                    <div className="text-sm text-gray-500">Match Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-medium text-green-600">Skills Match ({result.skillsMatch}%)</h5>
                    <div className="flex flex-wrap gap-1">
                      {result.matchedSkills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium text-orange-600">Missing Skills</h5>
                    <div className="flex flex-wrap gap-1">
                      {result.missingSkills.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs text-orange-600 border-orange-200">
                          <X className="w-3 h-3 mr-1" />
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium">Experience Relevance</h5>
                    <div className="flex items-center space-x-2">
                      <Progress value={result.experienceRelevance} className="flex-1" />
                      <span className="text-sm font-medium">{result.experienceRelevance}%</span>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="strengths" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="strengths">Strengths</TabsTrigger>
                    <TabsTrigger value="concerns">Concerns</TabsTrigger>
                    <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
                  </TabsList>

                  <TabsContent value="strengths">
                    <ul className="space-y-1">
                      {result.strengths.map((strength, idx) => (
                        <li key={idx} className="text-sm flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>

                  <TabsContent value="concerns">
                    <div className="space-y-2">
                      {result.concerns.map((concern, idx) => (
                        <div key={idx} className="text-sm flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                          <span>{concern}</span>
                        </div>
                      ))}
                      {result.redFlags.map((flag, idx) => (
                        <div key={idx} className="text-sm flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-red-600">{flag}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="breakdown">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Skills Match:</span> {result.skillsMatch}%
                      </div>
                      <div>
                        <span className="font-medium">Experience Match:</span> {result.experienceMatch}%
                      </div>
                      <div>
                        <span className="font-medium">Education Match:</span> {result.educationMatch}%
                      </div>
                      <div>
                        <span className="font-medium">Experience Relevance:</span> {result.experienceRelevance}%
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-2">
                  <Button size="sm" variant="outline">
                    View Full Analysis
                  </Button>
                  <Button size="sm" variant="outline">
                    Compare with Others
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Shortlist Candidate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillAssessment;
