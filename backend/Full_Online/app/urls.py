from django.urls import path
from app.views import LoginView, LogoutView, ListaView

urlpatterns = [
    
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('users/', ListaView.as_view(), name='users'),
]