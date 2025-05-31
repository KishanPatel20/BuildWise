
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Award, Plus, Trash2, ExternalLink } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate: string;
  credentialId: string;
  credentialUrl: string;
}

const Certifications = () => {
  const navigate = useNavigate();
  const [certifications, setCertifications] = useState<Certification[]>([]);

  const addCertification = () => {
    const newCertification: Certification = {
      id: Date.now().toString(),
      name: '',
      issuingOrganization: '',
      issueDate: '',
      expirationDate: '',
      credentialId: '',
      credentialUrl: ''
    };
    setCertifications([...certifications, newCertification]);
  };

  const removeCertification = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setCertifications(certifications.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('candidateCertifications', JSON.stringify(certifications));
    navigate('/candidate/job-preferences');
  };

  const skipStep = () => {
    localStorage.setItem('candidateCertifications', JSON.stringify([]));
    navigate('/candidate/job-preferences');
  };

  const currentStep = 6;
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
            <h1 className="text-2xl font-bold text-gray-800">Certifications</h1>
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        {certifications.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Add Your Certifications</h3>
                  <p className="text-gray-600 mb-6">
                    Showcase your professional certifications, licenses, and training achievements. This section is optional.
                  </p>
                </div>
                <div className="flex space-x-4 justify-center">
                  <Button onClick={addCertification} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Certification
                  </Button>
                  <Button variant="outline" onClick={skipStep}>
                    Skip for Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {certifications.map((certification, index) => (
              <Card key={certification.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Award className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <CardTitle>Certification {index + 1}</CardTitle>
                        <CardDescription>Add your certification details</CardDescription>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCertification(certification.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${certification.id}`}>Certification Name *</Label>
                    <Input
                      id={`name-${certification.id}`}
                      placeholder="AWS Certified Solutions Architect"
                      value={certification.name}
                      onChange={(e) => updateCertification(certification.id, 'name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`organization-${certification.id}`}>Issuing Organization *</Label>
                    <Input
                      id={`organization-${certification.id}`}
                      placeholder="Amazon Web Services (AWS)"
                      value={certification.issuingOrganization}
                      onChange={(e) => updateCertification(certification.id, 'issuingOrganization', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`issueDate-${certification.id}`}>Issue Date *</Label>
                      <Input
                        id={`issueDate-${certification.id}`}
                        type="date"
                        value={certification.issueDate}
                        onChange={(e) => updateCertification(certification.id, 'issueDate', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`expirationDate-${certification.id}`}>Expiration Date</Label>
                      <Input
                        id={`expirationDate-${certification.id}`}
                        type="date"
                        value={certification.expirationDate}
                        onChange={(e) => updateCertification(certification.id, 'expirationDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`credentialId-${certification.id}`}>Credential ID</Label>
                      <Input
                        id={`credentialId-${certification.id}`}
                        placeholder="ABC123XYZ"
                        value={certification.credentialId}
                        onChange={(e) => updateCertification(certification.id, 'credentialId', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`credentialUrl-${certification.id}`}>Credential URL</Label>
                      <div className="relative">
                        <Input
                          id={`credentialUrl-${certification.id}`}
                          type="url"
                          placeholder="https://credential-verification-url.com"
                          value={certification.credentialUrl}
                          onChange={(e) => updateCertification(certification.id, 'credentialUrl', e.target.value)}
                        />
                        {certification.credentialUrl && (
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
              onClick={addCertification}
              className="w-full border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Certification
            </Button>

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/candidate/projects')}
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
        )}
      </div>
    </div>
  );
};

export default Certifications;
