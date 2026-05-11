// app/components/LeftPanel.tsx
'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  TrendingUp, 
  Package, 
  Receipt, 
  Truck, 
  Settings, 
  LogOut, 
  UserPlus, 
  PlusCircle,
  Key,
  Menu 
} from 'lucide-react';

interface LeftPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ activeTab, setActiveTab, isAdmin }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const cashierMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Point of Sale', icon: ShoppingCart },
    { id: 'returns', label: 'Returns', icon: Receipt },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
  ];

  const adminMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Point of Sale', icon: ShoppingCart },
    { id: 'sales', label: 'Sales Analytics', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'returns', label: 'Returns', icon: Receipt },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'delivery', label: 'Delivery', icon: Truck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const menuItems = isAdmin ? adminMenu : cashierMenu;

  return (
    <div 
      className={`h-screen bg-emerald-700 text-white border-r border-emerald-800 transition-all duration-300 z-50 shadow-xl
        ${isExpanded ? 'w-72' : 'w-20'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-emerald-600">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
          🍔
        </div>
        <div className={`font-bold text-3xl tracking-tight transition-all duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
          Elshamy
        </div>
      </div>

      {/* Menu */}
      <div className="px-3 py-6 flex flex-col h-[calc(100vh-180px)] overflow-y-auto custom-scroll">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-1 transition-all text-left
                ${isActive 
                  ? 'bg-white text-emerald-700 font-semibold shadow-md' 
                  : 'hover:bg-emerald-600 text-white/90'
                }`}
            >
              <Icon size={24} className="flex-shrink-0" />
              <span className={`transition-all duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Admin Quick Actions */}
        {isAdmin && isExpanded && (
          <div className="mt-8 px-4">
            <p className="text-emerald-200 text-xs uppercase tracking-widest mb-3">Quick Actions</p>
            
            <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-emerald-600 rounded-2xl text-sm">
              <UserPlus size={20} />
              <span>Add New Cashier</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-emerald-600 rounded-2xl text-sm">
              <PlusCircle size={20} />
              <span>Add New Item</span>
            </button>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="absolute bottom-6 w-full px-6">
        <button 
          onClick={() => window.location.href = '/login'}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-emerald-600 text-white/90 transition-all"
        >
          <LogOut size={24} />
          <span className={`font-medium ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default LeftPanel;