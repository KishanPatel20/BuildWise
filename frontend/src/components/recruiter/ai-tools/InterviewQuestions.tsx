
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Brain, Copy, Edit, Download, Zap, Clock, Target } from 'lucide-react';

const InterviewQuestions = () => {
  const [selectedCandidate, setSelectedCandidate] = useState('sarah-chen');
  const [selectedJob, setSelectedJob] = useState('frontend-dev');
  const [questionType, setQuestionType] = useState('mixed');
  const [interviewStage, setInterviewStage] = useState('initial');
  const [isGenerating, setIsGenerating] = useState(false);

  const [generatedQuestions, setGeneratedQuestions] = useState([
    {
      id: '1',
      type: 'technical',
      question: 'Sarah, I noticed you led the development of React applications serving 100k+ users at TechCorp. Can you walk me through your approach to optimizing performance for such scale?',
      reasoning: 'Based on her specific experience with large-scale React applications and performance optimization needs for the role.',
      followUp: [
        'What specific performance metrics did you track?',
        'How did you handle state management at this scale?',
        'What tools did you use for performance monitoring?'
      ],
      difficulty: 'intermediate',
      estimatedTime: '8-10 minutes'
    },
    {
      id: '2',
      type: 'behavioral',
      question: 'You transitioned from StartupXYZ to TechCorp, moving from a startup to a larger company. How did you adapt your working style, and what challenges did you face in this transition?',
      reasoning: 'Addresses her career progression and ability to adapt to different company cultures and scales.',
      followUp: [
        'What did you miss most about the startup environment?',
        'How did you maintain your impact in a larger organization?',
        'What did you learn about scaling development processes?'
      ],
      difficulty: 'easy',
      estimatedTime: '5-7 minutes'
    },
    {
      id: '3',
      type: 'situational',
      question: 'Given your GraphQL experience, imagine you need to migrate our existing REST API endpoints to GraphQL while maintaining backward compatibility. How would you approach this?',
      reasoning: 'Tests practical application of her GraphQL skills to a real scenario relevant to our tech stack.',
      followUp: [
        'How would you handle schema versioning?',
        'What would be your rollout strategy?',
        'How would you measure the success of the migration?'
      ],
      difficulty: 'advanced',
      estimatedTime: '12-15 minutes'
    },
    {
      id: '4',
      type: 'leadership',
      question: 'Your GitHub shows you\'ve contributed to open source projects. How has this experience shaped your approach to code review and mentoring junior developers?',
      reasoning: 'Leverages her open source contributions to assess leadership and mentoring capabilities.',
      followUp: [
        'Can you share an example of feedback you gave that had significant impact?',
        'How do you balance code quality with development speed?',
        'What\'s your approach to onboarding new team members?'
      ],
      difficulty: 'intermediate',
      estimatedTime: '6-8 minutes'
    }
  ]);

  const [questionTemplates] = useState([
    {
      category: 'Technical Deep Dive',
      template: 'Based on {candidate_experience}, can you explain how you would approach {technical_challenge} in our environment?',
      usage: 847,
      effectiveness: 89
    },
    {
      category: 'Culture Fit',
      template: 'Given your experience at {previous_company}, how do you think you\'d adapt to our {company_culture} approach?',
      usage: 623,
      effectiveness: 76
    },
    {
      category: 'Problem Solving',
      template: 'I see you worked on {specific_project}. How would you apply those learnings to solve {hypothetical_scenario}?',
      usage: 592,
      effectiveness: 84
    }
  ]);

  const generateQuestions = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      console.log('Generated new questions for', selectedCandidate);
    }, 2000);
  };

  const copyQuestion = (question: string) => {
    navigator.clipboard.writeText(question);
  };

  const exportQuestions = () => {
    const questionsText = generatedQuestions.map(q => 
      `${q.type.toUpperCase()}: ${q.question}\n\nFollow-up questions:\n${q.followUp.map(f => `- ${f}`).join('\n')}\n\n`
    ).join('\n---\n\n');
    
    const blob = new Blob([questionsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-questions-${selectedCandidate}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Generation Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>AI Interview Question Generator</span>
          </CardTitle>
          <CardDescription>
            Generate contextual, personalized questions based on candidate profiles and job requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select value={selectedCandidate} onValueChange={setSelectedCandidate}>
              <SelectTrigger>
                <SelectValue placeholder="Select candidate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sarah-chen">Sarah Chen - Senior Frontend Developer</SelectItem>
                <SelectItem value="michael-rodriguez">Michael Rodriguez - Full Stack Engineer</SelectItem>
                <SelectItem value="emily-johnson">Emily Johnson - Frontend Developer</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger>
                <SelectValue placeholder="Select job role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frontend-dev">Senior Frontend Developer</SelectItem>
                <SelectItem value="fullstack-eng">Full Stack Engineer</SelectItem>
                <SelectItem value="backend-dev">Backend Developer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Select value={questionType} onValueChange={setQuestionType}>
              <SelectTrigger>
                <SelectValue placeholder="Question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mixed">Mixed Types</SelectItem>
                <SelectItem value="technical">Technical Only</SelectItem>
                <SelectItem value="behavioral">Behavioral Only</SelectItem>
                <SelectItem value="situational">Situational Only</SelectItem>
                <SelectItem value="leadership">Leadership Only</SelectItem>
              </SelectContent>
            </Select>

            <Select value={interviewStage} onValueChange={setInterviewStage}>
              <SelectTrigger>
                <SelectValue placeholder="Interview stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="initial">Initial Screen</SelectItem>
                <SelectItem value="technical">Technical Round</SelectItem>
                <SelectItem value="cultural">Cultural Fit</SelectItem>
                <SelectItem value="final">Final Interview</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={generateQuestions} disabled={isGenerating}>
              {isGenerating ? (
                <>Generating...</>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={exportQuestions}>
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Save as Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Generated Questions</CardTitle>
            <CardDescription>Contextually generated for {selectedCandidate} applying for {selectedJob}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {generatedQuestions.map((q) => (
                <div key={q.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className={
                          q.type === 'technical' ? 'border-blue-200 text-blue-600' :
                          q.type === 'behavioral' ? 'border-green-200 text-green-600' :
                          q.type === 'situational' ? 'border-purple-200 text-purple-600' :
                          'border-orange-200 text-orange-600'
                        }>
                          {q.type}
                        </Badge>
                        <Badge variant="outline" className={
                          q.difficulty === 'easy' ? 'border-green-200 text-green-600' :
                          q.difficulty === 'intermediate' ? 'border-yellow-200 text-yellow-600' :
                          'border-red-200 text-red-600'
                        }>
                          {q.difficulty}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {q.estimatedTime}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-2">Question:</h4>
                          <p className="text-sm bg-gray-50 p-3 rounded border">{q.question}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">AI Reasoning:</h4>
                          <p className="text-sm text-gray-600 italic">{q.reasoning}</p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Follow-up Questions:</h4>
                          <ul className="text-sm space-y-1">
                            {q.followUp.map((follow, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <span className="text-gray-400 mt-1">•</span>
                                <span>{follow}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => copyQuestion(q.question)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Generation Stats & Templates */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>Generation Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Questions Generated</span>
                  <Badge variant="outline">2,847</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg. Generation Time</span>
                  <Badge variant="outline">3.2s</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Recruiter Satisfaction</span>
                  <Badge variant="outline">4.7/5</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Questions Used</span>
                  <Badge variant="outline">89%</Badge>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Context Analysis</h4>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Resume Context:</span>
                    <span className="text-green-600">✓ Loaded</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Job Requirements:</span>
                    <span className="text-green-600">✓ Analyzed</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Company Culture:</span>
                    <span className="text-green-600">✓ Integrated</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Templates</CardTitle>
              <CardDescription>Most effective question templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questionTemplates.map((template, index) => (
                  <div key={index} className="border rounded p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{template.category}</h4>
                      <Badge variant="outline" className="text-xs">{template.effectiveness}% effective</Badge>
                    </div>
                    <p className="text-xs text-gray-600">{template.template}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Used {template.usage} times</span>
                      <Button size="sm" variant="outline" className="h-6 text-xs">
                        Use Template
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interview Prep Assistant */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Interview Preparation Assistant</span>
          </CardTitle>
          <CardDescription>
            AI-powered guidance for conducting effective interviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tips" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tips">Interview Tips</TabsTrigger>
              <TabsTrigger value="scoring">Scoring Guide</TabsTrigger>
              <TabsTrigger value="notes">Notes Template</TabsTrigger>
            </TabsList>

            <TabsContent value="tips" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">For Technical Questions:</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Allow thinking time before responding</li>
                    <li>• Ask for clarification if answer is vague</li>
                    <li>• Focus on problem-solving approach</li>
                    <li>• Probe for real-world application</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">For Behavioral Questions:</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Listen for STAR method responses</li>
                    <li>• Ask for specific examples</li>
                    <li>• Explore lessons learned</li>
                    <li>• Understand impact and outcomes</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scoring" className="space-y-4">
              <div className="text-sm">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="font-medium">Criteria</div>
                  <div className="font-medium">Excellent (4)</div>
                  <div className="font-medium">Good (3)</div>
                  <div className="font-medium">Needs Improvement (2)</div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-4 gap-4 p-2 bg-gray-50 rounded">
                    <div>Technical Knowledge</div>
                    <div>Deep understanding, innovative solutions</div>
                    <div>Solid grasp, correct approaches</div>
                    <div>Basic knowledge, guidance needed</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 p-2 bg-gray-50 rounded">
                    <div>Communication</div>
                    <div>Clear, concise, engaging</div>
                    <div>Generally clear, good explanations</div>
                    <div>Some clarity issues, basic responses</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <Textarea 
                placeholder="Interview notes template will be generated here based on the questions..."
                rows={8}
                className="w-full"
              />
              <div className="flex justify-end">
                <Button size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewQuestions;
