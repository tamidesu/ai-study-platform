from django.urls import path
from .admin_views import AdminUserListView, AdminUserBlockView, AdminNoteListView, AdminNoteDeleteView, AdminAIRequestListView

urlpatterns = [
    path("users/", AdminUserListView.as_view(), name="admin-user-list"),
    path("users/<uuid:user_id>/block/", AdminUserBlockView.as_view(), name="admin-user-block"),
    path("notes/", AdminNoteListView.as_view(), name="admin-note-list"),
    path("notes/<uuid:pk>/", AdminNoteDeleteView.as_view(), name="admin-note-delete"),
    path("ai-requests/", AdminAIRequestListView.as_view(), name="admin-ai-request-list"),
]
