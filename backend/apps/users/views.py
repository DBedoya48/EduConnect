from rest_framework import generics
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenSerializer
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_str, force_bytes
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from django.conf import settings

from .serializers import UserSerializer, RegisterSerializer
from .permissions import IsDocenteOrAdmin
from .permissions import CanCreateUsers
from .tokens import EmailVerificationTokenGenerator

User = get_user_model()
token_generator = EmailVerificationTokenGenerator()


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer

class UserViewSet(ModelViewSet):

    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_serializer_class(self):
        if self.action == "create":
            return RegisterSerializer
        return UserSerializer

    def get_permissions(self):

        if self.action == "create":
            return [AllowAny()]

        if self.action == "list":
            return [IsDocenteOrAdmin()]

        if self.action in ["retrieve", "update", "partial_update", "destroy"]:
            return [IsAuthenticated()]

        if self.action in ["me"]:
            return [IsAuthenticated()]

        if self.action in ["activate"]:
            return [AllowAny()]

        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save(
            is_active=False,
            role=User.Roles.ESTUDIANTE
        )

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = token_generator.make_token(user)

        activation_link = (
            f"http://127.0.0.1:8000/api/users/activate/{uid}/{token}/"
        )

        send_mail(
            subject="Activación de cuenta",
            message=f"Bienvenido a Educonnect, activa tu cuenta aquí:\n{activation_link}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email]
        )

        return Response(
            {"message": "Usuario creado. Revisa tu correo para activar la cuenta."},
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=["get"])
    def me(self, request):

        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["get"],
        url_path=r"activate/(?P<uidb64>[^/.]+)/(?P<token>[^/.]+)"
    )
    def activate(self, request, uidb64=None, token=None):

        try:
            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=user_id)
        except Exception:
            return Response(
                {"error": "Enlace inválido"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({"message": "Cuenta activada correctamente"})

        return Response(
            {"error": "Token inválido o expirado"},
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=False, methods=["post"], permission_classes=[CanCreateUsers])
    def create_staff(self, request):

        role = request.data.get("role")

        if request.user.role == "DOCENTE" and role != "ESTUDIANTE":
            return Response(
                {"error": "Docente solo puede crear estudiantes"},
                status=403
            )

        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save(is_active=True)

        return Response(UserSerializer(user).data)
