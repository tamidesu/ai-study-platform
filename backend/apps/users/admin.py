from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("email", "username", "role", "is_blocked", "is_active", "created_at")
    list_filter = ("role", "is_blocked", "is_active")
    search_fields = ("email", "username")
    ordering = ("-created_at",)
    fieldsets = (
        (None, {"fields": ("email", "username", "password")}),
        ("Role & Status", {"fields": ("role", "is_blocked", "is_active", "is_staff", "is_superuser")}),
        ("Permissions", {"fields": ("groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "username", "password1", "password2", "role"),
        }),
    )
