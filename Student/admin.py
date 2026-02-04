from django.contrib import admin
from .models import MarketingCampaign, student,Product
# Register your models here.

admin.site.register(student)
admin.site.register(Product)
admin.site.register(MarketingCampaign)
