// frontend/src/pages/Registro.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";

function Registro() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({
    empresa: "",
    cnpj: "",
    username: "",
    email: "",
    cpf: "",
    nascimento: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast({ title: "Erro", description: "Senhas não coincidem", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await authService.register({
        empresa: {
          nome: form.empresa,
          cnpj: form.cnpj,
        },
        usuario: {
          username: form.username,
          email: form.email,
          password: form.password,
          cpf: form.cpf,
          nascimento: form.nascimento,
        },
      });
      toast({
        title: "Sucesso",
        description: "Registro realizado com sucesso! Faça login.",
        variant: "default",
      });
      navigate("/login");
    } catch (err) {
      toast({
        title: "Erro no registro",
        description: err.response?.data?.detail || err.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 340, margin: "100px auto" }}>
      <form onSubmit={handleSubmit}>
        <h2>Criar Conta</h2>
        <input
          name="empresa"
          placeholder="Nome da empresa"
          value={form.empresa}
          onChange={handleChange}
          required
        /><br/>
        <input
          name="cnpj"
          placeholder="CNPJ"
          value={form.cnpj}
          onChange={handleChange}
          required
        /><br/>
        <input
          name="username"
          placeholder="Usuário"
          value={form.username}
          onChange={handleChange}
          required
        /><br/>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        /><br/>
        <input
          name="cpf"
          placeholder="CPF"
          value={form.cpf}
          onChange={handleChange}
          required
        /><br/>
        <input
          name="nascimento"
          type="date"
          placeholder="Data de nascimento"
          value={form.nascimento}
          onChange={handleChange}
        /><br/>
        <input
          name="password"
          type="password"
          placeholder="Senha"
          value={form.password}
          onChange={handleChange}
          required
        /><br/>
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirmar senha"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        /><br/>
        <button type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Registrar"}
        </button>
      </form>
    </div>
  );
}

export default Registro;
