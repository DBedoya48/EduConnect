from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.urls import reverse


class EmailVerificationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return f"{user.pk}{timestamp}{user.is_active}"


def send_activation_email(user):

    token = account_activation_token.make_token(user)

    activation_link = f"http://localhost:8000/activate/{user.id}/{token}/"

    send_mail(
        "Activar cuenta EduConnect",
        f"Activa tu cuenta aquí: {activation_link}",
        "noreply@educonnect.com",
        [user.email],
        fail_silently=False
    )