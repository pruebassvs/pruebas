from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, ProductSerializer
from .models import CustomUser, Product


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        
        if user is not None:
            login(request, user)
            user_data = UserSerializer(user).data
            return Response({'message': 'Login successful', "user": user_data}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class ListaView(APIView):   
    def get(self, request):
        users = CustomUser.objects.all()
        users_data= UserSerializer(users, many = True).data
        return Response({'message': 'User gets', "users": users_data}, status=status.HTTP_200_OK)
        
     
class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


class ProductViewSet(viewsets.ModelViewSet):
    
    queryset = Product.objects.all()
    serializer_class = ProductSerializer