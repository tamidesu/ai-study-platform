from rest_framework import serializers
from .models import AIRequest


class AIRequestSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = AIRequest
        fields = (
            "id", "user", "prompt", "result", "model_used", "mode",
            "status", "prompt_tokens", "completion_tokens", "total_tokens",
            "saved_to_note", "created_at",
        )
        read_only_fields = fields


class GeneratePromptSerializer(serializers.Serializer):
    prompt = serializers.CharField(min_length=10, max_length=1000)
    mode = serializers.ChoiceField(
        choices=AIRequest.Mode.values,
        default=AIRequest.Mode.EXPLAIN,
    )
    note_id = serializers.UUIDField(required=False, allow_null=True, default=None)


class SaveToNoteSerializer(serializers.Serializer):
    note_id = serializers.UUIDField()
