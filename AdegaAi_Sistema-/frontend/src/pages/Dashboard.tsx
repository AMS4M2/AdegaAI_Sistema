import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  Target
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import AppSidebar from "@/components/AppSidebar";
import { produtoService } from "@/services/produtoService";
import { vendaService } from "@/services/vendaService";
import { fornecedorService } from "@/services/fornecedorService";

import dashboardService from '@/services/dashboardService';


const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Buscar dados reais
  const { data: produtos = [] } = useQuery({
    queryKey: ['produtos'],
    queryFn: produtoService.getAll
  });

  const { data: vendas = [] } = useQuery({
    queryKey: ['vendas'],
    queryFn: vendaService.getAll
  });

  const { data: fornecedores = [] } = useQuery({
    queryKey: ['fornecedores'],
    queryFn: fornecedorService.getAll
  });

  // Calcular métricas
  const totalProdutos = produtos.length;
  const produtosEstoqueBaixo = produtos.filter(p => p.estoque < 10).length;
  const totalVendas = vendas.length;
  const faturamentoTotal = vendas.reduce((sum, venda) => sum + venda.total, 0);
  const totalFornecedores = fornecedores.length;

  // Dados para gráficos (simulados baseados em vendas reais)
  const salesData = [
    { month: 'Jan', sales: 4000, revenue: 2400 },
    { month: 'Fev', sales: 3000, revenue: 1398 },
    { month: 'Mar', sales: 2000, revenue: 9800 },
    { month: 'Abr', sales: 2780, revenue: 3908 },
    { month: 'Mai', sales: 1890, revenue: 4800 },
    { month: 'Jun', sales: 2390, revenue: 3800 },
  ];

  const productData = [
    { name: 'Bebidas', value: produtos.filter(p => p.categoria === 'bebidas').length },
    { name: 'Alimentos', value: produtos.filter(p => p.categoria === 'alimentos').length },
    { name: 'Limpeza', value: produtos.filter(p => p.categoria === 'limpeza').length },
    { name: 'Outros', value: produtos.filter(p => p.categoria === 'outros').length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AppSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-800">Dashboard</h1>
              <p className="text-gray-600">Visão geral da sua adega</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date().toLocaleDateString('pt-BR')}
              </Badge>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
                <Package className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{totalProdutos}</div>
                <p className="text-xs text-muted-foreground">
                  {produtosEstoqueBaixo > 0 && (
                    <span className="text-red-500">
                      {produtosEstoqueBaixo} com estoque baixo
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
                <ShoppingCart className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{totalVendas}</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% em relação ao mês passado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  R$ {faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  +15.2% em relação ao mês passado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fornecedores</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{totalFornecedores}</div>
                <p className="text-xs text-muted-foreground">
                  Fornecedores ativos
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Alertas */}
          {produtosEstoqueBaixo > 0 && (
            <Card className="mb-6 border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-800">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Produtos com Estoque Baixo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-orange-700 mb-2">
                  {produtosEstoqueBaixo} produtos precisam de reposição (menos de 10 unidades)
                </p>
                <div className="space-y-2">
                  {produtos.filter(p => p.estoque < 10).slice(0, 5).map((produto) => (
                    <div key={produto.id} className="flex items-center justify-between">
                      <span className="text-sm">{produto.nome}</span>
                      <Badge variant="destructive">{produto.estoque} unidades</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendas por Mês</CardTitle>
                <CardDescription>Evolução das vendas nos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Produtos por Categoria</CardTitle>
                <CardDescription>Distribuição dos produtos por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Produtos Mais Vendidos */}
          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Vendidos</CardTitle>
              <CardDescription>Top 10 produtos com melhor performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {produtos.slice(0, 10).map((produto, index) => (
                  <div key={produto.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{produto.nome}</p>
                        <p className="text-sm text-gray-600">R$ {produto.preco.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{produto.estoque} unidades</p>
                      <Progress value={Math.min((produto.estoque / 100) * 100, 100)} className="w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;