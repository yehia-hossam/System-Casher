// app/components/SelectionModal.tsx
'use client';

import React, { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'add-cashier' | 'add-item';
  onAddItem?: (dish: any) => void;
}

const SelectionModal: React.FC<ModalProps> = ({ isOpen, onClose, type, onAddItem }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    name: '',
    price: '',
    emoji: '🍔',
    category: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === 'add-cashier') {
      const { fullName, username, password } = formData;
      if (fullName && username && password) {
        // Will be handled in parent
        alert(`Cashier added: ${fullName}`);
        onClose();
      }
    } else if (type === 'add-item' && onAddItem) {
      const newDish = {
        name: formData.name,
        price: parseFloat(formData.price),
        emoji: formData.emoji,
        category: formData.category,
      };
      onAddItem(newDish);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">
          {type === 'add-cashier' ? 'Add New Cashier' : 'Add New Menu Item'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {type === 'add-cashier' ? (
            <>
              <input type="text" placeholder="Full Name" className="w-full p-4 rounded-2xl border" 
                onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
              <input type="text" placeholder="Username" className="w-full p-4 rounded-2xl border" 
                onChange={(e) => setFormData({...formData, username: e.target.value})} required />
              <input type="password" placeholder="Password" className="w-full p-4 rounded-2xl border" 
                onChange={(e) => setFormData({...formData, password: e.target.value})} required />
            </>
          ) : (
            <>
              <input type="text" placeholder="Item Name" className="w-full p-4 rounded-2xl border" 
                onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              <input type="number" placeholder="Price ($)" className="w-full p-4 rounded-2xl border" 
                onChange={(e) => setFormData({...formData, price: e.target.value})} required />
              <input type="text" placeholder="Emoji (e.g. 🍕)" className="w-full p-4 rounded-2xl border" 
                value={formData.emoji} onChange={(e) => setFormData({...formData, emoji: e.target.value})} />
              <input type="text" placeholder="Category" className="w-full p-4 rounded-2xl border" 
                onChange={(e) => setFormData({...formData, category: e.target.value})} />
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl border">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl">
              Add {type === 'add-cashier' ? 'Cashier' : 'Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SelectionModal;