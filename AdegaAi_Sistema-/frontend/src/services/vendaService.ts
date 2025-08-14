
import { api } from './api';
import { Venda, ItemVenda } from '../types/backend';

export const vendaService = {
  getAll: async (): Promise<Venda[]> => {
    const response = await api.get('/api/vendas/');
    return response.data;
  },

  getById: async (id: number): Promise<Venda> => {
    const response = await api.get(`/api/vendas/${id}/`);
    return response.data;
  },

  create: async (venda: Omit<Venda, 'id' | 'empresa' | 'data'>): Promise<Venda> => {
    const response = await api.post('/api/vendas/', venda);
    return response.data;
  },

  update: async (id: number, venda: Partial<Venda>): Promise<Venda> => {
    const response = await api.put(`/api/vendas/${id}/`, venda);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/vendas/${id}/`);
  },

  // Itens de venda
  createItem: async (item: Omit<ItemVenda, 'id'>): Promise<ItemVenda> => {
    const response = await api.post('/api/itens/', item);
    return response.data;
  },

  getItemsByVenda: async (vendaId: number): Promise<ItemVenda[]> => {
    const response = await api.get(`/api/itens/?venda=${vendaId}`);
    return response.data;
  }
};
