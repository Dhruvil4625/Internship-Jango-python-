from django.db import models

class Category(models.Model):
    categoryName = models.CharField(max_length=100)
    categoryDescription = models.TextField()
    categoryStatus = models.BooleanField(default=True)
    
    class Meta:
        db_table = "category"

    def __str__(self):
        return self.categoryName    

class Service(models.Model):
    service_name = models.CharField(max_length=100)
    price = models.IntegerField()
    description = models.TextField()
    duration = models.IntegerField(help_text="Duration in days")
    is_active = models.BooleanField(default=True)
    created_date = models.DateField(null=True, blank=True)

    discount = models.IntegerField(null=True)
    categoryId = models.ForeignKey(
    Category,
    on_delete=models.CASCADE,
    null=True,
    blank=True
)

    class Meta:
        db_table = "service"

    def __str__(self):
        return self.service_name