from django.conf import settings
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from rest_framework.exceptions import ValidationError, Throttled

from apps.notes.models import Note
from .models import AIRequest
from .providers.groq_provider import GroqProvider


def _check_rate_limit(user) -> None:
    limit = settings.AI_RATE_LIMIT_PER_HOUR
    window_start = timezone.now() - timedelta(hours=1)
    count = AIRequest.objects.filter(
        user=user,
        created_at__gte=window_start,
    ).count()
    if count >= limit:
        raise Throttled(detail=f"AI request limit reached ({limit} per hour). Try again later.")


def _get_note_context(user, note_id: str) -> str:
    if not note_id:
        return ""
    try:
        note = Note.objects.get(id=note_id, owner=user)
    except Note.DoesNotExist:
        raise ValidationError({"note_id": "Note not found or does not belong to you."})
    parts = [f"Title: {note.title}"]
    if note.content:
        parts.append(f"Content: {note.content}")
    return "\n".join(parts)


def generate_ai_response(user, prompt: str, mode: str = "explain", note_id: str = None) -> AIRequest:
    _check_rate_limit(user)
    context = _get_note_context(user, note_id)

    ai_request = AIRequest.objects.create(
        user=user,
        prompt=prompt,
        model_used=settings.LLM_MODEL,
        mode=mode,
        status=AIRequest.Status.PENDING,
    )
    try:
        provider = GroqProvider()
        data = provider.generate(prompt=prompt, mode=mode, context=context)
        ai_request.result = data["result"]
        ai_request.prompt_tokens = data["prompt_tokens"]
        ai_request.completion_tokens = data["completion_tokens"]
        ai_request.total_tokens = data["total_tokens"]
        ai_request.status = AIRequest.Status.SUCCESS
        ai_request.save(update_fields=[
            "result", "status",
            "prompt_tokens", "completion_tokens", "total_tokens",
        ])
    except Exception:
        ai_request.status = AIRequest.Status.FAILED
        ai_request.save(update_fields=["status"])
        raise
    return ai_request


def get_user_history(user):
    return AIRequest.objects.filter(user=user).order_by("-created_at")


@transaction.atomic
def save_ai_result_to_note(user, ai_request_id: str, note_id: str) -> AIRequest:
    try:
        ai_request = AIRequest.objects.select_for_update().get(id=ai_request_id, user=user)
    except AIRequest.DoesNotExist:
        raise ValidationError({"detail": "AI request not found."})

    try:
        note = Note.objects.get(id=note_id, owner=user)
    except Note.DoesNotExist:
        raise ValidationError({"detail": "Note not found."})

    ai_request.saved_to_note = note
    ai_request.save(update_fields=["saved_to_note"])
    return ai_request


def delete_ai_request(user, ai_request_id: str) -> None:
    try:
        ai_request = AIRequest.objects.get(id=ai_request_id, user=user)
    except AIRequest.DoesNotExist:
        raise ValidationError({"detail": "AI request not found."})
    ai_request.delete()


def get_user_stats(user) -> dict:
    from apps.notes.models import Note
    from django.db.models import Sum

    notes_count = Note.objects.filter(owner=user).count()
    ai_qs = AIRequest.objects.filter(user=user)
    ai_count = ai_qs.count()
    success_count = ai_qs.filter(status=AIRequest.Status.SUCCESS).count()
    tokens = ai_qs.aggregate(
        total=Sum("total_tokens"),
        prompt=Sum("prompt_tokens"),
        completion=Sum("completion_tokens"),
    )
    return {
        "notes_count": notes_count,
        "ai_requests_total": ai_count,
        "ai_requests_success": success_count,
        "tokens_used": {
            "total": tokens["total"] or 0,
            "prompt": tokens["prompt"] or 0,
            "completion": tokens["completion"] or 0,
        },
    }
