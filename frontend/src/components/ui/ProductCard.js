import React from 'react';
import { ShoppingBag, Eye, CheckCircle } from 'lucide-react';

const ProductCard = ({ part, onAddToCart, onViewDetails }) => (
  <div 
    onClick={() => onViewDetails && onViewDetails(part)}
    className="group relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer"
  >
    {/* Luxury Border Animation */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-400/50 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
    <div className="absolute inset-[1px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
    
    {/* Top Accent Line */}
    <div className="absolute top-0 left-0 right-0 h-[1px] lg:h-[2px] z-20">
      <div className="h-full bg-gradient-to-r from-transparent via-blue-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000"></div>
    </div>
    
    <div className="relative z-10">
      <ProductImage part={part} />
      <ProductInfo part={part} onAddToCart={onAddToCart} onViewDetails={onViewDetails} />
    </div>
    
    {/* Corner Glow Effects - مخفي على الموبايل */}
    <div className="hidden lg:block absolute top-0 right-0 w-20 h-20 bg-blue-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    <div className="hidden lg:block absolute bottom-0 left-0 w-20 h-20 bg-blue-600/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
  </div>
);

const ProductImage = ({ part }) => (
  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
    {/* Background Grid Pattern - مخفي على الموبايل */}
    <div className="hidden lg:block absolute inset-0 opacity-10">
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}></div>
    </div>
    
    <img
      src={part.image_url}
      alt={part.name}
      className="relative w-full h-full object-contain p-2 lg:p-4 group-hover:scale-110 transition-transform duration-700 z-10"
    />
    
    {/* Radial Glow */}
    <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    
    {/* Stock Badge - أصغر على الموبايل */}
    <div className="absolute top-1 right-1 lg:top-2 lg:right-2 bg-slate-800/90 backdrop-blur-sm border border-blue-500/30 px-1 py-0.5 lg:px-2 lg:py-1 flex items-center gap-0.5 lg:gap-1 shadow-lg shadow-blue-500/10">
      <CheckCircle className="w-2 h-2 lg:w-3 lg:h-3 text-blue-400" />
      <span className="text-[8px] lg:text-xs font-bold text-blue-100 tracking-wide">STOCK</span>
    </div>
  </div>
);

const ProductInfo = ({ part, onAddToCart, onViewDetails }) => (
  <div className="p-2 lg:p-4 bg-gradient-to-b from-slate-900 to-slate-800 relative">
    {/* Product Name */}
    <h4 className="text-[10px] sm:text-xs lg:text-base font-bold mb-1 lg:mb-2 text-white group-hover:text-blue-400 transition-colors duration-300 min-h-[28px] lg:min-h-[40px] line-clamp-2 tracking-wide leading-tight">
      {part.name}
    </h4>
    
    {/* Decorative Line - مخفي على الموبايل */}
    <div className="hidden lg:block relative h-[1px] w-full mb-3 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
    </div>
    
    {/* Price */}
    <ProductPrice price={part.price} />
    
    {/* Action Buttons */}
    <div className="flex gap-1 lg:gap-2 mt-2 lg:mt-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails && onViewDetails(part);
        }}
        className="flex-1 group/btn relative bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-blue-500/50 text-slate-300 hover:text-blue-400 py-1.5 lg:py-2.5 font-bold transition-all duration-300 flex items-center justify-center overflow-hidden"
      >
        <Eye className="w-3 h-3 lg:w-4 lg:h-4 relative z-10" />
        
        {/* Hover Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart(part);
        }}
        className="flex-[2] lg:flex-1 group/btn relative bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-1.5 lg:py-2.5 font-bold transition-all duration-300 flex items-center justify-center gap-1 shadow-lg shadow-blue-600/50 hover:shadow-xl hover:shadow-blue-500/60 overflow-hidden"
      >
        <ShoppingBag className="w-3 h-3 lg:w-4 lg:h-4 relative z-10" />
        <span className="relative z-10 text-[9px] lg:text-xs tracking-widest uppercase">ADD</span>
        
        {/* Metallic Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
        
        {/* Bottom Glow */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] lg:h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
      </button>
    </div>
  </div>
);

const ProductPrice = ({ price }) => (
  <div className="flex items-baseline gap-0.5 lg:gap-1.5 bg-slate-800/50 px-1.5 lg:px-3 py-1 lg:py-2 border border-slate-700 group-hover:border-blue-500/30 transition-colors duration-300">
    <span className="text-[9px] lg:text-sm font-bold text-blue-400 tracking-wider">EGP</span>
    <p className="text-sm lg:text-2xl font-black text-white leading-none tracking-tight">
      {price.toLocaleString()}
    </p>
  </div>
);

export default ProductCard;