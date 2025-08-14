import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, ShoppingCart, CreditCard, Banknote, Smartphone, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AppSidebar from "@/components/AppSidebar";
import SalesSummary from "@/components/sales/SalesSummary";
import ProductConsultation from "@/components/sales/ProductConsultation";
import { produtoService } from "@/services/produtoService";
import { vendaService } from "@/services/vendaService";
import { Produto } from "../types/backend";

import vendaService from '@/services/vendaService';


interface SaleItem {
  produto: Produto;
  quantidade: number;
  subtotal: number;
}

const Sales = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar produtos
  const { data: produtos = [], isLoading } = useQuery({
    queryKey: ['produtos'],
    queryFn: produtoService.getAll
  });

  // Mutation para criar venda
  const createVendaMutation = useMutation({
    mutationFn: async (vendaData: { total: number; itens: Array<{produto: number, quantidade: number, preco_unitario: number}> }) => {
      const venda = await vendaService.create({ total: vendaData.total });
      
      // Criar itens da venda
      for (const item of vendaData.itens) {
        await vendaService.createItem({
          venda: venda.id!,
          produto: item.produto,
          quantidade: item.quantidade,
          preco_unitario: item.preco_unitario
        });
      }
      
      return venda;
    },
    onSuccess: () => {
      toast({
        title: "Venda finalizada com sucesso!",
        description: "A venda foi registrada no sistema.",
      });
      setSaleItems([]);
      setSelectedPayment("");
      queryClient.invalidateQueries({ queryKey: ['vendas'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao finalizar venda",
        description: error.response?.data?.erro || "Tente novamente",
        variant: "destructive"
      });
    }
  });

  const paymentMethods = [
    { id: "dinheiro", name: "Dinheiro", icon: Banknote },
    { id: "cartao_credito", name: "Cartão de Crédito", icon: CreditCard },
    { id: "cartao_debito", name: "Cartão de Débito", icon: CreditCard },
    { id: "pix", name: "PIX", icon: Smartphone },
    { id: "qr_code", name: "QR Code", icon: QrCode }
  ];

  const totalAmount = saleItems.reduce((sum, item) => sum + item.subtotal, 0);
  const totalItems = saleItems.reduce((sum, item) => sum + item.quantidade, 0);

  const handleBarcodeSearch = () => {
    if (!barcodeInput.trim()) return;

    const produto = produtos.find(p => p.id.toString() === barcodeInput);
    if (produto) {
      handleAddToSale(produto);
      setBarcodeInput("");
    } else {
      toast({
        title: "Produto não encontrado",
        description: "Código não existe no sistema",
        variant: "destructive"
      });
    }
  };

  const handleAddToSale = (produto: Produto) => {
    if (produto.estoque <= 0) {
      toast({
        title: "Produto sem estoque",
        description: "Este produto não possui estoque disponível",
        variant: "destructive"
      });
      return;
    }

    const existingItem = saleItems.find(item => item.produto.id === produto.id);
    
    if (existingItem) {
      if (existingItem.quantidade >= produto.estoque) {
        toast({
          title: "Estoque insuficiente",
          description: "Quantidade máxima atingida",
          variant: "destructive"
        });
        return;
      }
      
      setSaleItems(items =>
        items.map(item =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1, subtotal: (item.quantidade + 1) * produto.preco }
            : item
        )
      );
    } else {
      setSaleItems(items => [...items, {
        produto,
        quantidade: 1,
        subtotal: produto.preco
      }]);
    }
  };

  const handleRemoveFromSale = (produtoId: number) => {
    setSaleItems(items => items.filter(item => item.produto.id !== produtoId));
  };

  const handleUpdateQuantity = (produtoId: number, novaQuantidade: number) => {
    if (novaQuantidade <= 0) {
      handleRemoveFromSale(produtoId);
      return;
    }

    const produto = produtos.find(p => p.id === produtoId);
    if (produto && novaQuantidade > produto.estoque) {
      toast({
        title: "Estoque insuficiente",
        description: `Máximo disponível: ${produto.estoque}`,
        variant: "destructive"
      });
      return;
    }

    setSaleItems(items =>
      items.map(item =>
        item.produto.id === produtoId
          ? { ...item, quantidade: novaQuantidade, subtotal: novaQuantidade * item.produto.preco }
          : item
      )
    );
  };

  const handleFinalizeSale = async () => {
    if (saleItems.length === 0 || !selectedPayment) return;

    const vendaData = {
      total: totalAmount,
      itens: saleItems.map(item => ({
        produto: item.produto.id,
        quantidade: item.quantidade,
        preco_unitario: item.produto.preco
      }))
    };

    createVendaMutation.mutate(vendaData);
  };

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cupom de Venda</title>
          <style>
            body { font-family: monospace; width: 300px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; }
            .item { display: flex; justify-content: space-between; margin: 5px 0; }
            .total { border-top: 1px dashed #000; padding-top: 10px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h3>ADEGAÍ</h3>
            <p>${new Date().toLocaleString()}</p>
          </div>
          ${saleItems.map(item => `
            <div class="item">
              <span>${item.produto.nome} x${item.quantidade}</span>
              <span>R$ ${item.subtotal.toFixed(2)}</span>
            </div>
          `).join('')}
          <div class="total">
            <div class="item">
              <span>TOTAL</span>
              <span>R$ ${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(printContent);
    printWindow?.document.close();
    printWindow?.print();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando produtos...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AppSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-emerald-800">Ponto de Venda</h1>
            <Badge variant="outline" className="text-emerald-600 border-emerald-600">
              {produtos.length} produtos disponíveis
            </Badge>
          </div>
        </header>

        <div className="flex-1 p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Lista de Produtos da Venda */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Produtos da Venda</CardTitle>
                      <CardDescription>
                        Adicione produtos digitando o código ou usando a consulta
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setConsultationOpen(true)}
                        variant="outline"
                        size="sm"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Consultar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Busca por código */}
                  <div className="flex space-x-2 mb-6">
                    <Input
                      placeholder="Digite o código do produto..."
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleBarcodeSearch()}
                      className="flex-1"
                    />
                    <Button onClick={handleBarcodeSearch}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Lista de itens */}
                  <div className="space-y-4">
                    {saleItems.map((item) => (
                      <div key={item.produto.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.produto.nome}</h4>
                          <p className="text-sm text-gray-600">
                            R$ {item.produto.preco.toFixed(2)} cada
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateQuantity(item.produto.id, item.quantidade - 1)}
                            >
                              -
                            </Button>
                            <span className="w-12 text-center">{item.quantidade}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateQuantity(item.produto.id, item.quantidade + 1)}
                            >
                              +
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">R$ {item.subtotal.toFixed(2)}</p>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemoveFromSale(item.produto.id)}
                            >
                              Remover
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {saleItems.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Nenhum produto adicionado</p>
                        <p className="text-sm">Digite um código ou use a consulta para adicionar produtos</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumo da Venda */}
            <SalesSummary
              totalAmount={totalAmount}
              totalItems={totalItems}
              paymentMethods={paymentMethods}
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
              onFinalizeSale={handleFinalizeSale}
              onPrint={handlePrint}
              hasItems={saleItems.length > 0}
            />
          </div>
        </div>
      </div>

      {/* Consulta de Produtos */}
      {consultationOpen && (
        <ProductConsultation
          isOpen={consultationOpen}
          onClose={() => setConsultationOpen(false)}
          products={produtos.map(p => ({
            id: p.id.toString(),
            name: p.nome,
            price: p.preco,
            barcode: p.id.toString(),
            category: "Geral",
            stock: p.estoque
          }))}
          onAddToSale={(product) => {
            const produto = produtos.find(p => p.id.toString() === product.id);
            if (produto) handleAddToSale(produto);
          }}
        />
      )}
    </div>
  );
};

export default Sales;