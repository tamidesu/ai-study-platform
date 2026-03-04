from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField(min_length=3, max_length=150)
    password = serializers.CharField(min_length=8, write_only=True)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "username", "role", "is_blocked", "created_at")
        read_only_fields = ("id", "email", "role", "is_blocked", "created_at")


class UpdateProfileSerializer(serializers.Serializer):
    username = serializers.CharField(min_length=3, max_length=150, required=False)
    password = serializers.CharField(min_length=8, write_only=True, required=False)

    def validate(self, attrs):
        if not attrs:
            raise serializers.ValidationError("At least one field must be provided.")
        return attrs


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "username", "role", "is_blocked", "created_at")
        read_only_fields = fields
