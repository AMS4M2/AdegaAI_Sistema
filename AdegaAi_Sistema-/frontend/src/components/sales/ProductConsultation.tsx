
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Package, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  barcode: string;
  category: string;
  stock: number;
}

interface ProductConsultationProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToSale: (product: Product) => void;
}

const ProductConsultation = ({ isOpen, onClose, products, onAddToSale }: ProductConsultationProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!searchInput.trim()) return;

    const product = products.find(p => 
      p.barcode === searchInput || 
      p.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (product) {
      setFoundProduct(product);
      setNotFound(false);
    } else {
      setFoundProduct(null);
      setNotFound(true);
    }
  };

  const handleAddToSale = () => {
    if (foundProduct) {
      onAddToSale(foundProduct);
      toast({
        title: "Produto adicionado",
        description: `${foundProduct.name} foi adicionado à venda`,
      });
      clearSearch();
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setFoundProduct(null);
    setNotFound(false);
  };

  const handleClose = () => {
    clearSearch();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Consulta de Produtos</span>
          </DialogTitle>
          <DialogDescription>
            Digite o código de barras ou nome do produto para consultar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Campo de busca */}
          <div className="flex space-x-2">
            <Input
              placeholder="Código de barras ou nome do produto..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Resultado da consulta */}
          {foundProduct && (
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{foundProduct.name}</h3>
                  <Badge variant="secondary" className="mb-2">
                    {foundProduct.category}
                  </Badge>
                </div>
                <Package className="h-6 w-6 text-emerald-600" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Preço de Venda</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    R$ {foundProduct.price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Estoque Disponível</p>
                  <p className="text-xl font-semibold">
                    {foundProduct.stock} unidades
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-gray-500">
                  Código: {foundProduct.barcode}
                </p>
              </div>

              <div className="flex space-x-2 pt-3">
                <Button 
                  onClick={handleAddToSale}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  disabled={foundProduct.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Adicionar à Venda
                </Button>
                <Button variant="outline" onClick={clearSearch}>
                  Limpar
                </Button>
              </div>

              {foundProduct.stock === 0 && (
                <p className="text-red-600 text-sm text-center">
                  ⚠️ Produto sem estoque disponível
                </p>
              )}
            </div>
          )}

          {/* Produto não encontrado */}
          {notFound && (
            <div className="border border-red-200 rounded-lg p-4 text-center">
              <Package className="h-12 w-12 mx-auto mb-3 text-red-400" />
              <h3 className="font-semibold text-red-800 mb-2">Produto não encontrado</h3>
              <p className="text-red-600 text-sm mb-4">
                O código "{searchInput}" não foi encontrado no sistema
              </p>
              <Button variant="outline" onClick={clearSearch}>
                Tentar Novamente
              </Button>
            </div>
          )}

          {/* Estado inicial */}
          {!foundProduct && !notFound && searchInput === "" && (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Digite um código de barras ou nome para consultar</p>
              <p className="text-sm mt-2">
                O campo será limpo automaticamente após cada consulta
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductConsultation;
