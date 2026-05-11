'use client';

import { useState } from 'react';
import { usePosStore } from '../store/usePosStore';
import LogoutButton from '../components/common/LogoutButton';
import ItemsTable from '../components/settings/ItemsTable';
import CashiersTable from '../components/settings/CashiersTable';
import ItemForm from '../components/settings/ItemForm';
import CashierForm from '../components/settings/CashierForm';
import FormModal from '../components/common/FormModal';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'items' | 'cashiers'>('items');
  const [modal, setModal] = useState<{
    type: 'item' | 'cashier';
    mode: 'add' | 'edit';
    data?: any;
  } | null>(null);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">الإعدادات</h1>
        <LogoutButton />
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('items')}
          className={`px-8 py-3 text-lg font-medium border-b-2 transition ${
            activeTab === 'items'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent hover:text-gray-700'
          }`}
        >
          المنتجات
        </button>
        <button
          onClick={() => setActiveTab('cashiers')}
          className={`px-8 py-3 text-lg font-medium border-b-2 transition ${
            activeTab === 'cashiers'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent hover:text-gray-700'
          }`}
        >
          الكاشيرز
        </button>
      </div>

      {/* Add Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setModal({ type: activeTab === 'items' ? 'item' : 'cashier', mode: 'add' })}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium"
        >
          + إضافة {activeTab === 'items' ? 'منتج جديد' : 'كاشير جديد'}
        </button>
      </div>

      {/* Tables */}
      {activeTab === 'items' ? (
        <ItemsTable onEdit={(item) => setModal({ type: 'item', mode: 'edit', data: item })} />
      ) : (
        <CashiersTable onEdit={(cashier) => setModal({ type: 'cashier', mode: 'edit', data: cashier })} />
      )}

      {/* Modal */}
      <FormModal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        title={
          modal?.mode === 'add'
            ? `إضافة ${modal?.type === 'item' ? 'منتج' : 'كاشير'}`
            : `تعديل ${modal?.type === 'item' ? 'منتج' : 'كاشير'}`
        }
      >
        {modal?.type === 'item' ? (
          <ItemForm
            mode={modal.mode}
            initialData={modal.data}
            onClose={() => setModal(null)}
          />
        ) : (
          <CashierForm
            mode={modal.mode}
            initialData={modal.data}
            onClose={() => setModal(null)}
          />
        )}
      </FormModal>
    </div>
  );
}