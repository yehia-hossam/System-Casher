// store/useAuthStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  username?: string;
  fullName?: string;
  role: 'admin' | 'cashier';
  avatar?: string;
}

interface AuthStore {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  isCashier: () => boolean;
}

// المستخدمين الافتراضيين (في قاعدة بيانات حقيقية ستكون مشفرة)
const defaultUsers = [
  { id: '1', name: 'admin', password: 'admin123', role: 'admin' as const },
  { id: '2', name: 'cashier1', password: 'cash123', role: 'cashier' as const },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,

      login: async (username: string, password: string) => {
        // محاكاة تأخير الشبكة
        await new Promise(resolve => setTimeout(resolve, 500));

        // جلب المستخدمين المخزنين محلياً (للكاشير المضافين من قبل الأدمن)
        const storedUsers = JSON.parse(localStorage.getItem('pos-users') || '[]');
        const allUsers = [...defaultUsers, ...storedUsers];
        
        const foundUser = allUsers.find(
          u => u.name === username && u.password === password
        );

        if (foundUser) {
          // إزالة كلمة المرور قبل تخزينها في الـ state
          const { password: _, ...userWithoutPassword } = foundUser;
          void _;
          set({ user: userWithoutPassword });
          return true;
        }
        
        return false;
      },

      logout: () => {
        set({ user: null });
        localStorage.removeItem('pos-auth');
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },

      isCashier: () => {
        const { user } = get();
        return user?.role === 'cashier';
      },
    }),
    {
      name: 'pos-auth', // اسم المفتاح في localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);