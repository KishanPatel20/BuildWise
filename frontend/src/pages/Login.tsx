import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = '';  // Empty string for relative paths

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [candidateForm, setCandidateForm] = useState({ email: '', password: '' });
  const [recruiterForm, setRecruiterForm] = useState({ email: '', password: '' });

  const checkCandidateProfile = async (token: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/candidates/me/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      
      // If we get a valid response with data, redirect to dashboard
      if (response.data && response.data.id) {
        navigate('/candidate/dashboard');
      } else {
        // If no profile data, redirect to profile setup
        navigate('/candidate/profile-setup');
      }
    } catch (error) {
      // If any error or empty response, redirect to profile setup
      navigate('/candidate/profile-setup');
    }
  };

  const handleCandidateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/login/`, {
        username: candidateForm.email,
        password: candidateForm.password
      });

      if (response.data.token) {
        // Store token in sessionStorage
        sessionStorage.setItem('token', response.data.token);
        // Store user data if needed
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        
        toast.success('Login successful!');
        // Check candidate profile and redirect accordingly
        await checkCandidateProfile(response.data.token);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecruiterLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/recruiter/login/`, {
        username: recruiterForm.email,
        password: recruiterForm.password
      });

      if (response.data.token) {
        // Store token in sessionStorage
        sessionStorage.setItem('recruiterToken', response.data.token);
        // Store user data
        sessionStorage.setItem('recruiterUser', JSON.stringify(response.data.user));
        
        toast.success('Login successful!');
        navigate('/web/recruiter/dashboard');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="absolute top-8 left-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              HireAI
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Choose your account type to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="candidate" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="candidate" className="text-sm">Candidate</TabsTrigger>
                <TabsTrigger value="recruiter" className="text-sm">Recruiter</TabsTrigger>
              </TabsList>

              {/* Candidate Login */}
              <TabsContent value="candidate">
                <form onSubmit={handleCandidateLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="candidate-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="candidate-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={candidateForm.email}
                        onChange={(e) => setCandidateForm({ ...candidateForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="candidate-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="candidate-password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        value={candidateForm.password}
                        onChange={(e) => setCandidateForm({ ...candidateForm, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In as Candidate'}
                  </Button>
                  <p className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Button
                      variant="link"
                      onClick={() => navigate('/candidate/signup')}
                      className="p-0 text-blue-600"
                    >
                      Sign up here
                    </Button>
                  </p>
                </form>
              </TabsContent>

              {/* Recruiter Login */}
              <TabsContent value="recruiter">
                <form onSubmit={handleRecruiterLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recruiter-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="recruiter-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={recruiterForm.email}
                        onChange={(e) => setRecruiterForm({ ...recruiterForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recruiter-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="recruiter-password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        value={recruiterForm.password}
                        onChange={(e) => setRecruiterForm({ ...recruiterForm, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In as Recruiter'}
                  </Button>
                  <p className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Button
                      variant="link"
                      onClick={() => navigate('/web/recruiter/signup')}
                      className="p-0 text-green-600"
                    >
                      Sign up here
                    </Button>
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
