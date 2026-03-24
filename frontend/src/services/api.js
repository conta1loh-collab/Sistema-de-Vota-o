import axios from 'axios';

const API_BASE_URL = `http://${window.location.hostname}:8000`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const authService = {
  login: (matricula) => api.post(`/auth/voter/login?matricula=${matricula}`),
  confirm: (matricula) => api.post(`/auth/admin/confirm?matricula=${matricula}`),
  getWaiting: () => api.get('/auth/waiting'),
};

export const votingService = {
  cast: (matricula, candidateNumber) => api.post(`/vote/?matricula=${matricula}&candidate_number=${candidateNumber || ''}`),
};

export const adminService = {
  getLogs: () => api.get('/audit/logs'),
  exportLogs: () => api.get('/audit/export', { responseType: 'blob' }),
  getCandidates: () => api.get('/candidates/'),
  addCandidate: (number, name) => api.post('/candidates/', { number, name }),
  removeCandidate: (id) => api.delete(`/candidates/${id}`),
  importVoters: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/voters/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  login: (username, password) => api.post('/auth/admin/login', { username, password }),
  getElectionStatus: () => api.get('/auth/election/status'),
  toggleElection: () => api.post('/auth/election/toggle'),
  getResults: () => api.get('/vote/results'),
  exportVoted: () => api.get('/auth/voters/export-voted', { responseType: 'blob' }),
};

export default api;
