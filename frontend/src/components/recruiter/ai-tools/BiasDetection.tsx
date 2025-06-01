
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, BarChart3, Users, TrendingDown, Eye, FileText } from 'lucide-react';

const BiasDetection = () => {
  const [jobDescription, setJobDescription] = useState(`We're looking for a young, energetic developer who can hit the ground running. Must be a rockstar programmer with ninja-level skills. We need someone who's a cultural fit for our fast-paced, high-energy startup environment.`);
  const [outreachMessage, setOutreachMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [biasAnalysis] = useState({
    overallScore: 65,
    flags: [
      {
        type: 'age',
        severity: 'high',
        text: 'young, energetic',
        suggestion: 'Replace with "motivated" or "enthusiastic"',
        line: 1
      },
      {
        type: 'gender',
        severity: 'medium', 
        text: 'rockstar, ninja',
        suggestion: 'Use "skilled" or "expert" instead of these terms',
        line: 2
      },
      {
        type: 'exclusionary',
        severity: 'medium',
        text: 'cultural fit',
        suggestion: 'Be specific about required skills and values',
        line: 3
      }
    ]
  });

  const [pipelineData] = useState([
    {
      stage: 'Applications',
      total: 847,
      demographics: {
        male: 455, female: 342, nonBinary: 38, undisclosed: 12,
        white: 423, asian: 211, hispanic: 98, black: 67, other: 48
      }
    },
    {
      stage: 'Screened',
      total: 156,
      demographics: {
        male: 89, female: 58, nonBinary: 7, undisclosed: 2,
        white: 78, asian: 43, hispanic: 18, black: 12, other: 5
      }
    },
    {
      stage: 'Interviewed', 
      total: 42,
      demographics: {
        male: 26, female: 14, nonBinary: 2, undisclosed: 0,
        white: 21, asian: 12, hispanic: 5, black: 3, other: 1
      }
    },
    {
      stage: 'Offered',
      total: 12,
      demographics: {
        male: 8, female: 4, nonBinary: 0, undisclosed: 0,
        white: 7, asian: 3, hispanic: 1, black: 1, other: 0
      }
    }
  ]);

  const [fairnessMetrics] = useState([
    {
      metric: 'Interview Rate by Gender',
      value: 'M: 5.7%, F: 4.1%',
      status: 'attention',
      description: 'Male candidates have higher interview rates'
    },
    {
      metric: 'Offer Rate by Ethnicity',
      value: 'Disparity detected',
      status: 'warning',
      description: 'Significant differences in offer rates across ethnic groups'
    },
    {
      metric: 'Time to Hire',
      value: 'No bias detected',
      status: 'good',
      description: 'Consistent hiring timeline across demographics'
    }
  ]);

  const analyzeContent = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  const calculatePercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Content Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Content Bias Analysis</span>
            </CardTitle>
            <CardDescription>
              Real-time analysis of job descriptions and outreach messages for biased language
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Job Description</label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={4}
                placeholder="Paste your job description here..."
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Outreach Message</label>
              <Textarea
                value={outreachMessage}
                onChange={(e) => setOutreachMessage(e.target.value)}
                rows={3}
                placeholder="Paste your outreach message here..."
              />
            </div>

            <Button onClick={analyzeContent} disabled={isAnalyzing} className="w-full">
              {isAnalyzing ? 'Analyzing...' : 'Analyze for Bias'}
            </Button>

            {biasAnalysis.flags.length > 0 && (
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
              <Shield className="w-5 h-5" />
              <span>Bias Prevention Guide</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Common Bias Patterns</h4>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-red-50 border border-red-200 rounded">
                  <strong>Age Bias:</strong> Avoid "young," "energetic," "digital native," "recent graduate"
                </div>
                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <strong>Gender Bias:</strong> Avoid "rockstar," "ninja," "aggressive," "dominant"
                </div>
                <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                  <strong>Exclusionary:</strong> Avoid "culture fit," "fast-paced," "work hard, play hard"
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Inclusive Alternatives</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Instead of "young":</span>
                  <span className="font-medium">motivated, fresh perspective</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Instead of "rockstar":</span>
                  <span className="font-medium">skilled, expert, talented</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Instead of "culture fit":</span>
                  <span className="font-medium">shares our values</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button className="w-full" variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View Full Style Guide
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Demographics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Pipeline Demographics Analysis</span>
          </CardTitle>
          <CardDescription>
            Track representation across your recruitment funnel to identify potential bias points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="funnel" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="funnel">Funnel Analysis</TabsTrigger>
              <TabsTrigger value="metrics">Fairness Metrics</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="funnel" className="space-y-4">
              <div className="space-y-6">
                {pipelineData.map((stage, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{stage.stage}</h4>
                      <Badge variant="outline">{stage.total} candidates</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Gender Distribution</h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Male</span>
                            <span>{calculatePercentage(stage.demographics.male, stage.total)}%</span>
                          </div>
                          <Progress value={(stage.demographics.male / stage.total) * 100} className="h-2" />
                          
                          <div className="flex items-center justify-between text-sm">
                            <span>Female</span>
                            <span>{calculatePercentage(stage.demographics.female, stage.total)}%</span>
                          </div>
                          <Progress value={(stage.demographics.female / stage.total) * 100} className="h-2" />
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium mb-2">Ethnic Distribution</h5>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span>White:</span>
                            <span>{calculatePercentage(stage.demographics.white, stage.total)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Asian:</span>
                            <span>{calculatePercentage(stage.demographics.asian, stage.total)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Hispanic:</span>
                            <span>{calculatePercentage(stage.demographics.hispanic, stage.total)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Black:</span>
                            <span>{calculatePercentage(stage.demographics.black, stage.total)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <div className="space-y-4">
                {fairnessMetrics.map((metric, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{metric.metric}</h4>
                      <Badge variant={
                        metric.status === 'good' ? 'default' :
                        metric.status === 'attention' ? 'secondary' :
                        'destructive'
                      }>
                        {metric.status === 'good' ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        )}
                        {metric.value}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{metric.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                <p>Historical bias trend analysis coming soon...</p>
                <p className="text-sm">Track changes in diversity metrics over time</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Algorithmic Fairness */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingDown className="w-5 h-5" />
            <span>Algorithmic Fairness Monitoring</span>
          </CardTitle>
          <CardDescription>
            Continuous monitoring of AI ranking and matching for disparate impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0.89</div>
              <div className="text-sm text-gray-500">Fairness Score</div>
              <div className="text-xs text-gray-400">0.8+ is considered fair</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">±3.2%</div>
              <div className="text-sm text-gray-500">Score Variance</div>
              <div className="text-xs text-gray-400">Across demographic groups</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">Weekly</div>
              <div className="text-sm text-gray-500">Monitoring Frequency</div>
              <div className="text-xs text-gray-400">Automated bias detection</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">No significant algorithmic bias detected</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              AI matching and ranking systems are performing fairly across all monitored demographic groups.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiasDetection;
