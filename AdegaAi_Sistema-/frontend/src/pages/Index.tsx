
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, ArrowRight, BarChart3, Package, Users, ShoppingCart, Calculator, FileText, Star, Crown, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  const plans = [
    {
      name: "Essencial",
      price: "R$ 59,90",
      color: "bg-green-100 border-green-300",
      icon: Star,
      description: "Ideal para adegas pequenas começando",
      features: [
        "1 usuário",
        "Até 500 produtos",
        "Estoque completo",
        "Caixa diário",
        "Cadastro de fornecedores",
        "Relatórios mensais",
        "Suporte por e-mail (24h)"
      ]
    },
    {
      name: "Profissional",
      price: "R$ 99,90",
      color: "bg-amber-100 border-amber-300",
      icon: BarChart3,
      description: "Para adegas em crescimento",
      features: [
        "Até 3 usuários",
        "Produtos ilimitados",
        "Gráficos e relatórios completos",
        "Dashboard com indicadores",
        "Suporte por chat comercial"
      ],
      popular: true
    },
    {
      name: "Premium",
      price: "R$ 149,90",
      color: "bg-green-100 border-green-300",
      icon: Crown,
      description: "Solução completa para sua adega",
      features: [
        "Usuários ilimitados",
        "Produtos ilimitados",
        "App mobile incluso",
        "Fidelidade por pontos",
        "Integração com impressora térmica",
        "Leitor de código de barras",
        "Suporte por chat e telefone"
      ]
    }
  ];

  const features = [
    {
      icon: Package,
      title: "Gestão de Estoque",
      description: "Controle completo de produtos, entradas e saídas com alertas inteligentes"
    },
    {
      icon: ShoppingCart,
      title: "Vendas Rápidas",
      description: "Sistema PDV otimizado para venda no balcão com leitor de código de barras"
    },
    {
      icon: Calculator,
      title: "Controle de Caixa",
      description: "Fechamento diário automático e controle financeiro completo"
    },
    {
      icon: Users,
      title: "Gestão de Clientes",
      description: "Cadastro de clientes com histórico de compras e contato por WhatsApp"
    },
    {
      icon: FileText,
      title: "Relatórios Inteligentes",
      description: "Dashboards e relatórios exportáveis para tomada de decisões"
    },
    {
      icon: Zap,
      title: "Multitenant",
      description: "Cada adega com seus próprios dados, totalmente isolados e seguros"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-green-800">AdegAÍ</span>
          </div>
          <div className="flex space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="text-green-700 hover:text-green-800"
            >
              Entrar
            </Button>
            <Button 
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white"
            >
              Começar Agora
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-green-800 mb-6">
            Gerencie sua adega com
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-amber-600"> inteligência</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sistema completo para gestão de adegas de bairro. Controle estoque, vendas, 
            caixa e clientes em uma plataforma moderna e fácil de usar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white text-lg px-8 py-3"
            >
              Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/demo')}
              className="border-green-600 text-green-700 hover:bg-green-50 text-lg px-8 py-3"
            >
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            Tudo que sua adega precisa
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Funcionalidades pensadas especificamente para o dia a dia das adegas brasileiras
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-green-800">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            Planos que crescem com você
          </h2>
          <p className="text-gray-600">
            Escolha o plano ideal para o tamanho da sua adega
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.color} ${plan.popular ? 'ring-2 ring-green-500 scale-105' : ''} hover:shadow-xl transition-all duration-300`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white">
                  Mais Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <plan.icon className="h-12 w-12 mx-auto mb-4 text-green-700" />
                <CardTitle className="text-green-800 text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                <div className="text-3xl font-bold text-green-800 mt-4">
                  {plan.price}<span className="text-lg font-normal text-gray-600">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => navigate('/register')}
                >
                  Começar Agora
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-amber-400 rounded-lg flex items-center justify-center">
              <span className="text-green-900 font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold">AdegAÍ</span>
          </div>
          <p className="text-green-200">
            © 2024 AdegAÍ - Sistema de Gestão para Adegas de Bairro
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
