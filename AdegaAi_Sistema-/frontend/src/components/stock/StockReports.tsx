
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Package, Calendar, TrendingDown } from "lucide-react";
import { Product, Category, StockMovement } from "@/types/stock";

interface StockReportsProps {
  products: Product[];
  categories: Category[];
  movements: StockMovement[];
}

const StockReports = ({ products, categories, movements }: StockReportsProps) => {
  // Produtos com estoque baixo
  const lowStockProducts = products.filter(p => p.quantidade_em_estoque < p.estoque_minimo);

  // Produtos por categoria
  const productsByCategory = categories.map(category => ({
    ...category,
    count: products.filter(p => p.categoria === category.id).length,
    totalValue: products
      .filter(p => p.categoria === category.id)
      .reduce((sum, p) => sum + (p.quantidade_em_estoque * p.preco_compra), 0)
  }));

  // Produtos próximos ao vencimento (30 dias)
  const getExpiringProducts = () => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    return products.filter(p => {
      if (!p.validade) return false;
      const expiryDate = new Date(p.validade);
      return expiryDate <= thirtyDaysFromNow && expiryDate >= new Date();
    }).sort((a, b) => new Date(a.validade!).getTime() - new Date(b.validade!).getTime());
  };

  const expiringProducts = getExpiringProducts();

  // Movimentações recentes
  const recentMovements = movements.slice(0, 10);

  // Estatísticas gerais
  const totalProducts = products.length;
  const totalStockValue = products.reduce((sum, p) => sum + (p.quantidade_em_estoque * p.preco_compra), 0);
  const averageStockLevel = products.reduce((sum, p) => sum + p.quantidade_em_estoque, 0) / products.length || 0;

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total do Estoque</p>
                <p className="text-2xl font-bold text-green-600">R$ {totalStockValue.toFixed(2)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nível Médio de Estoque</p>
                <p className="text-2xl font-bold">{averageStockLevel.toFixed(0)} un</p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Produtos com Estoque Baixo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Produtos com Estoque Baixo</span>
            </CardTitle>
            <CardDescription>
              {lowStockProducts.length} produtos abaixo do estoque mínimo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Nenhum produto com estoque baixo! 🎉
              </p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{product.nome}</p>
                      <p className="text-sm text-gray-600">{product.marca}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">
                        {product.quantidade_em_estoque} / {product.estoque_minimo}
                      </p>
                    </div>
                  </div>
                ))}
                {lowStockProducts.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    + {lowStockProducts.length - 5} outros produtos
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Produtos por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos por Categoria</CardTitle>
            <CardDescription>
              Distribuição do estoque por categorias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productsByCategory.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{category.nome_categoria}</p>
                    <p className="text-sm text-gray-600">
                      Valor: R$ {category.totalValue.toFixed(2)}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {category.count} produtos
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Produtos Próximos ao Vencimento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-amber-500" />
              <span>Próximos ao Vencimento</span>
            </CardTitle>
            <CardDescription>
              Produtos que vencem nos próximos 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            {expiringProducts.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Nenhum produto próximo ao vencimento
              </p>
            ) : (
              <div className="space-y-3">
                {expiringProducts.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border border-amber-200 rounded-lg bg-amber-50">
                    <div>
                      <p className="font-medium">{product.nome}</p>
                      <p className="text-sm text-gray-600">{product.marca}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-amber-600">
                        {new Date(product.validade!).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-xs text-amber-500">
                        {Math.ceil((new Date(product.validade!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dias
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Movimentações Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Movimentações Recentes</CardTitle>
            <CardDescription>
              Últimas 10 movimentações de estoque
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentMovements.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Nenhuma movimentação registrada
              </p>
            ) : (
              <div className="space-y-2">
                {recentMovements.map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between p-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={movement.tipo === 'entrada' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {movement.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                      </Badge>
                      <span>{movement.produto_nome}</span>
                    </div>
                    <div className="text-right">
                      <p className={movement.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}>
                        {movement.tipo === 'entrada' ? '+' : '-'}{movement.quantidade}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(movement.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StockReports;
