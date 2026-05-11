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
  setLastOrder: (order: Order) => void;
}

export const usePosStore = create<PosStore>((set, get) => ({
  // ==================== أصناف مؤقتة (للتجربة) ====================
  products: [
    {
      id: '1',
      name: 'Hamburger',
      nameAr: 'هامبرجر كلاسيك',
      price: 85,
      category: 'برجر',
      stock: 45,
    },
    {
      id: '2',
      name: 'Cheese Burger',
      nameAr: 'تشيز برجر',
      price: 95,
      category: 'برجر',
      stock: 38,
    },
    {
      id: '3',
      name: 'Pizza Margherita',
      nameAr: 'بيتزا مارغريتا',
      price: 145,
      category: 'بيتزا',
      stock: 22,
    },
    {
      id: '4',
      name: 'Pepperoni Pizza',
      nameAr: 'بيتزا بيبروني',
      price: 165,
      category: 'بيتزا',
      stock: 18,
    },
    {
      id: '5',
      name: 'Sushi Roll',
      nameAr: 'سوشي رول',
      price: 120,
      category: 'ياباني',
      stock: 25,
    },
    {
      id: '6',
      name: 'Gratin',
      nameAr: 'غراتان دجاج',
      price: 110,
      category: 'مخبوزات',
      stock: 15,
    },
    {
      id: '7',
      name: 'Shawarma',
      nameAr: 'شاورما دجاج',
      price: 75,
      category: 'سندوتشات',
      stock: 50,
    },
    {
      id: '8',
      name: 'Falafel',
      nameAr: 'فلافل',
      price: 45,
      category: 'سندوتشات',
      stock: 60,
    },
    {
      id: '9',
      name: 'French Fries',
      nameAr: 'بطاطس مقلية',
      price: 35,
      category: 'مقبلات',
      stock: 80,
    },
    {
      id: '10',
      name: 'Cola',
      nameAr: 'كولا',
      price: 25,
      category: 'مشروبات',
      stock: 100,
    },
    {
      id: '11',
      name: 'Orange Juice',
      nameAr: 'عصير برتقال',
      price: 40,
      category: 'مشروبات',
      stock: 70,
    },
    {
      id: '12',
      name: 'Kofta Plate',
      nameAr: 'طبق كفتة',
      price: 130,
      category: 'أطباق رئيسية',
      stock: 20,
    },
  ],

  cart: [],
  orders: [],
  lastOrder: null,

  // ==================== الدوال ====================
  addToCart: (product) => {
    const cart = get().cart;
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      set({
        cart: cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
    } else {
      set({ cart: [...cart, { ...product, quantity: 1 }] });
    }
  },

  removeFromCart: (id) => {
    set({ cart: get().cart.filter(item => item.id !== id) });
  },

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

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      orderNumber: `#${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: "عميل عام",
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      subTotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      deliveryCharge: 10,
      discount: 0,
      paymentMethod: 'delivery',
      cashierName: 'الكاشير الحالي',
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

  setLastOrder: (order) => set({ lastOrder: order }),
}));