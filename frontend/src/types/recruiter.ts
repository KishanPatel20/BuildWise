export interface LocationFilter {
  country?: string;
  state?: string;
  city?: string;
  remote?: boolean;
  hybrid?: boolean;
  onsite?: boolean;
  willingToRelocate?: boolean;
}

export interface ExperienceFilter {
  overallExperience: {
    min: number;
    max: number;
  };
  domainExperience: {
    min: number;
    max: number;
  };
  currentRoleExperience: {
    min: number;
    max: number;
  };
  averageTenure: {
    min: number;
    max: number;
  };
}

export interface TechnicalSkillsFilter {
  programmingLanguages: string[];
  frameworks: string[];
  databases: string[];
  cloudPlatforms: string[];
  devOpsTools: string[];
  aiMlTools: string[];
  otherTechnologies: string[];
}

export interface DomainFilter {
  primaryDomain: string[];
  subDomains: string[];
  industryExperience: string[];
  preferredIndustries: string[];
}

export interface CompanyFilter {
  currentCompany: {
    type: string[]; // Startup, MNC, etc.
    size: {
      min: number;
      max: number;
    };
  };
  pastCompanies: {
    minExperience: number;
    preferredCompanies: string[];
    excludeCompanies: string[];
  };
}

export interface EducationFilter {
  degree: string[];
  fieldOfStudy: string[];
  minimumEducation: string;
  certifications: string[];
  preferredInstitutions: string[];
}

export interface RoleFilter {
  jobTitle: string[];
  seniorityLevel: string[];
  roleType: string[]; // Full-time, Contract, etc.
  department: string[];
  reportingTo: string[];
  teamSize: {
    min: number;
    max: number;
  };
}

export interface CompensationFilter {
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  equity: boolean;
  bonus: {
    min: number;
    max: number;
  };
  benefits: string[];
}

export interface AvailabilityFilter {
  noticePeriod: {
    min: number;
    max: number;
  };
  startDate: string;
  availability: string;
  timezone: string[];
}

export interface SoftSkillsFilter {
  communication: string[];
  leadership: string[];
  problemSolving: string[];
  teamwork: string[];
  otherSkills: string[];
}

export interface ProjectFilter {
  projectTypes: string[];
  projectScale: string[];
  teamSize: {
    min: number;
    max: number;
  };
  technologies: string[];
}

export interface SearchPreferences {
  matchScore: {
    min: number;
    max: number;
  };
  excludeContacted: boolean;
  excludeRejected: boolean;
  excludeShortlisted: boolean;
  activeInLastDays: number;
}

export interface RecruiterSearchFilters {
  location: LocationFilter;
  experience: ExperienceFilter;
  technicalSkills: TechnicalSkillsFilter;
  domain: DomainFilter;
  company: CompanyFilter;
  education: EducationFilter;
  role: RoleFilter;
  compensation: CompensationFilter;
  availability: AvailabilityFilter;
  softSkills: SoftSkillsFilter;
  projects: ProjectFilter;
  preferences: SearchPreferences;
  jobDescription?: string;
  customFilters?: Record<string, any>;
}

// Response structure from Groq API
export interface GroqProcessedFilters {
  extractedFilters: Partial<RecruiterSearchFilters>; // Filters extracted from job description
  userFilters: Partial<RecruiterSearchFilters>;      // Filters explicitly provided by user
  originalFilters: RecruiterSearchFilters;
  enhancedFilters: RecruiterSearchFilters;
  confidence: number;
  reasoning: string;
  considerations: string[];
  suggestedModifications: {
    field: string;
    originalValue: any;
    suggestedValue: any;
    reason: string;
  }[];
} 