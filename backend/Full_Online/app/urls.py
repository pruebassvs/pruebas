from django.urls import path, include
from app.views import ProductViewSet, LoginView, LogoutView, LogoutAllView, RegisterView, CartViewSet
from rest_framework import routers

router = routers.DefaultRouter()

router.register(r"products",ProductViewSet)
router.register(r"cart",CartViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('logout_all/', LogoutAllView.as_view(), name='logout_all'),
    path('register/', RegisterView.as_view(), name='register')
   
]