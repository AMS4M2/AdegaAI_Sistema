from rest_framework import serializers
from usuarios.models import (
    Usuario,
    Empresa,
    Fornecedor,
    Categoria,
    Produto,
    Compra,
    ItemCompra
)

# Serializer para registro de usuário + empresa
class RegisterUserSerializer(serializers.ModelSerializer):
    empresa_nome = serializers.CharField(source='empresa.nome')
    phone = serializers.CharField(source='empresa.phone', allow_blank=True, required=False)

    class Meta:
        model = Usuario
        fields = ['username', 'email', 'password', 'cpf', 'nascimento', 'empresa_nome', 'phone']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        empresa_data = validated_data.pop('empresa')
        phone = empresa_data.get('phone', '')
        user = Usuario.objects.create_user(**validated_data)
        user.empresa = Empresa.objects.create(nome=empresa_data['nome'], phone=phone)
        user.save()
        return user

# Serializer para visualização do usuário logado
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'cpf', 'nascimento', 'empresa']

# Serializers de domínio
class FornecedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fornecedor
        fields = ['id', 'empresa', 'nome', 'telefone', 'email']

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'empresa', 'nome']

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = [
            'id', 'empresa', 'categoria',
            'nome', 'descricao', 'codigo_barras',
            'preco', 'data_vencimento'
        ]

class ItemCompraSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCompra
        fields = ['id', 'produto', 'quantidade', 'preco_unitario']

class CompraSerializer(serializers.ModelSerializer):
    itens = ItemCompraSerializer(many=True)

    class Meta:
        model = Compra
        fields = ['id', 'fornecedor', 'data', 'itens']

    def create(self, validated_data):
        itens_data = validated_data.pop('itens')
        compra = Compra.objects.create(
            empresa=self.context['request'].user.empresa,
            **validated_data
        )
        for item in itens_data:
            ItemCompra.objects.create(compra=compra, **item)
        return compra
