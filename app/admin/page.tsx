// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { usePosStore } from '../store/usePosStore';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Receipt, 
  LogOut, 
  Plus, 
  Trash2 
} from 'lucide-react';

export default function AdminPage() {
  const { user, logout } = useAuthStore();
  const { 
    products, 
    orders, 
    addProduct, 
    deleteProduct, 
    updateStock 
  } = usePosStore();

  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'cashiers' | 'reports'>('dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);

  // نموذج إضافة منتج
  const [newProduct, setNewProduct] = useState({
    nameAr: '',
    name: '',
    category: '',
    price: 0,
    stock: 0,
  });

  // نموذج إضافة كاشير (سيتم تطويره بعد تحديث useAuthStore)
  const [newCashier, setNewCashier] = useState({
    name: '',
    password: '',
  });

  // حماية الصفحة
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') return null;

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const completedOrders = orders.filter(o => o.status === 'completed').length;

  const handleAddProduct = () => {
    if (!newProduct.nameAr || newProduct.price <= 0) {
      alert('⚠️ يرجى إدخال اسم المنتج والسعر');
      return;
    }

    addProduct({
      name: newProduct.name || newProduct.nameAr,
      nameAr: newProduct.nameAr,
      price: newProduct.price,
      category: newProduct.category || 'غير مصنف',
      stock: newProduct.stock,
    });

    setNewProduct({ nameAr: '', name: '', category: '', price: 0, stock: 0 });
    setShowAddProduct(false);
    alert('✅ تم إضافة المنتج بنجاح');
  };

  const handleAddCashier = () => {
    if (!newCashier.name || !newCashier.password) {
      alert('⚠️ يرجى ملء جميع الحقول');
      return;
    }
    alert('✅ سيتم إضافة الكاشير (بعد تحديث useAuthStore)');
    // سيتم تنفيذه بعد تحديث useAuthStore
    setNewCashier({ name: '', password: '' });
  };

  const stats = [
    { title: 'إجمالي المبيعات', value: `${totalSales.toFixed(2)} ج.م`, icon: Receipt, color: 'bg-green-500' },
    { title: 'الطلبات المكتملة', value: completedOrders, icon: Package, color: 'bg-blue-500' },
    { title: 'عدد المنتجات', value: products.length, icon: Package, color: 'bg-orange-500' },
    { title: 'الكاشير', value: 3, icon: Users, color: 'bg-purple-500' }, // مؤقت
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Top Bar */}
      <div className="bg-linear-to-r from-emerald-700 to-teal-700 text-white p-5 shadow-lg">
        <div className="flex justify-between items-center max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="text-3xl">🛡️</div>
            <div>
              <h1 className="text-2xl font-bold">لوحة تحكم المدير</h1>
              <p className="text-emerald-100 text-sm">نظام إلشامي للمبيعات</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-emerald-100">مدير النظام</p>
            </div>
            <button
              onClick={() => { logout(); router.push('/login'); }}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition"
            >
              <LogOut size={20} />
              خروج
            </button>
          </div>
        </div>
      </div>

      <div className="flex max-w-screen-2xl mx-auto">
        {/* Sidebar Navigation */}
        <div className="w-72 bg-white border-l border-gray-200 min-h-[calc(100vh-80px)] p-6">
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'لوحة المعلومات', icon: LayoutDashboard },
              { id: 'products', label: 'إدارة المنتجات', icon: Package },
              { id: 'cashiers', label: 'إدارة الكاشير', icon: Users },
              { id: 'reports', label: 'التقارير والمبيعات', icon: Receipt },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'dashboard' | 'products' | 'cashiers' | 'reports')}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-right transition-all ${
                  activeTab === tab.id 
                    ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <tab.icon size={22} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">{stat.title}</p>
                        <p className="text-3xl font-bold mt-3">{stat.value}</p>
                      </div>
                      <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white`}>
                        <stat.icon size={28} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-3xl shadow-sm p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">إدارة المنتجات</h2>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition"
                >
                  <Plus size={22} />
                  إضافة منتج جديد
                </button>
              </div>

              {/* Add Product Form */}
              {showAddProduct && (
                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl mb-8">
                  <h3 className="font-semibold mb-4 text-lg">إضافة منتج جديد</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <input
                      placeholder="اسم المنتج بالعربية"
                      value={newProduct.nameAr}
                      onChange={(e) => setNewProduct({ ...newProduct, nameAr: e.target.value })}
                      className="px-4 py-3 border rounded-2xl focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      placeholder="اسم المنتج (English)"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="px-4 py-3 border rounded-2xl focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      placeholder="التصنيف"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="px-4 py-3 border rounded-2xl focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="number"
                      placeholder="السعر"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      className="px-4 py-3 border rounded-2xl focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="number"
                      placeholder="المخزون"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                      className="px-4 py-3 border rounded-2xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={handleAddProduct} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl hover:bg-emerald-700">
                      حفظ المنتج
                    </button>
                    <button onClick={() => setShowAddProduct(false)} className="bg-gray-300 px-8 py-3 rounded-2xl">
                      إلغاء
                    </button>
                  </div>
                </div>
              )}

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-4 text-right">المنتج</th>
                      <th className="p-4 text-right">التصنيف</th>
                      <th className="p-4 text-right">السعر</th>
                      <th className="p-4 text-right">المخزون</th>
                      <th className="p-4 text-right">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">{product.nameAr}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">{product.category}</span>
                        </td>
                        <td className="p-4 font-semibold text-emerald-600">{product.price} ج.م</td>
                        <td className="p-4">
                          <input
                            type="number"
                            value={product.stock}
                            onChange={(e) => updateStock(product.id, parseInt(e.target.value))}
                            className="w-24 text-center border rounded-lg py-1"
                          />
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700 flex items-center gap-1"
                          >
                            <Trash2 size={18} />
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Cashiers Tab */}
          {activeTab === 'cashiers' && (
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="text-3xl font-bold mb-8">إدارة الكاشير</h2>
              {/* Add Cashier Form */}
              <div className="bg-blue-50 p-6 rounded-2xl mb-8">
                <h3 className="font-semibold mb-4">إضافة كاشير جديد</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    placeholder="اسم الكاشير"
                    value={newCashier.name}
                    onChange={(e) => setNewCashier({ ...newCashier, name: e.target.value })}
                    className="px-4 py-3 border rounded-2xl"
                  />
                  <input
                    type="password"
                    placeholder="كلمة المرور"
                    value={newCashier.password}
                    onChange={(e) => setNewCashier({ ...newCashier, password: e.target.value })}
                    className="px-4 py-3 border rounded-2xl"
                  />
                  <button
                    onClick={handleAddCashier}
                    className="bg-blue-600 text-white py-3 rounded-2xl hover:bg-blue-700"
                  >
                    إضافة كاشير
                  </button>
                </div>
              </div>
              <p className="text-center text-gray-500 py-12">سيتم عرض قائمة الكاشير بعد تحديث useAuthStore</p>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="text-3xl font-bold mb-6">تقارير المبيعات</h2>
              <p className="text-gray-500">سيتم تطوير هذا القسم بشكل كامل قريباً</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}