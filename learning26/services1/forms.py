from django import forms
from .models import Service, Category

class ServiceForm(forms.ModelForm):
    class Meta:
        model = Service
        fields = [
            "service_name",
            "description",
            "price",
            "duration",
            "created_date",
            "categoryId",
            "is_active",
            "discount",
        ]
        widgets = {
            "service_name": forms.TextInput(attrs={"class": "form-control"}),
            "description": forms.Textarea(attrs={"class": "form-control", "rows": 3}),
            "price": forms.NumberInput(attrs={"class": "form-control"}),
            "duration": forms.NumberInput(attrs={"class": "form-control"}),
            "created_date": forms.DateInput(attrs={"class": "form-control", "type": "date"}),
            "categoryId": forms.Select(attrs={"class": "form-select"}),
            "is_active": forms.CheckboxInput(attrs={"class": "form-check-input"}),
            "discount": forms.NumberInput(attrs={"class": "form-control"}),
        }

class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ["categoryName", "categoryDescription", "categoryStatus"]
        widgets = {
            "categoryName": forms.TextInput(attrs={"class": "form-control"}),
            "categoryDescription": forms.Textarea(attrs={"class": "form-control", "rows": 3}),
            "categoryStatus": forms.CheckboxInput(attrs={"class": "form-check-input"}),
        }
