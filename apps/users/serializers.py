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
            "password",
            "first_name",
            "last_name",
            "institution",
        ]

    def validate_email(self, value):
        if not value.endswith("@gmail.com"):
            raise serializers.ValidationError(
                "Debe usar un correo institucional válido"
            )
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")

        user = User(**validated_data)
        user.set_password(password)
        user.is_active = False
        user.role = "ESTUDIANTE"
        user.save()

        return user



