from django.core.management.base import BaseCommand
from candidate.models import (
    Candidate, Project, WorkExperience, Education, Certification
)
from candidate.mongo_models import (
    CandidateMongo, ProjectMongo, WorkExperienceMongo,
    EducationMongo, CertificationMongo
)
from datetime import datetime

def format_url(url):
    """Format URL to ensure it has a valid scheme"""
    if not url:
        return None
    if not url.startswith(('http://', 'https://')):
        return f'https://{url}'
    return url

def map_status(old_status):
    """Map old status to new status values"""
    status_mapping = {
        'new': 'active',
        'under_review': 'active',
        'shortlisted': 'active',
        'interviewing': 'active',
        'rejected': 'inactive',
        'hired': 'inactive',
        'withdrawn': 'inactive',
        'on_hold': 'suspended'
    }
    return status_mapping.get(old_status, 'active')

class Command(BaseCommand):
    help = 'Migrate data from SQLite to MongoDB'

    def handle(self, *args, **options):
        self.stdout.write('Starting migration to MongoDB...')

        # Migrate Candidates
        for candidate in Candidate.objects.all():
            try:
                # Convert skills string to list
                skills_list = candidate.skills.split(',') if candidate.skills else []
                
                # Create MongoDB candidate
                mongo_candidate = CandidateMongo(
                    user_id=candidate.user.id,  # Store user ID instead of reference
                    name=candidate.name,
                    email=candidate.email,
                    phone=candidate.phone,
                    gender=candidate.gender,
                    date_of_birth=candidate.date_of_birth,
                    linkedin_profile=format_url(candidate.linkedin_profile),
                    github_profile=format_url(candidate.github_profile),
                    portfolio_link=format_url(candidate.portfolio_link),
                    resume=str(candidate.resume) if candidate.resume else None,
                    skills=skills_list,
                    experience=candidate.experience,
                    current_job_title=candidate.current_job_title,
                    current_company=candidate.current_company,
                    desired_roles=candidate.desired_roles.split(',') if candidate.desired_roles else [],
                    preferred_industry_sector=candidate.preferred_industry_sector.split(',') if candidate.preferred_industry_sector else [],
                    employment_type_preferences=candidate.employment_type_preferences.split(',') if candidate.employment_type_preferences else [],
                    preferred_locations=candidate.preferred_locations.split(',') if candidate.preferred_locations else [],
                    desired_salary_range=candidate.desired_salary_range,
                    willingness_to_relocate=candidate.willingness_to_relocate,
                    is_actively_looking=candidate.is_actively_looking,
                    status=map_status(candidate.status),
                    source=candidate.source,
                    view_count=candidate.view_count,
                    created_at=candidate.created_at,
                    updated_at=candidate.updated_at
                )
                mongo_candidate.save()

                # Migrate Projects
                for project in candidate.projects.all():
                    tech_stack = project.tech_stack.split(',') if project.tech_stack else []
                    ProjectMongo(
                        candidate=mongo_candidate,
                        title=project.title,
                        description=project.description,
                        tech_stack=tech_stack,
                        role_in_project=project.role_in_project,
                        github_link=format_url(project.github_link),
                        live_link=format_url(project.live_link)
                    ).save()

                # Migrate Work Experiences
                for exp in candidate.work_experiences.all():
                    responsibilities = exp.responsibilities.split('\n') if exp.responsibilities else []
                    technologies = exp.technologies_used.split(',') if exp.technologies_used else []
                    WorkExperienceMongo(
                        candidate=mongo_candidate,
                        company_name=exp.company_name,
                        role_designation=exp.role_designation,
                        start_date=exp.start_date,
                        end_date=exp.end_date,
                        is_current=exp.is_current,
                        responsibilities=responsibilities,
                        technologies_used=technologies
                    ).save()

                # Migrate Education
                for edu in candidate.education_entries.all():
                    activities = edu.activities_achievements.split('\n') if edu.activities_achievements else []
                    EducationMongo(
                        candidate=mongo_candidate,
                        degree=edu.degree,
                        institution=edu.institution,
                        field_of_study=edu.field_of_study,
                        start_date=edu.start_date,
                        end_date=edu.end_date,
                        gpa=edu.gpa,
                        activities_achievements=activities
                    ).save()

                # Migrate Certifications
                for cert in candidate.certifications.all():
                    CertificationMongo(
                        candidate=mongo_candidate,
                        name=cert.name,
                        issuing_organization=cert.issuing_organization,
                        issue_date=cert.issue_date,
                        expiration_date=cert.expiration_date,
                        credential_id=cert.credential_id,
                        credential_url=format_url(cert.credential_url)
                    ).save()

                self.stdout.write(f'Successfully migrated candidate: {candidate.name}')

            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error migrating candidate {candidate.name}: {str(e)}'))

        self.stdout.write(self.style.SUCCESS('Migration completed!')) 