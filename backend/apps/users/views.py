from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import fields as rf_fields
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.exceptions import TokenError

from .serializers import RegisterSerializer, UserProfileSerializer, UpdateProfileSerializer
from .services import register_user, update_profile
from .permissions import IsNotBlocked


class RegisterView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        request=RegisterSerializer,
        responses={201: UserProfileSerializer},
        tags=["Auth"],
        summary="Register a new user",
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = register_user(**serializer.validated_data)
        return Response(UserProfileSerializer(user).data, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

    @extend_schema(
        tags=["Auth"],
        summary="Login — returns access + refresh JWT tokens",
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated, IsNotBlocked]

    @extend_schema(
        request=inline_serializer(
            name="LogoutRequest",
            fields={"refresh": rf_fields.CharField()},
        ),
        responses={204: None},
        tags=["Auth"],
        summary="Logout — blacklists the refresh token",
    )
    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"error": {"refresh": "Refresh token is required."}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return Response(
                {"error": {"refresh": "Invalid or expired token."}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated, IsNotBlocked]

    @extend_schema(
        responses={200: UserProfileSerializer},
        tags=["Auth"],
        summary="Get current user profile",
    )
    def get(self, request):
        return Response(UserProfileSerializer(request.user).data)

    @extend_schema(
        request=UpdateProfileSerializer,
        responses={200: UserProfileSerializer},
        tags=["Auth"],
        summary="Update username or password",
    )
    def put(self, request):
        serializer = UpdateProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = update_profile(request.user, serializer.validated_data)
        return Response(UserProfileSerializer(user).data)
