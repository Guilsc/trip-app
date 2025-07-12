import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // URL da API

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação a cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com a renovação do token (refresh token)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Se o erro for 401 (Unauthorized) e não for uma tentativa de refresh token já falha
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('authToken'); // Assumindo que o mesmo token é usado para refresh
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/refresh`, null, {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          });
          const newToken = response.data.access_token;
          localStorage.setItem('authToken', newToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          // Repete a requisição original com o novo token
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Se o refresh token falhar, redireciona para o login ou limpa o token
        console.error('Erro ao renovar o token:', refreshError);
        localStorage.removeItem('authToken');
        // Opcional: redirecionar para a página de login
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- Autenticação ---
export const authService = {
  register: (userData: any) => api.post('/register', userData),
  login: (credentials: any) => api.post('/login', credentials),
  refresh: () => api.post('/refresh'),
  getUser: () => api.get('/user'),
  logout: () => api.post('/logout'),
};

// --- Solicitações de Viagem ---
export const tripService = {
  createTripRequest: (tripData: any) => api.post('/trip-requests', tripData),
  listTripRequests: (params?: any) => api.get('/trip-requests', { params }),
  getTripRequest: (id: string | number) => api.get(`/trip-requests/${id}`),
  updateTripRequestStatus: (id: string | number, statusData: { status: string }) =>
    api.patch(`/trip-requests/${id}/status`, statusData),
};

export default api;
