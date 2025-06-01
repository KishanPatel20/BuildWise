
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Target, Zap, Settings, TrendingUp, Users, Award } from 'lucide-react';

const AIMatchingEngine = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [matchingWeights, setMatchingWeights] = useState({
    skills: 40,
    experience: 30,
    education: 15,
    location: 10,
    culture: 5
  });

  const [matchingResults, setMatchingResults] = useState([
    {
      candidateId: '1',
      name: 'Sarah Chen',
      overallScore: 95,
      breakdown: {
        skills: 98,
        experience: 92,
        education: 88,
        location: 100,
        culture: 85
      },
      reasoning: 'Excellent match with strong React expertise and leadership experience. Perfect location fit.',
      strengths: ['Advanced React skills', 'Team leadership', 'Startup experience'],
      gaps: ['Limited Python experience']
    },
    {
      candidateId: '2',
      name: 'Michael Rodriguez',
      overallScore: 92,
      breakdown: {
        skills: 90,
        experience: 95,
        education: 92,
        location: 85,
        culture: 90
      },
      reasoning: 'Strong full-stack candidate with excellent experience match. Minor location concerns.',
      strengths: ['Full-stack expertise', 'Cloud architecture', 'Agile methodology'],
      gaps: ['Requires relocation', 'Limited fintech experience']
    }
  ]);

  const handleRunMatching = () => {
    console.log('Running AI matching with weights:', matchingWeights);
    console.log('Job description:', jobDescription);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Description Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Job Description Analysis</span>
            </CardTitle>
            <CardDescription>
              AI-powered parsing and understanding of job requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your job description here for AI analysis..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
            />
            
            <Button onClick={handleRunMatching} className="w-full">
              <Zap className="w-4 h-4 mr-2" />
              Analyze & Extract Requirements
            </Button>

            {jobDescription && (
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium">AI-Extracted Requirements:</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Must-Have Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary">React</Badge>
                      <Badge variant="secondary">TypeScript</Badge>
                      <Badge variant="secondary">Node.js</Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Nice-to-Have:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="outline">GraphQL</Badge>
                      <Badge variant="outline">AWS</Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Experience Level:</span>
                    <Badge variant="secondary">Senior (3-5 years)</Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Matching Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Matching Algorithm</span>
            </CardTitle>
            <CardDescription>
              Customize weights for different matching criteria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Skills Match</label>
                  <span className="text-sm text-gray-500">{matchingWeights.skills}%</span>
                </div>
                <Slider
                  value={[matchingWeights.skills]}
                  onValueChange={(value) => setMatchingWeights({...matchingWeights, skills: value[0]})}
                  max={100}
                  step={5}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Experience Level</label>
                  <span className="text-sm text-gray-500">{matchingWeights.experience}%</span>
                </div>
                <Slider
                  value={[matchingWeights.experience]}
                  onValueChange={(value) => setMatchingWeights({...matchingWeights, experience: value[0]})}
                  max={100}
                  step={5}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Education</label>
                  <span className="text-sm text-gray-500">{matchingWeights.education}%</span>
                </div>
                <Slider
                  value={[matchingWeights.education]}
                  onValueChange={(value) => setMatchingWeights({...matchingWeights, education: value[0]})}
                  max={100}
                  step={5}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Location</label>
                  <span className="text-sm text-gray-500">{matchingWeights.location}%</span>
                </div>
                <Slider
                  value={[matchingWeights.location]}
                  onValueChange={(value) => setMatchingWeights({...matchingWeights, location: value[0]})}
                  max={100}
                  step={5}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Culture Fit</label>
                  <span className="text-sm text-gray-500">{matchingWeights.culture}%</span>
                </div>
                <Slider
                  value={[matchingWeights.culture]}
                  onValueChange={(value) => setMatchingWeights({...matchingWeights, culture: value[0]})}
                  max={100}
                  step={5}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Save Preset</Button>
              <Button variant="outline" size="sm">Load Preset</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Matching Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>AI Matching Results</span>
          </CardTitle>
          <CardDescription>
            Semantic similarity scores and detailed breakdowns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {matchingResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold">{result.name}</h4>
                    <p className="text-sm text-gray-600">{result.reasoning}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{result.overallScore}%</div>
                    <div className="text-sm text-gray-500">Overall Match</div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4">
                  {Object.entries(result.breakdown).map(([criterion, score]) => (
                    <div key={criterion} className="text-center">
                      <div className="text-lg font-semibold">{score}%</div>
                      <div className="text-xs text-gray-500 capitalize">{criterion}</div>
                      <Progress value={score} className="mt-1" />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-green-600 mb-2 flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      Key Strengths
                    </h5>
                    <div className="space-y-1">
                      {result.strengths.map((strength, idx) => (
                        <Badge key={idx} variant="outline" className="text-green-600 border-green-200">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-orange-600 mb-2 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Areas to Explore
                    </h5>
                    <div className="space-y-1">
                      {result.gaps.map((gap, idx) => (
                        <Badge key={idx} variant="outline" className="text-orange-600 border-orange-200">
                          {gap}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button size="sm" variant="outline">
                    View Full Profile
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Add to Shortlist
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

export default AIMatchingEngine;
