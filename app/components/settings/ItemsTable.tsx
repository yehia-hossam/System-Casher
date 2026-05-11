// app/components/settings/ItemsTable.tsx
'use client';

interface ItemsTableProps {
  onEdit: (item: any) => void;
}

export default function ItemsTable({ onEdit }: ItemsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">جدول المنتجات</h3>
      <p className="text-gray-500">قائمة المنتجات - قريباً</p>
    </div>
  );
}