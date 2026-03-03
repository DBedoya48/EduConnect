from django.core.mail import send_mail

send_mail(
    subject="Prueba de correo Gmail",
    message="¡Funciona EduConnect!",
    from_email=None,
    recipient_list=["bedoteban@gmail.com"],
)