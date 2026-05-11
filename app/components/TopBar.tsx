// app/components/TopBar.tsx
'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const TopBar: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="h-16 bg-white border-b flex items-center px-6 justify-between">
      {/* Left - Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl">
          🍔
        </div>
        <div className="font-bold text-2xl tracking-tight text-gray-800">Elshamy</div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-2xl mx-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search restaurant, Food, Cuisine or a Dish..."
            className="w-full bg-gray-100 border border-gray-200 rounded-3xl py-3 pl-12 pr-5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
          />
          <div className="absolute left-5 top-3.5 text-gray-400">
            🔍
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-2xl transition">
          <Bell size={22} className="text-gray-600" />
          <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full ring-2 ring-white"></div>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-semibold text-sm text-gray-800">
              {user?.name || "Alex Rivera"}
            </div>
            <div className="text-xs text-emerald-600 font-medium">
              {user?.role === 'admin' ? 'Administrator' : 'Cashier'}
            </div>
          </div>
          <div className="w-9 h-9 bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-xl ring-2 ring-white shadow">
            👨‍💼
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;