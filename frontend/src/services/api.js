import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
});

// ── Ordinances ────────────────────────────────────────────────────────────────
export const ordinanceAPI = {
  /** GET /api/ordinances — supports { search, category, year, page, limit } */
  getAll: (params = {}) => api.get('/api/ordinances', { params }),

  /** GET /api/ordinances/categories */
  getCategories: () => api.get('/api/ordinances/categories'),

  /** GET /api/ordinances/:id */
  getById: (id) => api.get(`/api/ordinances/${id}`),

  /** POST /api/ordinances — multipart/form-data with optional `file` field */
  create: (formData) =>
    api.post('/api/ordinances', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  /** PUT /api/ordinances/:id — multipart/form-data */
  update: (id, formData) =>
    api.put(`/api/ordinances/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  /** DELETE /api/ordinances/:id */
  delete: (id) => api.delete(`/api/ordinances/${id}`),
};

// ── Officials ─────────────────────────────────────────────────────────────────
export const officialsAPI = {
  getAll: () => api.get('/api/officials'),
  getById: (id) => api.get(`/api/officials/${id}`),
  create: (formData) =>
    api.post('/api/officials', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, formData) =>
    api.put(`/api/officials/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/api/officials/${id}`),
};

export default api;
