import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Download,
  FileText,
  TrendingUp,
  AlertTriangle,
  Package,
  DollarSign,
  Calendar,
  BarChart3
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import AppSidebar from "@/components/AppSidebar";
import { produtoService } from "@/services/produtoService";
import { vendaService } from "@/services/vendaService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

import reportService from '@/services/reportService';


const Reports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const { toast } = useToast();

  // Buscar dados do backend
  const { data: produtos = [] } = useQuery({
    queryKey: ['produtos'],
    queryFn: produtoService.getAll
  });

  const { data: vendas = [] } = useQuery({
    queryKey: ['vendas'],
    queryFn: vendaService.getAll
  });

  // Calcular métricas
  const produtosEstoqueBaixo = produtos.filter(p => p.estoque < 10);
  const totalVendas = vendas.reduce((sum, venda) => sum + venda.total, 0);
  const vendaMediaDiaria = vendas.length > 0 ? totalVendas / 30 : 0;
  const produtoMaisVendido = produtos.length > 0 ? produtos[0].nome : "N/A";

  // Dados para gráficos
  const salesData = [
    { month: 'Jan', vendas: 4000, faturamento: 24000 },
    { month: 'Fev', vendas: 3000, faturamento: 18000 },
    { month: 'Mar', vendas: 2000, faturamento: 12000 },
    { month: 'Abr', vendas: 2780, faturamento: 16680 },
    { month: 'Mai', vendas: 1890, faturamento: 11340 },
    { month: 'Jun', vendas: 2390, faturamento: 14340 },
  ];

  const stockData = [
    { categoria: 'Bebidas', quantidade: produtos.filter(p => p.categoria === 'bebidas').length },
    { categoria: 'Alimentos', quantidade: produtos.filter(p => p.categoria === 'alimentos').length },
    { categoria: 'Limpeza', quantidade: produtos.filter(p => p.categoria === 'limpeza').length },
    { categoria: 'Outros', quantidade: produtos.filter(p => p.categoria === 'outros').length },
  ];

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];

  // Funções de exportação
  const exportToPDF = () => {
    toast({
      title: "Exportando para PDF...",
      description: "O relatório será baixado em instantes.",
    });
  };

  const exportToExcel = () => {
    toast({
      title: "Exportando para Excel...",
      description: "O relatório será baixado em instantes.",
    });
  };

  const exportToCSV = () => {
    toast({
      title: "Exportando para CSV...",
      description: "O relatório será baixado em instantes.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AppSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-800">Relatórios</h1>
              <p className="text-gray-600">Análise detalhada do seu negócio</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                  <SelectItem value="365">Último ano</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex space-x-2">
                <Button onClick={exportToPDF} variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button onClick={exportToExcel} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button onClick={exportToCSV} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Tabs defaultValue="vendas" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="vendas">Vendas</TabsTrigger>
              <TabsTrigger value="estoque">Estoque</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
              <TabsTrigger value="produtos">Produtos</TabsTrigger>
            </TabsList>

            <TabsContent value="vendas" className="space-y-6">
              {/* Cards de Resumo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      R$ {totalVendas.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +12% em relação ao período anterior
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Venda Média Diária</CardTitle>
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      R$ {vendaMediaDiaria.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Baseado nos últimos 30 dias
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Produto Mais Vendido</CardTitle>
                    <Package className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {produtoMaisVendido}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Líder em vendas
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Gráfico de Vendas */}
              <Card>
                <CardHeader>
                  <CardTitle>Evolução das Vendas</CardTitle>
                  <CardDescription>
                    Vendas e faturamento nos últimos 6 meses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="vendas" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="faturamento" stroke="#f59e0b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="estoque" className="space-y-6">
              {/* Alertas de Estoque */}
              {produtosEstoqueBaixo.length > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-orange-800">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Produtos com Estoque Baixo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {produtosEstoqueBaixo.slice(0, 5).map((produto) => (
                        <div key={produto.id} className="flex items-center justify-between">
                          <span className="text-sm">{produto.nome}</span>
                          <Badge variant="destructive">{produto.estoque} unidades</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Gráfico de Estoque por Categoria */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição do Estoque</CardTitle>
                  <CardDescription>
                    Quantidade de produtos por categoria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={stockData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="quantidade"
                      >
                        {stockData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financeiro" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análise Financeira</CardTitle>
                  <CardDescription>
                    Resumo financeiro do período selecionado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Receita Total</p>
                      <p className="text-2xl font-bold text-blue-600">R$ {totalVendas.toFixed(2)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Ticket Médio</p>
                      <p className="text-2xl font-bold text-blue-600">
                        R$ {vendas.length > 0 ? (totalVendas / vendas.length).toFixed(2) : '0.00'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="produtos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Produtos</CardTitle>
                  <CardDescription>
                    Performance dos produtos em estoque
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {produtos.slice(0, 10).map((produto) => (
                      <div key={produto.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{produto.nome}</p>
                          <p className="text-sm text-gray-600">R$ {produto.preco.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{produto.estoque} unidades</p>
                          <Badge variant={produto.estoque < 10 ? "destructive" : "default"}>
                            {produto.estoque < 10 ? "Baixo" : "Normal"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Reports;