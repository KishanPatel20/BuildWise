
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, Clock, TrendingUp, Target, DollarSign, Filter, Download } from 'lucide-react';
import OverviewMetrics from './analytics/OverviewMetrics';
import EfficiencyMetrics from './analytics/EfficiencyMetrics';
import FunnelAnalytics from './analytics/FunnelAnalytics';
import QualityMetrics from './analytics/QualityMetrics';
import SourcingAnalytics from './analytics/SourcingAnalytics';
import DiversityMetrics from './analytics/DiversityMetrics';

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState('last30days');
  const [department, setDepartment] = useState('all');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruitment Analytics</h1>
          <p className="text-gray-600">Track performance, efficiency, and quality across your hiring process</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last90days">Last 90 days</SelectItem>
              <SelectItem value="lastYear">Last year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Openings</p>
                <p className="text-2xl font-bold">47</p>
                <p className="text-xs text-green-600">+12% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Hires This Month</p>
                <p className="text-2xl font-bold">23</p>
                <p className="text-xs text-green-600">92% of goal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Time to Fill</p>
                <p className="text-2xl font-bold">28</p>
                <p className="text-xs text-red-600">+2 days from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Offer Acceptance</p>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-xs text-green-600">+5% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="sourcing">Sourcing</TabsTrigger>
          <TabsTrigger value="diversity">Diversity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewMetrics dateRange={dateRange} department={department} />
        </TabsContent>

        <TabsContent value="efficiency">
          <EfficiencyMetrics dateRange={dateRange} department={department} />
        </TabsContent>

        <TabsContent value="funnel">
          <FunnelAnalytics dateRange={dateRange} department={department} />
        </TabsContent>

        <TabsContent value="quality">
          <QualityMetrics dateRange={dateRange} department={department} />
        </TabsContent>

        <TabsContent value="sourcing">
          <SourcingAnalytics dateRange={dateRange} department={department} />
        </TabsContent>

        <TabsContent value="diversity">
          <DiversityMetrics dateRange={dateRange} department={department} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
