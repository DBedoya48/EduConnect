from rest_framework.permissions import BasePermission


class IsDocenteOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ["DOCENTE", "ADMIN"]


class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.created_by == request.user or request.user.role == "ADMIN"