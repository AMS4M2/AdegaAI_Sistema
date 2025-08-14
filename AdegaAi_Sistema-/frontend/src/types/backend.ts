// TODO: Sync this file with backend models

export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  empresa: number;
  codigo_barras?: string;
  categoria?: string;
}

export interface Fornecedor {
  id: number;
  nome: string;
  contato?: string;
  email?: string;
  empresa: number;
}

export interface ItemVenda {
  id?: number;
  venda: number;
  produto: number;
  quantidade: number;
  preco_unitario: number;
}

export interface Venda {
  id?: number;
  empresa?: number;
  data?: string;
  total: number;
  itens?: ItemVenda[];
}

export interface Funcionario {
  id: number;
  username: string;
  email: string;
  cargo: string;
  empresa: number;
  permissoes: string[];
}

export interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  licenca_validade?: string;
}

export interface UserInfo {
  id: number;
  username: string;  
  email: string;
  empresa: number;
  cargo: string;
}
