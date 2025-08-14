import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Package, 
  Plus,
  Trash2,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  Bell,
  Building
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import compraService from '@/services/compraService';


interface PurchaseItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const Purchase = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [currentItem, setCurrentItem] = useState({
    productName: '',
    quantity: 0,
    unitPrice: 0
  });

  const suppliers = [
    { id: '1', name: 'Distribuidora Central' },
    { id: '2', name: 'Bebidas & Cia' },
    { id: '3', name: 'Fornecedor ABC' }
  ];

  const addItem = () => {
    if (currentItem.productName && currentItem.quantity > 0 && currentItem.unitPrice > 0) {
      const newItem: PurchaseItem = {
        id: Date.now().toString(),
        productName: currentItem.productName,
        quantity: currentItem.quantity,
        unitPrice: currentItem.unitPrice,
        total: currentItem.quantity * currentItem.unitPrice
      };
      
      setPurchaseItems([...purchaseItems, newItem]);
      setCurrentItem({
        productName: '',
        quantity: 0,
        unitPrice: 0
      });
    }
  };

  const removeItem = (id: string) => {
    setPurchaseItems(purchaseItems.filter(item => item.id !== id));
  };

  const totalPurchase = purchaseItems.reduce((sum, item) => sum + item.total, 0);

  const handleFinalizePurchase = () => {
    if (purchaseItems.length > 0 && selectedSupplier) {
      console.log('Compra finalizada:', {
        supplier: selectedSupplier,
        items: purchaseItems,
        total: totalPurchase
      });
      
      // Reset form
      setPurchaseItems([]);
      setSelectedSupplier('');
      alert('Compra registrada com sucesso!');
    }
  };

  const menuItems = [
    { icon: Package, label: "Dashboard", path: "/dashboard" },
    { icon: Package, label: "Vendas", path: "/sales" },
    { icon: Package, label: "Estoque", path: "/stock" },
    { icon: Building, label: "Fornecedores", path: "/suppliers" },
    { icon: Package, label: "Caixa", path: "/cashier" },
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
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-100`}
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
              <h2 className="text-2xl font-bold text-emerald-800">Registro de Compra</h2>
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
            {/* Formulário de Item */}
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Item</CardTitle>
                <CardDescription>
                  Adicione produtos à sua compra
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="supplier">Fornecedor</Label>
                  <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o fornecedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="productName">Nome do Produto</Label>
                  <Input
                    id="productName"
                    value={currentItem.productName}
                    onChange={(e) => setCurrentItem({...currentItem, productName: e.target.value})}
                    placeholder="Digite o nome do produto"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantidade</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={currentItem.quantity || ''}
                      onChange={(e) => setCurrentItem({...currentItem, quantity: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="unitPrice">Preço Unitário (R$)</Label>
                    <Input
                      id="unitPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={currentItem.unitPrice || ''}
                      onChange={(e) => setCurrentItem({...currentItem, unitPrice: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>

                {currentItem.quantity > 0 && currentItem.unitPrice > 0 && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total do item:</p>
                    <p className="text-lg font-bold text-emerald-600">
                      R$ {(currentItem.quantity * currentItem.unitPrice).toFixed(2)}
                    </p>
                  </div>
                )}

                <Button 
                  onClick={addItem}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={!currentItem.productName || currentItem.quantity <= 0 || currentItem.unitPrice <= 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Item
                </Button>
              </CardContent>
            </Card>

            {/* Lista de Itens */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Itens da Compra</CardTitle>
                    <CardDescription>
                      {purchaseItems.length} itens adicionados
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      R$ {totalPurchase.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {purchaseItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum item adicionado ainda</p>
                    <p className="text-sm">Adicione produtos usando o formulário ao lado</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {purchaseItems.map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-sm text-gray-600">
                            {item.quantity} unidades × R$ {item.unitPrice.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-bold text-emerald-600">
                              R$ {item.total.toFixed(2)}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="pt-4 border-t">
                      <Button 
                        onClick={handleFinalizePurchase}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        disabled={purchaseItems.length === 0 || !selectedSupplier}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Finalizar Compra - R$ {totalPurchase.toFixed(2)}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Purchase;