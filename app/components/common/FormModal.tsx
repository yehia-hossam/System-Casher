'use client';

import { useState } from 'react';

type FormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function FormModal({ isOpen, onClose, title, children }: FormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        {children}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
}