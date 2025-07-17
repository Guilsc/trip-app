import api from './api';

// --- Solicitações de Viagem ---
export const tripService = {
  createTripRequest: (tripData: any) => api.post('/trip-requests', tripData),
  listTripRequests: (params?: any) => api.get('/trip-requests', { params }),
  getTripRequest: (id: string | number) => api.get(`/trip-requests/${id}`),
  updateTripRequestStatus: (id: string | number, statusData: { status: string }) =>
    api.patch(`/trip-requests/${id}/status`, statusData),
};
