
import { api } from './api';
import { Produto } from '../types/backend';

export const produtoService = {
  getAll: async (): Promise<Produto[]> => {
    const response = await api.get('/api/produtos/');
    return response.data;
  },

  getById: async (id: number): Promise<Produto> => {
    const response = await api.get(`/api/produtos/${id}/`);
    return response.data;
  },

  create: async (produto: Omit<Produto, 'id' | 'empresa'>): Promise<Produto> => {
    const response = await api.post('/api/produtos/', produto);
    return response.data;
  },

  update: async (id: number, produto: Partial<Produto>): Promise<Produto> => {
    const response = await api.put(`/api/produtos/${id}/`, produto);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/produtos/${id}/`);
  }
};
