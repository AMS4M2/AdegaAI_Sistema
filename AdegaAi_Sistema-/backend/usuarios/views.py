from rest_framework import viewsets, generics, permissions
from rest_framework.permissions import IsAuthenticated
from usuarios.permissions import IsSameEmpresa
from usuarios.models import (
    Usuario,
    Fornecedor,
    Categoria,
    Produto,
    Compra,
    ItemCompra
)
from usuarios.serializers import (
    RegisterUserSerializer,
    UsuarioSerializer,
    FornecedorSerializer,
    CategoriaSerializer,
    ProdutoSerializer,
    CompraSerializer,
    ItemCompraSerializer
)

# View para registrar um novo usuário + empresa
class RegistroView(generics.CreateAPIView):
    serializer_class = RegisterUserSerializer
    permission_classes = [permissions.AllowAny]

# View para retornar os dados do usuário logado
class UsuarioLogadoView(generics.RetrieveAPIView):
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

# Base para os endpoints que devem filtrar por empresa
class BaseEmpresaViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsSameEmpresa]

    def perform_create(self, serializer):
        serializer.save(empresa=self.request.user.empresa)

    def get_queryset(self):
        return super().get_queryset().filter(empresa=self.request.user.empresa)

class FornecedorViewSet(BaseEmpresaViewSet):
    queryset = Fornecedor.objects.all()
    serializer_class = FornecedorSerializer

class CategoriaViewSet(BaseEmpresaViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class ProdutoViewSet(BaseEmpresaViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

class CompraViewSet(BaseEmpresaViewSet):
    queryset = Compra.objects.all()
    serializer_class = CompraSerializer

class ItemCompraViewSet(BaseEmpresaViewSet):
    queryset = ItemCompra.objects.all()
    serializer_class = ItemCompraSerializer
