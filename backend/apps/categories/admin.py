from django.contrib import admin
from django import forms
from django.utils.html import format_html
from .models import Category


class CategoryAdminForm(forms.ModelForm):
    color = forms.CharField(
        widget=forms.TextInput(attrs={"type": "color"})
    )

    class Meta:
        model = Category
        fields = "__all__"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    form = CategoryAdminForm
    list_display = ("name", "color_preview", "slug")
    readonly_fields = ("slug",)

    def color_preview(self, obj):
        return format_html(
            '<span style="background-color:{}; padding:5px 10px; border-radius:5px; color:white;">{}</span>',
            obj.color,
            obj.color
        )

    color_preview.short_description = "Color"