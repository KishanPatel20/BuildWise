
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, TrendingUp, Eye, UserCheck } from 'lucide-react';

interface DiversityMetricsProps {
  dateRange: string;
  department: string;
}

const DiversityMetrics = ({ dateRange, department }: DiversityMetricsProps) => {
  const diversityPipelineData = [
    { stage: 'Applications', women: 48, urm: 32, total: 1250 },
    { stage: 'Screened', women: 45, urm: 28, total: 435 },
    { stage: 'Interviewed', women: 42, urm: 25, total: 156 },
    { stage: 'Offers', women: 40, urm: 22, total: 45 },
    { stage: 'Hires', women: 39, urm: 21, total: 38 },
  ];

  const diversityByDepartment = [
    { department: 'Engineering', women: 32, urm: 18, lgbtq: 12, total: 45 },
    { department: 'Product', women: 55, urm: 28, lgbtq: 15, total: 25 },
    { department: 'Design', women: 68, urm: 35, lgbtq: 22, total: 18 },
    { department: 'Marketing', women: 62, urm: 30, lgbtq: 18, total: 22 },
    { department: 'Sales', women: 48, urm: 25, lgbtq: 14, total: 28 },
  ];

  const hiringTrends = [
    { month: 'Jan', women: 35, urm: 20, baseline: 40 },
    { month: 'Feb', women: 38, urm: 22, baseline: 40 },
    { month: 'Mar', women: 42, urm: 25, baseline: 40 },
    { month: 'Apr', women: 39, urm: 21, baseline: 40 },
    { month: 'May', women: 41, urm: 24, baseline: 40 },
    { month: 'Jun', women: 39, urm: 21, baseline: 40 },
  ];

  const fairnessMetrics = [
    { 
      metric: 'Interview-to-Offer Ratio',
      overall: 28.8,
      women: 26.5,
      urm: 24.2,
      fairnessScore: 'Good'
    },
    { 
      metric: 'Time-to-Hire (days)',
      overall: 28,
      women: 29,
      urm: 31,
      fairnessScore: 'Needs Attention'
    },
    { 
      metric: 'Offer Acceptance Rate (%)',
      overall: 84.4,
      women: 86.2,
      urm: 88.1,
      fairnessScore: 'Excellent'
    },
  ];

  const representationGoals = [
    { group: 'Women', current: 39, goal: 45, progress: 87 },
    { group: 'Underrepresented Minorities', current: 21, goal: 30, progress: 70 },
    { group: 'LGBTQ+', current: 16, goal: 20, progress: 80 },
    { group: 'Veterans', current: 8, goal: 10, progress: 80 },
  ];

  const chartConfig = {
    women: { label: 'Women', color: '#8b5cf6' },
    urm: { label: 'URM', color: '#10b981' },
    lgbtq: { label: 'LGBTQ+', color: '#f59e0b' },
    baseline: { label: 'Target', color: '#ef4444' },
    overall: { label: 'Overall', color: '#3b82f6' },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Diversity Pipeline */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Diversity Through Hiring Pipeline</CardTitle>
          <CardDescription>Representation percentages at each stage</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diversityPipelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis domain={[0, 60]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="women" fill="var(--color-women)" name="Women %" />
                <Bar dataKey="urm" fill="var(--color-urm)" name="URM %" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Diversity by Department */}
      <Card>
        <CardHeader>
          <CardTitle>Diversity by Department</CardTitle>
          <CardDescription>Current representation across teams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {diversityByDepartment.map((dept) => (
              <div key={dept.department} className="space-y-3">
                <h4 className="font-medium">{dept.department}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Women: {dept.women}%</span>
                    <Progress value={dept.women} className="w-24 h-2" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>URM: {dept.urm}%</span>
                    <Progress value={dept.urm} className="w-24 h-2" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>LGBTQ+: {dept.lgbtq}%</span>
                    <Progress value={dept.lgbtq} className="w-24 h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hiring Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Diversity Hiring Trends</CardTitle>
          <CardDescription>Monthly representation in new hires</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hiringTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 50]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="women" 
                  stroke="var(--color-women)" 
                  strokeWidth={2}
                  name="Women %"
                />
                <Line 
                  type="monotone" 
                  dataKey="urm" 
                  stroke="var(--color-urm)" 
                  strokeWidth={2}
                  name="URM %"
                />
                <Line 
                  type="monotone" 
                  dataKey="baseline" 
                  stroke="var(--color-baseline)" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Target %"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Fairness Metrics */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Fairness & Bias Analysis</CardTitle>
          <CardDescription>Comparing outcomes across demographic groups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Metric</th>
                  <th className="text-center p-3 font-medium">Overall</th>
                  <th className="text-center p-3 font-medium">Women</th>
                  <th className="text-center p-3 font-medium">URM</th>
                  <th className="text-center p-3 font-medium">Fairness Score</th>
                </tr>
              </thead>
              <tbody>
                {fairnessMetrics.map((metric) => (
                  <tr key={metric.metric} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{metric.metric}</td>
                    <td className="p-3 text-center">{metric.overall}</td>
                    <td className="p-3 text-center">{metric.women}</td>
                    <td className="p-3 text-center">{metric.urm}</td>
                    <td className="p-3 text-center">
                      <Badge 
                        variant={
                          metric.fairnessScore === 'Excellent' ? 'default' : 
                          metric.fairnessScore === 'Good' ? 'secondary' : 'destructive'
                        }
                      >
                        {metric.fairnessScore}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Representation Goals */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Representation Goals Progress</CardTitle>
          <CardDescription>Progress towards diversity targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {representationGoals.map((goal) => (
              <div key={goal.group} className="text-center space-y-3">
                <h4 className="font-medium">{goal.group}</h4>
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{goal.current}%</span>
                  </div>
                  <Progress value={goal.progress} className="w-full h-2" />
                </div>
                <div className="text-sm text-gray-600">
                  Goal: {goal.goal}% ({goal.progress}% complete)
                </div>
                <Badge 
                  variant={goal.progress >= 90 ? 'default' : goal.progress >= 70 ? 'secondary' : 'outline'}
                >
                  {goal.progress >= 90 ? 'On Track' : goal.progress >= 70 ? 'In Progress' : 'Needs Focus'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Diversity Summary */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Diversity Summary</CardTitle>
          <CardDescription>Key diversity metrics at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">39%</p>
              <p className="text-sm text-gray-600">Women in New Hires</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">21%</p>
              <p className="text-sm text-gray-600">URM Representation</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Eye className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">2.1%</p>
              <p className="text-sm text-gray-600">Pipeline Drop-off Rate</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <UserCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">Good</p>
              <p className="text-sm text-gray-600">Overall Fairness Score</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiversityMetrics;
