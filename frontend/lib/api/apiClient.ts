import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor — handle auth failures and surface structured errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Redirect to login on 401 (excluding landing page, login, and signup routes)
      if (status === 401) {
        if (
          typeof window !== 'undefined' &&
          window.location.pathname !== '/' &&
          !window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/signup')
        ) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
      }

      // Surface a clear, structured error message on the error object
      // so mutation onError handlers can read `err.response.data.error`
      if (status >= 500) {
        const message = data?.error || data?.detail || 'Internal server error. Please try again.';
        console.error(`[API ${status}] ${error.config?.url} — ${message}`);
      }
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('[API] Network error — backend may be offline:', error.message);
    } else if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
      console.error('[API] Request timed out:', error.config?.url);
    }

    return Promise.reject(error);
  }
);
