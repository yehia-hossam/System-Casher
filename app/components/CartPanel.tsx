// app/components/CartPanel.tsx
'use client';

import { usePosStore } from '../store/usePosStore';
import { CartItem } from '../types';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function CartPanel() {
  const { cart = [], removeFromCart, updateQuantity } = usePosStore();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = total * 0.1;
  const serviceCharge = 2.50;
  const grandTotal = total + tax + serviceCharge;

  return (
    <div className="w-96 bg-white flex flex-col h-screen shadow-2xl border-l border-gray-100 overflow-hidden">
      {/* Header - Delivery Info */}
      <div className="bg-[#0E4B5E] text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Cart</h2>
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Order #4392</span>
        </div>
        
        <div>
          <div className="text-xs uppercase tracking-widest opacity-75">Delivery Address</div>
          <div className="text-sm mt-1 leading-tight">
            1234 Main Street No. 62<br />
            West New York, NY
          </div>
          <div className="flex items-center gap-2 text-emerald-300 text-sm mt-3">
            <span>📍</span>
            <span>28 min • Takeaway</span>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-auto p-6 space-y-4 bg-gray-50 custom-scroll">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="text-7xl mb-6 opacity-50">🛒</div>
            <p className="text-xl font-medium">Cart is empty</p>
            <p className="text-sm mt-2 text-center">Start adding delicious items from the menu</p>
          </div>
        ) : (
          cart.map((item: CartItem) => (
            <div 
              key={item.id} 
              className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex gap-4">
                <Image
                  src={item.image || '/placeholder.jpg'}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-2xl object-cover"
                  alt={item.name}
                />

                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[15px] leading-tight">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.nameAr}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center border rounded-2xl">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-lg hover:bg-gray-100 rounded-l-2xl transition"
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-semibold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-lg hover:bg-gray-100 rounded-r-2xl transition"
                      >
                        +
                      </button>
                    </div>

                    <div className="font-bold text-lg text-emerald-700">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all self-start mt-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Summary */}
      <div className="p-6 bg-white border-t space-y-5">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Service Charge</span>
            <span>${serviceCharge.toFixed(2)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="border-t pt-5 flex justify-between items-center text-xl font-bold">
          <span>Total</span>
          <span className="text-emerald-700">$${grandTotal.toFixed(2)}</span>
        </div>

        {/* Promotion Code */}
        <div>
          <input
            type="text"
            placeholder="Have a promotion code?"
            className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Confirm Button */}
        <button 
          className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.985] transition-all text-white rounded-3xl text-lg font-semibold shadow-lg shadow-emerald-600/30"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
}