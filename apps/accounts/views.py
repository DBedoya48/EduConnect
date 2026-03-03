from django.shortcuts import render
from .forms import CustomLoginForm
from django.contrib.auth.views import LoginView

class CustomLoginView(LoginView):
    template_name = "registration/login.html"
    authentication_form = CustomLoginForm
    redirect_authenticated_user = True
