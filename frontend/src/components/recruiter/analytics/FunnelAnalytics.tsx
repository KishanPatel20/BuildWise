
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, FunnelChart, Funnel, Cell } from 'recharts';
import { TrendingDown, Users, Eye, MessageSquare, FileText, CheckCircle } from 'lucide-react';

interface FunnelAnalyticsProps {
  dateRange: string;
  department: string;
}

const FunnelAnalytics = ({ dateRange, department }: FunnelAnalyticsProps) => {
  const funnelData = [
    { stage: 'Applications', count: 1250, percentage: 100, color: '#3b82f6', icon: FileText },
    { stage: 'Screened', count: 435, percentage: 34.8, color: '#10b981', icon: Eye },
    { stage: 'Interviewed', count: 156, percentage: 12.5, color: '#f59e0b', icon: MessageSquare },
    { stage: 'Offers', count: 45, percentage: 3.6, color: '#8b5cf6', icon: Users },
    { stage: 'Hires', count: 38, percentage: 3.0, color: '#ef4444', icon: CheckCircle },
  ];

  const conversionRates = [
    { transition: 'Application → Screen', rate: 34.8, benchmark: 40.0 },
    { transition: 'Screen → Interview', rate: 35.9, benchmark: 30.0 },
    { transition: 'Interview → Offer', rate: 28.8, benchmark: 25.0 },
    { transition: 'Offer → Hire', rate: 84.4, benchmark: 80.0 },
  ];

  const departmentFunnels = [
    { 
      department: 'Engineering',
      applications: 450,
      screened: 140,
      interviewed: 52,
      offers: 18,
      hires: 15
    },
    { 
      department: 'Product',
      applications: 280,
      screened: 95,
      interviewed: 35,
      offers: 12,
      hires: 10
    },
    { 
      department: 'Design',
      applications: 320,
      screened: 115,
      interviewed: 42,
      offers: 8,
      hires: 7
    },
    { 
      department: 'Marketing',
      applications: 200,
      screened: 85,
      interviewed: 27,
      offers: 7,
      hires: 6
    },
  ];

  const candidatesPerHire = [
    { role: 'Senior Engineer', ratio: 28.5, quality: 'High' },
    { role: 'Product Manager', ratio: 35.2, quality: 'Medium' },
    { role: 'UX Designer', ratio: 22.8, quality: 'High' },
    { role: 'Marketing Specialist', ratio: 31.5, quality: 'Medium' },
  ];

  const chartConfig = {
    applications: { label: 'Applications', color: '#3b82f6' },
    screened: { label: 'Screened', color: '#10b981' },
    interviewed: { label: 'Interviewed', color: '#f59e0b' },
    offers: { label: 'Offers', color: '#8b5cf6' },
    hires: { label: 'Hires', color: '#ef4444' },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Main Recruitment Funnel */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Recruitment Funnel Overview</CardTitle>
          <CardDescription>Candidate flow through hiring stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelData.map((stage, index) => {
              const Icon = stage.icon;
              const nextStage = funnelData[index + 1];
              const conversionRate = nextStage ? (nextStage.count / stage.count * 100).toFixed(1) : null;
              
              return (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${stage.color}20` }}>
                        <Icon className="w-5 h-5" style={{ color: stage.color }} />
                      </div>
                      <div>
                        <h4 className="font-medium">{stage.stage}</h4>
                        <p className="text-sm text-gray-600">{stage.percentage}% of total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: stage.color }}>
                        {stage.count.toLocaleString()}
                      </p>
                      {conversionRate && (
                        <p className="text-sm text-gray-600">
                          {conversionRate}% conversion
                        </p>
                      )}
                    </div>
                  </div>
                  {index < funnelData.length - 1 && (
                    <div className="flex justify-center py-2">
                      <TrendingDown className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Rate Analysis</CardTitle>
          <CardDescription>Stage-to-stage conversion performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversionRates.map((conversion) => (
              <div key={conversion.transition} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{conversion.transition}</span>
                  <div className="text-right">
                    <span className="text-sm font-bold">{conversion.rate}%</span>
                    <Badge 
                      variant={conversion.rate >= conversion.benchmark ? 'default' : 'secondary'}
                      className="ml-2 text-xs"
                    >
                      {conversion.rate >= conversion.benchmark ? 'Above' : 'Below'} Benchmark
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      conversion.rate >= conversion.benchmark ? 'bg-green-600' : 'bg-orange-500'
                    }`}
                    style={{ width: `${Math.min(conversion.rate, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">Benchmark: {conversion.benchmark}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Funnel by Department</CardTitle>
          <CardDescription>Compare hiring funnels across departments</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentFunnels}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="applications" fill="var(--color-applications)" name="Applications" />
                <Bar dataKey="screened" fill="var(--color-screened)" name="Screened" />
                <Bar dataKey="interviewed" fill="var(--color-interviewed)" name="Interviewed" />
                <Bar dataKey="offers" fill="var(--color-offers)" name="Offers" />
                <Bar dataKey="hires" fill="var(--color-hires)" name="Hires" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Candidates per Hire */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Candidates per Hire Ratio</CardTitle>
          <CardDescription>Efficiency indicator by role type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {candidatesPerHire.map((role) => (
              <div key={role.role} className="p-4 bg-gray-50 rounded-lg text-center">
                <h4 className="font-medium mb-2">{role.role}</h4>
                <p className="text-2xl font-bold text-blue-600 mb-1">{role.ratio}</p>
                <p className="text-sm text-gray-600 mb-2">candidates per hire</p>
                <Badge 
                  variant={role.quality === 'High' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {role.quality} Quality
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FunnelAnalytics;
