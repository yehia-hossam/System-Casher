// app/components/common/Receipt.tsx
'use client';

import { Order } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';

interface ReceiptProps {
  order: Order;
}

export default function Receipt({ order }: ReceiptProps) {
  const { user } = useAuthStore();
  const date = new Date(order.date);

  const subTotal = order.subTotal || order.total;
  const total = order.total;

  return (
    <div id="receipt" className="w-95 bg-white p-6 text-sm font-mono mx-auto border border-gray-300" dir="rtl">
      {/* Header */}
      <div className="text-center border-b-2 border-dashed pb-4 mb-4">
        <h1 className="text-3xl font-bold tracking-wider">مطعم إلشامي</h1>
        <p className="text-lg font-semibold text-gray-700 mt-1">الذوق • الجودة • السرعة</p>
        <p className="text-xs mt-2">📍 1478 شارع 52 - ويست نيويورك</p>
        <p className="text-xs">📞 0100 123 4567</p>
      </div>

      {/* Invoice Info */}
      <div className="flex justify-between text-xs mb-4">
        <div>
          <span className="font-bold">رقم الفاتورة:</span><br />
          <span className="font-mono">{order.orderNumber}</span>
        </div>
        <div className="text-left">
          <span className="font-bold">التاريخ:</span><br />
          {date.toLocaleDateString('ar-EG')}
        </div>
        <div className="text-left">
          <span className="font-bold">الوقت:</span><br />
          {date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="text-xs mb-3">
        <span className="font-bold">الكاشير:</span> {user?.name || 'الكاشير'}
      </div>

      {/* Items Table */}
      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-right py-2 font-bold">الصنف</th>
            <th className="text-center py-2 font-bold w-16">الكمية</th>
            <th className="text-left py-2 font-bold">السعر</th>
            <th className="text-left py-2 font-bold">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <tr key={index} className="border-b border-dotted border-gray-200">
              <td className="py-2 pr-2">{item.nameAr}</td>
              <td className="text-center py-2">{item.quantity}</td>
              <td className="text-left py-2">{item.price}</td>
              <td className="text-left py-2 font-medium">
                {(item.price * item.quantity).toFixed(0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="space-y-2 text-sm border-t-2 border-dashed pt-4">
        <div className="flex justify-between">
          <span>المجموع الفرعي</span>
          <span>{subTotal.toFixed(0)} ج.م</span>
        </div>

        {order.deliveryCharge && order.deliveryCharge > 0 && (
          <div className="flex justify-between">
            <span>رسوم التوصيل</span>
            <span>{order.deliveryCharge} ج.م</span>
          </div>
        )}

        {order.discount && order.discount > 0 && (
          <div className="flex justify-between text-red-600">
            <span>الخصم</span>
            <span>-{order.discount.toFixed(0)} ج.م</span>
          </div>
        )}

        <div className="flex justify-between text-xl font-bold border-t pt-3 mt-3">
          <span>الإجمالي النهائي</span>
          <span className="text-emerald-600">{total.toFixed(0)} ج.م</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-xs">
        <p className="font-bold">شكراً لزيارتكم ❤️</p>
        <p className="mt-2">نتمنى لكم يوماً سعيداً</p>
        <p className="mt-4 text-[10px] text-gray-400">نظام إلشامي POS © 2026</p>
      </div>
    </div>
  );
}