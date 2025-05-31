# my_app/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Candidate, Education, WorkExperience, Project, Certification

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'
        read_only_fields = ('id', 'candidate')

class WorkExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkExperience
        fields = '__all__'
        read_only_fields = ('id', 'candidate')

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ('id', 'candidate')

class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = '__all__'
        read_only_fields = ('id', 'candidate')

class CandidateSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    education = EducationSerializer(many=True, read_only=True)
    work_experiences = WorkExperienceSerializer(many=True, read_only=True)
    projects = ProjectSerializer(many=True, read_only=True)
    certifications = CertificationSerializer(many=True, read_only=True)
    experience = serializers.IntegerField(required=False, allow_null=True)
    resume = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = Candidate
        fields = (
            'id', 'user', 'name', 'email', 'phone', 'gender', 'date_of_birth',
            'linkedin_profile', 'github_profile', 'portfolio_link',
            'current_job_title', 'current_company', 'skills', 'experience',
            'resume', 'view_count', 'education', 'work_experiences',
            'projects', 'certifications'
        )
        read_only_fields = ('id', 'user', 'view_count')

    def validate_gender(self, value):
        if value and value not in dict(Candidate.GENDER_CHOICES):
            raise serializers.ValidationError("Invalid gender choice")
        return value

    def validate_experience(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Experience cannot be negative")
        return value

    def create(self, validated_data):
        education_data = validated_data.pop('education', [])
        work_experience_data = validated_data.pop('work_experiences', [])
        projects_data = validated_data.pop('projects', [])
        certification_data = validated_data.pop('certifications', [])

        candidate = Candidate.objects.create(**validated_data)

        for edu_data in education_data:
            Education.objects.create(candidate=candidate, **edu_data)
        for work_data in work_experience_data:
            WorkExperience.objects.create(candidate=candidate, **work_data)
        for proj_data in projects_data:
            Project.objects.create(candidate=candidate, **proj_data)
        for cert_data in certification_data:
            Certification.objects.create(candidate=candidate, **cert_data)

        return candidate

    def update(self, instance, validated_data):
        # Handle nested updates for Education, WorkExperience, Projects, and Certifications
        # This is more complex and might require custom logic or a package like `drf-writable-nested`
        # For MVP, you might simplify: delete all existing and re-create, or only allow updates via separate endpoints.
        # For now, let's just update the top-level fields
        for attr, value in validated_data.items():
            if attr not in ['education', 'work_experiences', 'projects', 'certifications']:
                setattr(instance, attr, value)
        instance.save()

        # For nested updates, you'd typically handle additions/removals/updates here.
        # This can get tricky without a dedicated package or careful manual implementation.
        # For now, if you want to update nested items, you might need separate API calls or a more involved serializer.

        return instance
