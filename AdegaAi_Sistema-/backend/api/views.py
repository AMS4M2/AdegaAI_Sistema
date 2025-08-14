# api/views.py

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from usuarios.permissions import IsSameEmpresa
from usuarios.models import Empresa, Usuario
from .models import Venda, ItemVenda
from .serializers import (
    VendaSerializer,
    ItemVendaSerializer,
    SignupSerializer,
    SignupEmpresaSerializer,
    SignupUsuarioSerializer,
)

class BaseEmpresaViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsSameEmpresa]

    def perform_create(self, serializer):
        serializer.save(empresa=self.request.user.empresa)

    def get_queryset(self):
        return super().get_queryset().filter(empresa=self.request.user.empresa)


class VendaViewSet(BaseEmpresaViewSet):
    queryset = Venda.objects.all()
    serializer_class = VendaSerializer


class ItemVendaViewSet(BaseEmpresaViewSet):
    queryset = ItemVenda.objects.all()
    serializer_class = ItemVendaSerializer


class SignupAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        empresa, usuario = result['empresa'], result['usuario']
        empresa_data = SignupEmpresaSerializer(empresa).data
        usuario_data = SignupUsuarioSerializer(usuario).data
        return Response(
            {'empresa': empresa_data, 'usuario': usuario_data},
            status=status.HTTP_201_CREATED
        )
