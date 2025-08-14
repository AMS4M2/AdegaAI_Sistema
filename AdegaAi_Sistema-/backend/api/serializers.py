# api/serializers.py

from django.db import transaction
from rest_framework import serializers
from usuarios.models import Produto, Usuario, Empresa
from .models import Venda, ItemVenda

class ItemVendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemVenda
        fields = ['id', 'produto', 'quantidade', 'preco_unitario']


class VendaSerializer(serializers.ModelSerializer):
    itens = ItemVendaSerializer(many=True)
    empresa = serializers.PrimaryKeyRelatedField(read_only=True)
    data = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Venda
        fields = ['id', 'empresa', 'data', 'total', 'itens']

    def create(self, validated_data):
        itens_data = validated_data.pop('itens')
        venda = Venda.objects.create(
            empresa=self.context['request'].user.empresa,
            **validated_data
        )
        for item in itens_data:
            ItemVenda.objects.create(venda=venda, **item)
        return venda


class SignupUsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = ['username', 'email', 'password', 'cpf', 'nascimento']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Usuario(**validated_data)
        user.set_password(password)
        user.save()
        return user


class SignupEmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = ['nome', 'cnpj', 'telefone']


class SignupSerializer(serializers.Serializer):
    empresa = SignupEmpresaSerializer()
    usuario = SignupUsuarioSerializer()

    def create(self, validated_data):
        empresa_data = validated_data.pop('empresa')
        usuario_data = validated_data.pop('usuario')
        with transaction.atomic():
            # 1) Cria a empresa sem dono
            empresa = Empresa.objects.create(**empresa_data)
            # 2) Cria o usuário vinculado a essa empresa
            usuario_data['empresa'] = empresa
            user = SignupUsuarioSerializer().create(usuario_data)
            # 3) Define o dono da empresa e salva
            empresa.dono = user
            empresa.save()
        return {'empresa': empresa, 'usuario': user}
