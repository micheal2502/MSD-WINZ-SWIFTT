import axios, { AxiosError } from 'axios';
import { Applicant, AssessmentReport } from '../types';

const BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT token to every request freshly from localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept 401s — token expired or invalid, clear it
api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const adminLogin = async (email: string, password: string): Promise<string> => {
  // Use plain axios (no auth header) for login
  const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
  const token: string = res.data.token;
  localStorage.setItem('adminToken', token);
  return token;
};

export const fetchApplicants = (): Promise<Applicant[]> =>
  api.get<Applicant[]>('/applicants').then(r => r.data);

export const runAssessment = (applicantId: number): Promise<AssessmentReport> =>
  api.post<AssessmentReport>(`/eligibility/applicants/${applicantId}/assess`).then(r => r.data);

export const fetchAssessments = (applicantId: number): Promise<AssessmentReport> =>
  api.get<AssessmentReport>(`/eligibility/applicants/${applicantId}/assessments`).then(r => r.data);
