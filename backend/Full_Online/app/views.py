from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.db import transaction
from rest_framework import status, viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.exceptions import ValidationError
from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView
from knox.views import LogoutView as KnoxLogoutView
from knox.views import LogoutAllView as KnoxLogoutAllView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .permissions import IsAdminOrReadOnly
from rest_framework.decorators import action
from .services.cart_service import CartService
from .services.stripe_service import StripeService
from .services.purchase_service import PurchaseService
from .services.delivery_service import DeliveryService
from .serializers import UserSerializer, ProductSerializer, UserUpdateSerializer, DeliverySerializer,DeliveryHistorySerializer, CartSerializer, CartDetailSerializer, PurchaseSerializer,PurchaseDetailSerializer, ShoeModelTypeSerializer,BrandTypeSerializer,SizeTypeSerializer, ColorTypeSerializer
from .models import  Product, Cart,CartDetail, Purchase, DeliveryStatusType, Delivery,DeliveryHistory, ShoeModelType, BrandType,SizeType,ColorType
from knox.settings import knox_settings
from datetime import datetime, timezone
import random
from django_filters.rest_framework import DjangoFilterBackend
from .utils.filters import ProductFilter



class LoginView(KnoxLoginView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": "Invalid username or password"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            user = serializer.validated_data["user"]
            login(request, user)
            user_serializer = UserSerializer(user)
            token_instance, token = AuthToken.objects.create(user)
            isAdmin = request.user.is_staff
            expiration_date = token_instance.expiry
            expires_in = (expiration_date - datetime.now(timezone.utc)).total_seconds()

            return Response(
                {"user": user_serializer.data, "token": token, "is_staff": isAdmin, "expires_in": expires_in},
                status=status.HTTP_200_OK,
            )
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class LogoutView(KnoxLogoutView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        try:
            response = super().post(request, format=None)
            return Response({"success": "Logged out"}, status=response.status_code)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LogoutAllView(KnoxLogoutAllView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        try:
            super().post(request, format=None)
            return Response({"success": "Logged out from all sessions"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        try:
            serializer = UserSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            user_serializer = UserSerializer(user)

            return Response(
                {"user": user_serializer.data,"message": "User created successfully"},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
            
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user 
            serializer = UserSerializer(user) 
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        try:
            user = request.user
            serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ProductViewSet(viewsets.ModelViewSet):
   
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProductFilter
    
    @action(detail=False, methods=['get'])
    def get_random_product_excluding_id(self, request):
        try:
            current_product_id = request.query_params.get('current_product_id')
            queryset = self.get_queryset().exclude(id=current_product_id)
            random_product = random.choice(queryset) if queryset.exists() else None
        
            if random_product:
                serializer = self.get_serializer(random_product)
                return Response(serializer.data)
            else:
                return Response({'error': 'No products available excluding the current one.'}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["post"])
    def create_cart(self, request):
        try:
            cart, created = CartService.create_cart(request.user)
            if created:
                serializer = CartSerializer(cart)
                response_data = {
                "message": " Cart added successfully",
                "cart": serializer.data
            }
                return Response(response_data, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Cart already exists"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["delete"])
    def delete_cart(self, request):
        try:
            CartService.delete_cart(request.user)
            return Response({"message": "Cart deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Cart.DoesNotExist:
            return Response({"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=["post"])
    def add_product(self, request):
        product_id = request.data.get("product_id")
        quantity = request.data.get("quantity", 1)
        try:
            CartService.add_product_to_cart(request.user, product_id, quantity)
            cart = Cart.objects.get(user=request.user)
            serializer = CartSerializer(cart)
            response_data = {
                "message": "Product added to cart successfully",
                "cart": serializer.data
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"])
    def get_items(self, request):
        try:
            cart, _ = CartService.create_cart(request.user)
            items = CartDetail.objects.filter(cart=cart)
            serializer = CartDetailSerializer(items, many=True)
            cart_response = {
                "cart_id": cart.id,
                "created_date": cart.date,
                "email": cart.user.email,
                "items": serializer.data,
            }
            return Response(cart_response)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["delete"])
    def remove_item(self, request):
        item_id = request.data.get("item_id")
        try:
            CartService.remove_item_from_cart(item_id)
            return Response({"message": "Item removed from cart successfully"},status=status.HTTP_200_OK)
        except CartDetail.DoesNotExist:
            return Response({"error": "Item not found in cart"}, status=status.HTTP_404_NOT_FOUND)
        
    def destroy(self, request, *args, **kwargs):
        return Response(
            {"error": "Direct delete not allowed. Use the delete_cart action instead."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
        
class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def user_purchases(self, request):
        try:
            purchases = Purchase.objects.filter(user=request.user)
            serializer = PurchaseSerializer(purchases, many=True)
            return Response(serializer.data)
        except Purchase.DoesNotExist:
            return Response(
                {"error": "No purchases found for this user."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def confirm_purchase(self, request):
        try:
            user = request.user
            cart = Cart.objects.get(user=user) 
            total_amount = sum(item.product.price * item.quantity for item in cart.items.all())
            
            with transaction.atomic():
                amount_in_cents = int(total_amount * 100) 
                payment_method = 'pm_card_visa'
                payment_intent = StripeService.create_payment_intent(amount= amount_in_cents)
                StripeService.confirm_payment_intent(payment_intent['id'], payment_method)
                purchase, purchase_details = PurchaseService.confirm_purchase(user, cart)
                delivery= DeliveryService.create_delivery(purchase)
        
            
            details_serializer = PurchaseDetailSerializer(purchase_details, many=True)
            delivery_serializer = DeliverySerializer(delivery)

            response_data = {
                "message": "Purchase completed successfully",
                "details": details_serializer.data,
                "delivery": delivery_serializer.data,
                "payment_intent": payment_intent['id']  ,
            }

            return Response(response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ChangeDeliveryStatusAPIView(APIView):
    

    def patch(self, request):
        try:
            purchase_id = request.data.get('purchase_id')
            status_description = request.data.get('status_description')

            if not purchase_id:
                return Response({'error': 'purchase_id is requered'}, status=status.HTTP_400_BAD_REQUEST)
            if not status_description:
                return Response({'error': 'status_description is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            if status_description not in dict(DeliveryStatusType.STATUS_CHOICES):
                return Response({'error': 'Invalid status description,Choices avaibles P,T,C'}, status=status.HTTP_400_BAD_REQUEST)
            
            purchase = Purchase.objects.get(id=purchase_id)
            updated_delivery, delivery_history = DeliveryService.update_delivery_status_with_history(purchase, status_description)

            return Response({
                'message': 'Delivery status updated successfully',
                'delivery': DeliverySerializer(updated_delivery).data,
                'delivery_history': DeliveryHistorySerializer(delivery_history, many=True).data
            }, status=status.HTTP_200_OK)
        except Delivery.DoesNotExist:
            return Response({'error': 'Delivery not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def get(self, request):
        try:
            deliveries= Delivery.objects.all()
            if not deliveries:
                return Response ({"error": "No deliveries founded "},
                status=status.HTTP_404_NOT_FOUND)
            
            deliveries_all = DeliverySerializer(deliveries, many=True)
            return Response(
                 deliveries_all.data,
               )
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ShoeModelTypeViewSet(viewsets.ModelViewSet):
    queryset = ShoeModelType.objects.all()
    serializer_class = ShoeModelTypeSerializer

class BrandTypeViewSet(viewsets.ModelViewSet):
    queryset = BrandType.objects.all()
    serializer_class = BrandTypeSerializer

class SizeTypeViewSet(viewsets.ModelViewSet):
    queryset = SizeType.objects.all()
    serializer_class = SizeTypeSerializer

class ColorTypeViewSet(viewsets.ModelViewSet):
    queryset = ColorType.objects.all()
    serializer_class = ColorTypeSerializer