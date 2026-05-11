'use client';

import { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Utensils, 
  Wallet, 
  LogOut, 
  Search, 
  Plus, 
  Minus, 
  Trash2,
  Package, 
  MapPin, 
  Printer,
  Star
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

// --- البيانات التجريبية ---
const PRODUCTS = [
  { id: 1, nameAr: 'هامبرجر', price: 85.00, img: '🍔', category: 'وجبات', popular: true },
  { id: 2, nameAr: 'بيتزا', price: 150.00, img: '🍕', category: 'بيتزا', popular: true },
  { id: 3, nameAr: 'سوشي', price: 220.00, img: '🍣', category: 'سوشي', popular: false },
  { id: 4, nameAr: 'طاجن عكاوي', price: 180.00, img: '🥘', category: 'طواجن', popular: false },
  { id: 5, nameAr: 'كريب دجاج', price: 75.00, img: '🌯', category: 'معجنات', popular: true },
  { id: 6, nameAr: 'عصير برتقال', price: 35.00, img: '🍊', category: 'مشروبات', popular: false },
];

const initialStock = [
  { id: 1, name: 'هامبرجر', qty: 45, price: 85 },
  { id: 2, name: 'بيتزا', qty: 23, price: 150 },
];

export default function ProfessionalPOS() {
  const { isAdmin } = useAuthStore();
  
  // States
  const [activeTab, setActiveTab] = useState('Restaurants');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // حالة البحث
  const [cart, setCart] = useState<(typeof PRODUCTS[number] & { qty: number })[]>([]);
  const [orderType, setOrderType] = useState<'delivery' | 'dine_in' | 'takeaway'>('delivery');
  const [deliveryFee, setDeliveryFee] = useState<number>(10);
  const [address, setAddress] = useState('شارع 52، نيويورك الغربية');

  // --- تصفية المنتجات بناءً على البحث ---
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => 
      p.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // تقسيم المنتجات لـ "أكثر طلباً" وبقية المنيو
  const popularItems = filteredProducts.filter(p => p.popular);
  const regularItems = filteredProducts.filter(p => !p.popular);

  const totals = useMemo(() => {
    const sub = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const fee = orderType === 'delivery' ? deliveryFee : 0;
    return { sub, fee, total: sub + fee };
  }, [cart, orderType, deliveryFee]);

  const addToCart = (product: typeof PRODUCTS[number]) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const handleConfirmOrder = () => {
    if (cart.length === 0) return alert("السلة فارغة!");
    window.print();
    setCart([]);
  };

  const isAdminUser = isAdmin();

  return (
    <div className="flex h-screen bg-[#f3f4f6] font-sans overflow-hidden text-right" dir="ltr">
      
      {/* Sidebar - القائمة الجانبية */}
      <aside 
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
        className={`bg-white border-r transition-all duration-300 z-50 flex flex-col items-center py-6 
          ${isSidebarOpen ? 'w-64 shadow-2xl' : 'w-20'}`}
      >
        <div className="mb-10 text-emerald-600"><Utensils size={35} /></div>
        <nav className="w-full px-3 space-y-4">
          {[
            { id: 'Dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
            { id: 'Restaurants', label: 'المنيو', icon: Utensils },
            { id: 'Inventory', label: 'المخزون', icon: Package, adminOnly: true },
            { id: 'Expenses', label: 'المصاريف', icon: Wallet, adminOnly: true },
            { id: 'Delivery', label: 'التوصيل', icon: MapPin },
          ].map((item) => {
            if (item.adminOnly && !isAdminUser) return null;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all relative
                  ${activeTab === item.id ? 'bg-[#00a684] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <item.icon size={24} className="shrink-0" />
                {isSidebarOpen && <span className="font-bold text-left flex-1">{item.label}</span>}
              </button>
            );
          })}
        </nav>
        <button className="mt-auto p-4 text-red-400 hover:bg-red-50 rounded-xl w-full flex justify-center"><LogOut size={24} /></button>
      </aside>

      {/* Main Content - المحتوى الرئيسي */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden border-r">
        {/* Search Header - شريط البحث */}
        <header className="p-6 bg-white border-b">
          <div className="relative max-w-xl mx-auto">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن صنف أو تصنيف..." 
              className="w-full bg-gray-100 rounded-full py-3 px-12 outline-none border-2 border-transparent focus:border-emerald-500 focus:bg-white transition-all text-right" 
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-[#f9fafb]">
          {activeTab === 'Restaurants' && (
            <div className="space-y-12">
              
              {/* القسم الأول: الأكثر طلباً (باللون الأخضر) */}
              {popularItems.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-6 justify-end">
                    <h2 className="text-xl font-black text-gray-800">الأكثر طلباً</h2>
                    <Star size={20} className="text-orange-500 fill-orange-500" />
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {popularItems.map(p => (
                      <div key={p.id} onClick={() => addToCart(p)} 
                           className="bg-emerald-600 text-white rounded-[32px] p-6 cursor-pointer hover:scale-105 hover:shadow-2xl transition-all relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 opacity-10 group-hover:rotate-12 transition-transform">
                          <Utensils size={100} />
                        </div>
                        <div className="text-5xl mb-4 text-center">{p.img}</div>
                        <h3 className="font-bold text-center text-lg">{p.nameAr}</h3>
                        <p className="text-center font-black text-2xl mt-2">{p.price} <small className="text-xs">ج.م</small></p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* القسم الثاني: بقية المنيو */}
              <section>
                <h2 className="text-xl font-black text-gray-800 mb-6 border-r-4 border-emerald-500 pr-3 text-right">قائمة الطعام</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {regularItems.map(p => (
                    <div key={p.id} onClick={() => addToCart(p)} 
                         className="bg-white border border-gray-100 rounded-[32px] p-6 cursor-pointer hover:shadow-xl transition-all group">
                      <div className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform">{p.img}</div>
                      <h3 className="font-bold text-center text-gray-700">{p.nameAr}</h3>
                      <p className="text-center font-black text-xl mt-2 text-emerald-600">{p.price} <small className="text-xs text-gray-400">ج.م</small></p>
                    </div>
                  ))}
                </div>
                {filteredProducts.length === 0 && (
                  <div className="text-center py-20 text-gray-400 font-bold italic">لا توجد نتائج بحث مطابقة لـ "{searchQuery}"</div>
                )}
              </section>

            </div>
          )}

          {/* (بقية التبويبات المخزون والمصاريف تظل كما هي في الكود السابق) */}
          {activeTab === 'Inventory' && isAdminUser && ( <div className="text-right">شاشة المخزون...</div> )}
        </div>
      </main>

      {/* Cart Sidebar - سلة المشتريات */}
      <aside className="w-96 bg-[#00a684] p-6 text-white flex flex-col shadow-2xl">
        <div className="bg-black/20 rounded-3xl p-5 mb-6 border border-white/10">
          <h4 className="font-bold text-xs mb-3 flex flex-row-reverse items-center gap-2"><MapPin size={14}/> عنوان التوصيل</h4>
          {orderType === 'delivery' ? (
            <textarea value={address} onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-transparent border-b border-white/30 text-sm outline-none h-12 resize-none text-right"
              placeholder="اكتب العنوان بالتفصيل..." />
          ) : (
            <p className="text-right text-sm opacity-50 italic">طلب محلي - لا يحتاج عنوان</p>
          )}
        </div>

        <h3 className="text-xl font-black mb-6 flex flex-row-reverse items-center gap-2">🛒 السلة</h3>

        {/* أنواع الطلب */}
        <div className="flex flex-row-reverse bg-black/10 rounded-2xl p-1 mb-6">
          {(['delivery', 'dine_in', 'takeaway'] as const).map(type => (
            <button key={type} onClick={() => setOrderType(type)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${orderType === type ? 'bg-orange-500 shadow-lg' : 'opacity-60'}`}>
              {type === 'delivery' ? 'توصيل' : type === 'dine_in' ? 'صالة' : 'سفري'}
            </button>
          ))}
        </div>

        {/* عناصر السلة */}
        <div className="flex-1 space-y-4 overflow-y-auto">
          {cart.map(item => (
            <div key={item.id} className="flex flex-row-reverse justify-between items-center bg-white/10 p-4 rounded-2xl">
              <div className="flex flex-row-reverse items-center gap-3">
                <span className="text-2xl">{item.img}</span>
                <div className="text-right">
                  <h5 className="font-bold text-xs">{item.nameAr}</h5>
                  <p className="text-[10px] opacity-70">{item.price} ج.م</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(item.id, 1)} className="p-1 bg-white/10 rounded"><Plus size={14}/></button>
                <span className="font-bold w-4 text-center">{item.qty}</span>
                <button onClick={() => updateQty(item.id, -1)} className="p-1 bg-white/10 rounded"><Minus size={14}/></button>
                <button onClick={() => setCart(c => c.filter(i => i.id !== item.id))} className="mr-2 text-red-300">
                  <Trash2 size={16}/>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* الحسابات النهائية */}
        <div className="mt-6 pt-6 border-t border-white/20 space-y-3">
          <div className="flex flex-row-reverse justify-between text-sm opacity-80">
            <span>المجموع</span>
            <span>{totals.sub.toFixed(2)} ج.م</span>
          </div>
          {orderType === 'delivery' && (
            <div className="flex flex-row-reverse justify-between items-center text-sm">
              <span>رسوم التوصيل</span>
              <input type="number" value={deliveryFee} onChange={e => setDeliveryFee(Number(e.target.value))}
                className="w-16 bg-white/10 rounded px-2 text-center outline-none font-bold" />
            </div>
          )}
          <div className="flex flex-row-reverse justify-between text-2xl font-black pt-2 text-orange-400">
            <span>الإجمالي</span>
            <span>{totals.total.toFixed(2)} ج.م</span>
          </div>

          <button onClick={handleConfirmOrder}
            className="w-full bg-black py-4 rounded-2xl font-black text-lg mt-4 shadow-xl hover:bg-black/90 active:scale-95 transition-all">
            <Printer className="inline ml-2" size={20} /> تأكيد وطباعة
          </button>
        </div>
      </aside>
    </div>
  );
}