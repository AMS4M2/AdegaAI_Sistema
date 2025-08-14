
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileUp, Download, CheckCircle, AlertCircle } from "lucide-react";
import { Product, Category } from "@/types/stock";

interface ImportCSVProps {
  categories: Category[];
  onImport: (products: Omit<Product, 'id'>[]) => void;
  onClose: () => void;
}

const ImportCSV = ({ categories, onImport, onClose }: ImportCSVProps) => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [parsedProducts, setParsedProducts] = useState<Omit<Product, 'id'>[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const csvTemplate = `nome,marca,categoria,volume,preco_venda,preco_compra,quantidade_em_estoque,estoque_minimo,codigo_barras,validade,lote
Skol Lata,Ambev,cerveja,350ml,4.50,2.80,100,50,7891234567890,2024-12-31,L001
Coca-Cola,Coca-Cola,refrigerante,2L,8.90,5.20,50,20,7891234567891,2024-11-30,L002`;

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_produtos.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const requiredFields = ['nome', 'marca', 'categoria', 'preco_venda', 'preco_compra', 'quantidade_em_estoque', 'estoque_minimo', 'codigo_barras'];
    const missingFields = requiredFields.filter(field => !headers.includes(field));
    
    if (missingFields.length > 0) {
      setErrors([`Campos obrigatórios ausentes: ${missingFields.join(', ')}`]);
      return;
    }

    const data = [];
    const products = [];
    const newErrors = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      data.push(row);

      // Validar dados
      const rowErrors = [];
      
      if (!row.nome) rowErrors.push(`Linha ${i + 1}: Nome é obrigatório`);
      if (!row.marca) rowErrors.push(`Linha ${i + 1}: Marca é obrigatória`);
      if (!row.categoria) rowErrors.push(`Linha ${i + 1}: Categoria é obrigatória`);
      if (!row.codigo_barras) rowErrors.push(`Linha ${i + 1}: Código de barras é obrigatório`);
      
      const preco_venda = parseFloat(row.preco_venda);
      const preco_compra = parseFloat(row.preco_compra);
      const quantidade_em_estoque = parseInt(row.quantidade_em_estoque);
      const estoque_minimo = parseInt(row.estoque_minimo);
      
      if (isNaN(preco_venda) || preco_venda <= 0) {
        rowErrors.push(`Linha ${i + 1}: Preço de venda deve ser um número maior que zero`);
      }
      if (isNaN(preco_compra) || preco_compra <= 0) {
        rowErrors.push(`Linha ${i + 1}: Preço de compra deve ser um número maior que zero`);
      }
      if (isNaN(quantidade_em_estoque) || quantidade_em_estoque < 0) {
        rowErrors.push(`Linha ${i + 1}: Quantidade em estoque deve ser um número maior ou igual a zero`);
      }
      if (isNaN(estoque_minimo) || estoque_minimo < 0) {
        rowErrors.push(`Linha ${i + 1}: Estoque mínimo deve ser um número maior ou igual a zero`);
      }

      // Verificar se categoria existe
      const categoryExists = categories.some(c => c.id === row.categoria);
      if (!categoryExists) {
        rowErrors.push(`Linha ${i + 1}: Categoria "${row.categoria}" não existe`);
      }

      if (rowErrors.length === 0) {
        const product: Omit<Product, 'id'> = {
          nome: row.nome,
          marca: row.marca,
          categoria: row.categoria,
          volume: row.volume || '',
          preco_venda,
          preco_compra,
          quantidade_em_estoque,
          estoque_minimo,
          validade: row.validade || undefined,
          lote: row.lote || undefined,
          codigo_barras: row.codigo_barras
        };
        products.push(product);
      } else {
        newErrors.push(...rowErrors);
      }
    }

    setCsvData(data);
    setParsedProducts(products);
    setErrors(newErrors);
  };

  const handleImport = () => {
    if (parsedProducts.length > 0 && errors.length === 0) {
      onImport(parsedProducts);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Produtos via CSV</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Baixar Template</h3>
                  <p className="text-sm text-gray-600">
                    Baixe o arquivo modelo para facilitar a importação
                  </p>
                </div>
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Template CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upload de Arquivo */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Label htmlFor="csv-file">Selecionar Arquivo CSV</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                />
                <p className="text-sm text-gray-600">
                  Formatos aceitos: CSV. Campos obrigatórios: nome, marca, categoria, preco_venda, preco_compra, quantidade_em_estoque, estoque_minimo, codigo_barras
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Categorias Disponíveis */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-3">Categorias Disponíveis</h3>
              <div className="flex flex-wrap gap-2">
                {categories.filter(c => c.status === 'ativo').map((category) => (
                  <Badge key={category.id} variant="outline">
                    {category.id} ({category.nome_categoria})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Erros */}
          {errors.length > 0 && (
            <Card className="border-red-200">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <h3 className="font-medium text-red-700">Erros Encontrados</h3>
                </div>
                <div className="space-y-1">
                  {errors.map((error, index) => (
                    <p key={index} className="text-sm text-red-600">
                      {error}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preview dos Produtos */}
          {parsedProducts.length > 0 && (
            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium text-green-700">
                    {parsedProducts.length} produtos prontos para importação
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Marca</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Preço Venda</TableHead>
                        <TableHead>Estoque</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedProducts.slice(0, 5).map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{product.nome}</TableCell>
                          <TableCell>{product.marca}</TableCell>
                          <TableCell>{product.categoria}</TableCell>
                          <TableCell>R$ {product.preco_venda.toFixed(2)}</TableCell>
                          <TableCell>{product.quantidade_em_estoque}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {parsedProducts.length > 5 && (
                    <p className="text-sm text-gray-500 text-center mt-2">
                      + {parsedProducts.length - 5} outros produtos
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleImport}
            disabled={parsedProducts.length === 0 || errors.length > 0}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <FileUp className="h-4 w-4 mr-2" />
            Importar {parsedProducts.length} Produtos
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportCSV;
