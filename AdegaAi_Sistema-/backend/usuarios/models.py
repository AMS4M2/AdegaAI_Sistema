from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import JSONField
from django.utils import timezone

class Usuario(AbstractUser):
    cpf = models.CharField(
        max_length=14,
        unique=True,
        db_index=True,
        null=False,
        blank=False,
        help_text='CPF do usuário'
    )
    nascimento = models.DateField(
        null=True,
        blank=True,
        help_text='Data de nascimento (opcional)'
    )
    empresa = models.ForeignKey(
        'usuarios.Empresa',
        on_delete=models.PROTECT,
        related_name='usuarios',
        null=False,
        blank=False,
        help_text='Empresa à qual o usuário pertence'
    )

    def __str__(self):
        return self.username


class Empresa(models.Model):
    nome = models.CharField(
        max_length=100,
        db_index=True,
        null=False,
        blank=False,
        help_text='Nome da empresa'
    )
    cnpj = models.CharField(
        max_length=18,
        db_index=True,
        null=False,
        blank=False,
        help_text='CNPJ da empresa'
    )
    dono = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='empresas',
        null=False,
        blank=False,
        help_text='Usuário proprietário desta empresa'
    )
    telefone = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        help_text='Telefone de contato (opcional)'
    )

    def __str__(self):
        return self.nome


class Fornecedor(models.Model):
    empresa = models.ForeignKey(
        Empresa,
        on_delete=models.CASCADE,
        related_name='fornecedores',
        null=False,
        blank=False,
        help_text='Empresa vinculada ao fornecedor'
    )
    nome = models.CharField(
        max_length=100,
        db_index=True,
        null=False,
        blank=False,
        help_text='Nome do fornecedor'
    )
    telefone = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        help_text='Telefone do fornecedor (opcional)'
    )
    email = models.EmailField(
        null=True,
        blank=True,
        help_text='E-mail do fornecedor (opcional)'
    )

    def __str__(self):
        return self.nome


class Categoria(models.Model):
    nome = models.CharField(
        max_length=100,
        db_index=True,
        null=False,
        blank=False,
        help_text='Nome da categoria'
    )
    empresa = models.ForeignKey(
        Empresa,
        on_delete=models.CASCADE,
        related_name='categorias',
        null=False,
        blank=False,
        help_text='Empresa à qual a categoria pertence'
    )

    def __str__(self):
        return self.nome


class Produto(models.Model):
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.CASCADE,
        related_name='produtos',
        null=False,
        blank=False,
        help_text='Categoria deste produto'
    )
    empresa = models.ForeignKey(
        Empresa,
        on_delete=models.CASCADE,
        related_name='produtos',
        null=False,
        blank=False,
        help_text='Empresa deste produto'
    )
    nome = models.CharField(
        max_length=100,
        db_index=True,
        null=False,
        blank=False,
        help_text='Nome do produto'
    )
    descricao = models.TextField(
        null=True,
        blank=True,
        help_text='Descrição adicional (opcional)'
    )
    codigo_barras = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text='Código de barras (opcional)'
    )
    preco = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=False,
        blank=False,
        help_text='Preço do produto'
    )
    data_vencimento = models.DateField(
        null=True,
        blank=True,
        help_text='Data de vencimento (opcional)'
    )

    def __str__(self):
        return self.nome


class Compra(models.Model):
    empresa = models.ForeignKey(
        Empresa,
        on_delete=models.CASCADE,
        related_name='compras',
        null=False,
        blank=False,
        help_text='Empresa desta compra'
    )
    fornecedor = models.ForeignKey(
        Fornecedor,
        on_delete=models.CASCADE,
        related_name='compras_fornecedor',
        null=False,
        blank=False,
        help_text='Fornecedor desta compra'
    )
    data = models.DateTimeField(
        auto_now_add=True,
        help_text='Data e hora da compra'
    )

    def __str__(self):
        return f'Compra {self.id} – {self.empresa.nome}'


class ItemCompra(models.Model):
    compra = models.ForeignKey(
        Compra,
        on_delete=models.CASCADE,
        related_name='itens',
        null=False,
        blank=False,
        help_text='Compra à qual este item pertence'
    )
    produto = models.ForeignKey(
        Produto,
        on_delete=models.CASCADE,
        related_name='compras_produto',
        null=False,
        blank=False,
        help_text='Produto desta compra'
    )
    quantidade = models.PositiveIntegerField(
        null=False,
        blank=False,
        help_text='Quantidade comprada'
    )
    preco_unitario = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=False,
        blank=False,
        help_text='Preço unitário na compra'
    )

    def __str__(self):
        return f'{self.quantidade}× {self.produto.nome}'


class Estoque(models.Model):
    produto = models.ForeignKey(
        Produto,
        on_delete=models.CASCADE,
        related_name='estoques',
        null=False,
        blank=False,
        help_text='Produto no estoque'
    )
    quantidade = models.IntegerField(
        default=0,
        help_text='Quantidade disponível em estoque'
    )

    def __str__(self):
        return f'{self.produto.nome}: {self.quantidade}'


class MovimentoEstoque(models.Model):
    compra = models.ForeignKey(
        Compra,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text='Compra associada (opcional)'
    )
    produto = models.ForeignKey(
        Produto,
        on_delete=models.CASCADE,
        related_name='movimentos',
        null=False,
        blank=False,
        help_text='Produto movimentado'
    )
    tipo = models.CharField(
        max_length=10,
        null=False,
        blank=False,
        help_text='Tipo de movimento (ex: entrada, saída)'
    )
    quantidade = models.IntegerField(
        null=False,
        blank=False,
        help_text='Quantidade movimentada'
    )
    data = models.DateTimeField(
        auto_now_add=True,
        help_text='Data e hora do movimento'
    )
    fornecedor = models.ForeignKey(
        Fornecedor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='movimentos',
        help_text='Fornecedor associado (opcional)'
    )

    def __str__(self):
        return f'{self.tipo} – {self.produto.nome} ({self.quantidade})'
