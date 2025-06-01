
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Upload, FileText, Brain, CheckCircle, AlertCircle, Download, Eye, Trash2, Edit } from 'lucide-react';

const ResumeParser = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: '1',
      name: 'sarah_chen_resume.pdf',
      size: '2.4 MB',
      status: 'completed',
      confidence: 94,
      extractedData: {
        personalInfo: {
          name: 'Sarah Chen',
          email: 'sarah.chen@email.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          linkedin: 'linkedin.com/in/sarah-chen',
          github: 'github.com/sarahchen'
        },
        skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Docker', 'Python', 'PostgreSQL'],
        experience: [
          {
            title: 'Senior Frontend Developer',
            company: 'TechCorp Inc.',
            duration: '2021 - Present',
            description: 'Led development of React-based applications serving 100k+ users'
          },
          {
            title: 'Frontend Developer',
            company: 'StartupXYZ',
            duration: '2019 - 2021',
            description: 'Built responsive web applications using modern JavaScript frameworks'
          }
        ],
        education: [
          {
            degree: 'BS Computer Science',
            school: 'Stanford University',
            year: '2019'
          }
        ],
        projects: [
          {
            name: 'E-commerce Platform',
            description: 'Built full-stack e-commerce platform with React and Node.js',
            technologies: ['React', 'Node.js', 'MongoDB']
          }
        ],
        certifications: [
          {
            name: 'AWS Certified Developer',
            issuer: 'Amazon Web Services',
            date: '2023'
          }
        ]
      }
    },
    {
      id: '2',
      name: 'michael_rodriguez_cv.docx',
      size: '1.8 MB',
      status: 'processing',
      confidence: 0,
      extractedData: null
    }
  ]);

  const handleFileUpload = () => {
    setIsProcessing(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const formatFileSize = (size: string) => size;

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Multi-Format Resume Parser</span>
          </CardTitle>
          <CardDescription>
            AI-powered parsing with OCR support for PDF, DOCX, DOC, RTF, TXT, HTML, JPG, PNG
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-blue-100 rounded-full">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium">Upload Resumes & CVs</h3>
                <p className="text-gray-500">Drag & drop files or click to browse</p>
                <p className="text-sm text-gray-400 mt-2">Supports PDF, DOCX, DOC, RTF, TXT, HTML, JPG, PNG • Max 10MB per file</p>
              </div>
              <Button onClick={handleFileUpload} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Choose Files'}
              </Button>
            </div>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing with OCR and NLP extraction...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">287</div>
              <div className="text-sm text-gray-500">Files Processed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">96%</div>
              <div className="text-sm text-gray-500">Success Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">32</div>
              <div className="text-sm text-gray-500">Languages Supported</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">15ms</div>
              <div className="text-sm text-gray-500">Avg. Processing Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recently Processed Files</CardTitle>
            <CardDescription>AI-extracted data with confidence scoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">{file.name}</h4>
                        <p className="text-sm text-gray-500">
                          {file.size} • {file.status === 'completed' ? `Confidence: ${file.confidence}%` : 'Processing...'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={file.status === 'completed' ? 'default' : 'secondary'} className={
                        file.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }>
                        {file.status === 'completed' ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </>
                        ) : (
                          'Processing'
                        )}
                      </Badge>
                      {file.status === 'completed' && (
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {file.status === 'completed' && file.extractedData && (
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="skills">Skills</TabsTrigger>
                        <TabsTrigger value="experience">Experience</TabsTrigger>
                        <TabsTrigger value="education">Education</TabsTrigger>
                        <TabsTrigger value="validation">Validation</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-2">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Name:</span> {file.extractedData.personalInfo.name}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span> {file.extractedData.personalInfo.email}
                          </div>
                          <div>
                            <span className="font-medium">Phone:</span> {file.extractedData.personalInfo.phone}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span> {file.extractedData.personalInfo.location}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="skills">
                        <div className="flex flex-wrap gap-2">
                          {file.extractedData.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="experience">
                        <div className="space-y-3">
                          {file.extractedData.experience.map((exp, index) => (
                            <div key={index} className="border-l-2 border-blue-200 pl-4">
                              <h5 className="font-medium">{exp.title}</h5>
                              <p className="text-sm text-gray-600">{exp.company} • {exp.duration}</p>
                              <p className="text-sm">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="education">
                        <div className="space-y-3">
                          {file.extractedData.education.map((edu, index) => (
                            <div key={index} className="border-l-2 border-green-200 pl-4">
                              <h5 className="font-medium">{edu.degree}</h5>
                              <p className="text-sm text-gray-600">{edu.school} • {edu.year}</p>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="validation">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Email Format</span>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Phone Format</span>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Date Consistency</span>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Skill Normalization</span>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}

                  {file.status === 'completed' && (
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Add to Database
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Processing Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>AI Processing Pipeline</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">OCR Processing</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Entity Recognition</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Skill Extraction</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Normalization</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Validation & Scoring</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Processing Queue</h4>
              <div className="text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>In Queue:</span>
                  <span>3 files</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing:</span>
                  <span>1 file</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Wait:</span>
                  <span>2 minutes</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResumeParser;
