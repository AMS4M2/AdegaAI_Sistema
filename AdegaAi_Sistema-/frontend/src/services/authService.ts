import { api } from './api';

interface LoginData {
  username: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
}

interface UserInfo {
  id: number;
  username: string;
  email: string;
  empresa: number;
  cargo: string;
}

interface SignupEmpresa {
  nome: string;
  cnpj: string;
  telefone?: string;
}

interface SignupUsuario {
  username: string;
  email: string;
  password: string;
  cpf: string;
  nascimento: string;
}

export interface RegisterData {
  empresa: SignupEmpresa;
  usuario: SignupUsuario;
}

export const authService = {
  login: async (data: LoginData): Promise<LoginResponse> => {
    // Aqui tipamos a resposta para LoginResponse
    const response = await api.post<LoginResponse>('/usuarios/login/', data);
    const { access, refresh } = response.data;
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const payload = {
      empresa: data.empresa,
      usuario: data.usuario,
    };
    // O endpoint /signup/ retorna { empresa: {...}, usuario: {...} }
    const response = await api.post<any>('/signup/', payload);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  },

  getCurrentUser: async (): Promise<UserInfo> => {
    const response = await api.get<UserInfo>('/usuarios/me/');
    return response.data;
  },

  isAuthenticated: (): boolean => !!localStorage.getItem('access'),
};
