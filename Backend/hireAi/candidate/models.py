from django.db import models
from django.contrib.auth import get_user_model # Commented out for now

User = get_user_model() # Commented out for now

class Candidate(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
        ('prefer-not-to-say', 'Prefer not to say')
    ]

    # Basic Information
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='candidate_profile', blank=True, null=True) # Added blank/null for flexibility initially, but ideally, this should be required
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)

    # Social Links
    linkedin_profile = models.URLField(max_length=200, blank=True, null=True, help_text="Link to LinkedIn profile")
    github_profile = models.URLField(max_length=200, blank=True, null=True, help_text="Link to GitHub profile") # Added
    portfolio_link = models.URLField(max_length=200, blank=True, null=True, help_text="Link to personal portfolio/website")

    # Resume & Core Skills (these are typically extracted or manually input)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    skills = models.TextField(help_text="Comma-separated skills (e.g., Python, Django, AWS, SQL)", blank=True, null=True)
    experience = models.IntegerField(help_text="Total years of experience", blank=True, null=True) # Moved to top level for easy access

    # Current Employment (as a quick overview)
    current_job_title = models.CharField(max_length=255, blank=True, null=True)
    current_company = models.CharField(max_length=255, blank=True, null=True)

    # Job Preferences
    desired_roles = models.CharField(max_length=255, blank=True, null=True, help_text="Comma-separated desired job roles (e.g., Software Engineer, Product Manager)") # Added
    preferred_industry_sector = models.CharField(max_length=255, blank=True, null=True, help_text="Comma-separated preferred industries/sectors (e.g., IT, Healthcare, Finance)") # Added
    EMPLOYMENT_CHOICES = [
        ('full_time', 'Full-time'), ('part_time', 'Part-time'),
        ('contract', 'Contract'), ('freelance', 'Freelance'),
        ('internship', 'Internship'), ('remote', 'Remote') # Added remote here as a type
    ]
    employment_type_preferences = models.CharField(
        max_length=50,
        choices=EMPLOYMENT_CHOICES,
        default='full_time'
    )
    preferred_locations = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Comma-separated preferred job locations (e.g., Ahmedabad, Remote, Mumbai)"
    )
    desired_salary_range = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="E.g., '10-15 LPA', 'Open to negotiation'"
    )
    willingness_to_relocate = models.BooleanField(default=False) # Added
    is_actively_looking = models.BooleanField(default=True)

    # Internal Tracking
    CANDIDATE_STATUS_CHOICES = [
        ('new', 'New'), ('under_review', 'Under Review'),
        ('shortlisted', 'Shortlisted'), ('interviewing', 'Interviewing'),
        ('rejected', 'Rejected'), ('hired', 'Hired'),
        ('withdrawn', 'Withdrawn'), ('on_hold', 'On Hold'),
    ]
    status = models.CharField(max_length=50, choices=CANDIDATE_STATUS_CHOICES, default='new')
    source = models.CharField(max_length=100, blank=True, null=True, help_text="How was this candidate acquired?")
    view_count = models.IntegerField(default=0)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}'s Profile"

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Candidate"
        verbose_name_plural = "Candidates"
        
# my_app/models.py
class Project(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='projects')
    title = models.CharField(max_length=255)
    description = models.TextField()
    tech_stack = models.TextField(help_text="Comma-separated technologies used")
    role_in_project = models.CharField(max_length=255, blank=True, null=True)
    github_link = models.URLField(max_length=200, blank=True, null=True)
    live_link = models.URLField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f"{self.title} ({self.candidate.name})"

    class Meta:
        ordering = ['title'] # Or by date if you add one
        
# my_app/models.py
class WorkExperience(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='work_experiences')
    company_name = models.CharField(max_length=255)
    role_designation = models.CharField(max_length=255)
    start_date = models.DateField(blank=True, null=True)  # Made optional
    end_date = models.DateField(blank=True, null=True)  # Null for current role
    is_current = models.BooleanField(default=False)  # To easily identify current role
    responsibilities = models.TextField(blank=True, null=True)
    technologies_used = models.TextField(blank=True, null=True, help_text="Comma-separated technologies (e.g., Python, Django, AWS, SQL)")

    def __str__(self):
        return f"{self.role_designation} at {self.company_name} ({self.candidate.name})"

    class Meta:
        ordering = ['-end_date', '-start_date']

# my_app/models.py
class Education(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='education_entries')
    degree = models.CharField(max_length=255)
    institution = models.CharField(max_length=255)
    field_of_study = models.CharField(max_length=255, blank=True, null=True) # Good to add this
    start_date = models.DateField(blank=True, null=True)  # Made optional
    end_date = models.DateField(blank=True, null=True) # Null for ongoing education
    gpa = models.CharField(max_length=10, blank=True, null=True, help_text="e.g., 3.8/4.0 or A+")
    activities_achievements = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.degree} from {self.institution} ({self.candidate.name})"

    class Meta:
        ordering = ['-end_date', '-start_date']
        
class Certification(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='certifications')
    name = models.CharField(max_length=255, help_text="Name of the certification (e.g., AWS Certified Solutions Architect)")
    issuing_organization = models.CharField(max_length=255, blank=True, null=True)
    issue_date = models.DateField(blank=True, null=True)
    expiration_date = models.DateField(blank=True, null=True)
    credential_id = models.CharField(max_length=255, blank=True, null=True, help_text="Credential ID or License Number")
    credential_url = models.URLField(max_length=200, blank=True, null=True, help_text="Link to the certification verification page")

    def __str__(self):
        return f"{self.name} ({self.candidate.name})"

    class Meta:
        ordering = ['-issue_date']