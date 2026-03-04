from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiParameter
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.users.permissions import IsNotBlocked
from .models import Note
from .permissions import IsOwnerOrAdmin
from .serializers import NoteSerializer, NoteWriteSerializer
from .services import get_notes_for_user, create_note, update_note, delete_note


class NoteListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsNotBlocked]
    serializer_class = NoteSerializer

    def get_queryset(self):
        search = self.request.query_params.get("search", "").strip()
        return get_notes_for_user(self.request.user, search=search)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="search",
                description="Filter notes by title or content (case-insensitive)",
                required=False,
                type=str,
            )
        ],
        responses={200: NoteSerializer(many=True)},
        tags=["Notes"],
        summary="List own notes — supports ?search= filter",
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        request=NoteWriteSerializer,
        responses={201: NoteSerializer},
        tags=["Notes"],
        summary="Create a new note",
    )
    def create(self, request, *args, **kwargs):
        serializer = NoteWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        note = create_note(request.user, **serializer.validated_data)
        return Response(NoteSerializer(note).data, status=status.HTTP_201_CREATED)


class NoteDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsNotBlocked, IsOwnerOrAdmin]
    serializer_class = NoteSerializer

    def get_queryset(self):
        return get_notes_for_user(self.request.user)

    @extend_schema(
        responses={200: NoteSerializer},
        tags=["Notes"],
        summary="Get note detail",
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        request=NoteWriteSerializer,
        responses={200: NoteSerializer},
        tags=["Notes"],
        summary="Update note (owner or admin)",
    )
    def update(self, request, *args, **kwargs):
        note = self.get_object()
        serializer = NoteWriteSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = update_note(note, **serializer.validated_data)
        return Response(NoteSerializer(updated).data)

    @extend_schema(
        responses={204: None},
        tags=["Notes"],
        summary="Delete note (owner or admin)",
    )
    def destroy(self, request, *args, **kwargs):
        note = self.get_object()
        delete_note(note)
        return Response(status=status.HTTP_204_NO_CONTENT)
