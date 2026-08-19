from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrReadOnly(BasePermission):
    """
    Custom permission: Read-only access for any request, 
    write/edit access strictly for staff/admin users.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)

class IsOwnerOrAdmin(BasePermission):
    """
    Custom permission: Allow object owner (student) or staff/admin access.
    """
    def has_object_permission(self, request, view, obj):
        if request.user and request.user.is_staff:
            return True
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'student') and hasattr(request.user, 'student_profile'):
            return obj.student == request.user.student_profile
        return False
