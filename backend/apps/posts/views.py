from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status, viewsets

from django.db.models import Count, Q
from django.db.models.functions import Random
from django.shortcuts import get_object_or_404

from .models import Post, Comment, Reaction
from .serializers import PostSerializer, CommentSerializer, ReactionSerializer


class PostViewSet(ModelViewSet):
    queryset = Post.objects.all().order_by("-created_at")
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return (
            Post.objects
            .select_related("author")
            .prefetch_related("comments__user", "reactions__user")
            .annotate(
                likes_count=Count('reactions', filter=Q(reactions__reaction='like')),
                love_count=Count('reactions', filter=Q(reactions__reaction='love')),
                care_count=Count('reactions', filter=Q(reactions__reaction='care')),
            )
            .order_by("-created_at")
        )
        
    def get_queryset(self):
        queryset = Post.objects.all()

        category = self.request.query_params.get("category")

        if category:
            queryset = queryset.filter(category_id=category)

        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    # 🔹 Agregar comentario
    @action(detail=True, methods=["post"])
    def comment(self, request, pk=None):
        post = self.get_object()
        content = request.data.get("content")

        if not content:
            return Response(
                {"error": "El comentario no puede estar vacío"},
                status=status.HTTP_400_BAD_REQUEST
            )

        comment = Comment.objects.create(
            post=post,
            user=request.user,
            content=content
        )

        return Response(CommentSerializer(comment).data)

    # 🔹 Reaccionar
    @action(detail=True, methods=["post"])
    def react(self, request, pk=None):
        post = self.get_object()
        reaction_type = request.data.get("reaction")

        if reaction_type not in ["like", "love", "care"]:
            return Response(
                {"error": "Tipo de reacción inválido"},
                status=status.HTTP_400_BAD_REQUEST
            )

        reaction, created = Reaction.objects.get_or_create(
            post=post,
            user=request.user,
            defaults={"reaction": reaction_type}
        )

        if not created:
            if reaction.reaction == reaction_type:
                reaction.delete()  # toggle
                return Response({"message": "Reacción eliminada"})
            else:
                reaction.reaction = reaction_type
                reaction.save()

        return Response({"message": "Reacción registrada"})

    # 🔹 Ver solo reacciones
    @action(detail=True, methods=["get"], permission_classes=[AllowAny])
    def reactions(self, request, pk=None):
        post = self.get_object()
        reactions = post.reactions.select_related("user")
        return Response(ReactionSerializer(reactions, many=True).data)

    @action(detail=False, methods=["get"])
    def random(self, request):
        posts = Post.objects.order_by(Random())
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)