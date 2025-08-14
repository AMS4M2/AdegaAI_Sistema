import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  Phone,
  Mail,
  Building,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import AppSidebar from "@/components/AppSidebar";
import { fornecedorService } from "@/services/fornecedorService";
import { Fornecedor } from "@/types/backend";

import fornecedorService from '@/services/fornecedorService';


const Suppliers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    contato: "",
    email: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar fornecedores
  const { data: fornecedores = [], isLoading } = useQuery({
    queryKey: ['fornecedores'],
    queryFn: fornecedorService.getAll
  });

  // Mutations para CRUD
  const createFornecedorMutation = useMutation({
    mutationFn: (fornecedor: Omit<Fornecedor, 'id'>) => fornecedorService.create(fornecedor),
    onSuccess: () => {
      toast({
        title: "Fornecedor criado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar fornecedor",
        description: error.response?.data?.detail || "Tente novamente",
        variant: "destructive"
      });
    }
  });

  const updateFornecedorMutation = useMutation({
    mutationFn: ({ id, fornecedor }: { id: number; fornecedor: Partial<Fornecedor> }) =>
      fornecedorService.update(id, fornecedor),
    onSuccess: () => {
      toast({
        title: "Fornecedor atualizado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar fornecedor",
        description: error.response?.data?.detail || "Tente novamente",
        variant: "destructive"
      });
    }
  });

  const deleteFornecedorMutation = useMutation({
    mutationFn: fornecedorService.delete,
    onSuccess: () => {
      toast({
        title: "Fornecedor excluído com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir fornecedor",
        description: error.response?.data?.detail || "Tente novamente",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({ nome: "", contato: "", email: "" });
    setIsEditing(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      updateFornecedorMutation.mutate({ id: isEditing, fornecedor: formData });
    } else {
      // Adicionar empresa padrão (será ajustado pelo backend)
      createFornecedorMutation.mutate({ ...formData, empresa: 1 });
    }
  };

  const handleEdit = (fornecedor: Fornecedor) => {
    setFormData({
      nome: fornecedor.nome,
      contato: fornecedor.contato || "",
      email: fornecedor.email || ""
    });
    setIsEditing(fornecedor.id);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este fornecedor?")) {
      deleteFornecedorMutation.mutate(id);
    }
  };

  const filteredFornecedores = fornecedores.filter(fornecedor =>
    fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando fornecedores...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AppSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-green-800">Fornecedores</h2>
            <Badge variant="outline" className="text-green-600 border-green-600">
              {fornecedores.length} fornecedores
            </Badge>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Formulário */}
            <Card>
              <CardHeader>
                <CardTitle>{isEditing ? "Editar Fornecedor" : "Novo Fornecedor"}</CardTitle>
                <CardDescription>
                  {isEditing ? "Atualize os dados do fornecedor" : "Cadastre um novo fornecedor"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contato">Telefone</Label>
                    <Input
                      id="contato"
                      value={formData.contato}
                      onChange={(e) => setFormData({...formData, contato: e.target.value})}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    {isEditing ? "Atualizar" : "Cadastrar"} Fornecedor
                  </Button>
                  
                  {isEditing && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={resetForm}
                    >
                      Cancelar
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Lista de Fornecedores */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lista de Fornecedores</CardTitle>
                    <CardDescription>
                      {filteredFornecedores.length} fornecedores encontrados
                    </CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar fornecedores..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFornecedores.map((fornecedor) => (
                    <div key={fornecedor.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{fornecedor.nome}</h3>
                          
                          {fornecedor.contato && (
                            <p className="text-sm text-gray-600 mb-1">
                              <Phone className="inline h-4 w-4 mr-1" />
                              {fornecedor.contato}
                            </p>
                          )}
                          
                          {fornecedor.email && (
                            <p className="text-sm text-gray-600">
                              <Mail className="inline h-4 w-4 mr-1" />
                              {fornecedor.email}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(fornecedor)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(fornecedor.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredFornecedores.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhum fornecedor encontrado</p>
                      <p className="text-sm">
                        {searchTerm ? "Tente uma busca diferente" : "Cadastre seu primeiro fornecedor"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Suppliers;