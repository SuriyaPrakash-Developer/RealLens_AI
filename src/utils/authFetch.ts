import { useAuthStore } from '../store/useAuthStore';

export const authFetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
  const token = useAuthStore.getState().token;

  const headers = new Headers(init.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    useAuthStore.getState().clearAuth();
  }

  return response;
};
