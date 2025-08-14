import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import AppSidebar from "@/components/AppSidebar";
import { produtoService } from "@/services/produtoService";
import { Produto } from "../types/backend";
import AddProductForm from "@/components/stock/AddProductForm";

import estoqueService from '@/services/estoqueService';


const Stock = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar produtos
  const { data: produtos = [], isLoading, refetch } = useQuery({
    queryKey: ['produtos'],
    queryFn: produtoService.getAll
  });

  // Mutations para CRUD de produtos
  const createProdutoMutation = useMutation({
    mutationFn: produtoService.create,
    onSuccess: () => {
      toast({
        title: "Produto criado com sucesso!",
        description: "O produto foi adicionado ao estoque.",
      });
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar produto",
        description: error.response?.data?.erro || "Tente novamente",
        variant: "destructive"
      });
    }
  });

  const updateProdutoMutation = useMutation({
    mutationFn: ({ id, produto }: { id: number; produto: Partial<Produto> }) =>
      produtoService.update(id, produto),
    onSuccess: () => {
      toast({
        title: "Produto atualizado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar produto",
        description: error.response?.data?.erro || "Tente novamente",
        variant: "destructive"
      });
    }
  });

  const deleteProdutoMutation = useMutation({
    mutationFn: produtoService.delete,
    onSuccess: () => {
      toast({
        title: "Produto excluído com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir produto",
        description: error.response?.data?.erro || "Tente novamente",
        variant: "destructive"
      });
    }
  });

  // Produtos com estoque baixo (menos de 10)
  const lowStockProducts = produtos.filter(produto => produto.estoque < 10);

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      await deleteProdutoMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando estoque...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AppSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-green-800">Gestão de Estoque</h1>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setIsAddProductOpen(true)} 
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar produto
              </Button>
              <Badge variant="outline" className="text-green-600 border-green-600">
                {produtos.length} produtos
              </Badge>
              {lowStockProducts.length > 0 && (
                <Badge variant="destructive">
                  {lowStockProducts.length} em estoque baixo
                </Badge>
              )}
            </div>
          </div>
        </header>

        <div className="p-6">
          {lowStockProducts.length > 0 && (
            <Alert className="mb-6 border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>{lowStockProducts.length} produtos</strong> estão com estoque baixo (menos de 10 unidades):
                <span className="ml-2">
                  {lowStockProducts.map(p => p.nome).join(", ")}
                </span>
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Lista de Produtos</CardTitle>
              <CardDescription>
                Produtos cadastrados no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {produtos.map((produto) => (
                  <div 
                    key={produto.id} 
                    className={`border rounded-lg p-4 ${produto.estoque < 10 ? 'bg-red-50 border-red-200' : 'bg-white'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{produto.nome}</h3>
                          {produto.estoque < 10 && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Preço</p>
                            <p className="font-medium text-green-600">R$ {produto.preco.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Estoque</p>
                            <p className={`font-medium ${produto.estoque < 10 ? 'text-red-600' : 'text-green-600'}`}>
                              {produto.estoque} unidades
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">ID</p>
                            <p className="font-medium">{produto.id}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // Implementar edição de produto
                          }}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteProduct(produto.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {produtos.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p>Nenhum produto cadastrado</p>
                    <p className="text-sm">Clique em "Cadastrar produto" para adicionar itens ao estoque</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Formulário de Adição de Produto */}
      <AddProductForm 
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onProductAdded={() => refetch()}
      />
    </div>
  );
};

export default Stock;