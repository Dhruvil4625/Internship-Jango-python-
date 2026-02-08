from django.db import models

# Create your models here.
from django.db import models

class Customer(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)

    def __str__(self):
        return self.name

class CustomerProfile(models.Model):
    customer = models.OneToOneField(Customer, on_delete=models.CASCADE)
    address = models.CharField(max_length=200)
    city = models.CharField(max_length=50)
    gender = models.CharField(max_length=10)

    class Meta:
          db_table = "CustomerProfile"

    def __str__(self):
        return self.customer.name

class Category(models.Model):
    category_name = models.CharField(max_length=100)

    class Meta:
          db_table = "Category"

    def __str__(self):
        return self.category_name

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    product_name = models.CharField(max_length=100)
    price = models.IntegerField()
    quantity = models.IntegerField()

    class Meta:
          db_table = "Product"

    def __str__(self):
        return self.product_name

class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    order_date = models.DateField(auto_now_add=True)
    total_amount = models.IntegerField()

    class Meta:
        db_table = "Order"

    def __str__(self):
        return f"{self.id} - {self.customer.name}"

class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    order_date = models.DateField(auto_now_add=True)
    total_amount = models.IntegerField()

    class Meta:
        db_table = "Order"

    def __str__(self):
        return f"{self.id} - {self.customer.name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="order_items")
    quantity = models.IntegerField()

    class Meta:
        db_table = "order_item"

    def __str__(self):
        return f"{self.product.product_name} ({self.quantity})"