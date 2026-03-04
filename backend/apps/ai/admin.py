from django.contrib import admin
from .models import AIRequest


@admin.register(AIRequest)
class AIRequestAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "status", "model_used", "created_at")
    list_filter = ("status", "model_used")
    search_fields = ("user__email", "prompt")
    ordering = ("-created_at",)
    readonly_fields = ("id", "user", "prompt", "result", "model_used", "status", "created_at")
