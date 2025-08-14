
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Archive } from "lucide-react";
import { Category } from "@/types/stock";

interface CategoryManagerProps {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
}

const CategoryManager = ({ categories, setCategories }: CategoryManagerProps) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
        nome_categoria: newCategoryName,
        status: 'ativo'
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.nome_categoria);
  };

  const handleSaveEdit = () => {
    if (editingName.trim() && editingId) {
      setCategories(categories.map(c => 
        c.id === editingId 
          ? { ...c, nome_categoria: editingName }
          : c
      ));
      setEditingId(null);
      setEditingName("");
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      setCategories(categories.filter(c => c.id !== categoryId));
    }
  };

  const handleArchiveCategory = (categoryId: string) => {
    setCategories(categories.map(c => 
      c.id === categoryId 
        ? { ...c, status: c.status === 'ativo' ? 'arquivado' : 'ativo' }
        : c
    ));
  };

  return (
    <div className="space-y-6">
      {/* Adicionar Nova Categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Nova Categoria</CardTitle>
          <CardDescription>
            Adicione uma nova categoria de produtos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="new-category">Nome da Categoria</Label>
              <Input
                id="new-category"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Ex: Bebidas, Snacks, Laticínios..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleAddCategory} 
                disabled={!newCategoryName.trim()}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Categorias */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias Existentes</CardTitle>
          <CardDescription>
            Gerencie as categorias de produtos da sua adega
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    {editingId === category.id ? (
                      <div className="flex space-x-2">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={handleSaveEdit}>
                          Salvar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setEditingId(null);
                            setEditingName("");
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <span className="font-medium">{category.nome_categoria}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={category.status === 'ativo' ? 'default' : 'secondary'}
                    >
                      {category.status === 'ativo' ? 'Ativo' : 'Arquivado'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditCategory(category)}
                        disabled={editingId === category.id}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleArchiveCategory(category.id)}
                      >
                        <Archive className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {categories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma categoria cadastrada</p>
              <p className="text-sm">Adicione sua primeira categoria acima</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryManager;
