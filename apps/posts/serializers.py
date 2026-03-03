from rest_framework import serializers
from .models import Post, Comment, Reaction


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "user", "content", "created_at"]


class ReactionSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Reaction
        fields = ["id", "user", "reaction"]


class PostSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    reactions = ReactionSerializer(many=True, read_only=True)

    likes_count = serializers.IntegerField(read_only=True)
    love_count = serializers.IntegerField(read_only=True)
    care_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "author",
            "content",
            "created_at",
            "likes_count",
            "love_count",
            "care_count",
            "comments",
            "reactions",
        ]