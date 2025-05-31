from rest_framework import serializers
from django.contrib.auth.models import User
from .mongo_models import (
    CandidateMongo, ProjectMongo, WorkExperienceMongo,
    EducationMongo, CertificationMongo
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)

class ProjectMongoSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    candidate = serializers.CharField(read_only=True)
    title = serializers.CharField()
    description = serializers.CharField(required=False, allow_blank=True)
    tech_stack = serializers.ListField(child=serializers.CharField(), required=False)
    role_in_project = serializers.CharField(required=False, allow_blank=True)
    github_link = serializers.URLField(required=False, allow_blank=True)
    live_link = serializers.URLField(required=False, allow_blank=True)

class WorkExperienceMongoSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    candidate = serializers.CharField(read_only=True)
    company_name = serializers.CharField()
    role_designation = serializers.CharField()
    start_date = serializers.DateTimeField(required=False)
    end_date = serializers.DateTimeField(required=False)
    is_current = serializers.BooleanField(default=False)
    responsibilities = serializers.ListField(child=serializers.CharField(), required=False)
    technologies_used = serializers.ListField(child=serializers.CharField(), required=False)

class EducationMongoSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    candidate = serializers.CharField(read_only=True)
    degree = serializers.CharField()
    institution = serializers.CharField()
    field_of_study = serializers.CharField(required=False, allow_blank=True)
    start_date = serializers.DateTimeField(required=False)
    end_date = serializers.DateTimeField(required=False)
    gpa = serializers.FloatField(required=False)
    activities_achievements = serializers.ListField(child=serializers.CharField(), required=False)

class CertificationMongoSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    candidate = serializers.CharField(read_only=True)
    name = serializers.CharField()
    issuing_organization = serializers.CharField(required=False, allow_blank=True)
    issue_date = serializers.DateTimeField(required=False)
    expiration_date = serializers.DateTimeField(required=False)
    credential_id = serializers.CharField(required=False, allow_blank=True)
    credential_url = serializers.URLField(required=False, allow_blank=True)

class CandidateMongoSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    
    # Personal Information
    name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    gender = serializers.ChoiceField(
        choices=['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'],
        required=False
    )
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    
    # Social Links
    linkedin_profile = serializers.URLField(required=False, allow_blank=True)
    github_profile = serializers.URLField(required=False, allow_blank=True)
    portfolio_link = serializers.URLField(required=False, allow_blank=True)
    
    # Current Position
    current_job_title = serializers.CharField(required=False, allow_blank=True)
    current_company = serializers.CharField(required=False, allow_blank=True)
    
    # Salary Information
    current_salary = serializers.FloatField(required=False, allow_null=True)
    current_salary_currency = serializers.CharField(default='USD')
    expected_salary = serializers.FloatField(required=False, allow_null=True)
    expected_salary_currency = serializers.CharField(default='USD')
    notice_period = serializers.IntegerField(required=False, allow_null=True)
    salary_negotiable = serializers.BooleanField(default=True)
    
    # Skills and Experience
    skills = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    experience = serializers.FloatField(required=False, default=0)
    
    # Resume
    resume = serializers.CharField(required=False, allow_blank=True)
    
    # Job Preferences
    desired_roles = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    preferred_locations = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    
    employment_type_preferences = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list
    )
    
    # Internal Tracking
    status = serializers.ChoiceField(
        choices=['ACTIVE', 'INACTIVE', 'BLOCKED', 'DELETED'],
        default='ACTIVE'
    )
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    
    # Nested Serializers
    education = EducationMongoSerializer(many=True, read_only=True)
    work_experiences = WorkExperienceMongoSerializer(many=True, read_only=True)
    projects = ProjectMongoSerializer(many=True, read_only=True)
    certifications = CertificationMongoSerializer(many=True, read_only=True)

    def validate_gender(self, value):
        if value and value not in ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']:
            raise serializers.ValidationError("Invalid gender value")
        return value

    def validate_experience(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Experience cannot be negative")
        return value

    def validate_current_salary(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Current salary cannot be negative")
        return value

    def validate_expected_salary(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Expected salary cannot be negative")
        return value

    def validate_notice_period(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Notice period cannot be negative")
        return value 