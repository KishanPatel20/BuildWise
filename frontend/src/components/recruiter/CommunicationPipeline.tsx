import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { MessageSquare, Brain, ChevronRight, CheckCircle, AlertCircle, Clock, ArrowRight, Star, Award, Briefcase, Mail, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import ScreeningDialog from './candidate-ranking/ScreeningDialog';
import { generateScreeningQuestions, generateEmailContent } from '@/services/llm/groqService';

interface Candidate {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  matchScore: number;
  status: 'shortlisted' | 'pre-screening' | 'technical-interview' | 'hr-interview' | 'final-result';
  lastUpdated: string;
  notes?: string[];
  stageDetails?: {
    score?: number;
    feedback?: string;
    nextSteps?: string[];
    interviewDate?: string;
  };
}

// Mock data for demonstration
const MOCK_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    role: 'Senior Frontend Developer',
    matchScore: 92,
    status: 'shortlisted',
    lastUpdated: new Date().toISOString(),
    avatar: 'https://i.pravatar.cc/150?img=1',
    notes: ['Strong React experience', 'Open to relocation']
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    email: 'michael.r@example.com',
    role: 'Full Stack Engineer',
    matchScore: 88,
    status: 'pre-screening',
    lastUpdated: new Date(Date.now() - 86400000).toISOString(),
    avatar: 'https://i.pravatar.cc/150?img=2',
    stageDetails: {
      score: 85,
      feedback: 'Strong technical background, needs clarification on system design experience',
      nextSteps: ['Schedule technical interview', 'Review system design portfolio']
    }
  },
  {
    id: '3',
    name: 'Priya Patel',
    email: 'priya.p@example.com',
    role: 'Backend Developer',
    matchScore: 95,
    status: 'technical-interview',
    lastUpdated: new Date(Date.now() - 172800000).toISOString(),
    avatar: 'https://i.pravatar.cc/150?img=3',
    stageDetails: {
      interviewDate: '2024-03-25T14:00:00Z',
      nextSteps: ['Prepare system design questions', 'Review coding challenge']
    }
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'james.w@example.com',
    role: 'DevOps Engineer',
    matchScore: 90,
    status: 'hr-interview',
    lastUpdated: new Date(Date.now() - 259200000).toISOString(),
    avatar: 'https://i.pravatar.cc/150?img=4',
    stageDetails: {
      feedback: 'Technical interview passed with flying colors',
      nextSteps: ['Discuss salary expectations', 'Review benefits package']
    }
  },
  {
    id: '5',
    name: 'Emma Thompson',
    email: 'emma.t@example.com',
    role: 'Product Manager',
    matchScore: 87,
    status: 'final-result',
    lastUpdated: new Date(Date.now() - 345600000).toISOString(),
    avatar: 'https://i.pravatar.cc/150?img=5',
    stageDetails: {
      score: 92,
      feedback: 'Excellent cultural fit, strong leadership skills',
      nextSteps: ['Prepare offer letter', 'Schedule onboarding']
    }
  }
];

const SHORTLISTED_CANDIDATES_KEY = 'shortlisted_candidates';

const CommunicationPipeline = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState<'questions' | 'email'>('questions');
  const [questionPrompt, setQuestionPrompt] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<Array<{
    id: string;
    question: string;
    skill: string;
    selected: boolean;
  }>>([]);
  const [emailTone, setEmailTone] = useState<'friendly' | 'professional' | 'direct'>('professional');
  const [emailContent, setEmailContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Load shortlisted candidates from session storage
    const stored = sessionStorage.getItem(SHORTLISTED_CANDIDATES_KEY);
    if (stored) {
      const shortlistedCandidates = JSON.parse(stored);
      // Transform the data to match our pipeline format
      const pipelineCandidates = shortlistedCandidates.map((c: any) => ({
        id: c.user_token,
        name: c.name,
        email: c.email,
        avatar: c.avatar,
        role: c.role,
        matchScore: c.matchScore,
        status: 'shortlisted',
        lastUpdated: new Date().toISOString(),
        notes: []
      }));
      setCandidates(prev => [...pipelineCandidates, ...prev]);
    }
  }, []);

  const moveCandidate = (candidateId: string, newStatus: Candidate['status']) => {
    setCandidates(prev => prev.map(c => 
      c.id === candidateId 
        ? { ...c, status: newStatus, lastUpdated: new Date().toISOString() }
        : c
    ));
  };

  const getStatusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'shortlisted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pre-screening': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'technical-interview': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'hr-interview': return 'bg-green-100 text-green-800 border-green-200';
      case 'final-result': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Candidate['status']) => {
    switch (status) {
      case 'shortlisted': return <Star className="w-4 h-4" />;
      case 'pre-screening': return <Brain className="w-4 h-4" />;
      case 'technical-interview': return <Briefcase className="w-4 h-4" />;
      case 'hr-interview': return <MessageSquare className="w-4 h-4" />;
      case 'final-result': return <Award className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStageDescription = (status: Candidate['status']) => {
    switch (status) {
      case 'shortlisted': return 'Initial screening passed';
      case 'pre-screening': return 'AI assessment in progress';
      case 'technical-interview': return 'Technical evaluation';
      case 'hr-interview': return 'Final interview stage';
      case 'final-result': return 'Decision pending';
      default: return '';
    }
  };

  const generateQuestions = async () => {
    if (!selectedCandidate || !questionPrompt) {
      toast.error('Please select a candidate and enter a question prompt');
      return;
    }

    setIsGenerating(true);
    try {
      const questions = await generateScreeningQuestions({
        candidateName: selectedCandidate.name,
        candidateRole: selectedCandidate.role,
        questionPrompt,
        matchScore: selectedCandidate.matchScore
      });
      setGeneratedQuestions(questions);
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Failed to generate questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuestionSelect = (questionId: string) => {
    setGeneratedQuestions(prev => {
      const selectedCount = prev.filter(q => q.selected).length;
      const newQuestions = prev.map(q => {
        if (q.id === questionId) {
          // Only allow selecting if less than 2 questions are selected or if unselecting
          if (!q.selected && selectedCount >= 2) return q;
          return { ...q, selected: !q.selected };
        }
        return q;
      });
      return newQuestions;
    });
  };

  const generateEmail = async () => {
    const selectedQuestions = generatedQuestions.filter(q => q.selected);
    if (selectedQuestions.length !== 2) {
      toast.error('Please select exactly 2 questions');
      return;
    }

    setIsGenerating(true);
    try {
      const email = await generateEmailContent({
        candidateName: selectedCandidate!.name,
        candidateRole: selectedCandidate!.role,
        selectedQuestions,
        tone: emailTone
      });
      setEmailContent(email);
      setCurrentStep('email');
    } catch (error) {
      console.error('Error generating email:', error);
      toast.error('Failed to generate email. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const sendEmail = async () => {
    if (!selectedCandidate || !emailContent) {
      toast.error('Please ensure all email content is ready');
      return;
    }

    setIsSending(true);
    try {
      // Mock API call to send email
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Email sent successfully!');
      setShowDialog(false);
    } catch (error) {
      toast.error('Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  const renderPipelineColumn = (status: Candidate['status'], title: string) => {
    const columnCandidates = candidates.filter(c => c.status === status);
    
    return (
      <div className="flex-none w-[320px] max-w-[400px] bg-white rounded-lg border shadow-sm scroll-snap-start">
        <div className="p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {getStatusIcon(status)}
              <h3 className="font-semibold text-gray-700">{title}</h3>
            </div>
            <Badge variant="outline" className={getStatusColor(status)}>
              {columnCandidates.length}
            </Badge>
          </div>
          <p className="text-xs text-gray-500">{getStageDescription(status)}</p>
        </div>
        
        <div 
          className="p-3 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto no-scrollbar"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {columnCandidates.map(candidate => (
            <Card 
              key={candidate.id}
              className="cursor-pointer hover:shadow-md transition-all duration-200 border-gray-100"
              onClick={() => setSelectedCandidate(candidate)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10 border-2 border-gray-100">
                    <AvatarImage src={candidate.avatar} />
                    <AvatarFallback>{candidate.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate">{candidate.name}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(candidate.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-600 truncate">{candidate.role}</p>
                    
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Match Score</span>
                        <span className="font-medium">{candidate.matchScore}%</span>
                      </div>
                      <Progress 
                        value={candidate.matchScore} 
                        className={`h-1.5 ${
                          candidate.matchScore >= 90 ? "bg-green-500" : 
                          candidate.matchScore >= 80 ? "bg-blue-500" : 
                          "bg-orange-500"
                        }`}
                      />
                    </div>

                    {candidate.stageDetails && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        {candidate.stageDetails.interviewDate && (
                          <div className="flex items-center text-xs text-gray-600">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(candidate.stageDetails.interviewDate).toLocaleDateString()}
                          </div>
                        )}
                        {candidate.stageDetails.score && (
                          <div className="flex items-center text-xs text-gray-600 mt-1">
                            <Star className="w-3 h-3 mr-1" />
                            Stage Score: {candidate.stageDetails.score}%
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex justify-between">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCandidate(candidate);
                      setShowDialog(true);
                    }}
                  >
                    <Brain className="w-4 h-4 mr-1" />
                    Start Screening
                  </Button>
                </div>

                {status !== 'final-result' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full mt-2 text-xs text-gray-500 hover:text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      const nextStatus = {
                        'shortlisted': 'pre-screening',
                        'pre-screening': 'technical-interview',
                        'technical-interview': 'hr-interview',
                        'hr-interview': 'final-result'
                      }[status] as Candidate['status'];
                      moveCandidate(candidate.id, nextStatus);
                    }}
                  >
                    Move to next stage
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col p-6 bg-gray-50 overflow-hidden">
      <div className="flex-none flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Candidate Pipeline</h2>
          <p className="text-sm text-gray-500 mt-1">Track and manage candidates through the hiring process</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
            {candidates.filter(c => c.status === 'final-result').length} Hired
          </Badge>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
            {candidates.length} Total
          </Badge>
        </div>
      </div>

      {/* Pipeline container with hidden scrollbars */}
      <div className="flex-1 relative min-h-0">
        <div 
          className="absolute inset-0 flex space-x-4 overflow-x-auto  no-scrollbar"
          style={{ 
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}
        >
          {/* Add padding to ensure last column is fully visible */}
          <div className="flex space-x-4 pl-1 pr-6">
            {renderPipelineColumn('shortlisted', 'Shortlisted')}
            {renderPipelineColumn('pre-screening', 'Pre-Screening')}
            {renderPipelineColumn('technical-interview', 'Technical Interview')}
            {renderPipelineColumn('hr-interview', 'HR Interview')}
            {renderPipelineColumn('final-result', 'Final Result')}
          </div>
        </div>
      </div>

      {/* Combined Screening Dialog */}
      <ScreeningDialog
        candidate={selectedCandidate}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </div>
  );
};

export default CommunicationPipeline; 