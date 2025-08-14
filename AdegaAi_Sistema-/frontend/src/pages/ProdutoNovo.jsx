import { useState } from "react";
import axios from "axios";

import produtoService from '@/services/produtoService';
import categoriaService from '@/services/categoriaService';


function ProdutoNovo() {
  const [form, setForm] = useState({
    nome: "",
    preco: "",
    estoque: "",
  });
  const [mensagem, setMensagem] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    try {
      await axios.post("http://localhost:8000/api/produtos/", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensagem("Produto cadastrado com sucesso!");
      setForm({ nome: "", preco: "", estoque: "" });
    } catch (err) {
      setMensagem("Erro ao cadastrar produto.");
    }
  };

  return (
    <div style={{ maxWidth: 340, margin: "100px auto" }}>
      <form onSubmit={handleSubmit}>
        <h2>Novo Produto</h2>
        <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required /><br/>
        <input name="preco" placeholder="Preço" value={form.preco} onChange={handleChange} required /><br/>
        <input name="estoque" placeholder="Estoque" value={form.estoque} onChange={handleChange} required /><br/>
        <button type="submit">Cadastrar</button>
        {mensagem && <p>{mensagem}</p>}
      </form>
    </div>
  );
}
export default ProdutoNovo;