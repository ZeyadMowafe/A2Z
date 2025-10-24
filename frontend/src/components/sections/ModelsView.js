import React from 'react';
import { Car, Shield, Wrench, Zap } from 'lucide-react';
import LoadingState from '../common/LoadingState';
import EmptyState from '../common/EmptyState';
import ModelCard from '../ui/ModelCard';

const ModelsView = ({ selectedBrand, models, loading, onModelClick }) => (
  <section className="relative min-h-screen py-32 overflow-hidden">
    {/* Premium Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Ambient Glows */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-slate-700/5 rounded-full blur-[120px]"></div>
    </div>

    <div className="container mx-auto px-8 lg:px-16 relative z-10 max-w-7xl">
      <ModelsHeader selectedBrand={selectedBrand} />
      
      {loading ? (
        <LoadingState message="Loading models..." />
      ) : models.length === 0 ? (
        <EmptyModelsState selectedBrand={selectedBrand} onBrowseAll={onModelClick} />
      ) : (
        <ModelsGrid models={models} onModelClick={onModelClick} />
      )}

      <FeaturesSection />
    </div>
  </section>
);

const ModelsHeader = ({ selectedBrand }) => (
  <div className="text-center mb-24">
    {/* Brand Badge - Premium */}
    <div className="inline-flex items-center gap-4 mb-12 group">
      <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-slate-700"></div>
      
      <div className="relative">
        {/* Glow Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${selectedBrand.color} blur-xl opacity-30 scale-110`}></div>
        
        {/* Badge Container */}
        <div className="relative flex items-center gap-4 bg-slate-900/80 backdrop-blur-xl border-2 border-slate-800 px-6 py-4 shadow-2xl">
          {/* Icon */}
          // <div className={`w-12 h-12 bg-gradient-to-br ${selectedBrand.color} flex items-center justify-center shadow-lg`}>
          //   <Car className="w-6 h-6 text-white" />
          // </div>
          
          {/* Text */}
          <span className="text-sm font-bold text-white uppercase tracking-[0.2em]">{selectedBrand.name}</span>
          
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-blue-500/50"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-blue-500/50"></div>
        </div>
      </div>
      
      <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-slate-700"></div>
    </div>
    
    {/* Main Title */}
    <h2 className="text-6xl sm:text-7xl lg:text-8xl font-thin text-white mb-8 leading-tight tracking-tight">
      Choose Your <span className="font-light">Model</span>
    </h2>
    
    {/* Decorative Elements */}
    <div className="flex items-center justify-center gap-4 mb-8">
      <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
      <div className="w-2 h-2 border border-blue-500 rotate-45"></div>
      <div className="h-[2px] w-24 bg-gradient-to-l from-transparent via-blue-500 to-transparent"></div>
    </div>
    
    {/* Subtitle */}
    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
      Premium automotive parts engineered for your {selectedBrand.name}
    </p>
  </div>
);

const EmptyModelsState = ({ selectedBrand, onBrowseAll }) => (
  <div className="text-center py-20">
    <div className="max-w-2xl mx-auto">
      {/* Empty Icon */}
      <div className="relative inline-block mb-8">
        <div className="absolute inset-0 bg-blue-500/20 blur-3xl"></div>
        <div className="relative w-24 h-24 border-2 border-slate-700 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
          <Car className="w-12 h-12 text-slate-600" />
        </div>
      </div>
      
      <h3 className="text-3xl font-light text-white mb-4">No Models Available</h3>
      <p className="text-slate-400 mb-10 text-lg">
        No models found for {selectedBrand.name}. Browse all parts instead.
      </p>
      
      <button
        onClick={() => onBrowseAll({ id: 'all', name: 'All Models' })}
        className={`group relative bg-gradient-to-r ${selectedBrand.color} text-white px-10 py-5 font-semibold text-sm tracking-wider uppercase shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden`}
      >
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
        
        <span className="relative z-10">Browse All {selectedBrand.name} Parts</span>
        
        {/* Corner Accents */}
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/30"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/30"></div>
      </button>
    </div>
  </div>
);

const ModelsGrid = ({ models, onModelClick }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
    {models.map((model) => (
      <ModelCard key={model.id} model={model} onClick={() => onModelClick(model)} />
    ))}
  </div>
);

const FeaturesSection = () => {
  const features = [
    { 
      icon: Shield, 
      title: 'Original Parts', 
      desc: '100% Authentic Guarantee', 
      color: 'from-blue-500 to-blue-600' 
    },
    { 
      icon: Wrench, 
      title: 'Expert Support', 
      desc: 'Professional Assistance 24/7', 
      color: 'from-slate-600 to-slate-700' 
    },
    { 
      icon: Zap, 
      title: 'Fast Delivery', 
      desc: 'Express Shipping Available', 
      color: 'from-blue-400 to-blue-500' 
    }
  ];

  return (
    <div className="max-w-6xl mx-auto mt-20">
      {/* Premium Container */}
      <div className="relative bg-slate-900/50 backdrop-blur-xl border-2 border-slate-800 p-16 shadow-2xl overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px]"></div>
        
        {/* Header */}
        <div className="relative text-center mb-16">
          <h3 className="text-4xl font-thin text-white mb-6">Why Choose <span className="font-light">Us</span></h3>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-blue-500"></div>
            <div className="w-2 h-2 bg-blue-500 rotate-45"></div>
            <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-blue-500"></div>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="relative grid sm:grid-cols-3 gap-12">
          {features.map((item, idx) => (
            <FeatureItem key={idx} {...item} />
          ))}
        </div>
        
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-slate-700"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-slate-700"></div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon: Icon, title, desc, color }) => (
  <div className="flex flex-col items-center text-center group">
    {/* Icon Container */}
    <div className="relative mb-6">
      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
      
      {/* Icon Box */}
      <div className={`relative w-20 h-20 border-2 border-slate-700 group-hover:border-blue-500 bg-gradient-to-br ${color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-500`}>
        <Icon className="w-10 h-10 text-white" />
        
        {/* Corner Accents */}
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/0 group-hover:border-white/30 transition-all duration-500"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/0 group-hover:border-white/30 transition-all duration-500"></div>
      </div>
    </div>
    
    {/* Text */}
    <h4 className="font-semibold text-white text-xl mb-3 tracking-wide">{title}</h4>
    <p className="text-sm text-slate-400 leading-relaxed font-light">{desc}</p>
  </div>
);

export default ModelsView;
