from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    #django user table fileds a;ll ++
    roleChoice = (
        ('admin','admin'),
        ('student','student'),
        ('faculty','faculty')
    )
    role = models.CharField(max_length=100,choices=roleChoice,null=True,blank=True)