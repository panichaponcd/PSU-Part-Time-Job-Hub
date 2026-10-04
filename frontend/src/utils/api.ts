// src/utils/api.ts
import { setAuthToast } from './authToast';

const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname) {
    // Tailscale Funnel (.ts.net) or HTTPS: route through /api (port 443 / same origin)
    if (window.location.hostname.endsWith('.ts.net') || window.location.protocol === 'https:') {
      return `${window.location.origin}/api`;
    }
    return `http://${window.location.hostname}:8000/api`;
  }
  return '/api';
};
export const API_BASE_URL = getApiBaseUrl();

export function isJwtExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return true;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const { exp } = JSON.parse(jsonPayload);
    if (!exp) return false;
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem('access_token');

  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 && !endpoint.includes('/auth/login/')) {
    const refreshToken = localStorage.getItem('refresh_token');

    // Attempt silent refresh if refresh token is present, valid, and not already refreshing
    if (refreshToken && !endpoint.includes('/auth/refresh/') && !isJwtExpired(refreshToken)) {
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          localStorage.setItem('access_token', refreshData.access);
          headers['Authorization'] = `Bearer ${refreshData.access}`;
          return fetch(url, { ...options, headers });
        }
      } catch (err) {
        console.warn('Silent token refresh failed:', err);
      }
    }

    // If refresh failed or was not possible, trigger session expiration
    console.warn('Session expired or unauthorized.');
    const hadToken = !!localStorage.getItem('access_token');

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('student');

    if (hadToken) {
      setAuthToast('Your session has expired. Please sign in again.', 'warning');
      window.dispatchEvent(new CustomEvent('auth:session_expired'));

      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.startsWith('/signin') &&
        !window.location.pathname.startsWith('/register')
      ) {
        window.location.href = '/signin';
      }
    }
  }

  return response;
};

export const api = {
  get: (endpoint: string, options: RequestInit = {}) =>
    apiRequest(endpoint, { ...options, method: 'GET' }),

  post: (endpoint: string, body?: any, options: RequestInit = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: (endpoint: string, body?: any, options: RequestInit = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: (endpoint: string, options: RequestInit = {}) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

export default apiRequest;
