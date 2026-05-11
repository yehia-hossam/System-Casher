// app/components/settings/CashiersTable.tsx
'use client';

interface CashiersTableProps {
  onEdit: (cashier: any) => void;
}

export default function CashiersTable({ onEdit }: CashiersTableProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">جدول الكاشيرز</h3>
      <p className="text-gray-500">قائمة الكاشيرز - قريباً</p>
    </div>
  );
}