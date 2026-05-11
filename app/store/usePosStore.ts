// app/store/usePosStore.ts
import { create } from 'zustand';
import { Product, CartItem, Order } from '../types';

interface PosStore {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  lastOrder: Order | null;

  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  completeOrder: () => Order | null;
}

export const usePosStore = create<PosStore>((set, get) => ({
  // ==================== الأصناف المؤقتة (جاهزة للباك اند) ====================
  products: [
    // برجر
    { id: '1', name: 'Hamburger', nameAr: 'هامبرجر كلاسيك', price: 85, category: 'برجر', stock: 45 },
    { id: '2', name: 'Cheese Burger', nameAr: 'تشيز برجر', price: 95, category: 'برجر', stock: 38 },
    { id: '3', name: 'Double Beef Burger', nameAr: 'دبل بيف برجر', price: 135, category: 'برجر', stock: 25 },
    { id: '4', name: 'Chicken Burger', nameAr: 'برجر دجاج', price: 80, category: 'برجر', stock: 40 },

    // بيتزا
    { id: '5', name: 'Pizza Margherita', nameAr: 'بيتزا مارغريتا', price: 145, category: 'بيتزا', stock: 22 },
    { id: '6', name: 'Pepperoni Pizza', nameAr: 'بيتزا بيبروني', price: 165, category: 'بيتزا', stock: 18 },
    { id: '7', name: 'Mixed Pizza', nameAr: 'بيتزا مشكل', price: 175, category: 'بيتزا', stock: 15 },
    { id: '8', name: 'Chicken Ranch Pizza', nameAr: 'بيتزا رانش دجاج', price: 160, category: 'بيتزا', stock: 20 },

    // سندوتشات وشاورما
    { id: '9', name: 'Shawarma Chicken', nameAr: 'شاورما دجاج', price: 75, category: 'سندوتشات', stock: 50 },
    { id: '10', name: 'Shawarma Meat', nameAr: 'شاورما لحم', price: 85, category: 'سندوتشات', stock: 35 },
    { id: '11', name: 'Falafel Sandwich', nameAr: 'ساندوتش فلافل', price: 45, category: 'سندوتشات', stock: 60 },
    { id: '12', name: 'Kofta Sandwich', nameAr: 'ساندوتش كفتة', price: 70, category: 'سندوتشات', stock: 30 },

    // أطباق رئيسية
    { id: '13', name: 'Kofta Plate', nameAr: 'طبق كفتة', price: 130, category: 'أطباق رئيسية', stock: 20 },
    { id: '14', name: 'Grilled Chicken', nameAr: 'دجاج مشوي', price: 140, category: 'أطباق رئيسية', stock: 25 },
    { id: '15', name: 'Molokhia with Chicken', nameAr: 'ملوخية بالدجاج', price: 95, category: 'أطباق رئيسية', stock: 18 },

    // مقبلات وإضافات
    { id: '16', name: 'French Fries', nameAr: 'بطاطس مقلية', price: 35, category: 'مقبلات', stock: 80 },
    { id: '17', name: 'Onion Rings', nameAr: 'حلقات بصل', price: 45, category: 'مقبلات', stock: 40 },
    { id: '18', name: 'Coleslaw', nameAr: 'كول سلو', price: 30, category: 'مقبلات', stock: 55 },

    // مشروبات
    { id: '19', name: 'Cola', nameAr: 'كولا', price: 25, category: 'مشروبات', stock: 100 },
    { id: '20', name: 'Pepsi', nameAr: 'بيبسي', price: 25, category: 'مشروبات', stock: 95 },
    { id: '21', name: 'Orange Juice', nameAr: 'عصير برتقال', price: 40, category: 'مشروبات', stock: 70 },
    { id: '22', name: 'Mango Juice', nameAr: 'عصير مانجو', price: 45, category: 'مشروبات', stock: 60 },
    { id: '23', name: 'Water', nameAr: 'مياه', price: 10, category: 'مشروبات', stock: 150 },

    // حلويات
    { id: '24', name: 'Kunafa', nameAr: 'كنافة', price: 65, category: 'حلويات', stock: 12 },
    { id: '25', name: 'Rice Pudding', nameAr: 'رز بحليب', price: 50, category: 'حلويات', stock: 25 },
    { id: '26', name: 'Chocolate Cake', nameAr: 'كيك شوكولاتة', price: 75, category: 'حلويات', stock: 15 },

    // إضافي
    { id: '27', name: 'Garlic Sauce', nameAr: 'صوص ثوم', price: 15, category: 'إضافات', stock: 90 },
    { id: '28', name: 'BBQ Sauce', nameAr: 'صوص باربيكيو', price: 15, category: 'إضافات', stock: 85 },
  ],

  cart: [],
  orders: [],
  lastOrder: null,

  addToCart: (product) => {
    const cart = get().cart;
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      set({
        cart: cart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      });
    } else {
      set({ cart: [...cart, { ...product, quantity: 1 }] });
    }
  },

  removeFromCart: (id) => set({ cart: get().cart.filter(item => item.id !== id) }),

  updateQuantity: (id, quantity) => {
    if (quantity < 1) return;
    set({
      cart: get().cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    });
  },

  clearCart: () => set({ cart: [] }),

  completeOrder: () => {
    const cart = get().cart;
    if (cart.length === 0) return null;

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerName: "عميل عام",
      items: [...cart],
      total: total,
      date: new Date().toISOString(),
      status: 'completed',
    };

    set({
      orders: [newOrder, ...get().orders],
      lastOrder: newOrder,
      cart: []
    });

    return newOrder;
  },
}));