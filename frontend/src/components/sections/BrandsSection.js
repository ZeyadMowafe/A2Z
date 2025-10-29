import React, { useState, useEffect } from 'react';
import { Car, Loader2 } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import EmptyState from '../common/EmptyState';
import BrandCard from '../ui/BrandCard';

const BrandsSection = ({ brands, brandsRef, onBrandClick, productsCount }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // إذا جات الداتا قبل 10 ثواني، نوقف اللودينج
    if (brands && brands.length > 0) {
      setIsLoading(false);
      setShowContent(true);
    } else {
      // ننتظر 10 ثواني
      const timer = setTimeout(() => {
        setIsLoading(false);
        setShowContent(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [brands]);

  return (
    <section ref={brandsRef} className="py-20 md:py-32 lg:py-40 bg-gradient-to-b from-zinc-900 via-slate-900 to-black relative overflow-hidden">
      {/* Premium Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Ambient Light Effect */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-600/10 rounded-full blur-[100px] md:blur-[150px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-indigo-600/10 rounded-full blur-[100px] md:blur-[150px]"></div>
      </div>

      {/* Diagonal Accent Line - Hidden on mobile */}
      <div className="hidden md:block absolute top-0 right-0 w-full h-full overflow-hidden opacity-20">
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-blue-500 via-blue-400 to-transparent transform rotate-12 origin-top-right"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Premium Header */}
        <div className="text-center mb-16 md:mb-24 lg:mb-32">
          <div className="inline-flex items-center gap-2 md:gap-3 lg:gap-4 mb-6 md:mb-8">
            <div className="h-[1px] w-10 md:w-16 lg:w-20 bg-gradient-to-r from-transparent to-zinc-600"></div>
            <div className="flex items-center gap-2 md:gap-3">
              <Car className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-blue-400" />
              <span className="text-zinc-400 text-[9px] md:text-[10px] lg:text-xs font-bold tracking-[0.3em] md:tracking-[0.4em] lg:tracking-[0.5em] uppercase">Premium Brands</span>
            </div>
            <div className="h-[1px] w-10 md:w-16 lg:w-20 bg-gradient-to-l from-transparent to-zinc-600"></div>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-thin text-white mb-4 md:mb-6 tracking-[-0.02em] leading-[0.9]">
            ENGINEERED
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-light mb-6 md:mb-8 lg:mb-10 tracking-wide">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-400">
              EXCELLENCE
            </span>
          </h3>
          
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg lg:text-xl font-light max-w-3xl mx-auto leading-relaxed mb-6 md:mb-8 px-4">
            Curated selection of world-class automotive brands. Precision engineering meets uncompromising quality.
          </p>

          {/* Decorative Element */}
          <div className="flex items-center justify-center gap-1.5 md:gap-2">
            <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-blue-400 rounded-full"></div>
            <div className="w-10 md:w-12 lg:w-16 h-[1px] bg-gradient-to-r from-blue-400 to-transparent"></div>
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 border border-blue-400 rotate-45"></div>
            <div className="w-10 md:w-12 lg:w-16 h-[1px] bg-gradient-to-l from-blue-400 to-transparent"></div>
            <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-blue-400 rounded-full"></div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 md:py-32">
            <Loader2 className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-blue-400 animate-spin mb-4 md:mb-6" />
            <p className="text-zinc-400 text-base md:text-lg font-light">Loading premium brands...</p>
          </div>
        ) : (
          <>
            {brands.length === 0 ? (
              <EmptyState message="please check your connection" />
            ) : (
              <BrandsGrid brands={brands} onBrandClick={onBrandClick} />
            )}

            <StatsCard productsCount={productsCount} />
          </>
        )}
      </div>
    </section>
  );
};

const BrandsGrid = ({ brands, onBrandClick }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6 max-w-7xl mx-auto mb-16 md:mb-24 lg:mb-32">
    {brands.map((brand) => (
      <BrandCard key={brand.id} brand={brand} onClick={() => onBrandClick(brand)} />
    ))}
  </div>
);

const StatsCard = ({ productsCount }) => {
  const stats = [
    { 
      value: '100+', 
      label: 'Authorized Dealers',
      description: 'Global network' 
    },
    { 
      value: `${productsCount}+`, 
      label: 'Parts in Stock',
      description: 'Ready to ship' 
    },
    { 
      value: '10K+', 
      label: 'Happy Customers',
      description: 'Worldwide trust' 
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Premium Divider */}
      <div className="relative mb-12 md:mb-16 lg:mb-24">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
          <div className="w-2 h-2 md:w-3 md:h-3 border border-zinc-600 rotate-45 bg-zinc-900"></div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-gradient-to-r from-zinc-800/50 via-blue-900/30 to-zinc-800/50">
        {stats.map((stat, index) => (
          <div 
            key={stat.label}
            className="group relative bg-zinc-900/90 backdrop-blur-sm p-8 sm:p-10 md:p-12 lg:p-16 transition-all duration-700 hover:bg-zinc-800/90 overflow-hidden"
          >
            {/* Top Accent Beam */}
            <div className="absolute top-0 left-0 w-0 h-[1.5px] md:h-[2px] bg-gradient-to-r from-blue-500 to-blue-400 group-hover:w-full transition-all duration-1000 ease-out"></div>
            
            {/* Glow Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Number */}
              <div className="mb-4 md:mb-6">
                <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-thin text-white tracking-tighter leading-none group-hover:text-blue-400 transition-colors duration-700">
                  {stat.value}
                </div>
              </div>

              {/* Divider Line */}
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <div className="h-[1px] w-10 md:w-12 bg-zinc-700 group-hover:w-16 md:group-hover:w-20 group-hover:bg-blue-400 transition-all duration-700"></div>
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-zinc-700 group-hover:bg-blue-400 rounded-full transition-colors duration-700"></div>
              </div>

              {/* Label */}
              <div className="mb-2 md:mb-3">
                <h4 className="text-white text-sm md:text-base lg:text-lg font-light tracking-wider uppercase">
                  {stat.label}
                </h4>
              </div>

              {/* Description */}
              <p className="text-zinc-500 text-xs md:text-sm font-light tracking-wide group-hover:text-zinc-400 transition-colors duration-700">
                {stat.description}
              </p>
            </div>

            {/* Corner Accent */}
            <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-5 h-5 md:w-6 md:h-6 border-r border-b border-zinc-800 group-hover:border-blue-500/50 transition-colors duration-700"></div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="mt-12 md:mt-16 lg:mt-24 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 md:gap-8">
        <div className="max-w-2xl">
          <p className="text-zinc-500 text-xs sm:text-sm md:text-base font-light leading-relaxed">
            Every component represents decades of engineering excellence. We source only from verified manufacturers, 
            ensuring authenticity and peak performance for your vehicle.
          </p>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex flex-col items-end gap-0.5 md:gap-1">
            <div className="h-6 md:h-8 w-[1px] bg-gradient-to-b from-transparent to-zinc-700"></div>
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 border border-zinc-600 rotate-45"></div>
            <div className="h-6 md:h-8 w-[1px] bg-gradient-to-t from-transparent to-zinc-700"></div>
          </div>
          <span className="text-zinc-600 text-[9px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] uppercase">Quality Assured</span>
        </div>
      </div>
    </div>
  );
};

export default BrandsSection;
