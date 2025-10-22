import React from 'react';
import { Car, Wrench, Package } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import LoadingState from '../common/LoadingState';
import EmptyState from '../common/EmptyState';
import ProductCard from '../ui/ProductCard';


const PartsView = ({ selectedBrand, selectedModel, products, categories, productsByCategory, loading, onAddToCart, onViewDetails }) => (
  <section className="relative min-h-screen py-16 lg:py-24 overflow-hidden">
    {/* BMW Premium Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
    
    {/* Sophisticated Grid Pattern */}
    <div className="absolute inset-0 opacity-[0.02]">
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>
    </div>
    
    {/* Ambient Lighting */}
    <div className="absolute inset-0">
      <div className="absolute top-1/4 right-1/4 w-[800px] h-[800px] bg-blue-600/8 rounded-full blur-[200px]"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-slate-700/8 rounded-full blur-[180px]"></div>
    </div>
    
    {/* Top Premium Line */}
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
    
    <div className="container mx-auto px-4 lg:px-8 xl:px-20 relative z-10 max-w-7xl">
      <PartsHeader selectedBrand={selectedBrand} selectedModel={selectedModel} productsCount={products.length} />

      {loading ? (
        <LoadingState message="Loading products..." />
      ) : products.length === 0 ? (
        <EmptyState 
          message="No products available for this brand yet."
          submessage="Please check back later or contact us."
        />
      ) : (
        <ProductsByCategory 
          categories={categories}
          productsByCategory={productsByCategory}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
        />
      )}
    </div>
  </section>
);

const PartsHeader = ({ selectedBrand, selectedModel, productsCount }) => (
  <div className="mb-12 lg:mb-20 pb-8 lg:pb-12 border-b border-slate-800">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
      
      {/* Left Side - Brand Info */}
      <div className="flex-1">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${selectedBrand.color} flex items-center justify-center`}>
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{selectedBrand.name}</span>
          </div>
          {selectedModel && (
            <>
              <div className="w-[1px] h-4 bg-slate-700"></div>
              <span className="text-sm text-slate-500 font-medium">{selectedModel.name}</span>
            </>
          )}
        </div>
      </div>
      
      {/* Right Side - Products Count Only */}
      <div>
        {/* Products Count Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative bg-slate-900/80 backdrop-blur-xl border-2 border-slate-800 group-hover:border-blue-500/50 px-5 py-3 transition-all duration-500">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl font-thin text-white mb-0.5">{productsCount}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Products</div>
              </div>
              <div className="w-9 h-9 border-2 border-slate-700 group-hover:border-blue-500 flex items-center justify-center transition-all duration-500">
                <Package className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors duration-500" />
              </div>
            </div>
            
            {/* Corner Accents */}
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-blue-500/0 group-hover:border-blue-500/50 transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-blue-500/0 group-hover:border-blue-500/50 transition-all duration-500"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProductsByCategory = ({ categories, productsByCategory, onAddToCart, onViewDetails }) => (
  <div className="space-y-16 lg:space-y-24">
    {Object.entries(productsByCategory).map(([category, parts]) => (
      parts.length > 0 && (
        <CategorySection
          key={category}
          category={category}
          parts={parts}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
        />
      )
    ))}
  </div>
);

const CategorySection = ({ category, parts, onAddToCart, onViewDetails }) => (
  <div className="relative">
    {/* Category Header - BMW Premium Style */}
    <div className="mb-8 lg:mb-12">
      <div className="flex items-center gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Premium Icon Box */}
        <div className="relative group">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative w-14 h-14 lg:w-16 lg:h-16 border-2 border-slate-800 group-hover:border-blue-500 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center transition-all duration-500">
            <Wrench className="w-7 h-7 lg:w-8 lg:h-8 text-slate-500 group-hover:text-blue-400 transition-colors duration-500" />
            
            {/* Corner Accents */}
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-blue-500/0 group-hover:border-blue-500/50 transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-blue-500/0 group-hover:border-blue-500/50 transition-all duration-500"></div>
          </div>
        </div>
        
        {/* Category Info */}
        <div className="flex-1">
          <h2 className="text-3xl lg:text-4xl font-thin text-white tracking-wide mb-2">{category}</h2>
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-16 lg:w-20 bg-gradient-to-r from-blue-500 to-transparent"></div>
            <span className="text-sm text-slate-500 font-light">{parts.length} {parts.length === 1 ? 'Product' : 'Products'}</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Products Grid - صفين على الموبايل، 3 على الـ PC */}
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
      {parts.map((part) => (
        <ProductCard
          key={part.id}
          part={part}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  </div>
);

export default PartsView;