from rest_framework.permissions import BasePermission


class IsDocenteOrAdmin(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        return request.user.role in ["DOCENTE", "ADMIN"]

class CanCreateUsers(BasePermission):

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        if request.user.role == "ADMIN":
            return True

        if request.user.role == "DOCENTE":
            return True

        return False