from django.db import models

class Service(models.Model):
    service_name = models.CharField(max_length=100)
    price = models.IntegerField()
    description = models.TextField()
    duration = models.IntegerField(help_text="Duration in days")
    is_active = models.BooleanField(default=True)
    created_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.service_name