import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Search,
  Printer,
  Eye,
  Trash2,
  Calendar
} from "lucide-react";
import AppSidebar from "@/components/AppSidebar";

import quoteService from '@/services/quoteService';


interface Quote {
  id: string;
  number: string;
  date: string;
  customer: string;
  items: number;
  total: number;
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'expirado';
}

const Quotes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data - em produção viria do banco de dados
  const [quotes] = useState<Quote[]>([
    {
      id: "1",
      number: "ORC-001",
      date: "2024-01-15",
      customer: "João Silva",
      items: 5,
      total: 127.50,
      status: "pendente"
    },
    {
      id: "2", 
      number: "ORC-002",
      date: "2024-01-14",
      customer: "Maria Santos",
      items: 3,
      total: 89.90,
      status: "aprovado"
    }
  ]);

  const filteredQuotes = quotes.filter(quote =>
    quote.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      case 'expirado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrintQuote = (quote: Quote) => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Orçamento ${quote.number}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 20px; margin-bottom: 30px; }
            .company { color: #059669; font-size: 24px; font-weight: bold; }
            .quote-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .items-table th { background-color: #059669; color: white; }
            .total { text-align: right; font-size: 18px; font-weight: bold; }
            .footer { margin-top: 50px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company">ADEGAÍ</div>
            <p>Sua Adega de Confiança</p>
          </div>
          
          <div class="quote-info">
            <div>
              <strong>Orçamento:</strong> ${quote.number}<br>
              <strong>Data:</strong> ${new Date(quote.date).toLocaleDateString()}<br>
              <strong>Cliente:</strong> ${quote.customer}
            </div>
            <div>
              <strong>Validade:</strong> 30 dias<br>
              <strong>Status:</strong> ${quote.status.toUpperCase()}
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qtd</th>
                <th>Valor Unit.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Produtos diversos</td>
                <td>${quote.items}</td>
                <td>-</td>
                <td>R$ ${quote.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div class="total">
            Total Geral: R$ ${quote.total.toFixed(2)}
          </div>

          <div class="footer">
            <p>Este orçamento é válido por 30 dias a partir da data de emissão.</p>
            <p>Obrigado pela preferência!</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow?.document.write(printContent);
    printWindow?.document.close();
    printWindow?.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AppSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-emerald-800">Orçamentos Salvos</h1>
            <Badge variant="outline" className="text-emerald-600 border-emerald-600">
              {quotes.length} orçamentos
            </Badge>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Lista de Orçamentos</CardTitle>
                  <CardDescription>
                    Gerencie seus orçamentos salvos
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar orçamentos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredQuotes.map((quote) => (
                  <div key={quote.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">{quote.number}</h3>
                          <Badge className={getStatusColor(quote.status)}>
                            {quote.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <Calendar className="inline h-4 w-4 mr-1" />
                            {new Date(quote.date).toLocaleDateString()}
                          </div>
                          <div>
                            Cliente: {quote.customer}
                          </div>
                          <div>
                            {quote.items} itens
                          </div>
                          <div className="font-semibold text-emerald-600">
                            R$ {quote.total.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePrintQuote(quote)}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Quotes;