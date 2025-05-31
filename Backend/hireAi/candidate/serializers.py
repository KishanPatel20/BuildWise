# my_app/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Candidate, Project, WorkExperience, Education, Certification

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['id', 'candidate']

class WorkExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkExperience
        fields = '__all__'
        read_only_fields = ['id', 'candidate']

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'
        read_only_fields = ['id', 'candidate']

class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = '__all__'
        read_only_fields = ['id', 'candidate']

class CandidateSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    education = EducationSerializer(many=True, read_only=True)
    work_experiences = WorkExperienceSerializer(many=True, read_only=True)
    projects = ProjectSerializer(many=True, read_only=True)
    certifications = CertificationSerializer(many=True, read_only=True)

    class Meta:
        model = Candidate
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def validate_gender(self, value):
        if value and value not in ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']:
            raise serializers.ValidationError("Invalid gender value")
        return value

    def validate_status(self, value):
        if value not in ['ACTIVE', 'INACTIVE', 'BLOCKED', 'DELETED']:
            raise serializers.ValidationError("Invalid status value")
        return value

    def validate_experience(self, value):
        if value < 0:
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
