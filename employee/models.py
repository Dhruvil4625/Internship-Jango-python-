from django.db import models

class Employee(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    salary = models.IntegerField()
    department = models.CharField(max_length=100)
    status = models.BooleanField(default=True)
    age = models.IntegerField(null=True, blank=True)
    join_date = models.DateField(null=True, blank=True)
    post = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.name