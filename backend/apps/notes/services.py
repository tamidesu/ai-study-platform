from django.db.models import Q
from .models import Note


def get_notes_for_user(user, search: str = "") -> "QuerySet":
    if user.role == "admin":
        qs = Note.objects.select_related("owner").all()
    else:
        qs = Note.objects.filter(owner=user)
    if search:
        qs = qs.filter(Q(title__icontains=search) | Q(content__icontains=search))
    return qs


def create_note(user, title: str, content: str = "") -> Note:
    return Note.objects.create(owner=user, title=title, content=content)


def update_note(note: Note, title: str = None, content: str = None) -> Note:
    if title is not None:
        note.title = title
    if content is not None:
        note.content = content
    note.save()
    return note


def delete_note(note: Note) -> None:
    note.delete()
