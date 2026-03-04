from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, DestroyAPIView

from .permissions import IsAdminRole
from .serializers import AdminUserSerializer
from .services import toggle_user_block

User = get_user_model()


class AdminUserListView(ListAPIView):
    permission_classes = [IsAdminRole]
    serializer_class = AdminUserSerializer
    queryset = User.objects.all()

    @extend_schema(
        tags=["Admin"],
        summary="[Admin] List all users",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class AdminUserBlockView(APIView):
    permission_classes = [IsAdminRole]

    @extend_schema(
        request=None,
        responses={200: AdminUserSerializer},
        tags=["Admin"],
        summary="[Admin] Toggle block/unblock user",
    )
    def put(self, request, user_id):
        user = toggle_user_block(str(user_id))
        return Response(AdminUserSerializer(user).data)


class AdminNoteListView(ListAPIView):
    permission_classes = [IsAdminRole]

    def get_queryset(self):
        from apps.notes.models import Note
        return Note.objects.select_related("owner").all()

    def get_serializer_class(self):
        from apps.notes.serializers import NoteSerializer
        return NoteSerializer

    @extend_schema(
        tags=["Admin"],
        summary="[Admin] List all notes",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class AdminNoteDeleteView(DestroyAPIView):
    permission_classes = [IsAdminRole]

    def get_queryset(self):
        from apps.notes.models import Note
        return Note.objects.all()

    def get_serializer_class(self):
        from apps.notes.serializers import NoteSerializer
        return NoteSerializer

    @extend_schema(
        responses={204: None},
        tags=["Admin"],
        summary="[Admin] Delete any note",
    )
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminAIRequestListView(ListAPIView):
    permission_classes = [IsAdminRole]

    def get_queryset(self):
        from apps.ai.models import AIRequest
        return AIRequest.objects.select_related("user").all()

    def get_serializer_class(self):
        from apps.ai.serializers import AIRequestSerializer
        return AIRequestSerializer

    @extend_schema(
        tags=["Admin"],
        summary="[Admin] List all AI request logs",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
