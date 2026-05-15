import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchCurrentUser } from '../utils/authApi';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isCheckingAuth: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
  validateSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isCheckingAuth: true,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
      validateSession: async () => {
        const token = get().token;

        if (!token) {
          set({ isCheckingAuth: false, user: null });
          return;
        }

        set({ isCheckingAuth: true });

        try {
          const result = await fetchCurrentUser();
          if (!result.ok || !result.user) {
            set({ isCheckingAuth: false });
            return;
          }

          set({ user: result.user, isCheckingAuth: false });
        } catch {
          set({ isCheckingAuth: false });
        }
      },
    }),
    {
      name: 'reallens-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.validateSession();
      },
    },
  ),
);
