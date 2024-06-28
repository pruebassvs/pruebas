from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from rest_framework import status, viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.exceptions import ValidationError
from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView
from knox.views import LogoutView as KnoxLogoutView
from knox.views import LogoutAllView as KnoxLogoutAllView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .permissions import IsAdminOrReadOnly
from rest_framework.decorators import action
from .services.cart_service import CartService
from .serializers import UserSerializer, ProductSerializer, CartSerializer, CartDetailSerializer
from .models import  Product, Cart,CartDetail



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
            _, token = AuthToken.objects.create(user)
            isAdmin = request.user.is_staff

            return Response(
                {"user": user_serializer.data, "token": token, "is_staff": isAdmin},
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

class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

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
        except Exception as e:
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