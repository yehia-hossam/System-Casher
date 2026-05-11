// components/common/LogoutButton.tsx
'use client';
import { usePosStore } from '@/store/usePosStore';

export default function LogoutButton() {
  const logout = usePosStore((state) => state.logout);

  return (
    <button
      onClick={logout}
      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
    >
      تسجيل الخروج
    </button>
  );
}