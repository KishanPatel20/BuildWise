import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface CandidateData {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  gender?: string;
  date_of_birth?: string;
  linkedin_profile?: string;
  github_profile?: string;
  portfolio_link?: string;
  current_job_title?: string;
  current_company?: string;
  skills?: string;
  experience?: number;
  education?: Array<{
    id: number;
    institution: string;
    degree: string;
    field_of_study: string;
    start_year: string;
    end_year: string;
    grade: string;
  }>;
  work_experience?: Array<{
    id: number;
    company: string;
    position: string;
    start_date: string;
    end_date: string;
    is_current_job: boolean;
    description: string;
    location: string;
  }>;
  projects?: Array<{
    id: number;
    title: string;
    description: string;
    technologies: string;
    start_date: string;
    end_date: string;
    project_url: string;
    github_url: string;
  }>;
  certifications?: Array<{
    id: number;
    name: string;
    issuing_organization: string;
    issue_date: string;
    expiration_date: string;
    credential_id: string;
    credential_url: string;
  }>;
}

interface CandidateContextType {
  candidateData: CandidateData | null;
  setCandidateData: (data: CandidateData | null) => void;
  fetchCandidateData: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const CandidateContext = createContext<CandidateContextType | undefined>(undefined);

export function CandidateProvider({ children }: { children: ReactNode }) {
  const [candidateData, setCandidateData] = useState<CandidateData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidateData = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('No authentication token found');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/candidates/me/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      // Transform the data to match our frontend structure
      const transformedData: CandidateData = {
        id: response.data.id,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
        phone: response.data.phone,
        location: response.data.location,
        gender: response.data.gender,
        date_of_birth: response.data.date_of_birth,
        education: response.data.education?.map((edu: any) => ({
          id: edu.id,
          institution: edu.institution,
          degree: edu.degree,
          field_of_study: edu.field_of_study,
          start_year: edu.start_year,
          end_year: edu.end_year,
          grade: edu.grade
        })),
        work_experience: response.data.work_experience?.map((exp: any) => ({
          id: exp.id,
          company: exp.company,
          position: exp.position,
          start_date: exp.start_date,
          end_date: exp.end_date,
          is_current_job: exp.is_current_job,
          description: exp.description,
          location: exp.location
        })),
        projects: response.data.projects?.map((proj: any) => ({
          id: proj.id,
          title: proj.title,
          description: proj.description,
          technologies: proj.technologies,
          start_date: proj.start_date,
          end_date: proj.end_date,
          project_url: proj.project_url,
          github_url: proj.github_url
        })),
        certifications: response.data.certifications?.map((cert: any) => ({
          id: cert.id,
          name: cert.name,
          issuing_organization: cert.issuing_organization,
          issue_date: cert.issue_date,
          expiration_date: cert.expiration_date,
          credential_id: cert.credential_id,
          credential_url: cert.credential_url
        }))
      };

      setCandidateData(transformedData);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to fetch candidate data');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CandidateContext.Provider value={{ candidateData, setCandidateData, fetchCandidateData, isLoading, error }}>
      {children}
    </CandidateContext.Provider>
  );
}

export function useCandidate() {
  const context = useContext(CandidateContext);
  if (context === undefined) {
    throw new Error('useCandidate must be used within a CandidateProvider');
  }
  return context;
} 