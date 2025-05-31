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
    name = serializers.CharField()
    email = serializers.EmailField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    gender = serializers.ChoiceField(choices=['M', 'F', 'O'], required=False)
    date_of_birth = serializers.DateTimeField(required=False)
    linkedin_profile = serializers.URLField(required=False, allow_blank=True)
    github_profile = serializers.URLField(required=False, allow_blank=True)
    portfolio_link = serializers.URLField(required=False, allow_blank=True)
    resume = serializers.CharField(required=False, allow_blank=True)
    skills = serializers.ListField(child=serializers.CharField(), required=False)
    experience = serializers.FloatField(required=False)
    current_job_title = serializers.CharField(required=False, allow_blank=True)
    current_company = serializers.CharField(required=False, allow_blank=True)
    desired_roles = serializers.ListField(child=serializers.CharField(), required=False)
    preferred_industry_sector = serializers.ListField(child=serializers.CharField(), required=False)
    employment_type_preferences = serializers.ListField(child=serializers.CharField(), required=False)
    preferred_locations = serializers.ListField(child=serializers.CharField(), required=False)
    desired_salary_range = serializers.CharField(required=False, allow_blank=True)
    willingness_to_relocate = serializers.BooleanField(default=False)
    is_actively_looking = serializers.BooleanField(default=True)
    status = serializers.ChoiceField(choices=['active', 'inactive', 'suspended'], required=False)
    source = serializers.CharField(required=False, allow_blank=True)
    view_count = serializers.IntegerField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    education = EducationMongoSerializer(many=True, read_only=True)
    work_experiences = WorkExperienceMongoSerializer(many=True, read_only=True)
    projects = ProjectMongoSerializer(many=True, read_only=True)
    certifications = CertificationMongoSerializer(many=True, read_only=True)

    def validate_gender(self, value):
        if value and value not in ['M', 'F', 'O']:
            raise serializers.ValidationError("Invalid gender choice")
        return value

    def validate_experience(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Experience cannot be negative")
        return value 