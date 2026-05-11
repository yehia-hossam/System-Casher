'use client';

import { useState, useMemo, useEffect } from 'react';
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
  Star,
  TrendingUp,
  Settings,
  Truck,
  Clock,
  UserPlus,
  Key,
  CheckCircle,
  AlertCircle,
  Edit,
  Eye
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

// --- البيانات التجريبية المنظمة ---
const PRODUCTS = [
  { id: 1, nameAr: 'هامبرجر', price: 85.00, img: '🍔', category: 'وجبات', popular: true, stockId: 1 },
  { id: 2, nameAr: 'بيتزا', price: 150.00, img: '🍕', category: 'بيتزا', popular: true, stockId: 2 },
  { id: 3, nameAr: 'سوشي', price: 220.00, img: '🍣', category: 'سوشي', popular: false, stockId: 3 },
  { id: 4, nameAr: 'طاجن عكاوي', price: 180.00, img: '🥘', category: 'طواجن', popular: false, stockId: 4 },
  { id: 5, nameAr: 'كريب دجاج', price: 75.00, img: '🌯', category: 'معجنات', popular: true, stockId: 5 },
  { id: 6, nameAr: 'عصير برتقال', price: 35.00, img: '🍊', category: 'مشروبات', popular: false, stockId: 6 },
];

// المخزون المتطور
const initialStock = [
  { id: 1, name: 'هامبرجر', qty: 45, price: 85, category: 'وجبات', minStock: 5 },
  { id: 2, name: 'بيتزا', qty: 23, price: 150, category: 'بيتزا', minStock: 5 },
  { id: 3, name: 'سوشي', qty: 8, price: 220, category: 'سوشي', minStock: 5 },
  { id: 4, name: 'طاجن عكاوي', qty: 12, price: 180, category: 'طواجن', minStock: 5 },
  { id: 5, name: 'كريب دجاج', qty: 4, price: 75, category: 'معجنات', minStock: 5 },
  { id: 6, name: 'عصير برتقال', qty: 30, price: 35, category: 'مشروبات', minStock: 5 },
];

// المصاريف
const initialExpenses = [
  { id: 1, title: 'رواتب الموظفين', amount: 18500, date: '2026-05-01', category: 'رواتب' },
  { id: 2, title: 'إيجار المحل', amount: 12000, date: '2026-05-01', category: 'إيجارات' },
  { id: 3, title: 'فواتير كهرباء', amount: 2500, date: '2026-05-05', category: 'مرافق' },
];

// طلبات التوصيل
interface DeliveryOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  address: string;
  phone: string;
  items: string;
  totalAmount: number;
  deliveryFee: number;
  driverName: string;
  orderTime: Date;
  status: 'pending' | 'delivering' | 'delivered';
  isLate: boolean;
}

// المستخدمين
const initialUsers = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', createdAt: new Date() },
  { id: 2, username: 'cashier1', password: 'cash123', role: 'cashier', createdAt: new Date() },
];

export default function ProfessionalPOS() {
  const { isAdmin } = useAuthStore();
  
  // States الأساسية
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<(typeof PRODUCTS[number] & { qty: number })[]>([]);
  const [orderType, setOrderType] = useState<'delivery' | 'dine_in' | 'takeaway'>('delivery');
  const [deliveryFee, setDeliveryFee] = useState<number>(10);
  const [address, setAddress] = useState('شارع 52، نيويورك الغربية');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [showNotification, setShowNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // بيانات الأقسام
  const [salesData] = useState({ today: 12450, thisMonth: 245800, ordersCount: 87 });
  const [stock, setStock] = useState(initialStock);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([]);
  const [users, setUsers] = useState(initialUsers);
  
  // مودالات
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddCashierModal, setShowAddCashierModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [newStockItem, setNewStockItem] = useState({ name: '', qty: 0, price: 0, category: '', minStock: 5 });
  const [newExpense, setNewExpense] = useState({ title: '', amount: 0, category: '', notes: '' });
  const [newCashier, setNewCashier] = useState({ username: '', password: '' });
  const [resetPasswordData, setResetPasswordData] = useState({ username: '', newPassword: '' });

  // إظهار الإشعارات
  const showTempNotification = (message: string, type: 'success' | 'error') => {
    setShowNotification({ message, type });
    setTimeout(() => setShowNotification(null), 3000);
  };

  // مؤقت التوصيل - يظهر بالاحمر بعد 15 دقيقة
  useEffect(() => {
    const interval = setInterval(() => {
      setDeliveryOrders(prev => prev.map(order => {
        if (order.status === 'delivering' && order.orderTime) {
          const elapsedMinutes = (new Date().getTime() - new Date(order.orderTime).getTime()) / 60000;
          return { ...order, isLate: elapsedMinutes > 15 };
        }
        return order;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // فلتر المنتجات
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => 
      p.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const popularItems = filteredProducts.filter(p => p.popular);
  const regularItems = filteredProducts.filter(p => !p.popular);

  // حسابات السلة
  const totals = useMemo(() => {
    const sub = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const fee = orderType === 'delivery' ? deliveryFee : 0;
    return { sub, fee, total: sub + fee };
  }, [cart, orderType, deliveryFee]);

  // إضافة للسلة مع التحقق من المخزون
  const addToCart = (product: typeof PRODUCTS[number]) => {
    const stockItem = stock.find(s => s.id === product.stockId);
    if (stockItem && stockItem.qty <= 0) {
      showTempNotification(`${product.nameAr} غير متوفر في المخزون`, 'error');
      return;
    }
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        const newQty = exists.qty + 1;
        if (stockItem && newQty > stockItem.qty) {
          showTempNotification(`الكمية المتاحة: ${stockItem.qty} فقط`, 'error');
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, qty: newQty } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        const stockItem = stock.find(s => s.id === item.stockId);
        if (stockItem && newQty > stockItem.qty) {
          showTempNotification(`الكمية المتاحة: ${stockItem.qty} فقط`, 'error');
          return item;
        }
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  // إنشاء طلب توصيل
  const createDeliveryOrder = () => {
    if (cart.length === 0) {
      showTempNotification('السلة فارغة!', 'error');
      return;
    }
    if (!customerName || !customerPhone || !address) {
      showTempNotification('يرجى إدخال بيانات العميل كاملة', 'error');
      return;
    }

    const newOrder: DeliveryOrder = {
      id: deliveryOrders.length + 1,
      orderNumber: `ORD-${Date.now()}`,
      customerName,
      address,
      phone: customerPhone,
      items: cart.map(item => `${item.qty}x ${item.nameAr}`).join(', '),
      totalAmount: totals.total,
      deliveryFee,
      driverName: 'لم يتم التعيين',
      orderTime: new Date(),
      status: 'pending',
      isLate: false
    };

    setDeliveryOrders([newOrder, ...deliveryOrders]);
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    showTempNotification('تم إنشاء طلب التوصيل بنجاح', 'success');
  };

  // تأكيد الطلب العادي
  const handleConfirmOrder = () => {
    if (cart.length === 0) {
      showTempNotification('السلة فارغة!', 'error');
      return;
    }
    if (orderType === 'delivery') {
      createDeliveryOrder();
    } else {
      showTempNotification('تم تأكيد الطلب بنجاح', 'success');
      window.print();
      setCart([]);
    }
  };

  // تحديث حالة التوصيل
  const updateDeliveryStatus = (orderId: number, status: DeliveryOrder['status']) => {
    setDeliveryOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updates: Partial<DeliveryOrder> = { status };
        if (status === 'delivering') {
          updates.orderTime = new Date();
        }
        return { ...order, ...updates };
      }
      return order;
    }));
    showTempNotification('تم تحديث حالة الطلب', 'success');
  };

  // تحديث اسم الطيار
  const updateDriverName = (orderId: number, driverName: string) => {
    setDeliveryOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, driverName } : order
    ));
  };

  // إدارة المخزون
  const addStockItem = () => {
    if (!newStockItem.name || newStockItem.qty <= 0) {
      showTempNotification('يرجى إدخال بيانات صحيحة', 'error');
      return;
    }
    const newId = Math.max(...stock.map(s => s.id), 0) + 1;
    setStock([...stock, { ...newStockItem, id: newId, price: newStockItem.price || 0 }]);
    setShowAddStockModal(false);
    setNewStockItem({ name: '', qty: 0, price: 0, category: '', minStock: 5 });
    showTempNotification('تم إضافة الصنف بنجاح', 'success');
  };

  const updateStockQty = (id: number, delta: number) => {
    setStock(stock.map(item => 
      item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
    ));
  };

  // إدارة المصاريف
  const addExpense = () => {
    if (!newExpense.title || newExpense.amount <= 0) {
      showTempNotification('يرجى إدخال بيانات صحيحة', 'error');
      return;
    }
    const newId = Math.max(...expenses.map(e => e.id), 0) + 1;
    setExpenses([...expenses, { 
      ...newExpense, 
      id: newId, 
      date: new Date().toISOString().split('T')[0] 
    }]);
    setShowAddExpenseModal(false);
    setNewExpense({ title: '', amount: 0, category: '', notes: '' });
    showTempNotification('تم إضافة المصروف بنجاح', 'success');
  };

  // إدارة المستخدمين
  const addCashier = () => {
    if (!newCashier.username || !newCashier.password) {
      showTempNotification('يرجى إدخال جميع البيانات', 'error');
      return;
    }
    if (users.find(u => u.username === newCashier.username)) {
      showTempNotification('اسم المستخدم موجود بالفعل', 'error');
      return;
    }
    const newId = Math.max(...users.map(u => u.id), 0) + 1;
    setUsers([...users, { ...newCashier, id: newId, role: 'cashier', createdAt: new Date() }]);
    setShowAddCashierModal(false);
    setNewCashier({ username: '', password: '' });
    showTempNotification('تم إضافة الكاشير بنجاح', 'success');
  };

  const resetPassword = () => {
    const user = users.find(u => u.username === resetPasswordData.username);
    if (!user) {
      showTempNotification('اسم المستخدم غير موجود', 'error');
      return;
    }
    setUsers(users.map(u => 
      u.username === resetPasswordData.username 
        ? { ...u, password: resetPasswordData.newPassword }
        : u
    ));
    setShowResetPasswordModal(false);
    setResetPasswordData({ username: '', newPassword: '' });
    showTempNotification('تم إعادة تعيين كلمة المرور', 'success');
  };

  // إحصائيات
  const lowStockItems = stock.filter(item => item.qty <= item.minStock);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pendingDeliveries = deliveryOrders.filter(o => o.status !== 'delivered').length;

  const isAdminUser = isAdmin();

  return (
    <div className="flex h-screen bg-[#f3f4f6] font-sans overflow-hidden text-right" dir="ltr">
      
      {/* إشعارات */}
      {showNotification && (
        <div className={`fixed top-20 right-5 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-2 ${
          showNotification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {showNotification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {showNotification.message}
        </div>
      )}

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
            { id: 'Settings', label: 'الإعدادات', icon: Settings, adminOnly: true },
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden border-r">
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
          
          {/* ==================== لوحة التحكم ==================== */}
          {activeTab === 'Dashboard' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-800 border-r-4 border-emerald-500 pr-4">لوحة التحكم</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg">
                  <p className="text-sm opacity-90">مبيعات اليوم</p>
                  <p className="text-3xl font-bold mt-2">{salesData.today} ج.م</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
                  <p className="text-sm opacity-90">مبيعات الشهر</p>
                  <p className="text-3xl font-bold mt-2">{salesData.thisMonth} ج.م</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
                  <p className="text-sm opacity-90">طلبات التوصيل</p>
                  <p className="text-3xl font-bold mt-2">{pendingDeliveries}</p>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg">
                  <p className="text-sm opacity-90">مخزون منخفض</p>
                  <p className="text-3xl font-bold mt-2">{lowStockItems.length}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">قائمة الطعام السريعة</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {PRODUCTS.slice(0, 4).map(p => (
                    <div key={p.id} onClick={() => addToCart(p)} 
                         className="bg-gray-50 rounded-xl p-4 text-center cursor-pointer hover:shadow-md transition-all">
                      <div className="text-3xl mb-2">{p.img}</div>
                      <p className="font-bold text-gray-700 text-sm">{p.nameAr}</p>
                      <p className="text-emerald-600 font-bold">{p.price} ج.م</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== المنيو ==================== */}
          {activeTab === 'Restaurants' && (
            <div className="space-y-12">
              {popularItems.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-6 justify-end">
                    <h2 className="text-xl font-black text-gray-800">الأكثر طلباً</h2>
                    <Star size={20} className="text-orange-500 fill-orange-500" />
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {popularItems.map(p => {
                      const stockItem = stock.find(s => s.id === p.stockId);
                      const isOutOfStock = stockItem && stockItem.qty <= 0;
                      return (
                        <div key={p.id} onClick={() => !isOutOfStock && addToCart(p)} 
                             className={`bg-emerald-600 text-white rounded-[32px] p-6 cursor-pointer hover:scale-105 hover:shadow-2xl transition-all relative overflow-hidden group ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <div className="absolute -right-4 -top-4 opacity-10 group-hover:rotate-12 transition-transform">
                            <Utensils size={100} />
                          </div>
                          <div className="text-5xl mb-4 text-center">{p.img}</div>
                          <h3 className="font-bold text-center text-lg">{p.nameAr}</h3>
                          <p className="text-center font-black text-2xl mt-2">{p.price} <small className="text-xs">ج.م</small></p>
                          {isOutOfStock && <p className="text-center text-xs mt-2">غير متوفر</p>}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              <section>
                <h2 className="text-xl font-black text-gray-800 mb-6 border-r-4 border-emerald-500 pr-3 text-right">قائمة الطعام</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {regularItems.map(p => {
                    const stockItem = stock.find(s => s.id === p.stockId);
                    const isOutOfStock = stockItem && stockItem.qty <= 0;
                    return (
                      <div key={p.id} onClick={() => !isOutOfStock && addToCart(p)} 
                           className={`bg-white border border-gray-100 rounded-[32px] p-6 cursor-pointer hover:shadow-xl transition-all group ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <div className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform">{p.img}</div>
                        <h3 className="font-bold text-center text-gray-700">{p.nameAr}</h3>
                        <p className="text-center font-black text-xl mt-2 text-emerald-600">{p.price} <small className="text-xs text-gray-400">ج.م</small></p>
                        {isOutOfStock && <p className="text-center text-xs text-red-500 mt-2">غير متوفر</p>}
                      </div>
                    );
                  })}
                </div>
                {filteredProducts.length === 0 && (
                  <div className="text-center py-20 text-gray-400 font-bold italic">لا توجد نتائج بحث مطابقة لـ "{searchQuery}"</div>
                )}
              </section>
            </div>
          )}

          {/* ==================== المخزون ==================== */}
          {activeTab === 'Inventory' && isAdminUser && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold border-r-4 border-emerald-500 pr-4">إدارة المخزون</h2>
                <button onClick={() => setShowAddStockModal(true)} 
                  className="bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-600">
                  <Plus size={18} /> إضافة صنف
                </button>
              </div>

              {lowStockItems.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                  <p className="text-red-700 font-bold">⚠️ تنبيه: الأصناف التالية أقل من 5 قطع</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {lowStockItems.map(item => (
                      <span key={item.id} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                        {item.name} ({item.qty} قطع)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stock.map(item => (
                  <div key={item.id} className={`bg-white p-6 rounded-3xl shadow-sm border-2 ${item.qty <= item.minStock ? 'border-red-300 bg-red-50/30' : 'border-gray-100'}`}>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-gray-500 text-sm">{item.category}</p>
                    <p className={`text-3xl font-black mt-4 ${item.qty <= item.minStock ? 'text-red-500' : 'text-emerald-600'}`}>
                      {item.qty} <span className="text-base font-normal">قطعة</span>
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => updateStockQty(item.id, 1)} className="flex-1 bg-gray-100 py-2 rounded-xl hover:bg-gray-200">+ زيادة</button>
                      <button onClick={() => updateStockQty(item.id, -1)} className="flex-1 bg-gray-100 py-2 rounded-xl hover:bg-gray-200" disabled={item.qty <= 0}>- إنقاص</button>
                    </div>
                    <p className="mt-3 text-gray-600">السعر: {item.price} ج.م</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== المصاريف ==================== */}
          {activeTab === 'Expenses' && isAdminUser && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold border-r-4 border-emerald-500 pr-4">المصاريف</h2>
                <button onClick={() => setShowAddExpenseModal(true)}
                  className="bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-600">
                  <Plus size={18} /> إضافة مصروف
                </button>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-2xl mb-6">
                <p className="text-sm opacity-90">إجمالي المصاريف</p>
                <p className="text-4xl font-bold mt-2">{totalExpenses} ج.م</p>
              </div>

              <div className="space-y-4">
                {expenses.map(exp => (
                  <div key={exp.id} className="bg-white p-5 rounded-2xl flex justify-between items-center shadow-sm">
                    <div>
                      <p className="font-bold text-lg">{exp.title}</p>
                      <p className="text-sm text-gray-500">{exp.date} - {exp.category}</p>
                    </div>
                    <p className="text-2xl font-bold text-red-600">-{exp.amount} ج.م</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== التوصيل ==================== */}
          {activeTab === 'Delivery' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 border-r-4 border-emerald-500 pr-4">طلبات التوصيل</h2>
              
              {deliveryOrders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl">
                  <Truck size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-400">لا توجد طلبات توصيل</p>
                  <p className="text-sm text-gray-300">قم بإنشاء طلب من السلة الجانبية</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {deliveryOrders.map(order => {
                    const elapsedMinutes = order.status === 'delivering' && order.orderTime
                      ? Math.floor((new Date().getTime() - new Date(order.orderTime).getTime()) / 60000)
                      : 0;
                    const isLate = order.status === 'delivering' && elapsedMinutes > 15;
                    
                    return (
                      <div key={order.id} className={`bg-white rounded-2xl shadow-sm border-2 p-6 transition-all ${isLate ? 'border-red-400 bg-red-50/30' : 'border-gray-100'}`}>
                        <div className="flex justify-between items-start mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'delivering' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status === 'delivered' ? 'تم التوصيل' :
                             order.status === 'delivering' ? 'جاري التوصيل' : 'قيد الانتظار'}
                          </span>
                          <p className="font-mono text-sm text-gray-500">{order.orderNumber}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-gray-500 text-sm">العميل</p>
                            <p className="font-bold">{order.customerName}</p>
                            <p className="text-sm text-gray-600">{order.phone}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm">العنوان</p>
                            <p className="text-sm">{order.address}</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-gray-500 text-sm">الطلبات</p>
                          <p className="text-sm">{order.items}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-gray-500 text-sm">الإجمالي</p>
                            <p className="font-bold text-emerald-600">{order.totalAmount} ج.م</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm">وقت الطلب</p>
                            <p className={`text-sm flex items-center gap-1 ${isLate ? 'text-red-600 font-bold' : ''}`}>
                              {new Date(order.orderTime).toLocaleTimeString('ar-EG')}
                              {isLate && <Clock size={14} className="text-red-500" />}
                              {isLate && ` (متأخر ${elapsedMinutes - 15} دقيقة)`}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 flex-wrap">
                          <div className="flex-1">
                            <label className="text-sm text-gray-500 block mb-1">✈️ اسم الطيار</label>
                            <input 
                              type="text"
                              value={order.driverName}
                              onChange={(e) => updateDriverName(order.id, e.target.value)}
                              className="border border-gray-200 rounded-lg p-2 w-full text-sm"
                              placeholder="أدخل اسم الطيار"
                            />
                          </div>
                          
                          {order.status !== 'delivered' && (
                            <>
                              {order.status === 'pending' && (
                                <button onClick={() => updateDeliveryStatus(order.id, 'delivering')}
                                  className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-600 flex items-center gap-2">
                                  <Truck size={16} /> بدء التوصيل
                                </button>
                              )}
                              {order.status === 'delivering' && (
                                <button onClick={() => updateDeliveryStatus(order.id, 'delivered')}
                                  className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-emerald-600 flex items-center gap-2">
                                  <CheckCircle size={16} /> تم الاستلام
                                </button>
                              )}
                            </>
                          )}
                          
                          {order.status === 'delivering' && (
                            <div className={`text-sm flex items-center gap-2 ${isLate ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                              <Clock size={16} />
                              الوقت: {elapsedMinutes} دقيقة
                              {elapsedMinutes <= 15 ? ` (متبقي ${15 - elapsedMinutes})` : ' (متأخر!)'}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ==================== الإعدادات ==================== */}
          {activeTab === 'Settings' && isAdminUser && (
            <div>
              <h2 className="text-2xl font-bold mb-6 border-r-4 border-emerald-500 pr-4">الإعدادات</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <UserPlus size={24} className="text-emerald-500" />
                    <h3 className="text-xl font-bold">إضافة كاشير جديد</h3>
                  </div>
                  <button onClick={() => setShowAddCashierModal(true)}
                    className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold hover:bg-emerald-600">
                    + إضافة كاشير
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Key size={24} className="text-orange-500" />
                    <h3 className="text-xl font-bold">إعادة تعيين كلمة المرور</h3>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">في حالة نسيان كلمة المرور</p>
                  <button onClick={() => setShowResetPasswordModal(true)}
                    className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600">
                    إعادة تعيين
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 lg:col-span-2">
                  <h3 className="text-xl font-bold mb-4">قائمة الكاشير</h3>
                  <div className="space-y-3">
                    {users.map(user => (
                      <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-bold">{user.username}</p>
                          <p className="text-xs text-gray-500">{user.role === 'admin' ? 'مدير' : 'كاشير'}</p>
                        </div>
                        <p className="text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString('ar-EG')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Cart Sidebar - سلة المشتريات */}
      <aside className="w-96 bg-[#00a684] p-6 text-white flex flex-col shadow-2xl">
        <div className="bg-black/20 rounded-3xl p-5 mb-6 border border-white/10">
          <h4 className="font-bold text-xs mb-3 flex flex-row-reverse items-center gap-2"><MapPin size={14}/> بيانات العميل</h4>
          {orderType === 'delivery' ? (
            <div className="space-y-2">
              <input 
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="اسم العميل"
                className="w-full bg-transparent border-b border-white/30 text-sm outline-none p-1 placeholder-white/50"
              />
              <input 
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="رقم الهاتف"
                className="w-full bg-transparent border-b border-white/30 text-sm outline-none p-1 placeholder-white/50"
              />
              <textarea 
                value={address} 
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-transparent border-b border-white/30 text-sm outline-none h-12 resize-none text-right placeholder-white/50"
                placeholder="العنوان بالتفصيل..." 
              />
            </div>
          ) : (
            <p className="text-right text-sm opacity-50 italic">طلب محلي - لا يحتاج عنوان</p>
          )}
        </div>

        <h3 className="text-xl font-black mb-6 flex flex-row-reverse items-center gap-2">🛒 السلة</h3>

        <div className="flex flex-row-reverse bg-black/10 rounded-2xl p-1 mb-6">
          {(['delivery', 'dine_in', 'takeaway'] as const).map(type => (
            <button key={type} onClick={() => setOrderType(type)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${orderType === type ? 'bg-orange-500 shadow-lg' : 'opacity-60'}`}>
              {type === 'delivery' ? 'توصيل' : type === 'dine_in' ? 'صالة' : 'سفري'}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px]">
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
          {cart.length === 0 && (
            <div className="text-center py-12 opacity-60">
              <p>السلة فارغة</p>
            </div>
          )}
        </div>

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
            <Printer className="inline ml-2" size={20} /> {orderType === 'delivery' ? 'طلب توصيل' : 'تأكيد وطباعة'}
          </button>
        </div>
      </aside>

      {/* ==================== مودالات ==================== */}
      
      {/* مودال إضافة صنف للمخزون */}
      {showAddStockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddStockModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-96" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">إضافة صنف جديد</h3>
            <div className="space-y-3">
              <input type="text" placeholder="اسم الصنف" className="w-full border rounded-xl p-2"
                value={newStockItem.name} onChange={e => setNewStockItem({...newStockItem, name: e.target.value})} />
              <input type="number" placeholder="الكمية" className="w-full border rounded-xl p-2"
                value={newStockItem.qty} onChange={e => setNewStockItem({...newStockItem, qty: Number(e.target.value)})} />
              <input type="number" placeholder="السعر" className="w-full border rounded-xl p-2"
                value={newStockItem.price} onChange={e => setNewStockItem({...newStockItem, price: Number(e.target.value)})} />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={addStockItem} className="flex-1 bg-emerald-500 text-white py-2 rounded-xl">إضافة</button>
              <button onClick={() => setShowAddStockModal(false)} className="flex-1 bg-gray-200 py-2 rounded-xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* مودال إضافة مصروف */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddExpenseModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-96" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">إضافة مصروف</h3>
            <div className="space-y-3">
              <input type="text" placeholder="العنوان" className="w-full border rounded-xl p-2"
                value={newExpense.title} onChange={e => setNewExpense({...newExpense, title: e.target.value})} />
              <input type="number" placeholder="المبلغ" className="w-full border rounded-xl p-2"
                value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})} />
              <input type="text" placeholder="التصنيف" className="w-full border rounded-xl p-2"
                value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={addExpense} className="flex-1 bg-emerald-500 text-white py-2 rounded-xl">إضافة</button>
              <button onClick={() => setShowAddExpenseModal(false)} className="flex-1 bg-gray-200 py-2 rounded-xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* مودال إضافة كاشير */}
      {showAddCashierModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddCashierModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-96" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">إضافة كاشير جديد</h3>
            <div className="space-y-3">
              <input type="text" placeholder="اسم المستخدم" className="w-full border rounded-xl p-2"
                value={newCashier.username} onChange={e => setNewCashier({...newCashier, username: e.target.value})} />
              <input type="password" placeholder="كلمة المرور" className="w-full border rounded-xl p-2"
                value={newCashier.password} onChange={e => setNewCashier({...newCashier, password: e.target.value})} />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={addCashier} className="flex-1 bg-emerald-500 text-white py-2 rounded-xl">إضافة</button>
              <button onClick={() => setShowAddCashierModal(false)} className="flex-1 bg-gray-200 py-2 rounded-xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* مودال إعادة تعيين كلمة المرور */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowResetPasswordModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-96" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">إعادة تعيين كلمة المرور</h3>
            <div className="space-y-3">
              <input type="text" placeholder="اسم المستخدم" className="w-full border rounded-xl p-2"
                value={resetPasswordData.username} onChange={e => setResetPasswordData({...resetPasswordData, username: e.target.value})} />
              <input type="password" placeholder="كلمة المرور الجديدة" className="w-full border rounded-xl p-2"
                value={resetPasswordData.newPassword} onChange={e => setResetPasswordData({...resetPasswordData, newPassword: e.target.value})} />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={resetPassword} className="flex-1 bg-orange-500 text-white py-2 rounded-xl">تغيير</button>
              <button onClick={() => setShowResetPasswordModal(false)} className="flex-1 bg-gray-200 py-2 rounded-xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}