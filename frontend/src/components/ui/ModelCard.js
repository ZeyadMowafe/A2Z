import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';

const ModelCard = ({ model, onClick }) => (
  <button
    onClick={onClick}
    className="group relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 hover:border-blue-500/50 transition-all duration-500 transform hover:scale-[1.02] shadow-2xl"
  >
    {/* Animated Background Pattern */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent group-hover:scale-110 transition-transform duration-1000"></div>
    </div>
    
    {/* Content Wrapper */}
    <div className="relative">
      {/* Top Section - Image */}
      <div className="relative p-8 pb-0">
        <div className="relative aspect-[16/10] overflow-hidden mb-6 bg-slate-800/30">
          {/* Premium Badge */}
          <div className="absolute top-4 right-4 z-10 bg-blue-500/90 backdrop-blur-sm px-3 py-1.5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-[-10px] group-hover:translate-y-0">
            <Sparkles className="w-3 h-3 text-white" />
            <span className="text-white text-xs font-bold tracking-wider">PREMIUM</span>
          </div>
          
          {/* Image - بدون rotation */}
          <img 
            src={model.image_url}
            alt={model.name}
            className="w-full h-full object-contain transform group-hover:scale-105 transition-all duration-700"
          />
          
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent"></div>
          
          {/* Floating Accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
        </div>
      </div>
      
      {/* Bottom Section - Info */}
      <div className="px-8 pb-8">
        {/* Model Name with Line */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-slate-700 to-transparent"></div>
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-blue-500"></div>
              <div className="w-1 h-1 rounded-full bg-blue-400"></div>
              <div className="w-1 h-1 rounded-full bg-blue-300"></div>
            </div>
          </div>
          
          <h3 className="text-2xl font-light text-white mb-2 tracking-wide">
            {model.name}
          </h3>
          
          <p className="text-slate-400 text-sm font-light">Premium Auto Parts Available</p>
        </div>
        
        {/* Action Button - Different Style */}
        <div className="relative group/btn">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative flex items-center justify-between bg-slate-800/50 border border-slate-700 group-hover:border-blue-500 px-5 py-4 transition-all duration-500">
            <span className="text-white font-medium text-sm tracking-wider uppercase">Explore Parts</span>
            
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center transform group-hover:rotate-45 transition-transform duration-500">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Hover Glow Effect */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-blue-500/10 blur-3xl"></div>
    </div>
    
    {/* Diagonal Line Accent */}
    <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-blue-500 to-transparent transform origin-top-right rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  </button>
);

export default ModelCard;