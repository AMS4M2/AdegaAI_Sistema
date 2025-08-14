# api/urls.py

from django.urls import path, include
from rest_framework import routers
from .views import VendaViewSet, ItemVendaViewSet, SignupAPIView

router = routers.DefaultRouter()
router.register(r'vendas', VendaViewSet, basename='venda')
router.register(r'itens-venda', ItemVendaViewSet, basename='itemvenda')

urlpatterns = [
    path('signup/', SignupAPIView.as_view(), name='signup'),
    path('', include(router.urls)),
]
