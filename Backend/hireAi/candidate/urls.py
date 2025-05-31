from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .mongo_views import (
    CandidateMongoViewSet, ProjectMongoViewSet,
    WorkExperienceMongoViewSet, EducationMongoViewSet,
    CertificationMongoViewSet
)

router = DefaultRouter()
router.register(r'candidates', CandidateMongoViewSet, basename='candidate')
router.register(r'projects', ProjectMongoViewSet, basename='project')
router.register(r'work-experiences', WorkExperienceMongoViewSet, basename='work-experience')
router.register(r'education', EducationMongoViewSet, basename='education')
router.register(r'certifications', CertificationMongoViewSet, basename='certification')

urlpatterns = [
    path('', include(router.urls)),
]
