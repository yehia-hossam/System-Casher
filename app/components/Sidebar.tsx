"use client";
import { Home, Sun, Moon, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  return (
    <aside className="w-24 bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 flex flex-col items-center py-8">
      <div className="w-12 h-12 bg-[#0e4b5e] rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-10 shadow-lg">Y</div>
      <nav className="flex-1">
        <button className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700">
          <Home />
        </button>
      </nav>
      <button onClick={() => setIsDark(!isDark)} className="p-4 text-slate-400">
        {isDark ? <Sun /> : <Moon />}
      </button>
      <button className="p-4 text-red-400 mt-4"><LogOut /></button>
    </aside>
  );
}