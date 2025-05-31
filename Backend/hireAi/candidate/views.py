from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import Candidate, Education, WorkExperience, Project, Certification
from .serializers import (
    UserSerializer, CandidateSerializer, EducationSerializer, WorkExperienceSerializer,
    ProjectSerializer, CertificationSerializer
)
from .permissions import (
    IsOwnerOfCandidateProfile, IsOwnerOfEducation,
    IsOwnerOfWorkExperience, IsOwnerOfProject, IsOwnerOfCertification
)
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .resume_parser import extract_text_from_file, extract_resume_details
from datetime import datetime
import re

def parse_date(date_str):
    """
    Parse date string in various formats to datetime.date object
    Handles formats like:
    - YYYY-MM-DD
    - MMM YYYY (e.g., Jan 2023)
    - MM/YYYY
    - YYYY
    """
    if not date_str:
        return None
        
    # Try YYYY-MM-DD format
    try:
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        pass
        
    # Try MMM YYYY format (e.g., Jan 2023)
    try:
        return datetime.strptime(date_str, '%b %Y').date()
    except ValueError:
        pass
        
    # Try MM/YYYY format
    try:
        return datetime.strptime(date_str, '%m/%Y').date()
    except ValueError:
        pass
        
    # Try YYYY format
    try:
        return datetime.strptime(date_str, '%Y').date()
    except ValueError:
        pass
        
    # If all parsing attempts fail, return None
    return None

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new user (without creating candidate profile)
    """
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')

    if not all([username, email, password]):
        return Response(
            {'error': 'Please provide username, email and password'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Username already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'Email already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Create user
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name
    )

    # Generate token
    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        'token': token.key,
        'user': UserSerializer(user).data
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    Login user and return token
    """
    username = request.data.get('username')
    password = request.data.get('password')

    if not all([username, password]):
        return Response(
            {'error': 'Please provide username and password'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)

    if not user:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    token, _ = Token.objects.get_or_create(user=user)

    # Check if user has a candidate profile
    has_candidate_profile = hasattr(user, 'candidate_profile')

    return Response({
        'token': token.key,
        'user': UserSerializer(user).data,
        'has_candidate_profile': has_candidate_profile
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """
    Get the authenticated user's profile
    """
    user_data = UserSerializer(request.user).data
    has_candidate_profile = hasattr(request.user, 'candidate_profile')
    
    response_data = {
        **user_data,
        'has_candidate_profile': has_candidate_profile
    }
    
    return Response(response_data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """
    Update the authenticated user's profile
    """
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """
    Change the authenticated user's password
    """
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    if not all([old_password, new_password]):
        return Response(
            {'error': 'Please provide both old and new password'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not request.user.check_password(old_password):
        return Response(
            {'error': 'Invalid old password'},
            status=status.HTTP_400_BAD_REQUEST
        )

    request.user.set_password(new_password)
    request.user.save()

    # Delete old token and create new one
    Token.objects.filter(user=request.user).delete()
    token = Token.objects.create(user=request.user)

    return Response({
        'message': 'Password changed successfully',
        'token': token.key
    })

class CandidateViewSet(viewsets.ModelViewSet):
    serializer_class = CandidateSerializer
    permission_classes = [IsAuthenticated, IsOwnerOfCandidateProfile]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return Candidate.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """
        Create a new candidate profile for the authenticated user
        """
        # Check if user already has a candidate profile
        if hasattr(request.user, 'candidate_profile'):
            return Response(
                {'error': 'Candidate profile already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Add user to the request data
        data = request.data.copy()
        data['user'] = request.user.id

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get', 'patch'])
    def me(self, request):
        """
        Get or update the authenticated user's candidate profile
        """
        try:
            candidate = Candidate.objects.get(user=request.user)
        except Candidate.DoesNotExist:
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
        """
        Upload and process resume, then create a completely new candidate profile.
        This will delete the old profile and create a new one with the extracted information.
        """
        try:
            # Get the old candidate profile
            old_candidate = Candidate.objects.get(user=request.user)
            # Store the user reference
            user = old_candidate.user
            # Delete the old profile and all its related data
            old_candidate.delete()
        except Candidate.DoesNotExist:
            return Response(
                {'error': 'Candidate profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )

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
            candidate = Candidate.objects.create(
                user=user,
                name=resume_data.personal_info.name if resume_data.personal_info else '',
                email=resume_data.personal_info.email if resume_data.personal_info else '',
                phone=resume_data.personal_info.phone if resume_data.personal_info else '',
                gender=None,  # Will be updated if found in resume
                date_of_birth=None,  # Will be updated if found in resume
                linkedin_profile=resume_data.personal_info.linkedin_url if resume_data.personal_info else '',
                github_profile='',  # Will be updated if found in resume
                portfolio_link='',  # Will be updated if found in resume
                current_job_title=resume_data.personal_info.title if resume_data.personal_info else '',
                current_company='',  # Will be updated if found in resume
                skills='',  # Will be updated below
                experience=0,  # Will be calculated below
                resume=resume_file
            )

            # Calculate total experience from work experiences
            total_experience = 0
            if resume_data.professional_experience:
                for exp in resume_data.professional_experience:
                    if exp.start_date and exp.end_date:
                        start_date = parse_date(exp.start_date)
                        end_date = parse_date(exp.end_date)
                        if start_date and end_date:
                            # Calculate years of experience
                            years = (end_date - start_date).days / 365.25
                            total_experience += years
                        elif start_date and not end_date:
                            # If end_date is not provided, assume current date
                            from datetime import date
                            years = (date.today() - start_date).days / 365.25
                            total_experience += years

            # Update experience
            candidate.experience = round(total_experience, 1)  # Round to 1 decimal place

            # Update skills
            if resume_data.technical_skills:
                skills = []
                if resume_data.technical_skills.technical_skills:
                    skills.extend(resume_data.technical_skills.technical_skills)
                if resume_data.technical_skills.frameworks_libraries:
                    skills.extend(resume_data.technical_skills.frameworks_libraries)
                if resume_data.technical_skills.tools:
                    skills.extend(resume_data.technical_skills.tools)
                candidate.skills = ', '.join(skills) if skills else ''
                candidate.save()

            # Create work experiences
            if resume_data.professional_experience:
                for exp in resume_data.professional_experience:
                    if exp.company and exp.role:
                        # Set default dates if not provided
                        start_date = parse_date(exp.start_date) if exp.start_date else datetime.now().date()
                        end_date = parse_date(exp.end_date) if exp.end_date else None
                        
                        WorkExperience.objects.create(
                            candidate=candidate,
                            company_name=exp.company,
                            role_designation=exp.role,
                            start_date=start_date,
                            end_date=end_date,
                            responsibilities='\n'.join(exp.responsibilities) if exp.responsibilities else '',
                            technologies_used=''
                        )

            # Create education entries
            if resume_data.education:
                for edu in resume_data.education:
                    if edu.institution and edu.degree:
                        Education.objects.create(
                            candidate=candidate,
                            institution=edu.institution,
                            degree=edu.degree,
                            field_of_study='',
                            start_date=parse_date(edu.start_date),
                            end_date=parse_date(edu.end_date)
                        )

            # Create projects
            if resume_data.projects:
                print(f"Found {len(resume_data.projects)} projects in resume")
                for proj in resume_data.projects:
                    try:
                        if proj.project_name:
                            print(f"Processing project: {proj.project_name}")
                            project = Project.objects.create(
                                candidate=candidate,
                                title=proj.project_name,
                                description=proj.description or '',
                                tech_stack=', '.join(proj.tech_stack) if proj.tech_stack else 'Not specified',
                                role_in_project='Not specified'
                            )
                            print(f"Successfully created project: {project.title}")
                        else:
                            print("Skipping project with no name")
                    except Exception as e:
                        print(f"Error creating project: {str(e)}")
                        continue
            else:
                print("No projects found in resume data")

            return Response({
                'message': 'Resume uploaded and processed successfully. Profile has been completely recreated.',
                'resume_url': candidate.resume.url,
                'profile_updated': True,
                'projects_created': len(resume_data.projects) if resume_data.projects else 0
            })

        except ValueError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': f'Error processing resume: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def portfolio_data(self, request):
        """
        Get comprehensive portfolio data
        """
        try:
            candidate = Candidate.objects.get(user=request.user)
        except Candidate.DoesNotExist:
            return Response(
                {'error': 'Candidate profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(candidate)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def dashboard_overview(self, request):
        """
        Get dashboard overview data
        """
        try:
            candidate = Candidate.objects.get(user=request.user)
        except Candidate.DoesNotExist:
            return Response(
                {'error': 'Candidate profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Calculate profile completeness
        filled_fields = sum(1 for field in [
            candidate.name, candidate.email, candidate.phone,
            candidate.gender, candidate.date_of_birth,
            candidate.linkedin_profile, candidate.github_profile,
            candidate.portfolio_link, candidate.current_job_title,
            candidate.current_company, candidate.skills,
            candidate.experience
        ] if field)

        total_fields = 13  # Total number of fields to check
        completeness = (filled_fields / total_fields) * 100

        return Response({
            'profile_completeness_percentage': completeness,
            'view_count': candidate.view_count,
            'skill_summary': {
                'skills': candidate.skills.split(',') if candidate.skills else [],
                'total_skills': len(candidate.skills.split(',')) if candidate.skills else 0
            },
            'editable_sections_links': {
                'education': '/api/education/',
                'work_experience': '/api/work-experiences/',
                'projects': '/api/projects/',
                'certifications': '/api/certifications/'
            }
        })

class EducationViewSet(viewsets.ModelViewSet):
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated, IsOwnerOfEducation]

    def get_queryset(self):
        return Education.objects.filter(candidate__user=self.request.user)

    def perform_create(self, serializer):
        candidate = Candidate.objects.get(user=self.request.user)
        serializer.save(candidate=candidate)

class WorkExperienceViewSet(viewsets.ModelViewSet):
    serializer_class = WorkExperienceSerializer
    permission_classes = [IsAuthenticated, IsOwnerOfWorkExperience]

    def get_queryset(self):
        return WorkExperience.objects.filter(candidate__user=self.request.user)

    def perform_create(self, serializer):
        candidate = Candidate.objects.get(user=self.request.user)
        serializer.save(candidate=candidate)

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsOwnerOfProject]

    def get_queryset(self):
        return Project.objects.filter(candidate__user=self.request.user)

    def perform_create(self, serializer):
        candidate = Candidate.objects.get(user=self.request.user)
        serializer.save(candidate=candidate)

class CertificationViewSet(viewsets.ModelViewSet):
    serializer_class = CertificationSerializer
    permission_classes = [IsAuthenticated, IsOwnerOfCertification]

    def get_queryset(self):
        return Certification.objects.filter(candidate__user=self.request.user)

    def perform_create(self, serializer):
        candidate = Candidate.objects.get(user=self.request.user)
        serializer.save(candidate=candidate) 