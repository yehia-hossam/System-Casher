// app/pos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { usePosStore } from '../store/usePosStore';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCart, LogOut, Package, TrendingDown, DollarSign, Search, 
  Plus, Minus, Trash2, Bike, Users, Coffee, Printer 
} from 'lucide-react';
import Receipt from '../components/common/Receipt';

export default function POSPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'pos' | 'returns' | 'inventory' | 'expenses'>('pos');
  const [selectedPayment, setSelectedPayment] = useState<'delivery' | 'dine_in' | 'takeaway'>('delivery');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const {
    products, cart, lastOrder,
    addToCart, removeFromCart, updateQuantity, completeOrder,
  } = usePosStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user) return null;

  const subTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = selectedPayment === 'delivery' ? 10 : 0;
  const discount = 0;
  const total = subTotal + deliveryCharge - discount;

  const categories = ['الكل', ...new Set(products.map(p => p.category))];
  const filteredProducts = products.filter(p => 
    selectedCategory === 'الكل' || p.category === selectedCategory
  );

  const handleConfirmOrder = () => {
    if (cart.length === 0) return alert('السلة فارغة');
    completeOrder();
    alert('✅ تم تأكيد الطلب بنجاح!');
  };

  const printReceipt = () => {
    if (lastOrder) window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden" dir="rtl">
      {/* Left Sidebar - Hover فقط */}
      <div 
        className={`bg-white border-l h-screen transition-all duration-300 z-50
          ${isSidebarOpen ? 'w-72' : 'w-20'} shrink-0`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="p-5 border-b flex items-center gap-3">
          <div className="text-4xl"></div>
          <div className={`font-bold text-2xl transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            إلشامي
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {[
            { id: 'pos', label: 'نقاط البيع', icon: ShoppingCart },
            { id: 'returns', label: 'المرتجعات', icon: TrendingDown },
            { id: 'inventory', label: 'إدارة المخزون', icon: Package },
            { id: 'expenses', label: 'المصاريف', icon: DollarSign },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'pos' | 'returns' | 'inventory' | 'expenses')}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-right transition-all hover:bg-emerald-50
                ${activeTab === tab.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'}`}
            >
              <tab.icon size={24} className="shrink-0" />
              <span className={`font-medium transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar - مشابه للصورة */}
        <div className="bg-white shadow border-b px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold"> كاشير </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div>
              <span className="text-gray-500">الكاشير : </span>
              <span className="font-semibold">{user.name}</span>
            </div>
          </div>

          <div className="relative w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="ابحث عن مطعم، طعام، مطبخ..."
              className="w-full pl-5 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button onClick={() => { logout(); router.push('/login'); }} className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg flex items-center gap-2">
            <LogOut size={20} /> خروج
          </button>
        </div>

        <div className="flex flex-1 p-6 gap-6 overflow-hidden">
          {/* Products Section */}
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-bold">قائمة الطعام</h2>
            </div>

            <div className="flex gap-3 flex-wrap mb-6">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm ${selectedCategory === cat ? 'bg-orange-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto flex-1">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-linear-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-3xl text-white">
                      {product.nameAr[0]}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold">{product.nameAr}</h4>
                      <p className="text-orange-600 font-semibold">{product.price} ج.م</p>
                      <button
                        onClick={() => addToCart(product)}
                        className="mt-3 bg-orange-500 text-white px-5 py-1.5 rounded-lg text-sm hover:bg-orange-600"
                      >
                        أضف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Panel - زي الصورة الأصلية */}
          <div className="w-95 bg-white rounded-2xl shadow-xl p-5 flex flex-col h-fit sticky top-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <ShoppingCart size={22} /> السلة
            </h3>

            {/* Payment Methods */}
            <div className="flex gap-2 mb-5">
              {[
                { value: 'delivery', label: 'توصيل', icon: Bike },
                { value: 'dine_in', label: 'داخل', icon: Users },
                { value: 'takeaway', label: 'خارجي', icon: Coffee },
              ].map(m => (
                <button
                  key={m.value}
                  onClick={() => setSelectedPayment(m.value as 'delivery' | 'dine_in' | 'takeaway')}
                  className={`flex-1 py-2 rounded-xl text-sm flex items-center justify-center gap-1.5 transition ${
                    selectedPayment === m.value ? 'bg-orange-500 text-white' : 'bg-gray-100'
                  }`}
                >
                  <m.icon size={18} />
                  {m.label}
                </button>
              ))}
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-auto space-y-3 mb-5">
              {cart.length === 0 ? (
                <p className="text-center text-gray-400 py-10">السلة فارغة</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                    <div>
                      <p>{item.nameAr}</p>
                      <p className="text-sm text-gray-500">{item.price} ج.م</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={16} /></button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={16} /></button>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">المجموع الفرعي</span>
                <span>{subTotal.toFixed(2)} ج.م</span>
              </div>
              {deliveryCharge > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">رسوم التوصيل</span>
                  <span>{deliveryCharge} ج.م</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>الخصم</span>
                  <span>-{discount.toFixed(2)} ج.م</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold border-t pt-3">
                <span>الإجمالي</span>
                <span className="text-orange-600">{total.toFixed(2)} ج.م</span>
              </div>
            </div>

            <button
              onClick={handleConfirmOrder}
              disabled={cart.length === 0}
              className="w-full mt-6 py-4 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold text-lg disabled:bg-gray-300"
            >
              تأكيد الطلب
            </button>

            {lastOrder && (
              <button
                onClick={printReceipt}
                className="w-full mt-3 py-3 border border-gray-300 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50"
              >
                <Printer size={20} /> طباعة الفاتورة
              </button>
            )}
          </div>
        </div>
      </div>

      {/* الفاتورة للطباعة */}
      {lastOrder && <Receipt order={lastOrder} />}
    </div>
  );
}