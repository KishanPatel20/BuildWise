
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, Clock, Target, TrendingUp, AlertTriangle } from 'lucide-react';

interface OverviewMetricsProps {
  dateRange: string;
  department: string;
}

const OverviewMetrics = ({ dateRange, department }: OverviewMetricsProps) => {
  const hiringGoalData = [
    { department: 'Engineering', hires: 15, goal: 20, percentage: 75 },
    { department: 'Product', hires: 8, goal: 10, percentage: 80 },
    { department: 'Design', hires: 4, goal: 5, percentage: 80 },
    { department: 'Marketing', hires: 6, goal: 8, percentage: 75 },
    { department: 'Sales', hires: 12, goal: 15, percentage: 80 },
  ];

  const hiringTrendData = [
    { month: 'Jan', hires: 18, target: 20 },
    { month: 'Feb', hires: 22, target: 20 },
    { month: 'Mar', hires: 19, target: 25 },
    { month: 'Apr', hires: 28, target: 25 },
    { month: 'May', hires: 23, target: 25 },
    { month: 'Jun', hires: 25, target: 30 },
  ];

  const openPositionsData = [
    { name: 'Junior', value: 15, color: '#3b82f6' },
    { name: 'Mid-level', value: 20, color: '#10b981' },
    { name: 'Senior', value: 8, color: '#f59e0b' },
    { name: 'Lead', value: 4, color: '#ef4444' },
  ];

  const urgentOpenings = [
    { role: 'Senior React Developer', days: 45, department: 'Engineering', priority: 'High' },
    { role: 'Product Manager', days: 38, department: 'Product', priority: 'High' },
    { role: 'UX Designer', days: 32, department: 'Design', priority: 'Medium' },
    { role: 'Marketing Manager', days: 28, department: 'Marketing', priority: 'Medium' },
  ];

  const chartConfig = {
    hires: { label: 'Hires', color: '#3b82f6' },
    target: { label: 'Target', color: '#10b981' },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Hiring Progress & Goals */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Hiring Progress vs Goals</CardTitle>
          <CardDescription>Track progress towards hiring targets by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hiringGoalData.map((dept) => (
              <div key={dept.department} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{dept.department}</span>
                  <span className="text-sm text-gray-600">
                    {dept.hires} / {dept.goal} hires
                  </span>
                </div>
                <Progress value={dept.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hiring Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Hiring Trends</CardTitle>
          <CardDescription>Monthly hiring performance vs targets</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hiringTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="hires" 
                  stroke="var(--color-hires)" 
                  strokeWidth={2}
                  name="Actual Hires"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="var(--color-target)" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Open Positions by Seniority */}
      <Card>
        <CardHeader>
          <CardTitle>Open Positions by Seniority</CardTitle>
          <CardDescription>Distribution of current openings</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={openPositionsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {openPositionsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex flex-wrap gap-2 mt-4">
            {openPositionsData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Urgent Openings */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span>Urgent Openings</span>
          </CardTitle>
          <CardDescription>Positions that require immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {urgentOpenings.map((opening, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">{opening.role}</h4>
                  <p className="text-sm text-gray-600">{opening.department}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">{opening.days} days open</p>
                    <Badge 
                      variant={opening.priority === 'High' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {opening.priority} Priority
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewMetrics;
