import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Globe,
  Linkedin,
  Github,
  Download,
  Code,
  Brain,
  Award,
  Building2,
  Clock,
  Eye,
  ExternalLink,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CandidatePortfolioProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: any; // Replace with proper type
  onShortlist?: (candidateId: string, isShortlisted: boolean) => void;
  isShortlisted?: boolean;
}

const CandidatePortfolio: React.FC<CandidatePortfolioProps> = ({
  isOpen,
  onClose,
  candidate,
  onShortlist,
  isShortlisted = false,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const formatExperienceDuration = (startDate: string, endDate: string | null, isCurrent: boolean) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    
    let duration = '';
    if (diffYears > 0) {
      duration += `${diffYears} yr${diffYears > 1 ? 's' : ''}`;
    }
    if (diffMonths > 0) {
      duration += `${duration ? ' ' : ''}${diffMonths} mo${diffMonths > 1 ? 's' : ''}`;
    }
    return duration;
  };

  const formatResponsibilities = (responsibilities: string) => {
    return responsibilities.split('•').filter(Boolean).map(item => item.trim());
  };

  const handleShortlist = () => {
    if (onShortlist) {
      onShortlist(candidate.id, !isShortlisted);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Candidate Portfolio</DialogTitle>
        </DialogHeader> */}

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-6 mb-6">
            <Avatar className="w-24 h-24">
              <img src={candidate.profile_picture || "https://github.com/shadcn.png"} alt={candidate.name} />
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{candidate.name}</h2>
                  <p className="text-lg text-gray-600">{candidate.job_title}</p>
                </div>
                <div className="flex items-center gap-2">
                  {candidate.match_percentage && (
                    <Badge variant="secondary" className="text-sm">
                      {candidate.match_percentage}% Match
                    </Badge>
                  )}
                  {onShortlist && (
                    <Button
                      variant={isShortlisted ? "default" : "outline"}
                      size="sm"
                      onClick={handleShortlist}
                      className="gap-2"
                    >
                      <Star className={cn("w-4 h-4", isShortlisted && "fill-white")} />
                      {isShortlisted ? "Shortlisted" : "Shortlist"}
                    </Button>
                  )}
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{candidate.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{candidate.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{candidate.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-3 mb-6">
            {candidate.social_links?.linkedin && (
              <a href={candidate.social_links.linkedin} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </Button>
              </a>
            )}
            {candidate.social_links?.github && (
              <a href={candidate.social_links.github} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </Button>
              </a>
            )}
            {candidate.social_links?.portfolio && (
              <a href={candidate.social_links.portfolio} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                  <Globe className="w-4 h-4" />
                  Portfolio
                </Button>
              </a>
            )}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="experience" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-6">
              {candidate.work_experiences?.map((exp: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{exp.role_designation}</h3>
                      <p className="text-gray-600">{exp.company_name}</p>
                    </div>
                    <Badge variant="secondary">
                      {formatExperienceDuration(exp.start_date, exp.end_date, exp.is_current)}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                  </div>
                  {exp.responsibilities && (
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold mb-2">Key Responsibilities:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {formatResponsibilities(exp.responsibilities).map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {exp.technologies_used && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Technologies Used:</h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies_used.split(',').map((tech: string, i: number) => (
                          <Badge key={i} variant="secondary">{tech.trim()}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              {candidate.projects?.map((project: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <ExternalLink className="w-4 h-4" />
                          View Project
                        </Button>
                      </a>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{project.description}</p>
                  {project.tech_stack && (
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.split(',').map((tech: string, i: number) => (
                        <Badge key={i} variant="secondary">{tech.trim()}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills?.split(',').map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">{skill.trim()}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Soft Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.soft_skills?.split(',').map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">{skill.trim()}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Work Preferences</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Availability: {candidate.availability || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Location: {candidate.location || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Notice Period: {candidate.notice_period || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>Education: {candidate.education || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>Seniority Level: {candidate.seniorityLevel || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandidatePortfolio; 