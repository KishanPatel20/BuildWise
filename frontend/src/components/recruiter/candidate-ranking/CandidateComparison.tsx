
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Star, MapPin, Briefcase, GraduationCap, X } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  skills: string[];
  education: string;
  matchScore: number;
  avatar?: string;
  strengths?: string[];
  redFlags?: string[];
}

interface CandidateComparisonProps {
  selectedCandidates: string[];
  candidates: Candidate[];
}

const CandidateComparison: React.FC<CandidateComparisonProps> = ({ selectedCandidates, candidates }) => {
  const comparisonCandidates = candidates.filter(c => selectedCandidates.includes(c.id));

  if (comparisonCandidates.length < 2) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Candidate Comparison</span>
        </CardTitle>
        <CardDescription>
          Side-by-side comparison of selected candidates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Criteria</th>
                {comparisonCandidates.map((candidate) => (
                  <th key={candidate.id} className="text-center p-4 min-w-[200px]">
                    <div className="flex flex-col items-center space-y-2">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={candidate.avatar} />
                        <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{candidate.name}</h4>
                        <p className="text-sm text-gray-500">{candidate.title}</p>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Match Score */}
              <tr className="border-b">
                <td className="p-4 font-medium">Match Score</td>
                {comparisonCandidates.map((candidate) => (
                  <td key={candidate.id} className="p-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-lg font-bold text-green-600">{candidate.matchScore}%</span>
                      </div>
                      <Progress value={candidate.matchScore} className="w-24" />
                    </div>
                  </td>
                ))}
              </tr>

              {/* Experience */}
              <tr className="border-b">
                <td className="p-4 font-medium">Experience</td>
                {comparisonCandidates.map((candidate) => (
                  <td key={candidate.id} className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span>{candidate.experience}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Location */}
              <tr className="border-b">
                <td className="p-4 font-medium">Location</td>
                {comparisonCandidates.map((candidate) => (
                  <td key={candidate.id} className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{candidate.location}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Education */}
              <tr className="border-b">
                <td className="p-4 font-medium">Education</td>
                {comparisonCandidates.map((candidate) => (
                  <td key={candidate.id} className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <GraduationCap className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{candidate.education}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Skills */}
              <tr className="border-b">
                <td className="p-4 font-medium">Top Skills</td>
                {comparisonCandidates.map((candidate) => (
                  <td key={candidate.id} className="p-4">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {candidate.skills.slice(0, 4).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{candidate.skills.length - 4}
                        </Badge>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Strengths */}
              <tr className="border-b">
                <td className="p-4 font-medium">Key Strengths</td>
                {comparisonCandidates.map((candidate) => (
                  <td key={candidate.id} className="p-4">
                    <div className="space-y-1">
                      {candidate.strengths?.slice(0, 3).map((strength, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-green-600 border-green-200 block">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Areas to Explore */}
              <tr className="border-b">
                <td className="p-4 font-medium">Areas to Explore</td>
                {comparisonCandidates.map((candidate) => (
                  <td key={candidate.id} className="p-4">
                    <div className="space-y-1">
                      {candidate.redFlags?.length ? candidate.redFlags.slice(0, 2).map((flag, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-orange-600 border-orange-200 block">
                          {flag}
                        </Badge>
                      )) : (
                        <span className="text-xs text-gray-400">None identified</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline">Export Comparison</Button>
          <Button variant="outline">Share with Team</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Schedule Group Interview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateComparison;
