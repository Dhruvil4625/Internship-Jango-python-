"""
URL configuration for learning26 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from . import views   

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home),
    path('about/', views.aboutus),
    path('contact/', views.conatactus),
    path('movies/', views.movies),
    path('shows/', views.shows),
    path('news/', views.news),
    path('recape/',views.recape),
    path('recipe/',views.recipe),
    path('team/',views.team),
    path('library',views.python_library),

       # app level url config

    path("student/", include("learning26.student.urls")),
    path("test/", include("test1.urls")),
    path("employee/", include("employee.urls")),
    path("services1/", include("services1.urls")),

]
