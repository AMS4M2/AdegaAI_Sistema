import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Settings as SettingsIcon,
  User,
  LogOut,
  Menu,
  Bell,
  Store,
  Printer,
  Smartphone,
  Mail,
  Lock,
  CreditCard
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import empresaService from '@/services/empresaService';


const Settings = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [storeData, setStoreData] = useState({
    name: "Adega do João",
    cnpj: "12.345.678/0001-90",
    address: "Rua das Flores, 123 - Centro",
    phone: "(11) 99999-9999",
    email: "contato@adegadojoao.com"
  });

  const [notifications, setNotifications] = useState({
    lowStock: true,
    sales: false,
    reports: true,
    email: true
  });

  const menuItems = [
    { icon: Package, label: "Dashboard", path: "/dashboard" },
    { icon: Package, label: "Vendas", path: "/sales" },
    { icon: Package, label: "Estoque", path: "/stock" },
    { icon: Package, label: "Fornecedores", path: "/suppliers" },
    { icon: Package, label: "Caixa", path: "/cashier" },
    { icon: Package, label: "Relatórios", path: "/reports" },
    { icon: SettingsIcon, label: "Configurações", active: true }
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
                <p className="text-xs text-gray-500">Adega do João</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button 
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    item.active 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => item.path && navigate(item.path)}
                >
                  <item.icon className="h-5 w-5" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
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
                <p className="text-sm font-medium">João Silva</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
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
              <h2 className="text-2xl font-bold text-emerald-800">Configurações</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                Plano Profissional
              </Badge>
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <Tabs defaultValue="store" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="store">Loja</TabsTrigger>
              <TabsTrigger value="user">Usuário</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
              <TabsTrigger value="integrations">Integrações</TabsTrigger>
              <TabsTrigger value="plan">Plano</TabsTrigger>
            </TabsList>

            <TabsContent value="store" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Store className="h-5 w-5" />
                    <span>Dados da Loja</span>
                  </CardTitle>
                  <CardDescription>
                    Informações básicas do seu estabelecimento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="storeName">Nome da Loja</Label>
                      <Input
                        id="storeName"
                        value={storeData.name}
                        onChange={(e) => setStoreData({...storeData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        value={storeData.cnpj}
                        onChange={(e) => setStoreData({...storeData, cnpj: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Textarea
                      id="address"
                      value={storeData.address}
                      onChange={(e) => setStoreData({...storeData, address: e.target.value})}
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={storeData.phone}
                        onChange={(e) => setStoreData({...storeData, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={storeData.email}
                        onChange={(e) => setStoreData({...storeData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Salvar Alterações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="user" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Perfil do Usuário</span>
                  </CardTitle>
                  <CardDescription>
                    Suas informações pessoais e de acesso
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="userName">Nome Completo</Label>
                      <Input id="userName" defaultValue="João Silva" />
                    </div>
                    <div>
                      <Label htmlFor="userEmail">Email</Label>
                      <Input id="userEmail" type="email" defaultValue="joao@email.com" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input id="currentPassword" type="password" placeholder="Digite sua senha atual" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newPassword">Nova Senha</Label>
                      <Input id="newPassword" type="password" placeholder="Nova senha" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                      <Input id="confirmPassword" type="password" placeholder="Confirme a nova senha" />
                    </div>
                  </div>
                  
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Atualizar Perfil
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notificações</span>
                  </CardTitle>
                  <CardDescription>
                    Configure como você quer receber alertas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="lowStock">Alerta de Estoque Baixo</Label>
                      <p className="text-sm text-gray-600">Receber notificação quando produtos estiverem com estoque baixo</p>
                    </div>
                    <Switch
                      id="lowStock"
                      checked={notifications.lowStock}
                      onCheckedChange={(checked) => setNotifications({...notifications, lowStock: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sales">Relatório de Vendas</Label>
                      <p className="text-sm text-gray-600">Receber resumo diário de vendas</p>
                    </div>
                    <Switch
                      id="sales"
                      checked={notifications.sales}
                      onCheckedChange={(checked) => setNotifications({...notifications, sales: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="reports">Relatórios Semanais</Label>
                      <p className="text-sm text-gray-600">Receber relatórios semanais por email</p>
                    </div>
                    <Switch
                      id="reports"
                      checked={notifications.reports}
                      onCheckedChange={(checked) => setNotifications({...notifications, reports: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email">Notificações por Email</Label>
                      <p className="text-sm text-gray-600">Receber todas as notificações por email</p>
                    </div>
                    <Switch
                      id="email"
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Smartphone className="h-5 w-5" />
                    <span>Integrações</span>
                  </CardTitle>
                  <CardDescription>
                    Conecte ferramentas externas ao seu sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Printer className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Impressora Fiscal</h4>
                        <p className="text-sm text-gray-600">Conectar impressora para cupons fiscais</p>
                      </div>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-8 w-8 text-green-600" />
                      <div>
                        <h4 className="font-medium">Máquina de Cartão</h4>
                        <p className="text-sm text-gray-600">Integração com terminal de pagamento</p>
                      </div>
                    </div>
                    <Button variant="outline">Conectar</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-8 w-8 text-purple-600" />
                      <div>
                        <h4 className="font-medium">Email Marketing</h4>
                        <p className="text-sm text-gray-600">Enviar promoções para clientes</p>
                      </div>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="plan" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Plano Atual</CardTitle>
                  <CardDescription>
                    Você está no plano Profissional
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <h3 className="font-semibold text-emerald-800">Plano Profissional</h3>
                      <p className="text-emerald-600">R$ 49,90/mês</p>
                      <ul className="text-sm text-emerald-700 mt-2 space-y-1">
                        <li>✓ Vendas ilimitadas</li>
                        <li>✓ Controle de estoque</li>
                        <li>✓ Relatórios avançados</li>
                        <li>✓ Suporte prioritário</li>
                      </ul>
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        Renovar Plano
                      </Button>
                      <Button variant="outline">
                        Alterar Plano
                      </Button>
                    </div>
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

export default Settings;