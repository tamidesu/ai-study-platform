from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError

User = get_user_model()


def register_user(email: str, username: str, password: str) -> User:
    if User.objects.filter(email=email).exists():
        raise ValidationError({"email": "A user with this email already exists."})
    if User.objects.filter(username=username).exists():
        raise ValidationError({"username": "A user with this username already exists."})
    return User.objects.create_user(email=email, username=username, password=password)


def update_profile(user: User, data: dict) -> User:
    for field in ("username",):
        if field in data:
            setattr(user, field, data[field])
    if "password" in data:
        user.set_password(data["password"])
    user.save()
    return user


def toggle_user_block(user_id: str) -> User:
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        raise ValidationError({"detail": "User not found."})
    user.is_blocked = not user.is_blocked
    user.is_active = not user.is_blocked
    user.save(update_fields=["is_blocked", "is_active"])
    return user
