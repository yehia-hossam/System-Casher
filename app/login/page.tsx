// app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';
import { Utensils, LogIn, AlertCircle, Loader2, Eye, EyeOff, User } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = useAuthStore(state => state.login);
  const user = useAuthStore(state => state.user);
  const router = useRouter();

  useEffect(() => {
    if (user) router.push('/pos');
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور');
      setLoading(false);
      return;
    }

    const success = await login(username.trim(), password);
    
    if (success) {
      router.push('/pos');
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-950 via-emerald-900 to-teal-900 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-10 border border-white/20">
        
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-xl">
            <Utensils className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800">نظام إلشامي</h1>
          <p className="text-gray-500 mt-2">نقطة بيع احترافية للمطاعم</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">اسم المستخدم</label>
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pr-12 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500 text-lg text-right"
                placeholder="مثال: admin أو cashier1"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-12 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500 text-lg text-right"
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl flex items-center gap-3">
              <AlertCircle size={22} />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-2xl text-xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                جاري الدخول...
              </>
            ) : (
              <>
                <LogIn size={24} />
                تسجيل الدخول
              </>
            )}
          </button>
        </form>

        {/* حسابات تجريبية */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-center text-gray-400 text-sm mb-4">حسابات تجريبية</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-center">
              <p className="font-bold text-emerald-700">مدير النظام</p>
              <p className="font-mono text-emerald-600">admin / admin123</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center">
              <p className="font-bold text-slate-700">كاشير</p>
              <p className="font-mono text-slate-600">cashier1 / cash123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}