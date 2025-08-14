import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, UserPlus, Edit, Trash2, Shield } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import { useToast } from "@/hooks/use-toast";

import usuarioService from '@/services/usuarioService';


// Mock data for initial development
const mockEmployees = [
  { id: 1, name: "João Silva", email: "joao@adegai.com", cargo: "gerente", permissions: ["vendas", "estoque", "relatorios", "configuracoes"] },
  { id: 2, name: "Maria Oliveira", email: "maria@adegai.com", cargo: "vendedor", permissions: ["vendas"] },
  { id: 3, name: "Pedro Santos", email: "pedro@adegai.com", cargo: "estoquista", permissions: ["estoque"] },
];

// Available permissions
const availablePermissions = [
  { id: "vendas", name: "Vendas" },
  { id: "estoque", name: "Estoque" },
  { id: "fornecedores", name: "Fornecedores" },
  { id: "caixa", name: "Caixa" },
  { id: "relatorios", name: "Relatórios" },
  { id: "configuracoes", name: "Configurações" },
  { id: "funcionarios", name: "Funcionários" },
];

// Available roles
const availableRoles = [
  { id: "dono", name: "Dono" },
  { id: "gerente", name: "Gerente" },
  { id: "vendedor", name: "Vendedor" },
  { id: "estoquista", name: "Estoquista" },
  { id: "caixa", name: "Caixa" },
];

const Employees = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [employees, setEmployees] = useState(mockEmployees);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("list");
  const { toast } = useToast();

  // Form data for adding/editing employee
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cargo: "",
  });

  // Selected permissions for the permissions modal
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, cargo: value }));
  };

  const handlePermissionChange = (permission: string) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permission)) {
        return prev.filter((p) => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };

  const handleAddEmployee = () => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro ao adicionar funcionário",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would be an API call
    const newEmployee = {
      id: employees.length + 1,
      name: formData.name,
      email: formData.email,
      cargo: formData.cargo,
      permissions: ["vendas"], // Default permission
    };

    setEmployees((prev) => [...prev, newEmployee]);
    setIsAddEmployeeOpen(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      cargo: "",
    });

    toast({
      title: "Funcionário adicionado com sucesso!",
    });
  };

  const openPermissionsModal = (employee: any) => {
    setSelectedEmployee(employee);
    setSelectedPermissions(employee.permissions);
    setIsPermissionsOpen(true);
  };

  const handleUpdatePermissions = () => {
    // In a real app, this would be an API call
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === selectedEmployee.id
          ? { ...emp, permissions: selectedPermissions }
          : emp
      )
    );
    setIsPermissionsOpen(false);
    
    toast({
      title: "Permissões atualizadas com sucesso!",
    });
  };

  const handleDeleteEmployee = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este funcionário?")) {
      // In a real app, this would be an API call
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      
      toast({
        title: "Funcionário excluído com sucesso!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AppSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-800">Funcionários</h1>
            <Button 
              onClick={() => setIsAddEmployeeOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Funcionário
            </Button>
          </div>
        </header>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="list">Lista de Funcionários</TabsTrigger>
              <TabsTrigger value="permissions">Permissões</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <Card>
                <CardHeader>
                  <CardTitle>Funcionários</CardTitle>
                  <CardDescription>
                    Gerencie os funcionários da sua adega
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Cargo</TableHead>
                        <TableHead>Permissões</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">{employee.name}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {employee.cargo}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {employee.permissions.map((permission) => (
                                <Badge 
                                  key={permission} 
                                  variant="secondary" 
                                  className="bg-blue-100 text-blue-800 text-xs"
                                >
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => openPermissionsModal(employee)}
                              >
                                <Shield className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon"
                              >
                                <Edit className="h-4 w-4 text-amber-600" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleDeleteEmployee(employee.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="permissions">
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Permissões</CardTitle>
                  <CardDescription>
                    Configure quais módulos cada funcionário pode acessar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="font-medium text-blue-800 mb-2">Sobre as permissões</h3>
                      <p className="text-sm text-blue-700">
                        As permissões controlam quais módulos do sistema cada funcionário pode acessar.
                        Funcionários sem permissão para um módulo não verão o item no menu lateral e não poderão
                        acessar as páginas correspondentes.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg mb-4">Permissões por cargo</h3>
                      
                      <div className="space-y-6">
                        {availableRoles.map((role) => (
                          <div key={role.id} className="border p-4 rounded-lg">
                            <h4 className="font-medium mb-2 flex items-center">
                              <Badge className="mr-2 bg-blue-600">{role.name}</Badge>
                              {role.id === "dono" && <span className="text-sm text-gray-500">(Acesso total, não editável)</span>}
                            </h4>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {availablePermissions.map((permission) => (
                                <div 
                                  key={permission.id} 
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox 
                                    id={`${role.id}-${permission.id}`} 
                                    checked={role.id === "dono" || role.id === "gerente"} 
                                    disabled={role.id === "dono"}
                                  />
                                  <label 
                                    htmlFor={`${role.id}-${permission.id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {permission.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modal para adicionar funcionário */}
      <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Funcionário</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Select 
                  value={formData.cargo} 
                  onValueChange={handleRoleChange}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.slice(1).map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>
              Cancelar
            </Button>
            <Button 
              type="button" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAddEmployee}
            >
              Adicionar Funcionário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para gerenciar permissões */}
      <Dialog open={isPermissionsOpen} onOpenChange={setIsPermissionsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Permissões - {selectedEmployee?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <Badge className="mb-4">{selectedEmployee?.cargo}</Badge>
              <p className="text-sm text-gray-600">
                Selecione quais módulos este funcionário pode acessar:
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {availablePermissions.map((permission) => (
                <div 
                  key={permission.id} 
                  className="flex items-center space-x-2"
                >
                  <Checkbox 
                    id={`perm-${permission.id}`} 
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={() => handlePermissionChange(permission.id)}
                  />
                  <label 
                    htmlFor={`perm-${permission.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {permission.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsPermissionsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              type="button" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleUpdatePermissions}
            >
              Salvar Permissões
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Employees;