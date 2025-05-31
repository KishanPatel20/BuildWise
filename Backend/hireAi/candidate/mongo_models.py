from mongoengine import Document, StringField, IntField, DateTimeField, ListField, ReferenceField, BooleanField, URLField, DateField, EmailField, FloatField
from django.contrib.auth.models import User
from datetime import datetime

class CandidateMongo(Document):
    user_id = IntField(required=True)
    name = StringField(required=True)
    email = EmailField()
    phone = StringField()
    gender = StringField(choices=['M', 'F', 'O'])
    date_of_birth = DateTimeField()
    
    # Social Links
    linkedin_profile = URLField()
    github_profile = URLField()
    portfolio_link = URLField()
    
    # Resume & Core Skills
    resume = StringField()  # Store file path as string
    skills = ListField(StringField())
    experience = FloatField(default=0)
    
    # Current Employment
    current_job_title = StringField()
    current_company = StringField()
    
    # Job Preferences
    desired_roles = ListField(StringField())
    preferred_industry_sector = ListField(StringField())
    employment_type_preferences = ListField(StringField())
    preferred_locations = ListField(StringField())
    desired_salary_range = StringField()
    willingness_to_relocate = BooleanField(default=False)
    is_actively_looking = BooleanField(default=True)
    
    # Internal Tracking
    status = StringField(choices=['active', 'inactive', 'suspended'])
    source = StringField()
    view_count = IntField(default=0)
    
    # Timestamps
    created_at = DateTimeField(default=datetime.now)
    updated_at = DateTimeField(default=datetime.now)

    meta = {'collection': 'candidates'}

    @property
    def user(self):
        """Get the Django User instance"""
        return User.objects.get(id=self.user_id)

    @user.setter
    def user(self, user):
        """Set the user ID from a Django User instance"""
        self.user_id = user.id

class ProjectMongo(Document):
    candidate = ReferenceField('CandidateMongo', required=True)
    title = StringField(required=True)
    description = StringField()
    tech_stack = ListField(StringField())
    role_in_project = StringField()
    github_link = URLField()
    live_link = URLField()

    meta = {'collection': 'projects'}

class WorkExperienceMongo(Document):
    candidate = ReferenceField('CandidateMongo', required=True)
    company_name = StringField(required=True)
    role_designation = StringField(required=True)
    start_date = DateTimeField()
    end_date = DateTimeField()
    is_current = BooleanField(default=False)
    responsibilities = ListField(StringField())
    technologies_used = ListField(StringField())

    meta = {'collection': 'work_experiences'}

class EducationMongo(Document):
    candidate = ReferenceField('CandidateMongo', required=True)
    degree = StringField(required=True)
    institution = StringField(required=True)
    field_of_study = StringField()
    start_date = DateTimeField()
    end_date = DateTimeField()
    gpa = FloatField()
    activities_achievements = ListField(StringField())

    meta = {'collection': 'education'}

class CertificationMongo(Document):
    candidate = ReferenceField('CandidateMongo', required=True)
    name = StringField(required=True)
    issuing_organization = StringField()
    issue_date = DateTimeField()
    expiration_date = DateTimeField()
    credential_id = StringField()
    credential_url = URLField()

    meta = {'collection': 'certifications'} 