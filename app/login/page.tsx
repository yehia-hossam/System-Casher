// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore(state => state.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await login(name, password);
    if (success) {
      router.push('/pos');
    } else {
      setError('اسم المستخدم أو كلمة المرور خاطئة');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 to-teal-900 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🍔</div>
          <h1 className="text-3xl font-bold text-gray-800">نظام إلشامي</h1>
          <p className="text-gray-600 mt-2">نقطة البيع الذكية</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">اسم الكاشير / المدير</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500 text-lg"
              placeholder="أدخل اسمك"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500 text-lg"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl text-xl font-semibold transition"
          >
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>

        <button
          onClick={() => alert('عذراً، هذه الخاصية للمديرين فقط')}
          className="w-full mt-6 text-emerald-600 hover:text-emerald-700 font-medium"
        >
          إنشاء كاشير جديد
        </button>
      </div>
    </div>
  );
}