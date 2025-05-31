
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Star, TrendingUp, Users, Award, ThumbsUp } from 'lucide-react';

interface QualityMetricsProps {
  dateRange: string;
  department: string;
}

const QualityMetrics = ({ dateRange, department }: QualityMetricsProps) => {
  const qualityOfHireData = [
    { department: 'Engineering', performance: 8.2, retention: 92, satisfaction: 8.5 },
    { department: 'Product', performance: 8.7, retention: 88, satisfaction: 8.8 },
    { department: 'Design', performance: 8.4, retention: 95, satisfaction: 8.6 },
    { department: 'Marketing', performance: 8.1, retention: 85, satisfaction: 8.3 },
    { department: 'Sales', performance: 8.6, retention: 90, satisfaction: 8.4 },
  ];

  const offerAcceptanceData = [
    { month: 'Jan', rate: 82 },
    { month: 'Feb', rate: 85 },
    { month: 'Mar', rate: 78 },
    { month: 'Apr', rate: 87 },
    { month: 'May', rate: 84 },
    { month: 'Jun', rate: 89 },
  ];

  const candidateExperienceScores = [
    { stage: 'Application Process', score: 8.2, responses: 245 },
    { stage: 'Interview Experience', score: 8.7, responses: 156 },
    { stage: 'Communication', score: 8.1, responses: 298 },
    { stage: 'Feedback Quality', score: 7.8, responses: 198 },
    { stage: 'Overall Experience', score: 8.3, responses: 187 },
  ];

  const hiringManagerSatisfaction = [
    { category: 'Candidate Quality', score: 8.4, target: 8.0 },
    { category: 'Time to Fill', score: 7.8, target: 8.0 },
    { category: 'Communication', score: 8.6, target: 8.5 },
    { category: 'Process Efficiency', score: 8.2, target: 8.0 },
  ];

  const retentionMetrics = [
    { period: '3 Months', rate: 96, industry: 92 },
    { period: '6 Months', rate: 91, industry: 85 },
    { period: '12 Months', rate: 87, industry: 78 },
    { period: '24 Months', rate: 82, industry: 70 },
  ];

  const chartConfig = {
    performance: { label: 'Performance', color: '#3b82f6' },
    retention: { label: 'Retention', color: '#10b981' },
    satisfaction: { label: 'Satisfaction', color: '#f59e0b' },
    rate: { label: 'Acceptance Rate', color: '#8b5cf6' },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quality of Hire Overview */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Quality of Hire by Department</CardTitle>
          <CardDescription>Performance, retention, and satisfaction scores</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={qualityOfHireData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="performance" fill="var(--color-performance)" name="Performance Score" />
                <Bar dataKey="satisfaction" fill="var(--color-satisfaction)" name="Manager Satisfaction" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Offer Acceptance Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Offer Acceptance Rate</CardTitle>
          <CardDescription>Monthly trends in offer acceptance</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={offerAcceptanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[70, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="var(--color-rate)" 
                  strokeWidth={2}
                  name="Acceptance Rate %"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Candidate Experience Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Candidate Experience Scores</CardTitle>
          <CardDescription>Feedback scores across hiring stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {candidateExperienceScores.map((item) => (
              <div key={item.stage} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.stage}</span>
                  <div className="text-right">
                    <span className="text-lg font-bold">{item.score}/10</span>
                    <span className="text-sm text-gray-500 ml-2">({item.responses} responses)</span>
                  </div>
                </div>
                <Progress value={item.score * 10} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hiring Manager Satisfaction */}
      <Card>
        <CardHeader>
          <CardTitle>Hiring Manager Satisfaction</CardTitle>
          <CardDescription>Manager feedback on recruitment process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hiringManagerSatisfaction.map((item) => (
              <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">{item.category}</h4>
                  <p className="text-sm text-gray-600">Target: {item.target}/10</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{item.score}/10</p>
                  <Badge 
                    variant={item.score >= item.target ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {item.score >= item.target ? 'Above Target' : 'Below Target'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Retention Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>New Hire Retention</CardTitle>
          <CardDescription>Retention rates vs industry benchmarks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {retentionMetrics.map((metric) => (
              <div key={metric.period} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{metric.period}</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-blue-600">{metric.rate}%</span>
                    <span className="text-sm text-gray-500 ml-2">(Industry: {metric.industry}%)</span>
                  </div>
                </div>
                <div className="relative">
                  <Progress value={metric.rate} className="h-2" />
                  <div 
                    className="absolute top-0 h-2 w-0.5 bg-red-500"
                    style={{ left: `${metric.industry}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quality Summary Cards */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Quality Metrics Summary</CardTitle>
          <CardDescription>Key quality indicators at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">8.4</p>
              <p className="text-sm text-gray-600">Avg. Performance Score</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">87%</p>
              <p className="text-sm text-gray-600">12-Month Retention</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <ThumbsUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">89%</p>
              <p className="text-sm text-gray-600">Offer Acceptance Rate</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">8.3</p>
              <p className="text-sm text-gray-600">Candidate Experience</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityMetrics;
