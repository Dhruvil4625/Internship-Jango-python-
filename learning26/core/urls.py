from django.urls import path
from . import views

urlpatterns = [
   path("register/",views.registerUser,name="register"),
   path("faculty/",views.facultyList,name="faculty_list"),
   path("student/",views.studentList,name="student_list"),

]