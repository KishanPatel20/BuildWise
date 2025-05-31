
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Clock, Timer, Users, Calendar } from 'lucide-react';

interface EfficiencyMetricsProps {
  dateRange: string;
  department: string;
}

const EfficiencyMetrics = ({ dateRange, department }: EfficiencyMetricsProps) => {
  const timeToFillData = [
    { department: 'Engineering', timeToFill: 32, target: 25, color: '#ef4444' },
    { department: 'Product', timeToFill: 28, target: 30, color: '#10b981' },
    { department: 'Design', timeToFill: 24, target: 20, color: '#f59e0b' },
    { department: 'Marketing', timeToFill: 18, target: 25, color: '#10b981' },
    { department: 'Sales', timeToFill: 22, target: 20, color: '#f59e0b' },
  ];

  const timeToFillTrend = [
    { month: 'Jan', days: 28 },
    { month: 'Feb', days: 26 },
    { month: 'Mar', days: 30 },
    { month: 'Apr', days: 32 },
    { month: 'May', days: 29 },
    { month: 'Jun', days: 28 },
  ];

  const stageBreakdown = [
    { stage: 'Sourcing', days: 8, percentage: 28 },
    { stage: 'Screening', days: 5, percentage: 18 },
    { stage: 'Interviewing', days: 10, percentage: 36 },
    { stage: 'Decision', days: 3, percentage: 11 },
    { stage: 'Offer', days: 2, percentage: 7 },
  ];

  const responseTimeData = [
    { metric: 'First Response', current: 2.4, target: 2.0, unit: 'hours' },
    { metric: 'Interview Scheduling', current: 1.8, target: 1.5, unit: 'days' },
    { metric: 'Feedback Delivery', current: 3.2, target: 2.0, unit: 'days' },
    { metric: 'Offer Processing', current: 1.5, target: 1.0, unit: 'days' },
  ];

  const chartConfig = {
    timeToFill: { label: 'Time to Fill', color: '#3b82f6' },
    target: { label: 'Target', color: '#10b981' },
    days: { label: 'Days', color: '#3b82f6' },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Time to Fill by Department */}
      <Card>
        <CardHeader>
          <CardTitle>Time to Fill by Department</CardTitle>
          <CardDescription>Average days to fill positions vs targets</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeToFillData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="timeToFill" fill="var(--color-timeToFill)" name="Actual" />
                <Bar dataKey="target" fill="var(--color-target)" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Time to Fill Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Time to Fill Trend</CardTitle>
          <CardDescription>Monthly average time to fill positions</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeToFillTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="days" 
                  stroke="var(--color-days)" 
                  strokeWidth={2}
                  name="Days"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Stage Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Time Breakdown by Stage</CardTitle>
          <CardDescription>Days spent in each hiring stage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stageBreakdown.map((stage) => (
              <div key={stage.stage} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{stage.stage}</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">{stage.days} days</span>
                    <span className="text-xs text-gray-500 ml-2">({stage.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Response Time Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Response Time Metrics</CardTitle>
          <CardDescription>Speed of communication and processing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {responseTimeData.map((metric) => (
              <div key={metric.metric} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">{metric.metric}</h4>
                  <p className="text-sm text-gray-600">Target: {metric.target} {metric.unit}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{metric.current}</p>
                  <p className="text-sm text-gray-600">{metric.unit}</p>
                  <Badge 
                    variant={metric.current <= metric.target ? 'default' : 'destructive'}
                    className="text-xs mt-1"
                  >
                    {metric.current <= metric.target ? 'On Target' : 'Above Target'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Efficiency Metrics Summary */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Efficiency Summary</CardTitle>
          <CardDescription>Key performance indicators for recruitment efficiency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">28</p>
              <p className="text-sm text-gray-600">Avg. Time to Fill (days)</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Timer className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">21</p>
              <p className="text-sm text-gray-600">Avg. Time to Hire (days)</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">2.4</p>
              <p className="text-sm text-gray-600">Avg. Response Time (hours)</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">1.8</p>
              <p className="text-sm text-gray-600">Interview Scheduling (days)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EfficiencyMetrics;
