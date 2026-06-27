import axios from 'axios';
import { AuthResponse, ApplicationRequest, ApplicantResponse, EligibilityReport } from '../types';

const api = axios.create({ baseURL: 'http://localhost:8080/api/v1' });

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────

export const signup = (data: {
  email: string; password: string; firstName: string; lastName: string;
}) => api.post<AuthResponse>('/auth/signup', data).then(r => r.data);

export const login = (data: { email: string; password: string }) =>
  api.post<AuthResponse>('/auth/login', data).then(r => r.data);

// ── User's own application ────────────────────────────────────────────────────

export const submitApplication = (data: ApplicationRequest) =>
  api.post<ApplicantResponse>('/my/application', data).then(r => r.data);

export const getMyApplication = () =>
  api.get<ApplicantResponse>('/my/application').then(r => r.data);

export const getMyResults = () =>
  api.get<EligibilityReport>('/my/results').then(r => r.data);
