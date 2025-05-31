from rest_framework import permissions

class IsOwnerOfCandidateProfile(permissions.BasePermission):
    """
    Custom permission to only allow owners of a candidate profile to access it.
    """
    def has_object_permission(self, request, view, obj):
        # Check if the user is the owner of the candidate profile
        return obj.user == request.user

class IsOwnerOfEducation(permissions.BasePermission):
    """
    Custom permission to only allow owners of education entries to access them.
    """
    def has_object_permission(self, request, view, obj):
        return obj.candidate.user == request.user

class IsOwnerOfWorkExperience(permissions.BasePermission):
    """
    Custom permission to only allow owners of work experience entries to access them.
    """
    def has_object_permission(self, request, view, obj):
        return obj.candidate.user == request.user

class IsOwnerOfProject(permissions.BasePermission):
    """
    Custom permission to only allow owners of project entries to access them.
    """
    def has_object_permission(self, request, view, obj):
        return obj.candidate.user == request.user

class IsOwnerOfCertification(permissions.BasePermission):
    """
    Custom permission to only allow owners of certification entries to access them.
    """
    def has_object_permission(self, request, view, obj):
        return obj.candidate.user == request.user