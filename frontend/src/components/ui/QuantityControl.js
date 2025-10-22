import React from 'react';
import { Plus, Minus } from 'lucide-react';

const QuantityControl = ({ quantity, onDecrease, onIncrease }) => (
  <div className="flex items-center bg-blue-50 rounded-lg p-1">
    <button
      onClick={onDecrease}
      className="w-8 h-8 hover:bg-blue-100 rounded transition-all duration-200 flex items-center justify-center group"
    >
      <Minus size={16} className="text-blue-600 group-hover:text-blue-800" />
    </button>
    <span className="w-12 text-center font-semibold text-blue-900">
      {quantity}
    </span>
    <button
      onClick={onIncrease}
      className="w-8 h-8 hover:bg-blue-100 rounded transition-all duration-200 flex items-center justify-center group"
    >
      <Plus size={16} className="text-blue-600 group-hover:text-blue-800" />
    </button>
  </div>
);

export default QuantityControl;