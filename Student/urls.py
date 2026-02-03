from django.urls import path 
from . import views

urlpatterns = [

     path("home/", views.studentHome, name="student_home"),
    path("dashboard/", views.studentDashboard, name="student_dashboard"),
     path("attendance/", views.studentAttendance, name="student_attendance"),
    path("assignments/", views.studentAssignments, name="student_assignments"),
    path("notices/", views.studentNotices, name="student_notices"),
]
