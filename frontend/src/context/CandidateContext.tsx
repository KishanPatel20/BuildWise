import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface CandidateData {
  id?: number;
  user?: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  name?: string;
  email?: string;
  phone?: string;
  gender?: string | null;
  date_of_birth?: string | null;
  linkedin_profile?: string;
  github_profile?: string;
  portfolio_link?: string;
  resume?: string;
  skills?: string;
  experience?: number;
  current_job_title?: string | null;
  current_company?: string;
  desired_roles?: string | null;
  preferred_industry_sector?: string | null;
  employment_type_preferences?: string;
  preferred_locations?: string | null;
  desired_salary_range?: string | null;
  willingness_to_relocate?: boolean;
  is_actively_looking?: boolean;
  status?: string;
  view_count?: number;
  created_at?: string;
  updated_at?: string;
  work_experiences?: Array<{
    id: number;
    company_name: string;
    role_designation: string;
    start_date: string | null;
    end_date: string | null;
    is_current: boolean;
    responsibilities: string;
    technologies_used: string;
  }>;
  projects?: Array<{
    id: number;
    title: string;
    description: string;
    tech_stack: string;
    role_in_project: string;
    github_link: string | null;
    live_link: string | null;
  }>;
  certifications?: Array<any>;
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
        user: {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          first_name: response.data.user.first_name,
          last_name: response.data.user.last_name,
        },
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        gender: response.data.gender,
        date_of_birth: response.data.date_of_birth,
        linkedin_profile: response.data.linkedin_profile,
        github_profile: response.data.github_profile,
        portfolio_link: response.data.portfolio_link,
        resume: response.data.resume,
        skills: response.data.skills,
        experience: response.data.experience,
        current_job_title: response.data.current_job_title,
        current_company: response.data.current_company,
        desired_roles: response.data.desired_roles,
        preferred_industry_sector: response.data.preferred_industry_sector,
        employment_type_preferences: response.data.employment_type_preferences,
        preferred_locations: response.data.preferred_locations,
        desired_salary_range: response.data.desired_salary_range,
        willingness_to_relocate: response.data.willingness_to_relocate,
        is_actively_looking: response.data.is_actively_looking,
        status: response.data.status,
        view_count: response.data.view_count,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at,
        work_experiences: response.data.work_experiences?.map((exp: any) => ({
          id: exp.id,
          company_name: exp.company_name,
          role_designation: exp.role_designation,
          start_date: exp.start_date,
          end_date: exp.end_date,
          is_current: exp.is_current,
          responsibilities: exp.responsibilities,
          technologies_used: exp.technologies_used
        })),
        projects: response.data.projects?.map((proj: any) => ({
          id: proj.id,
          title: proj.title,
          description: proj.description,
          tech_stack: proj.tech_stack,
          role_in_project: proj.role_in_project,
          github_link: proj.github_link,
          live_link: proj.live_link
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