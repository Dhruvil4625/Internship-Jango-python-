from django.contrib import admin
from .models import MarketingCampaign, Student, Product, Category, StudentProfile, UserAccount,UserProfile,Course,Enrollment,AdCreative,Lead

# Register your models here.

admin.site.register(Student)
admin.site.register(Product)
admin.site.register(MarketingCampaign)
admin.site.register(StudentProfile)
admin.site.register(Category)
admin.site.register( UserAccount)
admin.site.register(UserProfile)
admin.site.register(Course)
admin.site.register(Enrollment)
admin.site.register(AdCreative)
admin.site.register(Lead)

