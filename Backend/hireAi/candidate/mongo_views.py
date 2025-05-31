from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth.models import User
from .mongo_models import (
    CandidateMongo, ProjectMongo, WorkExperienceMongo,
    EducationMongo, CertificationMongo
)
from .mongo_serializers import (
    CandidateMongoSerializer, ProjectMongoSerializer,
    WorkExperienceMongoSerializer, EducationMongoSerializer,
    CertificationMongoSerializer, UserSerializer
)
from .mongo_permissions import (
    IsOwnerOfCandidateProfile, IsOwnerOfEducation,
    IsOwnerOfWorkExperience, IsOwnerOfProject, IsOwnerOfCertification
)
from .resume_parser import extract_text_from_file, extract_resume_details
from datetime import datetime
from dateutil.parser import parse as parse_date

def format_url(url):
    if not url:
        return None
    if not url.startswith(('http://', 'https://')):
        return f'https://{url}'
    return url

def parse_resume_date(date_str):
    if not date_str:
        return None
    date_str = date_str.upper()
    if date_str in ['PRESENT', 'CURRENT', 'NOW', 'TILL DATE']:
        return datetime.now().date()
    try:
        return parse_date(date_str).date()
    except:
        return None

class CandidateMongoViewSet(viewsets.ModelViewSet):
    serializer_class = CandidateMongoSerializer
    permission_classes = [IsAuthenticated, IsOwnerOfCandidateProfile]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return CandidateMongo.objects.filter(user_id=self.request.user.id)

    def create(self, request, *args, **kwargs):
        # Check if user already has a candidate profile
        if CandidateMongo.objects.filter(user_id=request.user.id).exists():
            return Response(
                {'error': 'Candidate profile already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Add user to the request data
        data = request.data.copy()
        data['user_id'] = request.user.id

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get', 'patch'])
    def me(self, request):
        try:
            candidate = CandidateMongo.objects.get(user_id=request.user.id)
        except CandidateMongo.DoesNotExist:
            return Response(
                {'error': 'Candidate profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if request.method == 'PATCH':
            serializer = self.get_serializer(candidate, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(candidate)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def upload_resume(self, request):
        user_id = request.user.id
        old_candidate = None

        # Try to get existing profile, but don't require it
        try:
            old_candidate = CandidateMongo.objects.get(user_id=user_id)
            # Delete the old profile and all its related data if it exists
            old_candidate.delete()
        except CandidateMongo.DoesNotExist:
            # It's okay if no profile exists
            pass

        if 'resume' not in request.FILES:
            return Response(
                {'error': 'No resume file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        resume_file = request.FILES['resume']
        
        try:
            # Extract text from the resume file
            resume_text = extract_text_from_file(resume_file)
            
            # Parse the resume using Gemini
            resume_data = extract_resume_details(resume_text)
            
            if not resume_data:
                return Response(
                    {'error': 'Failed to parse resume'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create a new candidate profile
            candidate = CandidateMongo(
                user_id=user_id,
                name=resume_data.personal_info.name if resume_data.personal_info else '',
                email=resume_data.personal_info.email if resume_data.personal_info else '',
                phone=resume_data.personal_info.phone if resume_data.personal_info else '',
                gender=None,
                date_of_birth=None,
                linkedin_profile=format_url(resume_data.personal_info.linkedin_url if resume_data.personal_info else None),
                github_profile=None,
                portfolio_link=None,
                current_job_title=resume_data.personal_info.title if resume_data.personal_info else '',
                current_company='',
                skills=[],
                experience=0,
                resume=str(resume_file),
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            candidate.save()

            # Calculate total experience from work experiences
            total_experience = 0
            if resume_data.professional_experience:
                for exp in resume_data.professional_experience:
                    start_date = parse_resume_date(exp.start_date)
                    end_date = parse_resume_date(exp.end_date)
                    if start_date:
                        if end_date:
                            years = (end_date - start_date).days / 365.25
                            total_experience += years
                        else:
                            years = (datetime.now().date() - start_date).days / 365.25
                            total_experience += years

            # Update experience
            candidate.experience = round(total_experience, 1)
            candidate.save()

            # Update skills
            if resume_data.technical_skills:
                skills = []
                if resume_data.technical_skills.technical_skills:
                    skills.extend(resume_data.technical_skills.technical_skills)
                if resume_data.technical_skills.frameworks_libraries:
                    skills.extend(resume_data.technical_skills.frameworks_libraries)
                if resume_data.technical_skills.tools:
                    skills.extend(resume_data.technical_skills.tools)
                candidate.skills = skills
                candidate.save()

            # Create work experiences
            if resume_data.professional_experience:
                for exp in resume_data.professional_experience:
                    if exp.company and exp.role:
                        start_date = parse_resume_date(exp.start_date)
                        end_date = parse_resume_date(exp.end_date)
                        
                        WorkExperienceMongo(
                            candidate=candidate,
                            company_name=exp.company,
                            role_designation=exp.role,
                            start_date=start_date or datetime.now().date(),
                            end_date=end_date,
                            responsibilities=exp.responsibilities if exp.responsibilities else [],
                            technologies_used=[]
                        ).save()

            # Create education entries
            if resume_data.education:
                for edu in resume_data.education:
                    if edu.institution and edu.degree:
                        EducationMongo(
                            candidate=candidate,
                            institution=edu.institution,
                            degree=edu.degree,
                            field_of_study='',
                            start_date=parse_resume_date(edu.start_date),
                            end_date=parse_resume_date(edu.end_date)
                        ).save()

            # Create projects
            if resume_data.projects:
                for proj in resume_data.projects:
                    if proj.project_name:
                        ProjectMongo(
                            candidate=candidate,
                            title=proj.project_name,
                            description=proj.description or '',
                            tech_stack=proj.tech_stack if proj.tech_stack else [],
                            role_in_project='Not specified'
                        ).save()

            return Response({
                'message': 'Resume uploaded and processed successfully. Profile has been created.',
                'resume_url': candidate.resume,
                'profile_updated': True,
                'projects_created': len(resume_data.projects) if resume_data.projects else 0
            })

        except Exception as e:
            return Response(
                {'error': f'Error processing resume: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ProjectMongoViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectMongoSerializer
    permission_classes = [IsAuthenticated, IsOwnerOfProject]

    def get_queryset(self):
        return ProjectMongo.objects.filter(candidate__user_id=self.request.user.id)

    def perform_create(self, serializer):
        candidate = CandidateMongo.objects.get(user_id=self.request.user.id)
        serializer.save(candidate=candidate)

class WorkExperienceMongoViewSet(viewsets.ModelViewSet):
    serializer_class = WorkExperienceMongoSerializer
    permission_classes = [IsAuthenticated, IsOwnerOfWorkExperience]

    def get_queryset(self):
        return WorkExperienceMongo.objects.filter(candidate__user_id=self.request.user.id)

    def perform_create(self, serializer):
        candidate = CandidateMongo.objects.get(user_id=self.request.user.id)
        serializer.save(candidate=candidate)

class EducationMongoViewSet(viewsets.ModelViewSet):
    serializer_class = EducationMongoSerializer
    permission_classes = [IsAuthenticated, IsOwnerOfEducation]

    def get_queryset(self):
        return EducationMongo.objects.filter(candidate__user_id=self.request.user.id)

    def perform_create(self, serializer):
        candidate = CandidateMongo.objects.get(user_id=self.request.user.id)
        serializer.save(candidate=candidate)

class CertificationMongoViewSet(viewsets.ModelViewSet):
    serializer_class = CertificationMongoSerializer
    permission_classes = [IsAuthenticated, IsOwnerOfCertification]

    def get_queryset(self):
        return CertificationMongo.objects.filter(candidate__user_id=self.request.user.id)

    def perform_create(self, serializer):
        candidate = CandidateMongo.objects.get(user_id=self.request.user.id)
        serializer.save(candidate=candidate) 