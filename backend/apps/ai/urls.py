from django.urls import path
from .views import GenerateView, HistoryView, SaveToNoteView, DeleteAIRequestView, StatsView

urlpatterns = [
    path("generate/", GenerateView.as_view(), name="ai-generate"),
    path("history/", HistoryView.as_view(), name="ai-history"),
    path("history/<uuid:pk>/", DeleteAIRequestView.as_view(), name="ai-request-delete"),
    path("save/<uuid:pk>/", SaveToNoteView.as_view(), name="ai-save-to-note"),
    path("stats/", StatsView.as_view(), name="ai-stats"),
]
