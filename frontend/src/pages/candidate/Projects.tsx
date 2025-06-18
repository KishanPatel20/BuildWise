import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Code, Plus, Trash2, ExternalLink } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = '';  // Empty string for relative paths

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  startDate: string;
  endDate: string;
  projectUrl: string;
  githubUrl: string;
  roleInProject?: string;
}

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProjects = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/projects/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      const transformedProjects = response.data.map((proj: any) => ({
        id: proj.id.toString(),
        title: proj.title,
        description: proj.description,
        technologies: proj.tech_stack || '',
        startDate: '', // API doesn't provide these fields
        endDate: '',
        projectUrl: proj.live_link || '',
        githubUrl: proj.github_link || '',
        roleInProject: proj.role_in_project || ''
      }));

      if (transformedProjects.length === 0) {
        // Initialize with empty project if no data
        setProjects([{
          id: 'new',
          title: '',
          description: '',
          technologies: '',
          startDate: '',
          endDate: '',
          projectUrl: '',
          githubUrl: '',
          roleInProject: ''
        }]);
      } else {
        setProjects(transformedProjects);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to fetch projects');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = () => {
    const newProject: Project = {
      id: 'new',
      title: '',
      description: '',
      technologies: '',
      startDate: '',
      endDate: '',
      projectUrl: '',
      githubUrl: '',
      roleInProject: ''
    };
    setProjects([...projects, newProject]);
  };

  const removeProject = async (id: string) => {
    if (id === 'new') {
      setProjects(projects.filter(proj => proj.id !== id));
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/projects/${id}/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setProjects(projects.filter(proj => proj.id !== id));
      toast.success('Project removed successfully');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to remove project');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setProjects(projects.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = sessionStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    try {
      // Handle both new and existing projects
      const promises = projects.map(async (project) => {
        const projectData = {
          title: project.title,
          description: project.description,
          tech_stack: project.technologies,
          role_in_project: project.roleInProject || 'Not specified',
          github_link: project.githubUrl || null,
          live_link: project.projectUrl || null
        };

        if (project.id === 'new') {
          // Create new project
          return axios.post(`${API_BASE_URL}/api/projects/`, projectData, {
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } else {
          // Update existing project
          return axios.patch(`${API_BASE_URL}/api/projects/${project.id}/`, projectData, {
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
            }
          });
        }
      });

      await Promise.all(promises);
      toast.success('Projects updated successfully');
      navigate('/candidate/certifications');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to update projects');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStep = 5;
  const totalSteps = 7;
  const progressValue = (currentStep / totalSteps) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              HireAI
            </span>
          </div>
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Exit Setup
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {projects.map((project, index) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Code className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle>Project {index + 1}</CardTitle>
                      <CardDescription>Showcase your technical projects</CardDescription>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProject(project.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`title-${project.id}`}>Project Title *</Label>
                  <Input
                    id={`title-${project.id}`}
                    placeholder="E.g., E-commerce Web Application"
                    value={project.title}
                    onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${project.id}`}>Description *</Label>
                  <Textarea
                    id={`description-${project.id}`}
                    placeholder="Describe what the project does, key features, and your role..."
                    rows={4}
                    value={project.description}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`technologies-${project.id}`}>Technologies Used *</Label>
                    <Input
                      id={`technologies-${project.id}`}
                      placeholder="React, Node.js, MongoDB, AWS, etc."
                      value={project.technologies}
                      onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`role-${project.id}`}>Your Role</Label>
                    <Input
                      id={`role-${project.id}`}
                      placeholder="e.g., Lead Developer, Full Stack Developer"
                      value={project.roleInProject}
                      onChange={(e) => updateProject(project.id, 'roleInProject', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`projectUrl-${project.id}`}>Project URL</Label>
                    <div className="relative">
                      <Input
                        id={`projectUrl-${project.id}`}
                        type="url"
                        placeholder="https://myproject.com"
                        value={project.projectUrl}
                        onChange={(e) => updateProject(project.id, 'projectUrl', e.target.value)}
                      />
                      {project.projectUrl && (
                        <ExternalLink className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`githubUrl-${project.id}`}>GitHub URL</Label>
                    <div className="relative">
                      <Input
                        id={`githubUrl-${project.id}`}
                        type="url"
                        placeholder="https://github.com/username/repo"
                        value={project.githubUrl}
                        onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
                      />
                      {project.githubUrl && (
                        <ExternalLink className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addProject}
            className="w-full border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Project
          </Button>

          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/candidate/work-experience')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Projects;
