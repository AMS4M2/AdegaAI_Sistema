import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Package, 
  DollarSign,
  TrendingUp,
  Calculator,
  CreditCard,
  Banknote,
  User,
  LogOut,
  Menu,
  Bell,
  Lock,
  Unlock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import vendaService from '@/services/vendaService';


const Cashier = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cashierStatus, setCashierStatus] = useState<'closed' | 'open'>('closed');
  const [openingAmount, setOpeningAmount] = useState('');
  const [closingAmount, setClosingAmount] = useState('');

  // Dados simulados do dia
  const todayData = {
    sales: 2450.00,
    transactions: 24,
    cardPayments: 1650.00,
    cashPayments: 800.00,
    expenses: 150.00
  };

  const recentTransactions = [
    { id: 1, type: 'sale', description: 'Venda #001', amount: 89.50, method: 'card', time: '14:32' },
    { id: 2, type: 'sale', description: 'Venda #002', amount: 156.80, method: 'cash', time: '14:15' },
    { id: 3, type: 'expense', description: 'Troco inicial', amount: -50.00, method: 'cash', time: '09:00' },
  ];

  const handleOpenCashier = () => {
    if (openingAmount) {
      setCashierStatus('open');
      console.log(`Caixa aberto com R$ ${openingAmount}`);
    }
  };

  const handleCloseCashier = () => {
    if (closingAmount) {
      setCashierStatus('closed');
      console.log(`Caixa fechado com R$ ${closingAmount}`);
    }
  };

  const menuItems = [
    { icon: Package, label: "Dashboard", path: "/dashboard" },
    { icon: Package, label: "Vendas", path: "/sales" },
    { icon: Package, label: "Estoque", path: "/stock" },
    { icon: Package, label: "Fornecedores", path: "/suppliers" },
    { icon: Calculator, label: "Caixa", active: true },
    { icon: Package, label: "Relatórios", path: "/reports" },
    { icon: Package, label: "Configurações", path: "/settings" }
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
              <h2 className="text-2xl font-bold text-emerald-800">Controle de Caixa</h2>
              <Badge variant={cashierStatus === 'open' ? 'default' : 'secondary'}>
                {cashierStatus === 'open' ? 'Aberto' : 'Fechado'}
              </Badge>
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
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Status do Caixa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {cashierStatus === 'open' ? (
                    <Unlock className="h-5 w-5 text-green-600" />
                  ) : (
                    <Lock className="h-5 w-5 text-red-600" />
                  )}
                  <span>Status do Caixa</span>
                </CardTitle>
                <CardDescription>
                  {cashierStatus === 'open' ? 'Caixa está aberto para vendas' : 'Abra o caixa para iniciar as vendas'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cashierStatus === 'closed' ? (
                  <div>
                    <Label htmlFor="opening">Valor de Abertura (R$)</Label>
                    <Input
                      id="opening"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={openingAmount}
                      onChange={(e) => setOpeningAmount(e.target.value)}
                    />
                    <Button 
                      className="w-full mt-4 bg-green-600 hover:bg-green-700"
                      onClick={handleOpenCashier}
                      disabled={!openingAmount}
                    >
                      <Unlock className="h-4 w-4 mr-2" />
                      Abrir Caixa
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="closing">Valor de Fechamento (R$)</Label>
                    <Input
                      id="closing"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={closingAmount}
                      onChange={(e) => setClosingAmount(e.target.value)}
                    />
                    <Button 
                      className="w-full mt-4 bg-red-600 hover:bg-red-700"
                      onClick={handleCloseCashier}
                      disabled={!closingAmount}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Fechar Caixa
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resumo do Dia */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Resumo do Dia</CardTitle>
                <CardDescription>
                  Movimentação financeira de hoje
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">
                      R$ {todayData.sales.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">Total de Vendas</p>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">
                      {todayData.transactions}
                    </p>
                    <p className="text-sm text-gray-600">Transações</p>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <CreditCard className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">
                      R$ {todayData.cardPayments.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">Cartão</p>
                  </div>
                  
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <Banknote className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-amber-600">
                      R$ {todayData.cashPayments.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">Dinheiro</p>
                  </div>
                </div>

                {/* Últimas Transações */}
                <div>
                  <h3 className="font-semibold mb-4">Últimas Transações</h3>
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            transaction.type === 'sale' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {transaction.type === 'sale' ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <DollarSign className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-500">
                              {transaction.method === 'card' ? 'Cartão' : 'Dinheiro'} • {transaction.time}
                            </p>
                          </div>
                        </div>
                        <p className={`font-bold ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}R$ {Math.abs(transaction.amount).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Cashier;