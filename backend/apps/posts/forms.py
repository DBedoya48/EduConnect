from django import forms
from .models import Post
from apps.categories.models import Category


class PostForm(forms.ModelForm):

    class Meta:
        model = Post
        fields = ["content", "category", "image", "file", "link"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields["category"].queryset = Category.objects.all()

        # Agregamos data-color a cada opción
        choices = []
        for category in Category.objects.all():
            choices.append(
                (category.id, category.name)
            )
        self.fields["category"].choices = choices

    def clean(self):
        cleaned_data = super().clean()
        content = cleaned_data.get("content")
        image = cleaned_data.get("image")
        file = cleaned_data.get("file")
        link = cleaned_data.get("link")

        if not content and not image and not file and not link:
            raise forms.ValidationError(
                "Debes agregar al menos texto, imagen, archivo o enlace, tu publicación no puede ir vacía"
            )

        return cleaned_data