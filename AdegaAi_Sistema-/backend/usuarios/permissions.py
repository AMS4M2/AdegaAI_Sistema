from rest_framework import permissions

class IsSameEmpresa(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return hasattr(obj, 'empresa') and obj.empresa == request.user.empresa
