# updated model for internship

from django.db import models

# Create your models here.
class student (models.Model):
    studentName= models.CharField(max_length=100)
    studentAge = models.IntegerField()
    studentCity= models.CharField(max_length=40)

    class Meta:
        db_table = "student"

class Product(models.Model):
    productName = models.CharField(max_length=100)
    productPrice = models.DecimalField(max_digits=8, decimal_places=2)
    productQuantity = models.IntegerField()
    productFeedback = models.TextField()
    productColor = models.CharField(max_length=30)

    class Meta:
        db_table = "product"

from django.db import models

class MarketingCampaign(models.Model):
    campaignName = models.CharField(max_length=100)
    platform = models.CharField(max_length=50)   
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    startDate = models.DateField()
    endDate = models.DateField()
    status = models.CharField(max_length=30)     
    feedback = models.TextField(blank=True)

    class Meta:
        db_table = "marketing_campaign"

    def __str__(self):
        return self.campaignName


