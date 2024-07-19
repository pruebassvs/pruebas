from django.urls import path, include
from app.views import ProductViewSet, ShoeModelTypeViewSet,BrandTypeViewSet,ColorTypeViewSet,SizeTypeViewSet, LoginView,UserUpdateView,UserDetailView, LogoutView, LogoutAllView, RegisterView, CartViewSet, PurchaseViewSet, ChangeDeliveryStatusAPIView
from rest_framework import routers

router = routers.DefaultRouter()

router.register(r"products",ProductViewSet)
router.register(r"cart",CartViewSet)
router.register(r"purchase",PurchaseViewSet)
router.register(r"model",ShoeModelTypeViewSet)
router.register(r"brand",BrandTypeViewSet)
router.register(r"color",ColorTypeViewSet)
router.register(r"size",SizeTypeViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('logout_all/', LogoutAllView.as_view(), name='logout_all'),
    path('register/', RegisterView.as_view(), name='register'),
    path('user/', UserDetailView.as_view(), name='user-update'),
    path('user/update/', UserUpdateView.as_view(), name='user-update'),
    path('deliveries/', ChangeDeliveryStatusAPIView.as_view(), name='change delivery_status'),
]