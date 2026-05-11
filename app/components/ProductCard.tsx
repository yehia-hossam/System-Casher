// app/components/ProductCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';

interface Dish {
  id: string;
  name: string;
  price: number;
  rating: number;
  sales?: number;
  image?: string;
  emoji?: string;
}

interface ProductCardProps {
  dish: Dish;
  onAddToCart: (dish: Dish) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ dish, onAddToCart }) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group border border-gray-100">
      {/* Image / Emoji Section */}
      <div className="h-52 bg-linear-to-br from-emerald-50 to-teal-50 flex items-center justify-center relative overflow-hidden">
        {dish.image ? (
          <Image
            src={dish.image}
            alt={dish.name}
            width={208}
            height={208}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-8xl drop-shadow-md">{dish.emoji || '🍔'}</span>
        )}

        {/* Sales Badge */}
        {dish.sales && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-2xl text-xs font-semibold shadow text-emerald-700">
            {dish.sales} sold
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="font-semibold text-lg leading-tight mb-1">{dish.name}</div>
        
        <div className="flex items-center gap-1 text-amber-500 mb-4">
          {'★'.repeat(Math.floor(dish.rating))}
          <span className="text-gray-400 text-sm">({dish.rating})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500">Starting from</span>
            <div className="text-2xl font-bold text-emerald-700">
              ${dish.price}
            </div>
          </div>

          <button 
            onClick={() => onAddToCart(dish)}
            className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-7 py-3 rounded-2xl text-sm font-semibold transition-all shadow-md hover:shadow-lg"
          >
            Add +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;