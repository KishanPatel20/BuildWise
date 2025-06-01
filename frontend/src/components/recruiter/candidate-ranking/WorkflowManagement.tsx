
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  Plus, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  ArrowRight,
  Filter
} from 'lucide-react';

interface WorkflowRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  conditions: string[];
  isActive: boolean;
  lastTriggered?: string;
}

interface Candidate {
  id: string;
  name: string;
  status: string;
  stage: string;
  lastUpdated: string;
  avatar?: string;
  email: string;
  phone: string;
  appliedDate: string;
}

const WorkflowManagement = () => {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  const [mockWorkflowRules] = useState<WorkflowRule[]>([
    {
      id: '1',
      name: 'Auto-reject unqualified candidates',
      trigger: 'New application received',
      action: 'Move to rejected if less than 2 years experience',
      conditions: ['Experience < 2 years', 'Missing required skills'],
      isActive: true,
      lastTriggered: '2 hours ago'
    },
    {
      id: '2',
      name: 'Priority candidate notification',
      trigger: 'High-match candidate applies',
      action: 'Send Slack notification to hiring manager',
      conditions: ['Match score > 90%', 'Required skills present'],
      isActive: true,
      lastTriggered: '1 day ago'
    },
    {
      id: '3',
      name: 'Follow-up reminder',
      trigger: 'Candidate in screening for 3+ days',
      action: 'Send reminder to recruiter',
      conditions: ['Status = Screening', 'Days in stage >= 3'],
      isActive: false
    }
  ]);

  const [mockCandidates] = useState<Candidate[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      status: 'Active',
      stage: 'Interview Scheduled',
      lastUpdated: '2 hours ago',
      email: 'sarah.chen@email.com',
      phone: '+1 (555) 123-4567',
      appliedDate: '2024-01-15',
      avatar: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      status: 'Active',
      stage: 'Technical Review',
      lastUpdated: '5 hours ago',
      email: 'michael.r@email.com',
      phone: '+1 (555) 234-5678',
      appliedDate: '2024-01-14',
      avatar: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Emily Johnson',
      status: 'On Hold',
      stage: 'Initial Screening',
      lastUpdated: '1 day ago',
      email: 'emily.j@email.com',
      phone: '+1 (555) 345-6789',
      appliedDate: '2024-01-13',
      avatar: '/placeholder.svg'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageProgress = (stage: string) => {
    const stages = ['Applied', 'Initial Screening', 'Technical Review', 'Interview Scheduled', 'Final Interview', 'Offer'];
    const currentIndex = stages.indexOf(stage);
    return ((currentIndex + 1) / stages.length) * 100;
  };

  const filteredCandidates = selectedStatus === 'all' 
    ? mockCandidates 
    : mockCandidates.filter(c => c.status.toLowerCase() === selectedStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workflow Management</h2>
          <p className="text-gray-600">Automate your recruitment process with intelligent workflows</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pipeline">Candidate Pipeline</TabsTrigger>
          <TabsTrigger value="automation">Automation Rules</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Candidate Pipeline</CardTitle>
                  <CardDescription>Track and manage candidates through your hiring process</CardDescription>
                </div>
                <div className="flex items-center space-x-3">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Candidates</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on hold">On Hold</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCandidates.map((candidate) => (
                  <div key={candidate.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={candidate.avatar} />
                          <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{candidate.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {candidate.email}
                            </span>
                            <span className="flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {candidate.phone}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              Applied {candidate.appliedDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge className={getStatusColor(candidate.status)}>
                            {candidate.status}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">Updated {candidate.lastUpdated}</p>
                        </div>
                        <div className="w-32">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>{candidate.stage}</span>
                            <span>{Math.round(getStageProgress(candidate.stage))}%</span>
                          </div>
                          <Progress value={getStageProgress(candidate.stage)} className="h-2" />
                        </div>
                        <Button variant="outline" size="sm">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockWorkflowRules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rule.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        {rule.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Trigger</Label>
                      <p className="text-sm text-gray-600">{rule.trigger}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Action</Label>
                      <p className="text-sm text-gray-600">{rule.action}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Conditions</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rule.conditions.map((condition, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {rule.lastTriggered && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        Last triggered: {rule.lastTriggered}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Manage automated email templates for candidate communication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Email Templates</h3>
                <p className="text-gray-600 mb-4">Create your first email template to automate candidate communication</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowManagement;
