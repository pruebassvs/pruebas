from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    email = models.EmailField(max_length=30, unique=True)
    identification_number = models.IntegerField(null=True, blank=True, unique=True)
    phone = models.CharField(max_length=45, null=True, blank=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "password","identification_number", "phone"]

    class Meta:
        db_table = "users"
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return self.email



class ColorType(models.Model):
    description = models.CharField(max_length=45)

    class Meta:
        db_table = "color"
        verbose_name = "Color"
        verbose_name_plural = "Colors"

    def __str__(self):
        return self.description


class BrandType(models.Model):
    description = models.CharField(max_length=45)

    class Meta:
        db_table = "brand"
        verbose_name = "Brand"
        verbose_name_plural = "Brands"

    def __str__(self):
        return self.description


class SizeType(models.Model):
    size = models.CharField(max_length=10)  

    class Meta:
        db_table = "size"
        verbose_name = "Size"
        verbose_name_plural = "Sizes"

    def __str__(self):
        return self.size


class ShoeModelType(models.Model):
    model = models.CharField(max_length=45)

    class Meta:
        db_table = "model"
        verbose_name = "Model"
        verbose_name_plural = "Models"

    def __str__(self):
        return self.model



class Product(models.Model):
    model= models.ForeignKey(ShoeModelType, on_delete=models.SET_NULL, null=True, blank=True)
    brand = models.ForeignKey(BrandType, on_delete=models.SET_NULL, null=True, blank=True)
    color = models.ForeignKey(ColorType, on_delete=models.SET_NULL, null=True, blank=True)
    size = models.ForeignKey(SizeType, on_delete=models.SET_NULL, null=True, blank=True)
    price = models.FloatField(default=0.0)
    stock = models.IntegerField(default=0)
    image = models.CharField(max_length=200, null=True, blank=True)
    detail = models.TextField(max_length=500, null=True, blank=True)

    class Meta:
        db_table = "product"
        verbose_name = "Product"
        verbose_name_plural = "Products"

    def __str__(self):
        return f"{self.model} - {self.size} - {self.color}"


class Cart(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)

    class Meta:
        db_table = "cart"
        verbose_name = "Cart"
        verbose_name_plural = "Carts"

    def __str__(self):
        return f"{self.user.email} - {self.date}"


class CartDetail(models.Model):
    quantity= models.PositiveIntegerField()
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    class Meta:
        db_table = "cart_detail"
        verbose_name = "Cart_detail"
        verbose_name_plural = "Cart_details"

    def __str__(self):
        return f"Cart id: {self.cart.id} - Product: {self.product} - Quantity: {self.quantity}"


class PaymentModeType(models.Model):
    description = models.CharField(max_length=45)

    class Meta:
        db_table = "payment_type"
        verbose_name = "Payment_type"
        verbose_name_plural = "Payment_types"

    def __str__(self):
        return self.description


class Purchase(models.Model):
    invoice_number = models.CharField(max_length=100)
    date = models.DateField(auto_now_add=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    total = models.IntegerField(default=0)
    payment_type = models.ForeignKey(PaymentModeType, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = "purchase"
        verbose_name = "Purchase"
        verbose_name_plural = "Purchases"

    def __str__(self):
        return f"{self.invoice_number} - {self.date}"


class PurchaseDetail(models.Model):
    quantity = models.PositiveIntegerField()
    purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    price = models.FloatField()  

    class Meta:
        db_table = "purchase_detail"
        verbose_name = "Purchase_detail"
        verbose_name_plural = "Purchase_details"

    def __str__(self):
        return f"Purchase id: {self.purchase.id} - Product: {self.product} - Quantity: {self.quantity}"


class DeliveryStatusType(models.Model):
    STATUS_CHOICES = [
        ('P', 'Pending'),
        ('T', 'In transit'),
        ('C', 'Completed'),
    ]
    description = models.CharField(max_length=45, choices=STATUS_CHOICES)

    class Meta:
        db_table = "delivery_status"
        verbose_name = "delivery_status"
        verbose_name_plural = "delivery_status"

    def __str__(self):
        return dict(self.STATUS_CHOICES)[self.description]


class Delivery(models.Model):
    purchase = models.OneToOneField(Purchase, on_delete=models.CASCADE)
    tracking_number = models.CharField(max_length=45)
    delivery_address= models.CharField(max_length=200)
    estimated_date = models.DateField(null=True, blank=True)
    delivery_date = models.DateField(null=True, blank=True)
    delivery_status = models.ForeignKey(DeliveryStatusType, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = "delivery"
        verbose_name = "Delivery"
        verbose_name_plural = "Deliveries"

    def __str__(self):
        return f"Tracking: {self.tracking_number}"

