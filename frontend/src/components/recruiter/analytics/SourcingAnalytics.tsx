
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Users, TrendingUp, Target } from 'lucide-react';

interface SourcingAnalyticsProps {
  dateRange: string;
  department: string;
}

const SourcingAnalytics = ({ dateRange, department }: SourcingAnalyticsProps) => {
  const sourceOfHireData = [
    { source: 'Employee Referrals', hires: 15, percentage: 39.5, cost: 800, quality: 9.2 },
    { source: 'LinkedIn', hires: 8, percentage: 21.1, cost: 1250, quality: 8.4 },
    { source: 'Job Boards', hires: 6, percentage: 15.8, cost: 950, quality: 7.8 },
    { source: 'Career Page', hires: 5, percentage: 13.2, cost: 320, quality: 8.1 },
    { source: 'Agencies', hires: 3, percentage: 7.9, cost: 3200, quality: 8.6 },
    { source: 'University Events', hires: 1, percentage: 2.6, cost: 1500, quality: 8.9 },
  ];

  const costPerHireData = [
    { source: 'Career Page', cost: 320, hires: 5, efficiency: 'High' },
    { source: 'Employee Referrals', cost: 800, hires: 15, efficiency: 'High' },
    { source: 'Job Boards', cost: 950, hires: 6, efficiency: 'Medium' },
    { source: 'LinkedIn', cost: 1250, hires: 8, efficiency: 'Medium' },
    { source: 'University Events', cost: 1500, hires: 1, efficiency: 'Low' },
    { source: 'Agencies', cost: 3200, hires: 3, efficiency: 'Low' },
  ];

  const conversionRatesBySource = [
    { source: 'Employee Referrals', applications: 45, hires: 15, rate: 33.3 },
    { source: 'Career Page', applications: 125, hires: 5, rate: 4.0 },
    { source: 'LinkedIn', applications: 89, hires: 8, rate: 9.0 },
    { source: 'Job Boards', applications: 245, hires: 6, rate: 2.4 },
    { source: 'Agencies', applications: 23, hires: 3, rate: 13.0 },
    { source: 'University Events', applications: 18, hires: 1, rate: 5.6 },
  ];

  const sourcingChannelTrends = [
    { month: 'Jan', referrals: 12, linkedin: 6, jobBoards: 8, careerPage: 3 },
    { month: 'Feb', referrals: 14, linkedin: 7, jobBoards: 6, careerPage: 4 },
    { month: 'Mar', referrals: 18, linkedin: 9, jobBoards: 7, careerPage: 5 },
    { month: 'Apr', referrals: 15, linkedin: 8, jobBoards: 5, careerPage: 6 },
    { month: 'May', referrals: 16, linkedin: 10, jobBoards: 6, careerPage: 4 },
    { month: 'Jun', referrals: 15, linkedin: 8, jobBoards: 6, careerPage: 5 },
  ];

  const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  const chartConfig = {
    cost: { label: 'Cost per Hire', color: '#3b82f6' },
    hires: { label: 'Hires', color: '#10b981' },
    rate: { label: 'Conversion Rate', color: '#f59e0b' },
    referrals: { label: 'Referrals', color: '#3b82f6' },
    linkedin: { label: 'LinkedIn', color: '#10b981' },
    jobBoards: { label: 'Job Boards', color: '#f59e0b' },
    careerPage: { label: 'Career Page', color: '#8b5cf6' },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Source of Hire Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Source of Hire Distribution</CardTitle>
          <CardDescription>Where our successful hires come from</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceOfHireData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="hires"
                >
                  {sourceOfHireData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-4 space-y-2">
            {sourceOfHireData.map((item, index) => (
              <div key={item.source} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: pieColors[index % pieColors.length] }}
                  />
                  <span>{item.source}</span>
                </div>
                <span className="font-medium">{item.hires} ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cost per Hire by Source */}
      <Card>
        <CardHeader>
          <CardTitle>Cost per Hire by Source</CardTitle>
          <CardDescription>Efficiency and cost analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costPerHireData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="cost" fill="var(--color-cost)" name="Cost ($)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Conversion Rates by Source */}
      <Card>
        <CardHeader>
          <CardTitle>Application Conversion Rates</CardTitle>
          <CardDescription>How effectively each source converts to hires</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversionRatesBySource.map((source) => (
              <div key={source.source} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{source.source}</span>
                  <div className="text-right">
                    <span className="text-lg font-bold">{source.rate}%</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({source.hires}/{source.applications})
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(source.rate * 3, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sourcing Channel Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Sourcing Channel Trends</CardTitle>
          <CardDescription>Monthly hiring trends by source</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourcingChannelTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="referrals" fill="var(--color-referrals)" name="Referrals" />
                <Bar dataKey="linkedin" fill="var(--color-linkedin)" name="LinkedIn" />
                <Bar dataKey="jobBoards" fill="var(--color-jobBoards)" name="Job Boards" />
                <Bar dataKey="careerPage" fill="var(--color-careerPage)" name="Career Page" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Source Quality & Cost Summary */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Source Performance Summary</CardTitle>
          <CardDescription>Comprehensive view of each sourcing channel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Source</th>
                  <th className="text-center p-2 font-medium">Hires</th>
                  <th className="text-center p-2 font-medium">Cost per Hire</th>
                  <th className="text-center p-2 font-medium">Quality Score</th>
                  <th className="text-center p-2 font-medium">Conversion Rate</th>
                  <th className="text-center p-2 font-medium">Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {sourceOfHireData.map((source, index) => {
                  const conversionData = conversionRatesBySource.find(c => c.source === source.source);
                  const costData = costPerHireData.find(c => c.source === source.source);
                  
                  return (
                    <tr key={source.source} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{source.source}</td>
                      <td className="p-2 text-center">{source.hires}</td>
                      <td className="p-2 text-center">${source.cost.toLocaleString()}</td>
                      <td className="p-2 text-center">{source.quality}/10</td>
                      <td className="p-2 text-center">{conversionData?.rate || 0}%</td>
                      <td className="p-2 text-center">
                        <Badge 
                          variant={
                            costData?.efficiency === 'High' ? 'default' : 
                            costData?.efficiency === 'Medium' ? 'secondary' : 'outline'
                          }
                        >
                          {costData?.efficiency || 'N/A'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Cost Metrics Summary */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Cost Metrics Overview</CardTitle>
          <CardDescription>Key financial indicators for recruitment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">$1,280</p>
              <p className="text-sm text-gray-600">Avg. Cost per Hire</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">12.8%</p>
              <p className="text-sm text-gray-600">Avg. Conversion Rate</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Target className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">8.4</p>
              <p className="text-sm text-gray-600">Avg. Quality Score</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">38</p>
              <p className="text-sm text-gray-600">Total Hires</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SourcingAnalytics;
