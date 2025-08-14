# usuarios/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Empresa, Categoria, Fornecedor, Compra, Produto, MovimentoEstoque, ItemCompra, Estoque

@admin.register(Usuario)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'empresa', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'empresa')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Info pessoal', {'fields': ('first_name', 'last_name', 'email', 'cpf', 'nascimento', 'empresa')}),
        ('Permissões', {'fields': ('is_active','is_staff','is_superuser','groups','user_permissions')}),
        ('Datas importantes', {'fields': ('last_login','date_joined')}),
    )

@admin.register(Empresa)
class EmpresaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'cnpj', 'dono', 'telefone')
    search_fields = ('nome','cnpj','dono__username')

# Registrando demais models
admin.site.register([Categoria, Fornecedor, Compra, Produto, MovimentoEstoque, ItemCompra, Estoque])
