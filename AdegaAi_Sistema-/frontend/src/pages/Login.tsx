import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import LoginHeader from "@/components/auth/LoginHeader";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    empresa: "",
    cnpj: "",
    cpf: "",
    nascimento: "",
    token: "",
    newPassword: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgotPassword) {
        // ... existing forgot password logic ...
      } else if (isLogin) {
        await login(formData.username, formData.password);
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o dashboard..."
        });
        navigate("/dashboard");
      } else {
        // Registro atômico (empresa + usuário)
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Senhas não coincidem");
        }

        await authService.register({
          empresa: {
            nome: formData.empresa,
            cnpj: formData.cnpj
          },
          usuario: {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            cpf: formData.cpf,
            nascimento: formData.nascimento
          }
        });

        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Faça login para continuar"
        });
        setIsLogin(true);
        setFormData({
          username: "",
          password: "",
          confirmPassword: "",
          email: "",
          empresa: "",
          cnpj: "",
          cpf: "",
          nascimento: "",
          token: "",
          newPassword: ""
        });
      }
    } catch (error: any) {
      console.error("Erro na autenticação:", error);
      toast({
        title: "Erro na autenticação",
        description: error.response?.data?.detail || error.message || "Tente novamente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    setResetStep(1);
    setFormData({
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      empresa: "",
      cnpj: "",
      cpf: "",
      nascimento: "",
      token: "",
      newPassword: ""
    });
  };

  const renderForgotPasswordForm = () => {
    if (resetStep === 1) {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar link de recuperação"}
          </Button>
        </div>
      );
    } else if (resetStep === 2) {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="token">
              Código de recuperação
            </label>
            <input
              id="token"
              type="text"
              placeholder="Digite o código recebido por email"
              className="w-full p-2 border rounded"
              value={formData.token}
              onChange={(e) =>
                setFormData({ ...formData, token: e.target.value })
              }
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Verificando..." : "Verificar código"}
          </Button>
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="newPassword"
            >
              Nova senha
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="Digite sua nova senha (mínimo 8 caracteres)"
              className="w-full p-2 border rounded"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              required
              minLength={8}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Redefinindo..." : "Redefinir senha"}
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => {
            if (isForgotPassword) {
              setIsForgotPassword(false);
            } else {
              navigate("/");
            }
          }}
          className="mb-6 text-green-700 hover:text-green-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {isForgotPassword ? "Voltar para o login" : "Voltar para o início"}
        </Button>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <LoginHeader isLogin={!isForgotPassword && isLogin} />
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              {isForgotPassword ? (
                renderForgotPasswordForm()
              ) : (
                <>
                  <LoginForm
                    isLogin={isLogin}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    loading={loading}
                  />
                  {!isLogin && (
                    <>
                      <div className="mt-4">
                        <label
                          htmlFor="cpf"
                          className="block text-sm font-medium mb-1"
                        >
                          CPF
                        </label>
                        <input
                          id="cpf"
                          name="cpf"
                          type="text"
                          value={formData.cpf}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cpf: e.target.value
                            })
                          }
                          required
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="mt-4">
                        <label
                          htmlFor="nascimento"
                          className="block text-sm font-medium mb-1"
                        >
                          Data de Nascimento
                        </label>
                        <input
                          id="nascimento"
                          name="nascimento"
                          type="date"
                          value={formData.nascimento}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nascimento: e.target.value
                            })
                          }
                          required
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {isLogin && !isForgotPassword && (
                <div className="mt-4 text-center">
                  <Button
                    variant="link"
                    className="text-green-600 hover:text-green-700"
                    onClick={() => setIsForgotPassword(true)}
                    type="button"
                  >
                    Esqueceu sua senha?
                  </Button>
                </div>
              )}
            </form>
          </CardContent>

          {!isForgotPassword && (
            <CardFooter className="flex flex-col space-y-4">
              <Separator />
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {isLogin ? "Ainda não tem uma conta?" : "Já tem uma conta?"}
                </p>
                <Button
                  variant="link"
                  onClick={toggleMode}
                  className="text-green-600 hover:text-green-700 font-medium"
                  disabled={loading}
                  type="button"
                >
                  {isLogin ? "Criar nova conta" : "Fazer login"}
                </Button>
              </div>

              {!isLogin && (
                <p className="text-xs text-gray-500 text-center">
                  Ao criar uma conta, você concorda com nossos{" "}
                  <a href="#" className="text-green-600 hover:underline">
                    Termos de Serviço
                  </a>{" "}
                  e{" "}
                  <a href="#" className="text-green-600 hover:underline">
                    Política de Privacidade
                  </a>
                </p>
              )}
            </CardFooter>
          )}
        </Card>

        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-sm text-green-700">
            ✨ <strong>14 dias grátis</strong> para testar todas as funcionalidades
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
