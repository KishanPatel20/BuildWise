
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Code, Plus, Trash2, ExternalLink } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  startDate: string;
  endDate: string;
  projectUrl: string;
  githubUrl: string;
}

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: '',
      description: '',
      technologies: '',
      startDate: '',
      endDate: '',
      projectUrl: '',
      githubUrl: ''
    }
  ]);

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      description: '',
      technologies: '',
      startDate: '',
      endDate: '',
      projectUrl: '',
      githubUrl: ''
    };
    setProjects([...projects, newProject]);
  };

  const removeProject = (id: string) => {
    if (projects.length > 1) {
      setProjects(projects.filter(proj => proj.id !== id));
    }
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setProjects(projects.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('candidateProjects', JSON.stringify(projects));
    navigate('/candidate/certifications');
  };

  const currentStep = 5;
  const totalSteps = 7;
  const progressValue = (currentStep / totalSteps) * 100;

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
                  {projects.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProject(project.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${project.id}`}>Start Date</Label>
                    <Input
                      id={`startDate-${project.id}`}
                      type="date"
                      value={project.startDate}
                      onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${project.id}`}>End Date</Label>
                    <Input
                      id={`endDate-${project.id}`}
                      type="date"
                      value={project.endDate}
                      onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
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
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Projects;
