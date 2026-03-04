from rest_framework import serializers
from .models import Note


class NoteSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Note
        fields = ("id", "title", "content", "owner", "created_at", "updated_at")
        read_only_fields = ("id", "owner", "created_at", "updated_at")


class NoteWriteSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200)
    content = serializers.CharField(required=False, allow_blank=True, default="")
