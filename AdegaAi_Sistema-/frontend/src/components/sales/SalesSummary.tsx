
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Check, DollarSign, Printer, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
}

interface SalesSummaryProps {
  totalAmount: number;
  totalItems: number;
  paymentMethods: PaymentMethod[];
  selectedPayment: string;
  setSelectedPayment: (value: string) => void;
  onFinalizeSale: () => void;
  onPrint: () => void;
  hasItems: boolean;
}

const SalesSummary = ({
  totalAmount,
  totalItems,
  paymentMethods,
  selectedPayment,
  setSelectedPayment,
  onFinalizeSale,
  onPrint,
  hasItems
}: SalesSummaryProps) => {
  const navigate = useNavigate();

  const handleSaveQuote = () => {
    // Salvar orçamento e navegar para tela de orçamentos
    navigate('/quotes');
  };

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5" />
          <span>Resumo da Venda</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Total da Venda</p>
          <p className="text-3xl font-bold text-emerald-600">
            R$ {totalAmount.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            {totalItems} {totalItems === 1 ? 'item' : 'itens'}
          </p>
        </div>

        <Separator />

        {/* Forma de Pagamento */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Forma de Pagamento *
          </label>
          <Select value={selectedPayment} onValueChange={setSelectedPayment}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar forma de pagamento..." />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method.id} value={method.id}>
                  <div className="flex items-center space-x-2">
                    <method.icon className="h-4 w-4" />
                    <span>{method.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Ações */}
        <div className="space-y-3">
          <Button 
            onClick={onFinalizeSale}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            size="lg"
            disabled={!hasItems || !selectedPayment}
          >
            <Check className="h-5 w-5 mr-2" />
            Finalizar Venda
          </Button>

          {(!hasItems || !selectedPayment) && (
            <div className="text-xs text-center text-gray-500">
              {!hasItems && "Adicione produtos para finalizar"}
              {hasItems && !selectedPayment && "Selecione uma forma de pagamento"}
            </div>
          )}
        </div>

        {/* Ações Adicionais */}
        <div className="grid grid-cols-2 gap-2 pt-4">
          <Button variant="outline" size="sm" disabled={!hasItems} onClick={handleSaveQuote}>
            <Save className="h-4 w-4 mr-1" />
            Salvar Orçamento
          </Button>
          <Button variant="outline" size="sm" disabled={!hasItems} onClick={onPrint}>
            <Printer className="h-4 w-4 mr-1" />
            Imprimir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesSummary;
