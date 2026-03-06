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
    author = serializers.CharField(source="author.username", read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    reactions = ReactionSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    category_color = serializers.CharField(source="category.color", read_only=True)

    likes_count = serializers.SerializerMethodField()
    love_count = serializers.SerializerMethodField()
    care_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id", "author","content",
            "image", "file", "link",
            "category", "category_name",
            "created_at","likes_count",
            "love_count","care_count",
            "reactions","comments",
            "category_color", "description",
        ]
    read_only_fields = ["author", "created_at"]
    
    def get_likes_count(self, obj):
        return obj.reactions.filter(reaction="like").count()

    def get_love_count(self, obj):
        return obj.reactions.filter(reaction="love").count()

    def get_care_count(self, obj):
        return obj.reactions.filter(reaction="care").count()