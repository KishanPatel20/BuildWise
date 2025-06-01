
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Brain, CheckCircle, AlertCircle, Users, Zap } from 'lucide-react';

const CandidateProfileParser = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedProfiles, setParsedProfiles] = useState([
    {
      id: '1',
      fileName: 'sarah_chen_resume.pdf',
      status: 'completed',
      extractedData: {
        name: 'Sarah Chen',
        email: 'sarah.chen@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Docker'],
        experience: [
          {
            title: 'Senior Frontend Developer',
            company: 'TechCorp Inc.',
            duration: '2021 - Present',
            description: 'Led development of React-based applications serving 100k+ users'
          }
        ],
        education: [
          {
            degree: 'BS Computer Science',
            school: 'Stanford University',
            year: '2019'
          }
        ],
        confidence: 94
      }
    }
  ]);

  const handleFileUpload = () => {
    setIsProcessing(true);
    setUploadProgress(0);
    
    // Simulate file upload and processing
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Resume & CV Parser</span>
            </CardTitle>
            <CardDescription>
              AI-powered parsing of PDF, DOCX, and TXT files with entity recognition
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
                  <h3 className="text-lg font-medium">Upload Resumes</h3>
                  <p className="text-gray-500">Drag & drop files or click to browse</p>
                  <p className="text-sm text-gray-400 mt-2">Supports PDF, DOCX, TXT • Max 10MB per file</p>
                </div>
                <Button onClick={handleFileUpload} disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Choose Files'}
                </Button>
              </div>
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing resumes...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">156</div>
                <div className="text-sm text-gray-500">Files Processed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">94%</div>
                <div className="text-sm text-gray-500">Success Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">32</div>
                <div className="text-sm text-gray-500">Languages Supported</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>AI Processing</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Entity Recognition</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Skill Extraction</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Experience Parsing</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Education Extraction</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Contact Information</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button className="w-full" variant="outline">
                <Zap className="w-4 h-4 mr-2" />
                Batch Process
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parsed Results */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Parsed Profiles</CardTitle>
          <CardDescription>AI-extracted data from uploaded resumes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {parsedProfiles.map((profile) => (
              <div key={profile.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">{profile.fileName}</h4>
                      <p className="text-sm text-gray-500">
                        Confidence: {profile.extractedData.confidence}%
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Name:</span> {profile.extractedData.name}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {profile.extractedData.email}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {profile.extractedData.phone}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {profile.extractedData.location}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="skills">
                    <div className="flex flex-wrap gap-2">
                      {profile.extractedData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="experience">
                    <div className="space-y-3">
                      {profile.extractedData.experience.map((exp, index) => (
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
                      {profile.extractedData.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-green-200 pl-4">
                          <h5 className="font-medium">{edu.degree}</h5>
                          <p className="text-sm text-gray-600">{edu.school} • {edu.year}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-2">
                  <Button size="sm" variant="outline">
                    Review & Edit
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Add to Database
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateProfileParser;
