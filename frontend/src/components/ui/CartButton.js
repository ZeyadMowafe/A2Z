import React from 'react';
import { ShoppingBag } from 'lucide-react';

const CartButton = ({ cartCount, onClick }) => (
  <button
    onClick={onClick}
    className="relative bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-medium tracking-wide uppercase text-sm transition-all duration-300 hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5 hover:shadow-xl group"
  >
    <span className="flex items-center gap-2">
      <ShoppingBag className="w-4 h-4" />
      <span>Cart</span>
      {cartCount > 0 && (
        <span className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold ml-1 animate-pulse">
          {cartCount}
        </span>
      )}
    </span>
  </button>
);

export default CartButton;