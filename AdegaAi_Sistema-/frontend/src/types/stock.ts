// TODO: Sync this file with backend models

export interface Category {
  id: string;
  nome_categoria: string;
  status: 'ativo' | 'arquivado';
}

export interface Product {
  id: string;
  nome: string;
  marca: string;
  categoria: string;
  volume: string;
  preco_venda: number;
  preco_compra: number;
  quantidade_em_estoque: number;
  estoque_minimo: number;
  validade?: string;
  lote?: string;
  codigo_barras: string;
}

export interface StockMovement {
  id: string;
  produto_id: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  motivo: string;
  data: string;
  produto_nome?: string;
}

export interface StockAlert {
  produto: Product;
  quantidade_atual: number;
  estoque_minimo: number;
}
