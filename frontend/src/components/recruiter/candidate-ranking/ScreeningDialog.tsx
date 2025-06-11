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

  const generateQuestions = async () => {
    if (!candidate || !questionPrompt) {
      toast.error('Please select a candidate and enter a question prompt');
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

    setIsGenerating(true);
    try {
      const email = await generateEmailContent({
        candidateName: candidate!.name,
        candidateRole: candidate!.role,
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
    if (!candidate || !emailContent) {
      toast.error('Please ensure all email content is ready');
      return;
    }

    setIsSending(true);
    try {
      // Mock API call to send email
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Email sent successfully!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to send email');
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