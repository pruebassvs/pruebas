from django.urls import path, include
from app.views import LoginView, LogoutView, ListaView, ProductViewSet
from rest_framework import routers

router = routers.DefaultRouter()

router.register(r"products",ProductViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('users/', ListaView.as_view(), name='users'),
]