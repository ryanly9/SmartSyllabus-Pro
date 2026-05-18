import axiosInstance from './axios';

// ─── Auth APIs ────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => axiosInstance.post('/auth/register', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  getMe: () => axiosInstance.get('/auth/me'),
};

// ─── Content APIs ─────────────────────────────────────────────────────────────
export const contentAPI = {
  getAll: (params) => axiosInstance.get('/content', { params }),
  getById: (id) => axiosInstance.get(`/content/${id}`),
  delete: (id) => axiosInstance.delete(`/content/${id}`),
};

// ─── Upload + AI APIs ─────────────────────────────────────────────────────────
export const uploadAPI = {
  uploadPDF: (formData) =>
    axiosInstance.post('/upload/pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    }),
  generateContent: (data) =>
    axiosInstance.post('/generate-content', data, { timeout: 120000 }),
};

// ─── Quiz APIs ────────────────────────────────────────────────────────────────
export const quizAPI = {
  submitQuiz: (data) => axiosInstance.post('/quiz/submit', data),
  getQuizById: (id) => axiosInstance.get(`/quiz/${id}`),
};

// ─── Result APIs ──────────────────────────────────────────────────────────────
export const resultAPI = {
  getResults: (params) => axiosInstance.get('/results', { params }),
};

// ─── Helper ───────────────────────────────────────────────────────────────────
export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Something went wrong'
  );
};
