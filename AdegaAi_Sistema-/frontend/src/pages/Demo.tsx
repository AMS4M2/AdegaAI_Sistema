
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  BarChart3,
  Plus,
  Settings,
  Bell,
  User,
  LogOut,
  Menu
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Demo = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dados fixos para demonstração
  const stats = [
    {
      title: "Vendas Hoje",
      value: "R$ 1.250,00",
      change: "+8%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Produtos em Estoque",
      value: "432",
      change: "-2 baixos",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Clientes Ativos",
      value: "89",
      change: "+5 novos",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Vendas do Mês",
      value: "R$ 28.500,00",
      change: "+15%",
      icon: TrendingUp,
      color: "text-emerald-600"
    }
  ];

  const lowStockProducts = [
    { name: "Cerveja Skol 350ml", current: 8, minimum: 30, category: "Cerveja" },
    { name: "Refrigerante Coca-Cola 2L", current: 3, minimum: 15, category: "Refrigerante" },
    { name: "Água Mineral 500ml", current: 12, minimum: 50, category: "Água" }
  ];

  const recentSales = [
    { id: "#001", client: "Cliente Demo 1", amount: "R$ 65,50", items: 6, time: "15:30" },
    { id: "#002", client: "Cliente Demo 2", amount: "R$ 128,90", items: 9, time: "15:15" },
    { id: "#003", client: "Cliente Demo 3", amount: "R$ 42,00", items: 3, time: "14:58" }
  ];

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", active: true },
    { icon: ShoppingCart, label: "Vendas" },
    { icon: Package, label: "Estoque" },
    { icon: Users, label: "Fornecedores" },
    { icon: Calculator, label: "Caixa" },
    { icon: TrendingUp, label: "Relatórios" },
    { icon: Settings, label: "Configurações" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-emerald-800">AdegAÍ</h1>
                <p className="text-xs text-gray-500">Demo - Adega Exemplo</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <div className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg ${
                  item.active 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'text-gray-600'
                }`}>
                  <item.icon className="h-5 w-5" />
                  {sidebarOpen && <span>{item.label}</span>}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* User */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium">Demo User</p>
                <p className="text-xs text-gray-500">Demonstração</p>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h2 className="text-2xl font-bold text-emerald-800">Dashboard - Demonstração</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-amber-600 border-amber-600">
                Modo Demonstração
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => navigate('/register')}>
                Criar Conta
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Estoque Baixo */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <span>Produtos com Estoque Baixo</span>
                  </CardTitle>
                  <CardDescription>
                    Demonstração de produtos que precisam de reposição
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lowStockProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-red-600">{product.current}</p>
                        <p className="text-xs text-gray-500">de {product.minimum}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vendas Recentes */}
            <Card>
              <CardHeader>
                <CardTitle>Vendas Recentes</CardTitle>
                <CardDescription>Demonstração de vendas do dia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSales.map((sale, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{sale.id}</p>
                        <p className="text-sm text-gray-600">{sale.client}</p>
                        <p className="text-xs text-gray-500">{sale.items} itens</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">{sale.amount}</p>
                        <p className="text-xs text-gray-500">{sale.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demo Notice */}
          <div className="mt-8">
            <Card className="bg-gradient-to-r from-emerald-50 to-amber-50 border-emerald-200">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                  Esta é uma demonstração do AdegAÍ
                </h3>
                <p className="text-gray-600 mb-4">
                  Todos os dados mostrados são fictícios para demonstrar as funcionalidades do sistema.
                </p>
                <Button 
                  onClick={() => navigate('/register')}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Criar Minha Conta Agora
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Demo;
