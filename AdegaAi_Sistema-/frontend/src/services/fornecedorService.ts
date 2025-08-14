
import { api } from './api';
import { Fornecedor } from '../types/backend';

export const fornecedorService = {
  getAll: async (): Promise<Fornecedor[]> => {
    const response = await api.get('/api/fornecedores/');
    return response.data;
  },

  create: async (fornecedor: Omit<Fornecedor, 'id'>): Promise<Fornecedor> => {
    const response = await api.post('/api/fornecedores/', fornecedor);
    return response.data;
  },

  update: async (id: number, fornecedor: Partial<Fornecedor>): Promise<Fornecedor> => {
    const response = await api.put(`/api/fornecedores/${id}/`, fornecedor);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/fornecedores/${id}/`);
  }
};
