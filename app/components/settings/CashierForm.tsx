// app/components/settings/CashierForm.tsx
'use client';

interface CashierFormProps {
  mode: 'add' | 'edit';
  initialData?: any;
  onSubmit?: (data: any) => void;
  onClose?: () => void;
}

export default function CashierForm({ mode, initialData, onSubmit, onClose }: CashierFormProps) {
  return (
    <div className="p-4">
      <h4 className="text-lg font-semibold mb-4">
        {mode === 'add' ? 'إضافة كاشير جديد' : 'تعديل الكاشير'}
      </h4>
      <p className="text-gray-500">نموذج الكاشير - قريباً</p>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="mt-4 inline-flex items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          إلغاء
        </button>
      ) : null}
    </div>
  );
}