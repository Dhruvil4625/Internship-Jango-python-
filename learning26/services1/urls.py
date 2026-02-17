from django.urls import path
from . import views

urlpatterns = [
    path("list/", views.serviceList, name="service_list"),
    path("create/", views.serviceCreate, name="service_create"),
    path("update/<int:id>/", views.serviceUpdate, name="service_update"),
    path("delete/<int:id>/", views.serviceDelete, name="service_delete"),
]