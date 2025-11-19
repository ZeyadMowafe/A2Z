import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';

const BrandCard = ({ brand, onClick }) => (
  <button
    onClick={onClick}
    className="group relative overflow-hidden bg-slate-900/50 backdrop-blur-sm border-2 border-slate-800 hover:border-slate-700 transition-all duration-500 transform hover:-translate-y-2 shadow-xl hover:shadow-2xl"
  >
    {/* Image Container */}
    <div className="relative aspect-[4/3] overflow-hidden">
      <img
        src={brand.logo_url}
        alt={brand.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
      />
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${brand.color} opacity-50 group-hover:opacity-60 transition-opacity duration-500`}></div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent"></div>
      
      <BrandCardContent brand={brand} />
      
      <ShimmerEffect />
      
      {/* Corner Accents */}
      <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-slate-700 opacity-0 group-hover:opacity-100 group-hover:border-blue-500 transition-all duration-500"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-slate-700 opacity-0 group-hover:opacity-100 group-hover:border-blue-500 transition-all duration-500"></div>
    </div>

    {/* Premium Bottom Line */}
    <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r ${brand.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
    
    {/* Side Accent Line */}
    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-blue-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"></div>
  </button>
);

const BrandCardContent = ({ brand }) => (
  <div className="absolute inset-0 flex flex-col justify-end p-8">
    {/* Top Badge */}
    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
      <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-700 px-4 py-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-slate-300 text-xs font-semibold tracking-wider uppercase">Premium</span>
      </div>
    </div>
    
    {/* Main Content */}
    <div className="transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
      {/* Decorative Line */}
      <div className="flex items-center gap-3 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-transparent"></div>
        <div className="w-1.5 h-1.5 border border-blue-500 rotate-45"></div>
      </div>
      
      {/* Brand Name */}
      <h3 className="text-5xl font-thin text-white mb-3 drop-shadow-2xl tracking-tight">
        {brand.name}
      </h3>
      
      {/* Description */}
      <p className="text-slate-300 text-base mb-6 drop-shadow-lg font-light leading-relaxed">
        {brand.description}
      </p>
      
      {/* View Button */}
      <div className="flex items-center gap-3 text-white font-semibold">
        <span className="text-sm tracking-wider uppercase">View Models</span>
        <div className="w-8 h-8 border-2 border-white/30 group-hover:border-white flex items-center justify-center transition-all duration-500 group-hover:rotate-90">
          <ArrowRight className="w-4 h-4 group-hover:-rotate-90 transition-transform duration-500" />
        </div>
      </div>
    </div>
  </div>
);

const ShimmerEffect = () => (
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
  </div>
);

export default BrandCard;