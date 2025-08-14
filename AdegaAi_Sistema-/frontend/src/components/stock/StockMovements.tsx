
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUp, ArrowDown, Search } from "lucide-react";
import { StockMovement, Product } from "@/types/stock";

interface StockMovementsProps {
  movements: StockMovement[];
  products: Product[];
}

const StockMovements = ({ movements, products }: StockMovementsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.produto_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.motivo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || movement.tipo === typeFilter;
    return matchesSearch && matchesType;
  });

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Movimentações</CardTitle>
          <CardDescription>
            Acompanhe todas as entradas e saídas de estoque
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar por produto ou motivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="entrada">Entradas</SelectItem>
                <SelectItem value="saida">Saídas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Motivo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.map((movement) => {
                  const { date, time } = formatDateTime(movement.data);
                  return (
                    <TableRow key={movement.id}>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{date}</p>
                          <p className="text-gray-600">{time}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{movement.produto_nome}</span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={movement.tipo === 'entrada' ? 'default' : 'destructive'}
                          className="flex items-center space-x-1 w-fit"
                        >
                          {movement.tipo === 'entrada' ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )}
                          <span>{movement.tipo === 'entrada' ? 'Entrada' : 'Saída'}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${
                          movement.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {movement.tipo === 'entrada' ? '+' : '-'}{movement.quantidade}
                        </span>
                      </TableCell>
                      <TableCell>
                        {movement.motivo}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {filteredMovements.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma movimentação encontrada</p>
                <p className="text-sm">Tente ajustar os filtros de busca</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockMovements;
