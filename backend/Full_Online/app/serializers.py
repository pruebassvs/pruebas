from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "email",
            "phone",
            "identification_number"
        ]

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

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['brand'] = BrandTypeSerializer(instance.brand).data if instance.brand else None
        representation['model'] = ShoeModelTypeSerializer(instance.model).data if instance.model else None
        representation['size'] = SizeTypeSerializer(instance.size).data if instance.size else None
        representation['color'] = ColorTypeSerializer(instance.color).data if instance.color else None
        return representation