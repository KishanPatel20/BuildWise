from rest_framework import permissions

class IsOwnerOfCandidateProfile(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class IsOwnerOfEducation(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.candidate.user == request.user

class IsOwnerOfWorkExperience(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.candidate.user == request.user

class IsOwnerOfProject(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.candidate.user == request.user

class IsOwnerOfCertification(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.candidate.user == request.user 