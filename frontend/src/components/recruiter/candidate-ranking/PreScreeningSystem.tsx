
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, MessageSquare, CheckCircle, AlertTriangle, Clock, Users, Zap } from 'lucide-react';

const PreScreeningSystem = () => {
  const [selectedCandidate, setSelectedCandidate] = useState('sarah-chen');
  const [generatedQuestions, setGeneratedQuestions] = useState([
    {
      id: '1',
      type: 'technical',
      question: 'Can you walk me through your experience with React hooks and how you\'ve used them in production applications?',
      reasoning: 'Based on the candidate\'s React expertise and the job requirement for advanced React skills.',
      followUp: ['Which hooks do you use most frequently?', 'How do you handle complex state management?']
    },
    {
      id: '2',
      type: 'behavioral',
      question: 'You mentioned leading a team of 5 developers at TechCorp. Can you describe a challenging situation you faced and how you resolved it?',
      reasoning: 'Assessing leadership experience and problem-solving skills mentioned in their resume.',
      followUp: ['What would you do differently?', 'How did you measure success?']
    },
    {
      id: '3',
      type: 'situational',
      question: 'If you had to migrate a large React application from JavaScript to TypeScript, what would be your approach?',
      reasoning: 'Testing practical knowledge of TypeScript migration, which is relevant to our current project needs.',
      followUp: ['How would you handle team training?', 'What challenges would you anticipate?']
    }
  ]);

  const [screeningResults, setScreeningResults] = useState([
    {
      candidateId: '1',
      name: 'Sarah Chen',
      status: 'completed',
      overallScore: 85,
      responses: [
        {
          question: 'React hooks experience',
          score: 90,
          summary: 'Demonstrated deep understanding of hooks, provided specific examples',
          redFlags: []
        },
        {
          question: 'Leadership challenge',
          score: 80,
          summary: 'Good leadership example, showed problem-solving skills',
          redFlags: ['Could provide more specific metrics']
        }
      ],
      recommendation: 'Strong candidate - proceed to technical interview',
      nextSteps: ['Schedule technical interview', 'Share coding challenge']
    }
  ]);

  const generateQuestions = () => {
    console.log(`Generating AI questions for candidate: ${selectedCandidate}`);
    // Simulate AI question generation
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Generation */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>AI Question Generator</span>
            </CardTitle>
            <CardDescription>
              Generate personalized screening questions based on candidate profiles and job requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              <Select value={selectedCandidate} onValueChange={setSelectedCandidate}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select candidate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah-chen">Sarah Chen - Senior Frontend Developer</SelectItem>
                  <SelectItem value="michael-rodriguez">Michael Rodriguez - Full Stack Engineer</SelectItem>
                  <SelectItem value="emily-johnson">Emily Johnson - Frontend Developer</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={generateQuestions}>
                <Zap className="w-4 h-4 mr-2" />
                Generate Questions
              </Button>
            </div>

            <div className="space-y-4">
              {generatedQuestions.map((q) => (
                <div key={q.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className={
                          q.type === 'technical' ? 'border-blue-200 text-blue-600' :
                          q.type === 'behavioral' ? 'border-green-200 text-green-600' :
                          'border-purple-200 text-purple-600'
                        }>
                          {q.type}
                        </Badge>
                      </div>
                      <p className="font-medium mb-2">{q.question}</p>
                      <p className="text-sm text-gray-600 mb-3">{q.reasoning}</p>
                      
                      {q.followUp.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1">Suggested follow-ups:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {q.followUp.map((follow, idx) => (
                              <li key={idx}>• {follow}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Use</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline">Save Template</Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <MessageSquare className="w-4 h-4 mr-2" />
                Start Screening
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Screening Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Screening Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Pending Screens</span>
                <Badge variant="outline">12</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Completed Today</span>
                <Badge variant="outline">8</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Pass Rate</span>
                <Badge variant="outline">73%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg. Score</span>
                <Badge variant="outline">82/100</Badge>
              </div>
            </div>

            <div className="pt-4 border-t space-y-2">
              <h4 className="font-medium">Quick Actions</h4>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                Schedule Batch Screening
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Brain className="w-4 h-4 mr-2" />
                AI Bulk Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Screening Results */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Screening Results</CardTitle>
          <CardDescription>AI-assisted evaluation and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {screeningResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold">{result.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={
                        result.status === 'completed' ? 'bg-green-100 text-green-800' :
                        result.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {result.status}
                      </Badge>
                      <span className="text-sm text-gray-500">Screening completed</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{result.overallScore}/100</div>
                    <div className="text-sm text-gray-500">Overall Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.responses.map((response, idx) => (
                    <div key={idx} className="border rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm">{response.question}</h5>
                        <span className="text-lg font-semibold text-blue-600">{response.score}/100</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{response.summary}</p>
                      {response.redFlags.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3 text-orange-500" />
                          <span className="text-xs text-orange-600">{response.redFlags[0]}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Brain className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h5 className="font-medium text-blue-900">AI Recommendation</h5>
                      <p className="text-sm text-blue-700">{result.recommendation}</p>
                      <div className="mt-2">
                        <p className="text-xs font-medium text-blue-800">Next Steps:</p>
                        <ul className="text-xs text-blue-700 space-y-1">
                          {result.nextSteps.map((step, idx) => (
                            <li key={idx}>• {step}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button size="sm" variant="outline">
                    View Full Screening
                  </Button>
                  <Button size="sm" variant="outline">
                    Add Notes
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
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

export default PreScreeningSystem;
