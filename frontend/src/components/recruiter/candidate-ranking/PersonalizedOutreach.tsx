import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Mail, Send, Edit, Copy, Zap, Users, TrendingUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShortlistedCandidate {
  user_token: string;
  name: string;
  role: string;
  matchScore: number;
  email?: string;
}

const SHORTLISTED_CANDIDATES_KEY = 'shortlisted_candidates';

interface MessageFilters {
  type: 'initial' | 'followup' | 'interview' | 'offer';
  tone: 'professional' | 'casual' | 'friendly' | 'formal';
  channel: 'email' | 'linkedin' | 'message';
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const LYZE_API_KEY = 'sk-default-2Ay7sSOlWxclQA80RWcsQ441TJMesqSo';
const LYZE_AGENT_ID = '6839e34706e05ef78261a210';

const PersonalizedOutreach = () => {
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [shortlistedCandidates, setShortlistedCandidates] = useState<ShortlistedCandidate[]>([]);
  const [messageTemplate, setMessageTemplate] = useState('initial');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messageFilters, setMessageFilters] = useState<MessageFilters>({
    type: 'initial',
    tone: 'professional',
    channel: 'email'
  });
  const [isSending, setIsSending] = useState(false);
  const [sessionId, setSessionId] = useState('');

  const [outreachCampaigns, setOutreachCampaigns] = useState([
    {
      id: '1',
      name: 'Senior Frontend Developers Q1',
      status: 'active',
      sent: 24,
      opened: 18,
      replied: 7,
      response_rate: 29.2,
      channels: ['email', 'linkedin']
    },
    {
      id: '2',
      name: 'Full Stack Engineers - Fintech',
      status: 'draft',
      sent: 0,
      opened: 0,
      replied: 0,
      response_rate: 0,
      channels: ['email']
    }
  ]);

  useEffect(() => {
    // Load shortlisted candidates from session storage
    const stored = sessionStorage.getItem(SHORTLISTED_CANDIDATES_KEY);
    if (stored) {
      const candidates = JSON.parse(stored);
      setShortlistedCandidates(candidates);
      // Set the first candidate as selected if available
      if (candidates.length > 0) {
        setSelectedCandidate(candidates[0].user_token);
      }
    }
  }, []);

  useEffect(() => {
    // Generate a unique session ID when component mounts
    setSessionId(`${LYZE_AGENT_ID}-${Math.random().toString(36).substring(2, 15)}`);
  }, []);

  const generateMessage = async () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate first');
      return;
    }

    setIsGenerating(true);
    try {
      const candidate = shortlistedCandidates.find(c => c.user_token === selectedCandidate);
      if (!candidate) {
        throw new Error('Selected candidate not found');
      }

      const systemPrompt = `You are an expert technical recruiter crafting personalized outreach messages. 
Your task is to create a compelling message that:
1. Is highly personalized to the candidate's background and experience
2. Matches the specified tone (${messageFilters.tone})
3. Is appropriate for the selected channel (${messageFilters.channel})
4. Follows the message type requirements (${messageFilters.type})

Guidelines:
- Keep the message concise but impactful (2-3 paragraphs)
- Highlight specific achievements or skills mentioned in their profile
- Include relevant details about the role and company
- End with a clear call to action
- Maintain a ${messageFilters.tone} tone throughout
- Format appropriately for ${messageFilters.channel} communication

Example for ${messageFilters.type} message:
${getExampleMessage(messageFilters.type)}

Remember to:
- Personalize based on their role (${candidate.role}) and match score (${candidate.matchScore}%)
- Use their name (${candidate.name}) naturally in the message
- Keep the tone ${messageFilters.tone} and professional
- Format for ${messageFilters.channel} delivery`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { 
              role: 'user', 
              content: `Generate a ${messageFilters.type} outreach message for ${candidate.name}, a ${candidate.role} with a ${candidate.matchScore}% match score. 
              The message should be ${messageFilters.tone} in tone and formatted for ${messageFilters.channel}.`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate message');
      }

      const data = await response.json();
      const generatedText = data.choices[0].message.content;
      setGeneratedMessage(generatedText);

    } catch (error) {
      console.error('Error generating message:', error);
      toast.error('Failed to generate message. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getExampleMessage = (type: MessageFilters['type']): string => {
    switch (type) {
      case 'initial':
        return `Hi [Name],

I came across your impressive work at [Company], particularly your expertise in [Skill]. Your experience with [Technology] caught my attention, especially given your background in [Field].

We're currently looking for a [Role] to join our team at [Company]. The position offers [Key Benefits] and the opportunity to work on [Project/Technology].

Would you be open to a brief conversation about this opportunity? I'd love to learn more about your career goals.

Best regards,
[Your Name]`;

      case 'followup':
        return `Hi [Name],

I hope this message finds you well. I wanted to follow up on my previous message about the [Role] position at [Company].

I thought you might be interested in [Recent Development/Project] we're working on, which aligns well with your experience in [Skill].

Would you have 15 minutes for a quick chat this week?

Best regards,
[Your Name]`;

      case 'interview':
        return `Hi [Name],

Great news! The team was impressed with your background, and we'd love to invite you for a technical interview for the [Role] position.

The interview will focus on [Topics] and last approximately [Duration]. We can schedule it for [Time Options].

Please let me know your availability, and I'll send over the detailed agenda.

Best regards,
[Your Name]`;

      case 'offer':
        return `Hi [Name],

I'm excited to share that we'd like to extend an offer for the [Role] position at [Company]!

The offer includes [Key Benefits] and [Compensation Details]. We believe this opportunity aligns well with your career goals in [Field].

Would you be available for a call to discuss the details?

Best regards,
[Your Name]`;

      default:
        return '';
    }
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(generatedMessage);
  };

  const sendMessage = async () => {
    if (!selectedCandidate || !generatedMessage) {
      toast.error('Please select a candidate and generate a message first');
      return;
    }

    setIsSending(true);
    try {
      const candidate = shortlistedCandidates.find(c => c.user_token === selectedCandidate);
      if (!candidate) {
        throw new Error('Selected candidate not found');
      }

      // Prepare the message for the Lyze agent
      const agentMessage = JSON.stringify({
        mode: "send",
        recipient_name: candidate.name,
        recipient_email: candidate.email || `${candidate.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        subject: `${messageFilters.type === 'initial' ? 'Opportunity at Our Company' : 
                 messageFilters.type === 'followup' ? 'Following up on our conversation' :
                 messageFilters.type === 'interview' ? 'Interview Invitation' : 
                 'Offer Discussion'} - ${candidate.role}`,
        message: generatedMessage
      });

      // Call Lyze agent API
      const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': LYZE_API_KEY
        },
        body: JSON.stringify({
          user_id: "deveshbhardwaj730@gmail.com",
          agent_id: LYZE_AGENT_ID,
          session_id: sessionId,
          message: agentMessage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Store the thread ID for future tracking
      if (data.gmail_response?.threadId) {
        // You might want to store this in a database or state management
        console.log('Email thread ID:', data.gmail_response.threadId);
      }

      toast.success('Message sent successfully!');
      
      // Optionally clear the generated message
      // setGeneratedMessage('');

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Generator */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>AI Message Generator</span>
            </CardTitle>
            <CardDescription>
              Create highly personalized outreach messages based on candidate profiles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select value={selectedCandidate} onValueChange={setSelectedCandidate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select candidate" />
                </SelectTrigger>
                <SelectContent>
                  {shortlistedCandidates.length > 0 ? (
                    shortlistedCandidates.map((candidate) => (
                      <SelectItem 
                        key={candidate.user_token} 
                        value={candidate.user_token || 'no-token'}
                      >
                        {candidate.name} - {candidate.role} ({candidate.matchScore}% Match)
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-candidates" disabled>
                      No shortlisted candidates
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>

              <Select value={messageTemplate} onValueChange={setMessageTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Message type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="initial">Initial Outreach</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                  <SelectItem value="interview">Interview Invitation</SelectItem>
                  <SelectItem value="offer">Offer Discussion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Select 
                value={messageFilters.tone} 
                onValueChange={(value: MessageFilters['tone']) => 
                  setMessageFilters(prev => ({ ...prev, tone: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={messageFilters.channel} 
                onValueChange={(value: MessageFilters['channel']) => 
                  setMessageFilters(prev => ({ ...prev, channel: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="linkedin">LinkedIn InMail</SelectItem>
                  <SelectItem value="message">Direct Message</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                onClick={generateMessage} 
                disabled={isGenerating || !selectedCandidate} 
                className="w-full"
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </div>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>

            {generatedMessage && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Generated Message</h4>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={copyMessage}>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={generatedMessage}
                  onChange={(e) => setGeneratedMessage(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Save as Template</Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={sendMessage}
                    disabled={isSending}
                  >
                    {isSending ? (
                      <div className="flex items-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Outreach Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Outreach Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Messages Sent Today</span>
                <Badge variant="outline">24</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Open Rate</span>
                <Badge variant="outline">75%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Response Rate</span>
                <Badge variant="outline">29%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg. Response Time</span>
                <Badge variant="outline">2.3 days</Badge>
              </div>
            </div>

            <div className="pt-4 border-t space-y-2">
              <h4 className="font-medium">AI Insights</h4>
              <div className="text-sm space-y-2">
                <div className="p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-green-700">Messages mentioning specific projects get 34% higher response rates</p>
                </div>
                <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-blue-700">Best time to send: Tuesday 10-11 AM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Outreach Campaigns</span>
            </div>
            <Button size="sm">
              <Mail className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </CardTitle>
          <CardDescription>
            Manage multi-step outreach sequences and track performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {outreachCampaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{campaign.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={
                        campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {campaign.status}
                      </Badge>
                      <div className="flex space-x-1">
                        {campaign.channels.map((channel) => (
                          <Badge key={channel} variant="outline" className="text-xs">
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{campaign.response_rate}%</div>
                    <div className="text-sm text-gray-500">Response Rate</div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold">{campaign.sent}</div>
                    <div className="text-xs text-gray-500">Sent</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{campaign.opened}</div>
                    <div className="text-xs text-gray-500">Opened</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{campaign.replied}</div>
                    <div className="text-xs text-gray-500">Replied</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{Math.round((campaign.replied / Math.max(campaign.sent, 1)) * 100)}%</div>
                    <div className="text-xs text-gray-500">Conversion</div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button size="sm" variant="outline">Edit Sequence</Button>
                  {campaign.status === 'draft' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Launch Campaign
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Message Templates</CardTitle>
          <CardDescription>Pre-built and AI-optimized templates for different scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="initial" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="initial">Initial Outreach</TabsTrigger>
              <TabsTrigger value="followup">Follow-up</TabsTrigger>
              <TabsTrigger value="interview">Interview Invite</TabsTrigger>
              <TabsTrigger value="offer">Offer Discussion</TabsTrigger>
            </TabsList>

            <TabsContent value="initial" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Tech-Focused Template</h4>
                  <p className="text-sm text-gray-600 mb-3">Emphasizes technical skills and projects</p>
                  <div className="flex justify-between">
                    <Badge variant="outline">92% Response Rate</Badge>
                    <Button size="sm" variant="outline">Use Template</Button>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Career Growth Template</h4>
                  <p className="text-sm text-gray-600 mb-3">Focuses on career advancement opportunities</p>
                  <div className="flex justify-between">
                    <Badge variant="outline">87% Response Rate</Badge>
                    <Button size="sm" variant="outline">Use Template</Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="followup" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Gentle Reminder</h4>
                  <p className="text-sm text-gray-600 mb-3">Soft follow-up after 1 week</p>
                  <div className="flex justify-between">
                    <Badge variant="outline">67% Response Rate</Badge>
                    <Button size="sm" variant="outline">Use Template</Button>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Value-Add Follow-up</h4>
                  <p className="text-sm text-gray-600 mb-3">Includes relevant industry insights</p>
                  <div className="flex justify-between">
                    <Badge variant="outline">73% Response Rate</Badge>
                    <Button size="sm" variant="outline">Use Template</Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="interview" className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                Interview invitation templates coming soon...
              </div>
            </TabsContent>

            <TabsContent value="offer" className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                Offer discussion templates coming soon...
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalizedOutreach;
