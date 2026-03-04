import uuid
from django.conf import settings
from django.db import models


class AIRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SUCCESS = "success", "Success"
        FAILED = "failed", "Failed"

    class Mode(models.TextChoices):
        EXPLAIN = "explain", "Explain"
        QUIZ = "quiz", "Quiz"
        SUMMARIZE = "summarize", "Summarize"
        EXAMPLES = "examples", "Examples"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="ai_requests",
    )
    prompt = models.TextField()
    result = models.TextField(blank=True, default="")
    model_used = models.CharField(max_length=100, blank=True, default="")
    mode = models.CharField(max_length=10, choices=Mode.choices, default=Mode.EXPLAIN)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    prompt_tokens = models.PositiveIntegerField(default=0)
    completion_tokens = models.PositiveIntegerField(default=0)
    total_tokens = models.PositiveIntegerField(default=0)
    saved_to_note = models.ForeignKey(
        "notes.Note",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="ai_requests",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "ai_requests"
        ordering = ["-created_at"]

    def __str__(self):
        return f"AIRequest({self.user_id}, {self.status})"
