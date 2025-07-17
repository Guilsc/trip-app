import api from './api';

// --- Autenticação ---
export const authService = {
  register: (userData: any) => api.post('/register', userData),
  login: (credentials: any) => api.post('/login', credentials),
  refresh: () => api.post('/refresh'),
  getUser: () => api.get('/user'),
  logout: () => api.post('/logout'),
};
