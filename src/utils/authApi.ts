import type { AuthUser } from '../store/useAuthStore';
import { authFetch } from './authFetch';

interface AuthPayload {
  token?: string;
  user?: AuthUser;
  error?: string;
}

interface AuthResult {
  ok: boolean;
  token?: string;
  user?: AuthUser;
  error?: string;
}

const readPayload = async (response: Response): Promise<AuthPayload> => {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return {};
  }

  try {
    return (await response.json()) as AuthPayload;
  } catch {
    return {};
  }
};

export const registerUser = async (name: string, email: string, password: string): Promise<AuthResult> => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await readPayload(response);

  if (!response.ok || !data.token || !data.user) {
    return {
      ok: false,
      error: data.error || 'Unable to create account right now.',
    };
  }

  return {
    ok: true,
    token: data.token,
    user: data.user,
  };
};

export const loginUser = async (email: string, password: string): Promise<AuthResult> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await readPayload(response);

  if (!response.ok || !data.token || !data.user) {
    return {
      ok: false,
      error: data.error || 'Unable to login with the provided credentials.',
    };
  }

  return {
    ok: true,
    token: data.token,
    user: data.user,
  };
};

export const fetchCurrentUser = async (): Promise<AuthResult> => {
  const response = await authFetch('/api/auth/me');
  const data = await readPayload(response);

  if (!response.ok || !data.user) {
    return {
      ok: false,
      error: data.error || 'Invalid session.',
    };
  }

  return {
    ok: true,
    user: data.user,
  };
};

export const logoutUser = async (): Promise<void> => {
  await authFetch('/api/auth/logout', {
    method: 'POST',
  });
};
