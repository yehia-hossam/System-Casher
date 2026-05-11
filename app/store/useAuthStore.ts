// app/store/useAuthStore.ts
import { create } from 'zustand';
import { User } from '../types';

interface AuthStore {
  user: User | null;
  login: (name: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,

  login: async (name: string, password: string) => {
    const mockUsers = [
      { id: '1', name: 'yehia', role: 'admin' as const, password: '1234' },
      { id: '2', name: 'hossam', role: 'cashier' as const, password: '1234' },
      { id: '3', name: 'علي', role: 'cashier' as const, password: '1234' },
    ];

    const found = mockUsers.find(u => u.name === name && u.password === password);

    if (found) {
      const { password: _, ...userData } = found;
      set({ user: userData });
      localStorage.setItem('elshamy_user', JSON.stringify(userData));
      return true;
    }
    return false;
  },

  logout: () => {
    set({ user: null });
    localStorage.removeItem('elshamy_user');
  },

  isAdmin: () => get().user?.role === 'admin',
}));