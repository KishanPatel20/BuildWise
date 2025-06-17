import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, X, Building, Users, Briefcase, Shield, Upload, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Department {
  id: string;
  name: string;
  description: string;
  headCount: number;
  isNew?: boolean;
  isModified?: boolean;
}

interface Role {
  id: string;
  title: string;
  department: string;
  level: string;
  isActive: boolean;
  isNew?: boolean;
  isModified?: boolean;
}

interface RecruiterProfile {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  company_name: string;
  phone_number: string | null;
  bio: string | null;
  industry: string | null;
  website: string | null;
  company_size: string | null;
  founded: string | null;
  headquarters: string | null;
  company_description: string | null;
  job_title: string | null;
  years_of_experience: string | null;
  linkedin_profile: string | null;
}

const RecruiterProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingDepartments, setIsSavingDepartments] = useState(false);
  const [isSavingRoles, setIsSavingRoles] = useState(false);
  const [profileData, setProfileData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      title: '',
      yearsExperience: '',
      linkedinUrl: '',
    },
    companyInfo: {
      name: '',
      website: '',
      industry: '',
      size: '',
      founded: '',
      headquarters: '',
      description: '',
    }
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const fetchProfileData = async () => {
    try {
      const token = sessionStorage.getItem('recruiterToken');
      if (!token) {
        toast.error('Please login to access your profile');
        navigate('/login');
        return;
      }

      // Fetch recruiter profile
      const profileResponse = await axios.get(`${API_BASE_URL}/recruiter/recruiters/me/`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      const profile: RecruiterProfile = profileResponse.data;
      
      // Update profile data
      setProfileData({
        personalInfo: {
          firstName: profile.user.first_name || '',
          lastName: profile.user.last_name || '',
          email: profile.user.email || '',
          phone: profile.phone_number || '',
          title: profile.job_title || '',
          yearsExperience: profile.years_of_experience || '',
          linkedinUrl: profile.linkedin_profile || '',
        },
        companyInfo: {
          name: profile.company_name || '',
          website: profile.website || '',
          industry: profile.industry || '',
          size: profile.company_size || '',
          founded: profile.founded || '',
          headquarters: profile.headquarters || '',
          description: profile.company_description || '',
        }
      });

      // Fetch departments
      const departmentsResponse = await axios.get(`${API_BASE_URL}/recruiter/departments/`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      if (departmentsResponse.data && Array.isArray(departmentsResponse.data)) {
        const formattedDepartments = departmentsResponse.data.map((dept: any) => ({
          id: dept.id.toString(),
          name: dept.name || '',
          description: dept.description || '',
          headCount: dept.head_count || 0,
        }));
        setDepartments(formattedDepartments);
      }

      // Fetch active roles
      const rolesResponse = await axios.get(`${API_BASE_URL}/recruiter/active-roles/`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      if (rolesResponse.data && Array.isArray(rolesResponse.data)) {
        const formattedRoles = rolesResponse.data.map((role: any) => ({
          id: role.id.toString(),
          title: role.title || '',
          department: role.department || '',
          level: role.level || 'Mid',
          isActive: role.is_active || true,
        }));
        setRoles(formattedRoles);
      }

    } catch (error: any) {
      console.error('Error fetching profile data:', error);
      toast.error(error.response?.data?.message || 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [navigate]);

  const addDepartment = () => {
    const newDept: Department = {
      id: `new-${Date.now()}`,
      name: '',
      description: '',
      headCount: 0,
      isNew: true
    };
    setDepartments([...departments, newDept]);
  };

  const removeDepartment = async (id: string) => {
    try {
      const token = sessionStorage.getItem('recruiterToken');
      if (!token) {
        toast.error('Please login to remove department');
        return;
      }

      if (id.startsWith('new-')) {
        setDepartments(departments.filter(dept => dept.id !== id));
        return;
      }

      await axios.delete(`${API_BASE_URL}/recruiter/departments/${id}`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      setDepartments(departments.filter(dept => dept.id !== id));
      toast.success('Department removed successfully');
    } catch (error: any) {
      console.error('Error removing department:', error);
      toast.error(error.response?.data?.message || 'Failed to remove department');
    }
  };

  const updateDepartment = (id: string, field: keyof Department, value: string | number) => {
    setDepartments(departments.map(dept => 
      dept.id === id 
        ? { 
            ...dept, 
            [field]: value,
            isModified: !dept.isNew
          } 
        : dept
    ));
  };

  const saveDepartments = async () => {
    try {
      setIsSavingDepartments(true);
      const token = sessionStorage.getItem('recruiterToken');
      if (!token) {
        toast.error('Please login to save departments');
        return;
      }

      const headers = {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      };

      for (const dept of departments) {
        if (dept.isNew) {
          await axios.post(
            `${API_BASE_URL}/recruiter/departments/`,
            { name: dept.name },
            { headers }
          );
        } else if (dept.isModified) {
          await axios.patch(
            `${API_BASE_URL}/recruiter/departments/${dept.id}/`,
            { name: dept.name },
            { headers }
          );
        }
      }

      const departmentsResponse = await axios.get(`${API_BASE_URL}/recruiter/departments/`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      if (departmentsResponse.data && Array.isArray(departmentsResponse.data)) {
        const formattedDepartments = departmentsResponse.data.map((dept: any) => ({
          id: dept.id.toString(),
          name: dept.name || '',
          description: dept.description || '',
          headCount: dept.head_count || 0,
        }));
        setDepartments(formattedDepartments);
      }

      toast.success('Departments saved successfully');
    } catch (error: any) {
      console.error('Error saving departments:', error);
      toast.error(error.response?.data?.message || 'Failed to save departments');
    } finally {
      setIsSavingDepartments(false);
    }
  };

  const addRole = () => {
    const newRole: Role = {
      id: `new-${Date.now()}`,
      title: '',
      department: departments.length > 0 ? departments[0].name : '',
      level: 'Mid',
      isActive: true,
      isNew: true
    };
    setRoles([...roles, newRole]);
  };

  const removeRole = async (id: string) => {
    try {
      const token = sessionStorage.getItem('recruiterToken');
      if (!token) {
        toast.error('Please login to remove role');
        return;
      }

      if (id.startsWith('new-')) {
        setRoles(roles.filter(role => role.id !== id));
        return;
      }

      await axios.delete(`${API_BASE_URL}/recruiter/active-roles/${id}`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      setRoles(roles.filter(role => role.id !== id));
      toast.success('Role removed successfully');
    } catch (error: any) {
      console.error('Error removing role:', error);
      toast.error(error.response?.data?.message || 'Failed to remove role');
    }
  };

  const updateRole = (id: string, field: keyof Role, value: string | boolean) => {
    setRoles(roles.map(role => 
      role.id === id 
        ? { 
            ...role, 
            [field]: value,
            isModified: !role.isNew
          } 
        : role
    ));
  };

  const saveRoles = async () => {
    try {
      setIsSavingRoles(true);
      const token = sessionStorage.getItem('recruiterToken');
      if (!token) {
        toast.error('Please login to save roles');
        return;
      }

      const headers = {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      };

      for (const role of roles) {
        if (role.isNew) {
          await axios.post(
            `${API_BASE_URL}/recruiter/active-roles/`,
            { name: role.title },
            { headers }
          );
        } else if (role.isModified) {
          await axios.patch(
            `${API_BASE_URL}/recruiter/active-roles/${role.id}/`,
            { name: role.title },
            { headers }
          );
        }
      }

      const rolesResponse = await axios.get(`${API_BASE_URL}/recruiter/active-roles/`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      if (rolesResponse.data && Array.isArray(rolesResponse.data)) {
        const formattedRoles = rolesResponse.data.map((role: any) => ({
          id: role.id.toString(),
          title: role.title || '',
          department: role.department || '',
          level: role.level || 'Mid',
          isActive: role.is_active || true,
        }));
        setRoles(formattedRoles);
      }

      toast.success('Roles saved successfully');
    } catch (error: any) {
      console.error('Error saving roles:', error);
      toast.error(error.response?.data?.message || 'Failed to save roles');
    } finally {
      setIsSavingRoles(false);
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    if (field.startsWith('personal.')) {
      const personalField = field.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [personalField]: value
        }
      }));
    } else if (field.startsWith('company.')) {
      const companyField = field.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        companyInfo: {
          ...prev.companyInfo,
          [companyField]: value
        }
      }));
    }
  };

  const handleSavePersonalInfo = async () => {
    try {
      setIsSaving(true);
      const token = sessionStorage.getItem('recruiterToken');
      if (!token) {
        toast.error('Please login to save changes');
        navigate('/login');
        return;
      }

      const personalInfo = {
        job_title: profileData.personalInfo.title,
        years_of_experience: profileData.personalInfo.yearsExperience,
        phone_number: profileData.personalInfo.phone,
        linkedin_profile: profileData.personalInfo.linkedinUrl,
      };

      const response = await axios.patch(
        `${API_BASE_URL}/recruiter/recruiters/me/`,
        personalInfo,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        toast.success('Personal information updated successfully');
        await fetchProfileData();
      }
    } catch (error: any) {
      console.error('Error updating personal info:', error);
      toast.error(error.response?.data?.message || 'Failed to update personal information');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCompanyInfo = async () => {
    try {
      setIsSaving(true);
      const token = sessionStorage.getItem('recruiterToken');
      if (!token) {
        toast.error('Please login to save changes');
        navigate('/login');
        return;
      }

      const companyInfo = {
        company_name: profileData.companyInfo.name,
        industry: profileData.companyInfo.industry,
        website: profileData.companyInfo.website,
        company_size: profileData.companyInfo.size,
        founded: profileData.companyInfo.founded,
        headquarters: profileData.companyInfo.headquarters,
        company_description: profileData.companyInfo.description,
      };

      const response = await axios.patch(
        `${API_BASE_URL}/recruiter/recruiters/me/`,
        companyInfo,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        toast.success('Company information updated successfully');
        await fetchProfileData();
      }
    } catch (error: any) {
      console.error('Error updating company info:', error);
      toast.error(error.response?.data?.message || 'Failed to update company information');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            
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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/recruiter/dashboard')}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
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
                        <Select 
                          value={profileData.personalInfo.yearsExperience}
                          onValueChange={(value) => handleSelectChange('personal.yearsExperience', value)}
                        >
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
                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={handleSavePersonalInfo}
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
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
                        <Select 
                          value={profileData.companyInfo.industry}
                          onValueChange={(value) => handleSelectChange('company.industry', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="Retail">Retail</SelectItem>
                            <SelectItem value="Media">Media</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Company Size</label>
                        <Select 
                          value={profileData.companyInfo.size}
                          onValueChange={(value) => handleSelectChange('company.size', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 employees</SelectItem>
                            <SelectItem value="11-50">11-50 employees</SelectItem>
                            <SelectItem value="51-200">51-200 employees</SelectItem>
                            <SelectItem value="201-500">201-500 employees</SelectItem>
                            <SelectItem value="501-1000">501-1000 employees</SelectItem>
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
                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={handleSaveCompanyInfo}
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
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
                            <h4 className="font-medium">
                              Department Details
                              {dept.isNew && (
                                <Badge variant="outline" className="ml-2 text-blue-600">New</Badge>
                              )}
                              {dept.isModified && !dept.isNew && (
                                <Badge variant="outline" className="ml-2 text-yellow-600">Modified</Badge>
                              )}
                            </h4>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeDepartment(dept.id)}
                              disabled={isSavingDepartments}
                            >
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
                                disabled={isSavingDepartments}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Head Count</label>
                              <Input 
                                type="number"
                                value={dept.headCount}
                                onChange={(e) => updateDepartment(dept.id, 'headCount', parseInt(e.target.value) || 0)}
                                placeholder="0"
                                disabled={isSavingDepartments}
                              />
                            </div>
                            <div className="space-y-2 md:col-span-1">
                              <label className="text-sm font-medium">Description</label>
                              <Input 
                                value={dept.description}
                                onChange={(e) => updateDepartment(dept.id, 'description', e.target.value)}
                                placeholder="Brief description"
                                disabled={isSavingDepartments}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                      <div className="flex justify-end pt-4">
                        <Button 
                          onClick={saveDepartments}
                          disabled={isSavingDepartments}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isSavingDepartments ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
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
                            <h4 className="font-medium">
                              Role Details
                              {role.isNew && (
                                <Badge variant="outline" className="ml-2 text-blue-600">New</Badge>
                              )}
                              {role.isModified && !role.isNew && (
                                <Badge variant="outline" className="ml-2 text-yellow-600">Modified</Badge>
                              )}
                            </h4>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeRole(role.id)}
                              disabled={isSavingRoles}
                            >
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
                                disabled={isSavingRoles}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Department</label>
                              <Select 
                                value={role.department} 
                                onValueChange={(value) => updateRole(role.id, 'department', value)}
                                disabled={isSavingRoles}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Engineering">Engineering</SelectItem>
                                  <SelectItem value="Software Development">Software Development</SelectItem>
                                  <SelectItem value="Product Management">Product Management</SelectItem>
                                  <SelectItem value="Design">Design</SelectItem>
                                  <SelectItem value="Marketing">Marketing</SelectItem>
                                  <SelectItem value="Sales">Sales</SelectItem>
                                  <SelectItem value="Human Resources">Human Resources</SelectItem>
                                  <SelectItem value="Finance">Finance</SelectItem>
                                  <SelectItem value="Operations">Operations</SelectItem>
                                  <SelectItem value="Customer Support">Customer Support</SelectItem>
                                  <SelectItem value="Research & Development">Research & Development</SelectItem>
                                  <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                                  <SelectItem value="Data Science">Data Science</SelectItem>
                                  <SelectItem value="DevOps">DevOps</SelectItem>
                                  <SelectItem value="IT">IT</SelectItem>
                                  <SelectItem value="Legal">Legal</SelectItem>
                                  <SelectItem value="Business Development">Business Development</SelectItem>
                                  <SelectItem value="Content">Content</SelectItem>
                                  <SelectItem value="Public Relations">Public Relations</SelectItem>
                                  <SelectItem value="Security">Security</SelectItem>
                                  <SelectItem value="Supply Chain">Supply Chain</SelectItem>
                                  <SelectItem value="Facilities">Facilities</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Level</label>
                              <Select 
                                value={role.level} 
                                onValueChange={(value) => updateRole(role.id, 'level', value)}
                                disabled={isSavingRoles}
                              >
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
                              <Select 
                                value={role.isActive ? 'active' : 'inactive'} 
                                onValueChange={(value) => updateRole(role.id, 'isActive', value === 'active')}
                                disabled={isSavingRoles}
                              >
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
                      <div className="flex justify-end pt-4">
                        <Button 
                          onClick={saveRoles}
                          disabled={isSavingRoles}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isSavingRoles ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
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
                    <div className="flex justify-end pt-4">
                      <Button 
                        variant="outline"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Verification
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default RecruiterProfile;
