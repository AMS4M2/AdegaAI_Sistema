from django.urls import path, include
from rest_framework import routers
from .views import (
    RegistroView,
    UsuarioLogadoView,
    FornecedorViewSet,
    CategoriaViewSet,
    ProdutoViewSet,
    CompraViewSet,
    ItemCompraViewSet
)

router = routers.DefaultRouter()
router.register(r'fornecedores', FornecedorViewSet, basename='fornecedor')
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'produtos', ProdutoViewSet, basename='produto')
router.register(r'compras', CompraViewSet, basename='compra')
router.register(r'itens-compra', ItemCompraViewSet, basename='itemcompra')

urlpatterns = [
    path('registrar/', RegistroView.as_view(), name='registrar'),
    path('usuario-logado/', UsuarioLogadoView.as_view(), name='usuario-logado'),
    path('', include(router.urls)),
]
