import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    empresaNome: "",
    empresaCnpj: "",
    username: "",
    email: "",
    cpf: "",
    nascimento: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Erro", description: "Senhas não coincidem", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await authService.register({
        empresa: {
          nome: formData.empresaNome,
          cnpj: formData.empresaCnpj,
        },
        usuario: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          cpf: formData.cpf,
          nascimento: formData.nascimento,
        },
      });
      toast({
        title: "Sucesso",
        description: "Cadastro realizado com sucesso! Faça login.",
        variant: "default",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.response?.data?.detail || error.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-emerald-800">AdegAÍ</span>
          </div>
          <CardTitle className="text-2xl text-emerald-800">Criar Conta</CardTitle>
          <CardDescription>Preencha os dados para começar a usar o AdegAÍ</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="empresaNome">Nome da Adega</Label>
              <Input
                id="empresaNome"
                name="empresaNome"
                type="text"
                value={formData.empresaNome}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="empresaCnpj">CNPJ</Label>
              <Input
                id="empresaCnpj"
                name="empresaCnpj"
                type="text"
                value={formData.empresaCnpj}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
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
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                name="cpf"
                type="text"
                value={formData.cpf}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="nascimento">Data de Nascimento</Label>
              <Input
                id="nascimento"
                name="nascimento"
                type="date"
                value={formData.nascimento}
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
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? "Cadastrando..." : "Criar Conta"}
            </Button>
            <div className="text-center text-sm text-gray-600">
              Já tem uma conta?{" "}
              <button type="button" onClick={() => navigate("/login")} className="text-emerald-600 hover:underline">
                Fazer login
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
