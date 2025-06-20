import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { generateScreeningQuestions, generateEmailContent } from '@/services/llm/groqService';

interface Candidate {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  matchScore: number;
  candidate_token: string;
}

interface ScreeningDialogProps {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ScreeningDialog = ({ candidate, open, onOpenChange }: ScreeningDialogProps) => {
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

  const LYZE_API_KEY = 'sk-default-2Ay7sSOlWxclQA80RWcsQ441TJMesqSo';
  const LYZE_AGENT_ID = '68541a018da27df0ba09a647';
  const USER_ID = 'deveshbhardwaj730@gmail.com';
  const [sessionId] = useState(() => `${LYZE_AGENT_ID}-${Math.random().toString(36).substring(2, 15)}`);

  const generateQuestions = async () => {
    if (!candidate || !questionPrompt) {
      toast.error('Please select a candidate and enter a question prompt');
      return;
    }

    if (!candidate.candidate_token) {
      toast.error('Candidate token is missing. Cannot proceed.');
      setIsGenerating(false);
      return;
    }

    setIsGenerating(true);
    try {
      const questions = await generateScreeningQuestions({
        candidateName: candidate.name,
        candidateRole: candidate.role,
        questionPrompt,
        matchScore: candidate.matchScore
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

    if (!candidate) {
      toast.error('No candidate selected.');
      return;
    }

    if (!candidate.candidate_token || typeof candidate.candidate_token !== 'string' || candidate.candidate_token.trim() === '') {
      console.error('Candidate object missing candidate_token:', candidate);
      toast.error('Candidate token is missing. Cannot proceed.');
      return;
    }

    setIsGenerating(true);
    try {
      const questionsForApi = selectedQuestions.map(q => q.question);
      const payload = {
        round: 'pre-screening',
        questions: questionsForApi,
        candidate_token: candidate.candidate_token,
        answers: [],
      };
      console.log('Sending screening payload:', payload);

      const roundQaResponse = await fetch('http://ec2-13-60-240-125.eu-north-1.compute.amazonaws.com/recruiter/round-qa/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${sessionStorage.getItem('recruiterToken')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!roundQaResponse.ok) {
        throw new Error('Failed to save screening questions.');
      }

      const roundQaData = await roundQaResponse.json();
      const recruiterId = roundQaData.questions?.recruiter;
      const candidateId = roundQaData.questions?.candidate;
      const recruiterToken = sessionStorage.getItem('recruiterToken');

      if (!recruiterToken) {
        throw new Error('Recruiter token not found. Please log in again.');
      }

      if (!recruiterId || !candidateId) {
        throw new Error('Could not retrieve recruiter or candidate ID from API response.');
      }

      const email = await generateEmailContent({
        candidateName: candidate.name,
        candidateRole: candidate.role,
        selectedQuestions,
        tone: emailTone,
        candidateId: candidateId.toString(),
        candidateToken: candidate.candidate_token,
        recruiterId: recruiterId.toString(),
        recruiterToken,
      });
      setEmailContent(email);
      setCurrentStep('email');
    } catch (error) {
      console.error('Error generating email:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate email. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const sendEmail = async () => {
    if (!candidate || !emailContent) {
      toast.error('Please ensure all email content is ready');
      return;
    }

    setIsSending(true);
    try {
      // Prepare the message for the Lyzr agent
      const agentMessage = JSON.stringify({
        to: candidate.email,
        subject: `Interview Invitation - ${candidate.role}`,
        body: emailContent
      });

      // Call Lyzr Agent API
      const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': LYZE_API_KEY
        },
        body: JSON.stringify({
          user_id: USER_ID,
          agent_id: LYZE_AGENT_ID,
          session_id: sessionId,
          message: agentMessage
        })
      });

      if (response.ok) {
        toast.success('Email sent successfully!');
        onOpenChange(false);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 'questions' ? 'AI Question Generation' : 'Candidate Outreach'}
          </DialogTitle>
        </DialogHeader>

        {currentStep === 'questions' ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={candidate?.avatar} />
                <AvatarFallback>{candidate?.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{candidate?.name}</h3>
                <p className="text-sm text-gray-500">{candidate?.role}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>What kind of questions do you want to ask?</Label>
                <Input
                  value={questionPrompt}
                  onChange={(e) => setQuestionPrompt(e.target.value)}
                  placeholder="E.g., Focus on technical skills, leadership experience, etc."
                  className="mt-1"
                />
              </div>

              <Button
                onClick={generateQuestions}
                disabled={isGenerating || !questionPrompt}
                className="w-full"
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Generating Questions...
                  </div>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Questions
                  </>
                )}
              </Button>

              {generatedQuestions.length > 0 && (
                <div className="space-y-4">
                  {generatedQuestions.map((q) => (
                    <div key={q.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        checked={q.selected}
                        onCheckedChange={() => handleQuestionSelect(q.id)}
                        disabled={!q.selected && generatedQuestions.filter(q => q.selected).length >= 2}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{q.question}</p>
                        <Badge variant="outline" className="mt-1">
                          {q.skill}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={generateEmail}
                    disabled={generatedQuestions.filter(q => q.selected).length !== 2}
                    className="w-full"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Continue to Email
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Email Tone</Label>
                <RadioGroup
                  value={emailTone}
                  onValueChange={(value: 'friendly' | 'professional' | 'direct') => setEmailTone(value)}
                  className="grid grid-cols-3 gap-4 mt-2"
                >
                  <div>
                    <RadioGroupItem value="friendly" id="friendly" className="peer sr-only" />
                    <Label
                      htmlFor="friendly"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Mail className="mb-3 h-6 w-6" />
                      Friendly
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="professional" id="professional" className="peer sr-only" />
                    <Label
                      htmlFor="professional"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Mail className="mb-3 h-6 w-6" />
                      Professional
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="direct" id="direct" className="peer sr-only" />
                    <Label
                      htmlFor="direct"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Mail className="mb-3 h-6 w-6" />
                      Direct
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Email Preview</Label>
                <Textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  className="mt-1 h-[300px] font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('questions')}
                >
                  Back to Questions
                </Button>
                <Button
                  onClick={sendEmail}
                  disabled={isSending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSending ? (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScreeningDialog; 