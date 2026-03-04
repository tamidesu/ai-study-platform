from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import fields as rf_fields, status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.permissions import IsNotBlocked
from .serializers import AIRequestSerializer, GeneratePromptSerializer, SaveToNoteSerializer
from .services import (
    generate_ai_response,
    get_user_history,
    save_ai_result_to_note,
    delete_ai_request,
    get_user_stats,
)


class GenerateView(APIView):
    permission_classes = [IsAuthenticated, IsNotBlocked]

    @extend_schema(
        request=GeneratePromptSerializer,
        responses={201: AIRequestSerializer},
        tags=["AI"],
        summary="Send prompt to AI (supports modes + optional note context)",
    )
    def post(self, request):
        serializer = GeneratePromptSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        ai_request = generate_ai_response(
            user=request.user,
            prompt=d["prompt"],
            mode=d["mode"],
            note_id=str(d["note_id"]) if d.get("note_id") else None,
        )
        return Response(AIRequestSerializer(ai_request).data, status=status.HTTP_201_CREATED)


class HistoryView(ListAPIView):
    permission_classes = [IsAuthenticated, IsNotBlocked]
    serializer_class = AIRequestSerializer

    def get_queryset(self):
        return get_user_history(self.request.user)

    @extend_schema(
        responses={200: AIRequestSerializer(many=True)},
        tags=["AI"],
        summary="Paginated AI request history for current user",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class SaveToNoteView(APIView):
    permission_classes = [IsAuthenticated, IsNotBlocked]

    @extend_schema(
        request=SaveToNoteSerializer,
        responses={200: AIRequestSerializer},
        tags=["AI"],
        summary="Link AI result to an existing note",
    )
    def post(self, request, pk):
        serializer = SaveToNoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ai_request = save_ai_result_to_note(
            request.user,
            str(pk),
            str(serializer.validated_data["note_id"]),
        )
        return Response(AIRequestSerializer(ai_request).data)


class DeleteAIRequestView(APIView):
    permission_classes = [IsAuthenticated, IsNotBlocked]

    @extend_schema(
        responses={204: None},
        tags=["AI"],
        summary="Delete an AI request from history",
    )
    def delete(self, request, pk):
        delete_ai_request(request.user, str(pk))
        return Response(status=status.HTTP_204_NO_CONTENT)


class StatsView(APIView):
    permission_classes = [IsAuthenticated, IsNotBlocked]

    @extend_schema(
        responses={
            200: inline_serializer(
                name="StatsResponse",
                fields={
                    "notes_count": rf_fields.IntegerField(),
                    "ai_requests_total": rf_fields.IntegerField(),
                    "ai_requests_success": rf_fields.IntegerField(),
                    "tokens_used": inline_serializer(
                        name="TokensUsed",
                        fields={
                            "total": rf_fields.IntegerField(),
                            "prompt": rf_fields.IntegerField(),
                            "completion": rf_fields.IntegerField(),
                        },
                    ),
                },
            )
        },
        tags=["AI"],
        summary="Current user stats: notes count, AI requests, tokens used",
    )
    def get(self, request):
        return Response(get_user_stats(request.user))
