from django.db import models

# Create your models here.
class Student(models.Model):
    studentName = models.CharField(max_length=100)
    studentAge = models.IntegerField()
    studentCity = models.CharField(max_length=40)

    def __str__(self):
        return self.studentName


class Product(models.Model):
    productName = models.CharField(max_length=100)
    productPrice = models.DecimalField(max_digits=8, decimal_places=2)
    productQuantity = models.IntegerField()
    productFeedback = models.TextField()
    productColor = models.CharField(max_length=30)

    class Meta:
        db_table = "product"

    def __str__(self):
        return self.productName

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
    
hobbies = (("reading","reading"),("traveling","traveling"),("music","music"),("Dancing","Dancing"))    
class StudentProfile(models.Model):
    student = models.OneToOneField(Student, on_delete=models.CASCADE)
    studentHobbies = models.CharField(max_length=100, choices=hobbies)
    studentAddress = models.CharField(max_length=100)
    studentPhone = models.CharField(max_length=10)
    studentGender = models.CharField(max_length=10)
    studentDob = models.DateField()

    class Meta:
        db_table = "student_profile"

    def __str__(self):
        return self.student.studentName

    
class Category(models.Model):
    categoryName = models.CharField(max_length=100)
    catogryDiscription = models.TextField()
    catogryStatus = models.BooleanField(default=True)

class Meta:
    db_table = "category"

def _str_(self):
    return self.categoryName



class UserAccount(models.Model):
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=50)  

    class Meta:
        db_table = "User_Account"

    def __str__(self):
        return self.username
    
class UserProfile(models.Model):
    user = models.OneToOneField(UserAccount, on_delete=models.CASCADE)
    bio = models.TextField()
    phone = models.CharField(max_length=15)
    country = models.CharField(max_length=50)

    class Meta:
        db_table = "User_Profile"

    def __str__(self):
        return self.user.username
    
class Course(models.Model):
    instructor = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    course_name = models.CharField(max_length=100)
    level = models.CharField(max_length=30)
    price = models.IntegerField()

    class Meta:
        db_table = "Course"

    def __str__(self):
        return self.course_name
    
class Enrollment(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_on = models.DateField(auto_now_add=True)
    progress = models.IntegerField(default=0)

class Meta:
        db_table = "Enrollment"

def __str__(self):
        return f"{self.user.username} - {self.course.course_name}"
    
class AdCreative(models.Model):
    campaign = models.ForeignKey(
        MarketingCampaign,
        on_delete=models.CASCADE,
        related_name="ad_creatives")
    title = models.CharField(max_length=100)
    ad_type = models.CharField(max_length=50)  
    content = models.TextField()
    status = models.CharField(max_length=20)  

    class Meta:
        db_table = "AdCreative"

    def __str__(self):
        return f"{self.title} ({self.campaign.campaign_name})"
    
class Lead(models.Model):
    campaign = models.ForeignKey(
        MarketingCampaign,
        on_delete=models.CASCADE,
        related_name="leads")
    name = models.CharField(max_length=100)
    email = models.EmailField()
    source = models.CharField(max_length=50)  
    is_converted = models.BooleanField(default=False)

    class Meta:
        db_table = "Lead"

    def __str__(self):
        return self.name



    


    




