
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Product, Category } from "@/types/stock";

interface ProductFormProps {
  product?: Product | null;
  categories: Category[];
  onSave: (product: Omit<Product, 'id'>) => void;
  onClose: () => void;
}

const ProductForm = ({ product, categories, onSave, onClose }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    marca: '',
    categoria: '',
    volume: '',
    preco_venda: 0,
    preco_compra: 0,
    quantidade_em_estoque: 0,
    estoque_minimo: 0,
    validade: '',
    lote: '',
    codigo_barras: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        nome: product.nome,
        marca: product.marca,
        categoria: product.categoria,
        volume: product.volume,
        preco_venda: product.preco_venda,
        preco_compra: product.preco_compra,
        quantidade_em_estoque: product.quantidade_em_estoque,
        estoque_minimo: product.estoque_minimo,
        validade: product.validade || '',
        lote: product.lote || '',
        codigo_barras: product.codigo_barras
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Editar Produto' : 'Novo Produto'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Informações Básicas */}
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Produto *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marca">Marca *</Label>
                  <Input
                    id="marca"
                    value={formData.marca}
                    onChange={(e) => handleInputChange('marca', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select value={formData.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar categoria..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c.status === 'ativo').map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.nome_categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="volume">Volume/Tamanho</Label>
                  <Input
                    id="volume"
                    value={formData.volume}
                    onChange={(e) => handleInputChange('volume', e.target.value)}
                    placeholder="ex: 350ml, 2L, 1kg"
                  />
                </div>

                {/* Preços */}
                <div className="space-y-2">
                  <Label htmlFor="preco_compra">Preço de Compra *</Label>
                  <Input
                    id="preco_compra"
                    type="number"
                    step="0.01"
                    value={formData.preco_compra}
                    onChange={(e) => handleInputChange('preco_compra', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preco_venda">Preço de Venda *</Label>
                  <Input
                    id="preco_venda"
                    type="number"
                    step="0.01"
                    value={formData.preco_venda}
                    onChange={(e) => handleInputChange('preco_venda', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                {/* Estoque */}
                <div className="space-y-2">
                  <Label htmlFor="quantidade_em_estoque">Quantidade em Estoque *</Label>
                  <Input
                    id="quantidade_em_estoque"
                    type="number"
                    value={formData.quantidade_em_estoque}
                    onChange={(e) => handleInputChange('quantidade_em_estoque', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estoque_minimo">Estoque Mínimo *</Label>
                  <Input
                    id="estoque_minimo"
                    type="number"
                    value={formData.estoque_minimo}
                    onChange={(e) => handleInputChange('estoque_minimo', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                {/* Código de Barras */}
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="codigo_barras">Código de Barras *</Label>
                  <Input
                    id="codigo_barras"
                    value={formData.codigo_barras}
                    onChange={(e) => handleInputChange('codigo_barras', e.target.value)}
                    required
                  />
                </div>

                {/* Informações Opcionais */}
                <div className="space-y-2">
                  <Label htmlFor="validade">Data de Validade</Label>
                  <Input
                    id="validade"
                    type="date"
                    value={formData.validade}
                    onChange={(e) => handleInputChange('validade', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lote">Lote</Label>
                  <Input
                    id="lote"
                    value={formData.lote}
                    onChange={(e) => handleInputChange('lote', e.target.value)}
                  />
                </div>
              </div>

              {/* Cálculo de Margem */}
              {formData.preco_compra > 0 && formData.preco_venda > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Margem de lucro: <span className="font-medium text-green-600">
                      {(((formData.preco_venda - formData.preco_compra) / formData.preco_compra) * 100).toFixed(1)}%
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Lucro por unidade: <span className="font-medium text-green-600">
                      R$ {(formData.preco_venda - formData.preco_compra).toFixed(2)}
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              {product ? 'Salvar Alterações' : 'Criar Produto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
