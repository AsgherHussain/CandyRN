from rest_framework import permissions

class IsPostOrIsAuthenticated(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'POST':
            return True

        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        
        if request.method == 'PATCH':
            if obj == request.user:
                return True
        
        if request.method == 'GET':
            return True

        if request.method == 'DELETE':
            if obj == request.user:
                return True

        return False


class IsGetOrIsAuthenticated(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'GET':
            return True

        return request.user and request.user.is_authenticated
