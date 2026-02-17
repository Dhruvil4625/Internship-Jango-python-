from django.urls import path
from . import views

urlpatterns = [
    path("list/", views.employeeList, name="employee_list"),
    path("filter/", views.employeeFilter, name="employee_filter"),
    path("create/", views.employeeCreate, name="employee_create"),
    path("update/<int:id>/", views.employeeUpdate, name="employee_update"),
    path("delete/<int:id>/", views.employeeDelete, name="employee_delete"),
]