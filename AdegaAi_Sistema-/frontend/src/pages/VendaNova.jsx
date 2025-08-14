import { useEffect, useState } from "react";
import axios from "axios";

import vendaService from '@/services/vendaService';
import produtoService from '@/services/produtoService';


function VendaNova() {
  const [produtos, setProdutos] = useState([]);
  const [itens, setItens] = useState([]);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios
      .get("http://localhost:8000/api/produtos/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProdutos(res.data))
      .catch((err) => console.error("Erro ao buscar produtos", err));
  }, []);

  const adicionarItem = (produtoId) => {
    const produto = produtos.find((p) => p.id === parseInt(produtoId));
    if (produto) {
      setItens([...itens, { produto: produto.id, quantidade: 1, preco_unitario: produto.preco }]);
    }
  };

  const alterarQuantidade = (index, valor) => {
    const novos = [...itens];
    novos[index].quantidade = parseInt(valor);
    setItens(novos);
  };

  const removerItem = (index) => {
    const novos = [...itens];
    novos.splice(index, 1);
    setItens(novos);
  };

  const enviarVenda = async () => {
    const token = localStorage.getItem("accessToken");
    const total = itens.reduce((acc, item) => acc + item.quantidade * item.preco_unitario, 0);
    try {
      const venda = await axios.post("http://localhost:8000/api/vendas/", { total }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const idVenda = venda.data.id;
      for (let item of itens) {
        await axios.post("http://localhost:8000/api/itens/", {
          ...item,
          venda: idVenda,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setMensagem("Venda registrada com sucesso!");
      setItens([]);
    } catch (err) {
      setMensagem("Erro ao registrar venda.");
    }
  };

  return (
    <div style={{ maxWidth: 540, margin: "100px auto" }}>
      <h2>Nova Venda</h2>
      <select onChange={(e) => adicionarItem(e.target.value)}>
        <option value="">Selecione um produto</option>
        {produtos.map((p) => (
          <option key={p.id} value={p.id}>{p.nome} - R$ {p.preco}</option>
        ))}
      </select>
      {itens.map((item, i) => (
        <div key={i}>
          <span>Produto #{item.produto}</span>
          <input
            type="number"
            min="1"
            value={item.quantidade}
            onChange={(e) => alterarQuantidade(i, e.target.value)}
          />
          <span>R$ {item.preco_unitario}</span>
          <button onClick={() => removerItem(i)}>Remover</button>
        </div>
      ))}
      <button onClick={enviarVenda}>
        Finalizar Venda
      </button>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}
export default VendaNova;