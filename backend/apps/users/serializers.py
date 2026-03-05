from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields =  "__all__"
        read_only_fields = ["role", "is_active", "is_staff", "is_superuser"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "email",
            "username",
            "password",
            "first_name",
            "last_name",
            "institution",
            "role",
        ]

    def validate_email(self, value):
        if not value.endswith("@gmail.com"):
            raise serializers.ValidationError(
                "Debe usar un correo institucional válido"
            )
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role=Roles.ESTUDIANTE,
            is_active=False
        )
        return user



