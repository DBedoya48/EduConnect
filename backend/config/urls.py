from django.contrib import admin
from django.conf import settings
from django.urls import path, include
from rest_framework.permissions import AllowAny
from django.conf.urls.static import static
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


@api_view(["GET"])
@permission_classes([AllowAny])
def api_root(request):
    return Response({
        "message": "EduConnect API",
        "version": "1.0",
        "status": "running"
    })

urlpatterns = [
    path("", api_root),
    path('admin/', admin.site.urls),
    path("api/posts/", include("apps.posts.urls")),
    path("api/users/", include("apps.users.urls")),
    path("api/courses/", include("apps.courses.urls")),
    path("api/login/", TokenObtainPairView.as_view(), name="login"),
    path("api/refresh/", TokenRefreshView.as_view(), name="refresh"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


