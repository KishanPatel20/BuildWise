
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Mail, Send, Edit, Copy, Zap, Users, TrendingUp } from 'lucide-react';

const PersonalizedOutreach = () => {
  const [selectedCandidate, setSelectedCandidate] = useState('sarah-chen');
  const [messageTemplate, setMessageTemplate] = useState('initial');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  const generateMessage = async () => {
    setIsGenerating(true);
    
    // Simulate AI message generation
    setTimeout(() => {
      const message = `Hi Sarah,

I came across your impressive work at TechCorp, particularly your leadership in developing React applications serving 100k+ users. Your expertise in TypeScript and GraphQL caught my attention, especially given your Stanford CS background.

We're currently looking for a Senior Frontend Developer to join our growing team at InnovateTech. The role involves leading our React migration project and working with modern technologies like the ones you've mastered.

Given your experience with team leadership and scalable frontend architectures, I believe you'd be a perfect fit for this opportunity. The position offers:
• Technical leadership opportunities
• Work with cutting-edge React ecosystem
• Competitive compensation + equity
• Remote-first culture

Would you be open to a brief conversation about this exciting opportunity? I'd love to learn more about your career goals and share details about how this role could be a great next step.

Best regards,
[Your Name]
Senior Technical Recruiter`;
      
      setGeneratedMessage(message);
      setIsGenerating(false);
    }, 2000);
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(generatedMessage);
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
                  <SelectItem value="sarah-chen">Sarah Chen - Senior Frontend Developer</SelectItem>
                  <SelectItem value="michael-rodriguez">Michael Rodriguez - Full Stack Engineer</SelectItem>
                  <SelectItem value="emily-johnson">Emily Johnson - Frontend Developer</SelectItem>
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
              <Select defaultValue="professional">
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

              <Select defaultValue="email">
                <SelectTrigger>
                  <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="linkedin">LinkedIn InMail</SelectItem>
                  <SelectItem value="message">Direct Message</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={generateMessage} disabled={isGenerating} className="w-full">
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
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
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
