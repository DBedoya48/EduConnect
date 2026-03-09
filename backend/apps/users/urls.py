from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import UserViewSet, LoginView

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="users")

urlpatterns = router.urls + [
    path("login/", LoginView.as_view(), name="login"),
]