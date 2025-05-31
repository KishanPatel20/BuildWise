from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CandidateViewSet, ProjectViewSet, WorkExperienceViewSet,
    EducationViewSet, CertificationViewSet
)
from .auth_views import register, login, logout, get_user
from .embedding_views import update_embeddings, search_similar_profiles

router = DefaultRouter()
router.register(r'candidates', CandidateViewSet, basename='candidate')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'work-experiences', WorkExperienceViewSet, basename='work-experience')
router.register(r'education', EducationViewSet, basename='education')
router.register(r'certifications', CertificationViewSet, basename='certification')

urlpatterns = [
    path('', include(router.urls)),
    
    # Authentication URLs
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('user/', get_user, name='get_user'),
    
    # Embedding URLs
    path('embeddings/update/', update_embeddings, name='update_embeddings'),
    path('embeddings/search/', search_similar_profiles, name='search_similar_profiles'),
]
