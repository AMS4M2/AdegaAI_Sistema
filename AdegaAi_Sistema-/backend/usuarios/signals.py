from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from django.db.models import F
from usuarios.models import ItemCompra, MovimentoEstoque, Estoque

@receiver(post_save, sender=ItemCompra)
def atualiza_estoque_apos_compra(sender, instance, created, **kwargs):
    if not created:
        return
    MovimentoEstoque.objects.create(
        compra=instance.compra,
        produto=instance.produto,
        tipo='ENTRADA',
        quantidade=instance.quantidade,
        data=timezone.now(),
        fornecedor=instance.compra.fornecedor
    )
    estoque, _ = Estoque.objects.get_or_create(produto=instance.produto)
    estoque.quantidade = F('quantidade') + instance.quantidade
    estoque.save()
