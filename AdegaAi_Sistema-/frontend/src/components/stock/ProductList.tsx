
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Edit, 
  Trash2, 
  Plus, 
  Minus,
  AlertTriangle 
} from "lucide-react";
import { Product, Category } from "@/types/stock";
import StockMovementDialog from "./StockMovementDialog";

interface ProductListProps {
  products: Product[];
  categories: Category[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onStockMovement: (productId: string, type: 'entrada' | 'saida', quantity: number, reason: string) => void;
}

const ProductList = ({ products, categories, onEdit, onDelete, onStockMovement }: ProductListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showMovementDialog, setShowMovementDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.codigo_barras.includes(searchTerm);
    const matchesCategory = categoryFilter === "all" || product.categoria === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleQuickMovement = (product: Product, type: 'entrada' | 'saida') => {
    setSelectedProduct(product);
    setShowMovementDialog(true);
  };

  const handleDeleteProduct = (product: Product) => {
    if (confirm(`Tem certeza que deseja excluir o produto "${product.nome}"?`)) {
      onDelete(product.id);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.nome_categoria || categoryId;
  };

  const isLowStock = (product: Product) => {
    return product.quantidade_em_estoque < product.estoque_minimo;
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nome, marca ou código de barras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.filter(c => c.status === 'ativo').map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.nome_categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Produtos */}
      <Card>
        <CardHeader>
          <CardTitle>
            Produtos ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Preços</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className={isLowStock(product) ? "bg-red-50" : ""}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {isLowStock(product) && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">{product.nome}</p>
                          <p className="text-sm text-gray-600">{product.marca} - {product.volume}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getCategoryName(product.categoria)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <p className={`font-bold ${isLowStock(product) ? 'text-red-600' : 'text-green-600'}`}>
                          {product.quantidade_em_estoque}
                        </p>
                        <p className="text-xs text-gray-500">mín: {product.estoque_minimo}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>Venda: <span className="font-medium text-green-600">R$ {product.preco_venda.toFixed(2)}</span></p>
                        <p>Compra: <span className="text-gray-600">R$ {product.preco_compra.toFixed(2)}</span></p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {product.codigo_barras}
                    </TableCell>
                    <TableCell>
                      {product.validade ? (
                        <span className="text-sm">
                          {new Date(product.validade).toLocaleDateString('pt-BR')}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuickMovement(product, 'entrada')}
                          title="Entrada de estoque"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuickMovement(product, 'saida')}
                          title="Saída de estoque"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(product)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum produto encontrado</p>
                <p className="text-sm">Tente ajustar os filtros ou adicionar novos produtos</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showMovementDialog && selectedProduct && (
        <StockMovementDialog
          product={selectedProduct}
          onMovement={onStockMovement}
          onClose={() => {
            setShowMovementDialog(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductList;
