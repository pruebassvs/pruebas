from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "email",
            "password",
            "phone",
            "identification_number",
            "is_staff",
        ]
        extra_kwargs = {
            "password": {"write_only": True}, 
            "id": {"read_only": True}, 
        }
    def create(self, validated_data):
       
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            identification_number=validated_data.get("identification_number"),
            phone=validated_data.get("phone"),
        )
        return user

class ShoeModelTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoeModelType
        fields = ["id", "model"]
class BrandTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrandType
        fields = ["id", "description"]

class ColorTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColorType
        fields = ["id", "description"]

class SizeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SizeType
        fields = ["id", "size"]


class ProductSerializer(serializers.ModelSerializer):
    model = serializers.PrimaryKeyRelatedField(queryset=ShoeModelType.objects.all())
    brand = serializers.PrimaryKeyRelatedField(queryset=BrandType.objects.all())
    color = serializers.PrimaryKeyRelatedField(queryset=ColorType.objects.all())
    size = serializers.PrimaryKeyRelatedField(queryset=SizeType.objects.all())

    class Meta:
        model = Product
        fields = [
            "id",
            "price",
            "stock",
            "image",
            "detail",
            "model",
            "brand",
            "size",
            "color"
        ]
    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock must be a non-negative integer.")
        return value
    
    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price must be a positive number.")
        return value
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['brand'] = BrandTypeSerializer(instance.brand).data if instance.brand else None
        representation['model'] = ShoeModelTypeSerializer(instance.model).data if instance.model else None
        representation['size'] = SizeTypeSerializer(instance.size).data if instance.size else None
        representation['color'] = ColorTypeSerializer(instance.color).data if instance.color else None
        return representation
    
class CartDetailSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = CartDetail
        fields = [
            "id",
            "quantity",
            "product",
        ]


class CartSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    items = CartDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = "__all__"