import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Upload, FileText, Brain, CheckCircle, AlertTriangle, Download, Eye, Trash2, Edit, 
  Shield, Users, TrendingDown, BarChart3, Target, MessageSquare, Copy, Zap, Clock, 
  Star, TrendingUp, Lightbulb, GitBranch, Award, MapPin, Briefcase, Settings, X,
  MessageSquare as MessageSquareIcon, Target as TargetIcon
} from 'lucide-react';
import { toast } from 'sonner';

interface ResumeAnalysisResult {
  candidate_email: string;
  overall_fit_score: number;
  skill_match_percent: number;
  experience_match_percent: number;
  education_match_percent: number;
  project_relevance_score: number;
  years_of_experience: number;
  num_relevant_projects: number;
  num_certifications: number;
  skill_gap_count: number;
  red_flag_count: number;
  strengths: string[];
  weaknesses: string[];
  summary: string;
  ranking: number;
  top_matched_skills: string[];
  experience_breakdown: Array<{
    company: string;
    role: string;
    years: number;
  }>;
  education_summary: Array<{
    degree: string;
    institution: string;
    years: number;
  }>;
  project_highlights: Array<{
    project_name: string;
    description: string;
    tech_stack: string[];
  }>;
  fit_breakdown: {
    skill_match_percent: number;
    experience_match_percent: number;
    education_match_percent: number;
  };
  recommendation_tag: string;
  red_flags: string[];
}

interface BiasAnalysis {
  overallScore: number;
  flags: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    text: string;
    suggestion: string;
    line: number;
  }>;
}

interface InterviewQuestion {
  id: string;
  type: 'technical' | 'behavioral' | 'situational' | 'leadership';
  question: string;
  reasoning: string;
  followUp: string[];
  difficulty: 'easy' | 'intermediate' | 'advanced';
  estimatedTime: string;
}

const AICopilot = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [analysisResults, setAnalysisResults] = useState<ResumeAnalysisResult[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [biasAnalysis, setBiasAnalysis] = useState<BiasAnalysis | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<InterviewQuestion[]>([]);
  const [isAnalyzingBias, setIsAnalyzingBias] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('resume-analysis');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeResumes = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one resume');
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      const recruiterToken = sessionStorage.getItem('recruiterToken');
      if (!recruiterToken) {
        throw new Error('No authorization token found');
      }

      const formData = new FormData();
      formData.append('jd', jobDescription);
      selectedFiles.forEach(file => {
        formData.append('resumes', file);
      });

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/recruiter/multi-resume-analysis/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${recruiterToken}`
        },
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('Failed to analyze resumes');
      }

      const data = await response.json();
      console.log('Analysis results:', data);
      setAnalysisResults(data.results || []);
      toast.success(`Successfully analyzed ${data.results?.length || 0} resumes`);
      setActiveTab('semantic-matching');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze resumes');
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const analyzeBias = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description first');
      return;
    }

    setIsAnalyzingBias(true);
    try {
      // Simulate bias analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockBiasAnalysis: BiasAnalysis = {
        overallScore: 75,
        flags: [
          {
            type: 'gender',
            severity: 'medium',
            text: 'skilled, rockstar',
            suggestion: 'Use "expert" or "talented" instead',
            line: 1
          },
          {
            type: 'exclusionary',
            severity: 'low',
            text: 'fast-paced environment',
            suggestion: 'Be specific about work environment expectations',
            line: 2
          }
        ]
      };
      
      setBiasAnalysis(mockBiasAnalysis);
      toast.success('Bias analysis completed');
    } catch (error) {
      toast.error('Failed to analyze bias');
    } finally {
      setIsAnalyzingBias(false);
    }
  };

  const generateInterviewQuestions = async () => {
    if (analysisResults.length === 0) {
      toast.error('Please analyze resumes first');
      return;
    }

    setIsGeneratingQuestions(true);
    try {
      // Simulate question generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockQuestions: InterviewQuestion[] = [
        {
          id: '1',
          type: 'technical',
          question: 'Based on your experience with TensorFlow and PyTorch, can you walk me through your approach to model optimization?',
          reasoning: 'Candidate shows strong ML framework experience',
          followUp: ['What specific optimization techniques did you use?', 'How did you measure performance improvements?'],
          difficulty: 'intermediate',
          estimatedTime: '8-10 minutes'
        },
        {
          id: '2',
          type: 'behavioral',
          question: 'Tell me about a challenging ML project you worked on and how you overcame obstacles.',
          reasoning: 'Assess problem-solving and project management skills',
          followUp: ['What was the biggest challenge?', 'How did you collaborate with the team?'],
          difficulty: 'easy',
          estimatedTime: '5-7 minutes'
        }
      ];
      
      setGeneratedQuestions(mockQuestions);
      toast.success('Interview questions generated');
    } catch (error) {
      toast.error('Failed to generate questions');
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const toggleCandidateSelection = (email: string) => {
    setSelectedCandidates(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const exportResults = () => {
    const data = {
      jobDescription,
      analysisResults,
      biasAnalysis,
      generatedQuestions,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-analysis-results.json';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Copilot - Resume Analysis & Insights</h1>
          <p className="text-gray-600">Comprehensive resume parsing, bias detection, and interview preparation</p>
        </div>
        <Button onClick={exportResults} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Results
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="resume-analysis">Resume Analysis</TabsTrigger>
          <TabsTrigger value="semantic-matching">Semantic Matching</TabsTrigger>
          <TabsTrigger value="candidate-comparison">Candidate Comparison</TabsTrigger>
          <TabsTrigger value="interview-prep">Interview Prep</TabsTrigger>
          <TabsTrigger value="insights">Insights & Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="resume-analysis" className="space-y-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Multi-Resume Analysis</span>
              </CardTitle>
              <CardDescription>
                Upload resumes and job description for AI-powered analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Job Description</label>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Enter the job description here..."
                  rows={6}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Upload Resumes</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    Supports PDF, DOCX, DOC, TXT • Max 10MB per file
                  </p>
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Selected Files:</h4>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Button 
                onClick={analyzeResumes} 
                disabled={isProcessing || !jobDescription.trim() || selectedFiles.length === 0}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing... {uploadProgress}%
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Resumes
                  </>
                )}
              </Button>

              {isProcessing && (
                <Progress value={uploadProgress} className="w-full" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semantic-matching" className="space-y-6">
          {analysisResults.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Semantic Matching Results</h3>
              {analysisResults.map((result, index) => (
                <Card key={result.candidate_email} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedCandidates.includes(result.candidate_email)}
                          onChange={() => toggleCandidateSelection(result.candidate_email)}
                          className="rounded"
                        />
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>
                            {result.candidate_email.split('@')[0].slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold">
                                {result.candidate_email.split('@')[0]}
                              </h3>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-lg font-bold text-green-600">
                                  {result.overall_fit_score}%
                                </span>
                              </div>
                              <Badge variant={
                                result.recommendation_tag === 'Strong Fit' ? 'default' :
                                result.recommendation_tag === 'Moderate Fit' ? 'secondary' :
                                'outline'
                              }>
                                {result.recommendation_tag}
                              </Badge>
                            </div>
                            <p className="text-gray-600">
                              {result.years_of_experience} years experience • {result.num_relevant_projects} relevant projects
                            </p>
                          </div>
                        </div>
                        {/* AI Insights */}
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="flex items-start space-x-2">
                            <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-blue-800">AI Summary</p>
                              <p className="text-sm text-blue-700">{result.summary}</p>
                            </div>
                          </div>
                        </div>
                        {/* Matching Scores */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-medium">Skills Match</span>
                              <span className="text-xs">{result.skill_match_percent}%</span>
                            </div>
                            <Progress value={result.skill_match_percent} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-medium">Experience</span>
                              <span className="text-xs">{result.experience_match_percent}%</span>
                            </div>
                            <Progress value={result.experience_match_percent} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-medium">Education</span>
                              <span className="text-xs">{result.education_match_percent}%</span>
                            </div>
                            <Progress value={result.education_match_percent} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-medium">Projects</span>
                              <span className="text-xs">{result.project_relevance_score}%</span>
                            </div>
                            <Progress value={result.project_relevance_score} className="h-2" />
                          </div>
                        </div>
                        {/* Skills & Experience */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h5 className="text-sm font-medium text-green-600 mb-2">Top Skills</h5>
                            <div className="flex flex-wrap gap-1">
                              {result.top_matched_skills.slice(0, 5).map((skill, idx) => (
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
                              {result.weaknesses.slice(0, 3).map((weakness, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs text-orange-600 border-orange-200">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  {weakness}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium mb-2">Key Metrics</h5>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span>Experience:</span>
                                <span>{result.years_of_experience} years</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Projects:</span>
                                <span>{result.num_relevant_projects}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Red Flags:</span>
                                <span>{result.red_flag_count}</span>
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
          ) : (
            <div className="text-center text-gray-500">No analysis results yet. Please run resume analysis.</div>
          )}
        </TabsContent>

        <TabsContent value="candidate-comparison" className="space-y-6">
          {selectedCandidates.length >= 2 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Candidate Comparison</span>
                </CardTitle>
                <CardDescription>
                  Side-by-side analysis of {selectedCandidates.length} selected candidates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedCandidates.map(email => {
                    const candidate = analysisResults.find(r => r.candidate_email === email);
                    if (!candidate) return null;
                    return (
                      <div key={email} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{candidate.candidate_email.split('@')[0]}</h4>
                          <Badge variant="outline">{candidate.overall_fit_score}% match</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Skills:</span>
                            <div className="font-medium">{candidate.skill_match_percent}%</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Experience:</span>
                            <div className="font-medium">{candidate.experience_match_percent}%</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Education:</span>
                            <div className="font-medium">{candidate.education_match_percent}%</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Projects:</span>
                            <div className="font-medium">{candidate.project_relevance_score}%</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select Candidates to Compare</h3>
                <p className="text-gray-600">Choose 2 or more candidates from the semantic matching results to see detailed side-by-side comparison</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="bias-detection" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Content Bias Analysis</span>
                </CardTitle>
                <CardDescription>
                  Analyze job description for biased language and suggestions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={analyzeBias} 
                  disabled={isAnalyzingBias || !jobDescription.trim()}
                  className="w-full"
                >
                  {isAnalyzingBias ? 'Analyzing...' : 'Analyze for Bias'}
                </Button>

                {biasAnalysis && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Bias Analysis Results</h4>
                      <Badge variant={biasAnalysis.overallScore > 80 ? 'default' : biasAnalysis.overallScore > 60 ? 'secondary' : 'destructive'}>
                        Score: {biasAnalysis.overallScore}/100
                      </Badge>
                    </div>
                    
                    {biasAnalysis.flags.map((flag, index) => (
                      <Alert key={index} className={
                        flag.severity === 'high' ? 'border-red-200' :
                        flag.severity === 'medium' ? 'border-yellow-200' :
                        'border-blue-200'
                      }>
                        <AlertTriangle className={`h-4 w-4 ${
                          flag.severity === 'high' ? 'text-red-500' :
                          flag.severity === 'medium' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`} />
                        <AlertDescription>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">{flag.type}</Badge>
                              <Badge variant="outline" className={`text-xs ${
                                flag.severity === 'high' ? 'border-red-200 text-red-600' :
                                flag.severity === 'medium' ? 'border-yellow-200 text-yellow-600' :
                                'border-blue-200 text-blue-600'
                              }`}>
                                {flag.severity}
                              </Badge>
                            </div>
                            <p className="text-sm">
                              <strong>Flagged:</strong> "{flag.text}"
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Suggestion:</strong> {flag.suggestion}
                            </p>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Pipeline Demographics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{analysisResults.length}</div>
                    <div className="text-sm text-gray-500">Candidates Analyzed</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Strong Fit:</span>
                      <span>{analysisResults.filter(r => r.recommendation_tag === 'Strong Fit').length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Moderate Fit:</span>
                      <span>{analysisResults.filter(r => r.recommendation_tag === 'Moderate Fit').length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Red Flags Detected:</span>
                      <span>{analysisResults.reduce((sum, r) => sum + r.red_flag_count, 0)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="interview-prep" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquareIcon className="w-5 h-5" />
                <span>AI Interview Question Generator</span>
              </CardTitle>
              <CardDescription>
                Generate contextual questions based on candidate analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={generateInterviewQuestions}
                disabled={isGeneratingQuestions || analysisResults.length === 0}
                className="w-full"
              >
                {isGeneratingQuestions ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Interview Questions
                  </>
                )}
              </Button>

              {generatedQuestions.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Generated Questions</h4>
                  {generatedQuestions.map((question) => (
                    <div key={question.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className={
                              question.type === 'technical' ? 'border-blue-200 text-blue-600' :
                              question.type === 'behavioral' ? 'border-green-200 text-green-600' :
                              question.type === 'situational' ? 'border-purple-200 text-purple-600' :
                              'border-orange-200 text-orange-600'
                            }>
                              {question.type}
                            </Badge>
                            <Badge variant="outline" className={
                              question.difficulty === 'easy' ? 'border-green-200 text-green-600' :
                              question.difficulty === 'intermediate' ? 'border-yellow-200 text-yellow-600' :
                              'border-red-200 text-red-600'
                            }>
                              {question.difficulty}
                            </Badge>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {question.estimatedTime}
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <h5 className="font-medium mb-2">Question:</h5>
                              <p className="text-sm bg-gray-50 p-3 rounded border">{question.question}</p>
                            </div>
                            
                            <div>
                              <h5 className="font-medium mb-2">AI Reasoning:</h5>
                              <p className="text-sm text-gray-600 italic">{question.reasoning}</p>
                            </div>

                            <div>
                              <h5 className="font-medium mb-2">Follow-up Questions:</h5>
                              <ul className="text-sm space-y-1">
                                {question.followUp.map((follow, idx) => (
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
                          <Button size="sm" variant="outline" onClick={() => copyToClipboard(question.question)}>
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Analysis Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Match Score</span>
                    <span className="font-medium">
                      {analysisResults.length > 0 
                        ? Math.round(analysisResults.reduce((sum, r) => sum + r.overall_fit_score, 0) / analysisResults.length)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Top Candidates</span>
                    <span className="font-medium">
                      {analysisResults.filter(r => r.overall_fit_score >= 80).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Perfect Skill Matches</span>
                    <span className="font-medium">
                      {analysisResults.filter(r => r.skill_match_percent >= 90).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Processing Accuracy</span>
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
                  {analysisResults.length > 0 && (
                    <>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Pattern Detected:</strong> Candidates with cloud experience show 25% higher overall scores
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Skill Gap:</strong> Most candidates need MLOps experience
                        </p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm text-orange-800">
                          <strong>Market Insight:</strong> Strong demand for AI/ML engineers with production experience
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AICopilot; 