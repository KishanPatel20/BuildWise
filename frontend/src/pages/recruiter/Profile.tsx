
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, X, Building, Users, Briefcase, Shield, Upload, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Department {
  id: string;
  name: string;
  description: string;
  headCount: number;
}

interface Role {
  id: string;
  title: string;
  department: string;
  level: string;
  isActive: boolean;
}

const RecruiterProfile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    personalInfo: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@techcorp.com',
      phone: '+1 (555) 123-4567',
      title: 'Senior Technical Recruiter',
      yearsExperience: '5',
      linkedinUrl: 'https://linkedin.com/in/johnsmith',
    },
    companyInfo: {
      name: 'TechCorp Inc.',
      website: 'https://techcorp.com',
      industry: 'Technology',
      size: '500-1000',
      founded: '2010',
      headquarters: 'San Francisco, CA',
      description: 'Leading technology company specializing in AI and machine learning solutions.',
    }
  });

  const [departments, setDepartments] = useState<Department[]>([
    { id: '1', name: 'Engineering', description: 'Software development and technical roles', headCount: 150 },
    { id: '2', name: 'Product', description: 'Product management and design', headCount: 45 },
    { id: '3', name: 'Marketing', description: 'Marketing and growth', headCount: 30 },
  ]);

  const [roles, setRoles] = useState<Role[]>([
    { id: '1', title: 'Senior Frontend Developer', department: 'Engineering', level: 'Senior', isActive: true },
    { id: '2', title: 'Product Manager', department: 'Product', level: 'Mid', isActive: true },
    { id: '3', title: 'Marketing Specialist', department: 'Marketing', level: 'Junior', isActive: false },
  ]);

  const addDepartment = () => {
    const newDept: Department = {
      id: Date.now().toString(),
      name: '',
      description: '',
      headCount: 0,
    };
    setDepartments([...departments, newDept]);
  };

  const removeDepartment = (id: string) => {
    setDepartments(departments.filter(dept => dept.id !== id));
  };

  const updateDepartment = (id: string, field: keyof Department, value: string | number) => {
    setDepartments(departments.map(dept => 
      dept.id === id ? { ...dept, [field]: value } : dept
    ));
  };

  const addRole = () => {
    const newRole: Role = {
      id: Date.now().toString(),
      title: '',
      department: 'Engineering',
      level: 'Mid',
      isActive: true,
    };
    setRoles([...roles, newRole]);
  };

  const removeRole = (id: string) => {
    setRoles(roles.filter(role => role.id !== id));
  };

  const updateRole = (id: string, field: keyof Role, value: string | boolean) => {
    setRoles(roles.map(role => 
      role.id === id ? { ...role, [field]: value } : role
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/recruiter/dashboard')}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">H</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                HireAI
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Logo
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Recruiter Profile</h1>
          <p className="text-gray-600">Manage your profile and company information to build credibility with candidates</p>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>Your professional details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input 
                      value={profileData.personalInfo.firstName}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        personalInfo: { ...profileData.personalInfo, firstName: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input 
                      value={profileData.personalInfo.lastName}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        personalInfo: { ...profileData.personalInfo, lastName: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input 
                      type="email"
                      value={profileData.personalInfo.email}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        personalInfo: { ...profileData.personalInfo, email: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input 
                      value={profileData.personalInfo.phone}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        personalInfo: { ...profileData.personalInfo, phone: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Title</label>
                    <Input 
                      value={profileData.personalInfo.title}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        personalInfo: { ...profileData.personalInfo, title: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Years of Experience</label>
                    <Select value={profileData.personalInfo.yearsExperience}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2">1-2 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn Profile</label>
                  <Input 
                    value={profileData.personalInfo.linkedinUrl}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      personalInfo: { ...profileData.personalInfo, linkedinUrl: e.target.value }
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5" />
                  <span>Company Information</span>
                </CardTitle>
                <CardDescription>Details about your organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Name</label>
                    <Input 
                      value={profileData.companyInfo.name}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        companyInfo: { ...profileData.companyInfo, name: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Website</label>
                    <Input 
                      value={profileData.companyInfo.website}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        companyInfo: { ...profileData.companyInfo, website: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Industry</label>
                    <Select value={profileData.companyInfo.industry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Size</label>
                    <Select value={profileData.companyInfo.size}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="500-1000">500-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Founded</label>
                    <Input 
                      value={profileData.companyInfo.founded}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        companyInfo: { ...profileData.companyInfo, founded: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Headquarters</label>
                    <Input 
                      value={profileData.companyInfo.headquarters}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        companyInfo: { ...profileData.companyInfo, headquarters: e.target.value }
                      })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Description</label>
                  <Textarea 
                    rows={4}
                    value={profileData.companyInfo.description}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      companyInfo: { ...profileData.companyInfo, description: e.target.value }
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Briefcase className="w-5 h-5" />
                        <span>Departments</span>
                      </CardTitle>
                      <CardDescription>Manage your company's departments and their details</CardDescription>
                    </div>
                    <Button onClick={addDepartment}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Department
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {departments.map((dept) => (
                    <Card key={dept.id} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Department Details</h4>
                        <Button variant="ghost" size="sm" onClick={() => removeDepartment(dept.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Name</label>
                          <Input 
                            value={dept.name}
                            onChange={(e) => updateDepartment(dept.id, 'name', e.target.value)}
                            placeholder="e.g., Engineering"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Head Count</label>
                          <Input 
                            type="number"
                            value={dept.headCount}
                            onChange={(e) => updateDepartment(dept.id, 'headCount', parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-1">
                          <label className="text-sm font-medium">Description</label>
                          <Input 
                            value={dept.description}
                            onChange={(e) => updateDepartment(dept.id, 'description', e.target.value)}
                            placeholder="Brief description"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Active Roles</CardTitle>
                      <CardDescription>Current open positions and role details</CardDescription>
                    </div>
                    <Button onClick={addRole}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Role
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {roles.map((role) => (
                    <Card key={role.id} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Role Details</h4>
                        <Button variant="ghost" size="sm" onClick={() => removeRole(role.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Title</label>
                          <Input 
                            value={role.title}
                            onChange={(e) => updateRole(role.id, 'title', e.target.value)}
                            placeholder="e.g., Senior Developer"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Department</label>
                          <Select value={role.department} onValueChange={(value) => updateRole(role.id, 'department', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Level</label>
                          <Select value={role.level} onValueChange={(value) => updateRole(role.id, 'level', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Junior">Junior</SelectItem>
                              <SelectItem value="Mid">Mid</SelectItem>
                              <SelectItem value="Senior">Senior</SelectItem>
                              <SelectItem value="Lead">Lead</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Status</label>
                          <Select value={role.isActive ? 'active' : 'inactive'} onValueChange={(value) => updateRole(role.id, 'isActive', value === 'active')}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Verification & Credentials</span>
                </CardTitle>
                <CardDescription>Build trust with verified credentials and certifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Company Verification</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Business Registration</span>
                        <Badge variant="outline" className="text-green-600 border-green-200">Verified</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Domain Ownership</span>
                        <Badge variant="outline" className="text-green-600 border-green-200">Verified</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">LinkedIn Company Page</span>
                        <Badge variant="outline" className="text-yellow-600 border-yellow-200">Pending</Badge>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Professional Certifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">SHRM Certification</span>
                        <Badge variant="outline" className="text-green-600 border-green-200">Verified</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">LinkedIn Recruiter</span>
                        <Badge variant="outline" className="text-green-600 border-green-200">Verified</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Certification
                      </Button>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RecruiterProfile;
