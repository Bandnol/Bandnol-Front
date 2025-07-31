// store/auth.ts
import { create } from 'zustand';

interface AuthState {
  JWTToken: string | null;
  setJWTToken: (token: string) => void;
  clearJWTToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  JWTToken: null,
  setJWTToken: (token) => set({ JWTToken: token }),
  clearJWTToken: () => set({ JWTToken: null }),
}));
