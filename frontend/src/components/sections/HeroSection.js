import React, { memo } from 'react';
import { Car, Shield, Zap, CheckCircle, ArrowRight, ChevronDown } from 'lucide-react';

// ✅ CRITICAL FIX: شلنا كل الـ animation delays اللي بتأخر LCP
const HeroSection = ({ onScrollToBrands, brandsCount }) => (
  <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-900">
    {/* Premium Background */}
    <div className="absolute inset-0">
      <img 
        src="https://i.pinimg.com/1200x/ae/fe/00/aefe00cf3ece9f7e0d0366a340463945.jpg" 
        alt="Car Background"
        width="1920"
        height="1080"
        loading="eager"
        fetchpriority="high"
        className="w-full h-full object-cover opacity-30 md:opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/60"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/80"></div>
    </div>

    {/* Sophisticated Grid Pattern */}
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }}></div>
    </div>

    {/* Ambient Lighting - Static */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 right-1/4 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-blue-600/10 rounded-full blur-[120px] md:blur-[200px]"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-indigo-600/10 rounded-full blur-[100px] md:blur-[180px]"></div>
    </div>

    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20">
      <div className="max-w-7xl mx-auto">
        <HeroContent onScrollToBrands={onScrollToBrands} brandsCount={brandsCount} />
      </div>
    </div>

    <ScrollIndicator />
  </section>
);

const HeroContent = memo(({ onScrollToBrands, brandsCount }) => (
  <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-24 items-center">
    <div>
      {/* Premium Badge - بدون animation delay */}
      <div className="inline-flex items-center gap-2 md:gap-3 lg:gap-4 mb-6 md:mb-8 lg:mb-12 group" style={{ minHeight: '44px' }}>
        <div className="h-[1px] w-6 md:w-8 lg:w-12 bg-gradient-to-r from-transparent to-slate-600"></div>
        <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 border border-slate-700 px-2.5 md:px-3 lg:px-5 py-1.5 md:py-2 lg:py-2.5 transition-colors duration-300">
          <Shield className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-blue-400" />
          <span className="text-slate-400 text-[9px] md:text-[10px] lg:text-xs font-semibold tracking-[0.15em] md:tracking-[0.2em] lg:tracking-[0.3em] uppercase">Premium Quality</span>
        </div>
        <div className="h-[1px] w-6 md:w-8 lg:w-12 bg-gradient-to-l from-transparent to-slate-600"></div>
      </div>

      {/* ✅ CRITICAL FIX: Main Headlines - بدون animations وبـ min-height ثابت */}
      <div className="mb-4 md:mb-6 lg:mb-10" style={{ minHeight: '220px' }}>
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-thin text-white mb-2 md:mb-3 lg:mb-4 tracking-tighter leading-[0.85]">
          DRIVE
        </h1>
        {/* ✅ هنا المشكلة كانت - شلنا animate-fade-in-up وال delay */}
        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-light mb-2 md:mb-3 lg:mb-4 tracking-wide">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-400">
            EXCELLENCE
          </span>
        </h2>
        <div className="flex items-center gap-2 md:gap-3 lg:gap-4 mt-3 md:mt-4 lg:mt-6">
          <div className="h-[1.5px] md:h-[2px] w-10 md:w-12 lg:w-20 bg-gradient-to-r from-blue-400 to-transparent"></div>
          <div className="w-1 h-1 md:w-1.5 md:h-1.5 lg:w-2 lg:h-2 border border-blue-400 rotate-45"></div>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm sm:text-base md:text-lg lg:text-xl font-light leading-relaxed max-w-xl mb-6 md:mb-8 lg:mb-12">
        Original automotive parts from world-class manufacturers. Uncompromising quality, precision engineering, and certified authenticity.
      </p>

      {/* Premium Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8 lg:mb-12">
        <FeatureItem 
          icon={CheckCircle}
          title="100% Authentic"
          subtitle="Certified original parts"
        />
        <FeatureItem 
          icon={Zap}
          title="Express Delivery"
          subtitle="Nationwide shipping"
        />
      </div>

      {/* Action Buttons */}
      <ActionButtons onScrollToBrands={onScrollToBrands} />
      
      {/* Stats */}
      <StatsGrid brandsCount={brandsCount} />
    </div>

    {/* Right Side - Visual Element */}
    <div className="hidden lg:block relative">
      <div className="relative">
        <div className="absolute -inset-4 border border-slate-700 opacity-50"></div>
        <div className="absolute -inset-8 border border-slate-800 opacity-30"></div>
        
        <div className="relative overflow-hidden group">
          <img 
            src="https://i.pinimg.com/1200x/8c/a5/51/8ca5514313dc0a31e39194edd11c8aa0.jpg" 
            alt="Premium Automobile"
            width="800"
            height="600"
            loading="lazy"
            className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700 ease-out"
            style={{ aspectRatio: '4/3' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
        </div>

        {/* Floating Stats Card */}
        <div className="absolute -bottom-8 -left-8 bg-slate-800/95 backdrop-blur-xl border border-slate-700 p-8 transition-colors duration-300" style={{ minWidth: '280px', minHeight: '140px' }}>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 border-2 border-slate-600 flex items-center justify-center flex-shrink-0">
              <Car className="w-10 h-10 text-slate-500" />
            </div>
            <div>
              <div className="text-5xl font-thin text-white mb-2 tracking-tight">{brandsCount}+</div>
              <div className="h-[1px] w-16 bg-slate-600 mb-2"></div>
              <div className="text-slate-400 text-sm font-light tracking-wider uppercase">Premium Brands</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
));

HeroContent.displayName = 'HeroContent';

const FeatureItem = memo(({ icon: Icon, title, subtitle }) => (
  <div className="group">
    <div className="flex items-start gap-2.5 md:gap-3 lg:gap-4">
      <div className="w-9 h-9 md:w-10 md:h-10 lg:w-14 lg:h-14 border border-slate-700 group-hover:border-blue-500 flex items-center justify-center transition-colors duration-300 flex-shrink-0">
        <Icon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-slate-600 group-hover:text-blue-400 transition-colors duration-300" />
      </div>
      <div>
        <div className="text-white font-light text-sm md:text-base lg:text-lg mb-0.5 md:mb-1">{title}</div>
        <div className="text-slate-500 text-xs md:text-sm font-light">{subtitle}</div>
      </div>
    </div>
  </div>
));

FeatureItem.displayName = 'FeatureItem';

const ActionButtons = memo(({ onScrollToBrands }) => {
  const handleClick = (e) => {
    e.preventDefault();
    requestAnimationFrame(() => {
      onScrollToBrands();
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2.5 md:gap-3 lg:gap-4 mb-8 md:mb-10 lg:mb-16">
      <button
        onClick={handleClick}
        className="group relative bg-white hover:bg-slate-100 text-black px-5 md:px-6 lg:px-10 py-3 md:py-4 lg:py-5 font-light text-sm md:text-base lg:text-lg transition-colors duration-300"
      >
        <span className="relative z-10 flex items-center justify-center gap-2 md:gap-2.5 lg:gap-3 tracking-wide">
          EXPLORE PARTS
          <ArrowRight className="w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </span>
      </button>
      
      <a 
        href="https://wa.me/201119890713" 
        target="_blank" 
        rel="noopener noreferrer"
        className="group relative border border-slate-600 hover:border-slate-500 text-white px-5 md:px-6 lg:px-10 py-3 md:py-4 lg:py-5 font-light text-sm md:text-base lg:text-lg transition-colors duration-300"
      >
        <span className="relative z-10 flex items-center justify-center gap-2 md:gap-2.5 lg:gap-3 tracking-wide">
          <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          CONTACT US
        </span>
      </a>
    </div>
  );
});

ActionButtons.displayName = 'ActionButtons';

const StatsGrid = memo(({ brandsCount }) => {
  const stats = [
    { value: '10K+', label: 'Customers' },
    { value: '100+', label: 'Products' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <div className="flex items-center gap-4 md:gap-6 lg:gap-12 overflow-x-auto pb-2" style={{ minHeight: '80px' }}>
      {stats.map((stat, index) => (
        <React.Fragment key={stat.label}>
          <div className="group flex-shrink-0">
            <div className="text-xl sm:text-2xl md:text-4xl font-thin text-white mb-1 md:mb-2 tracking-tight">
              {stat.value}
            </div>
            <div className="h-[1px] w-6 md:w-8 lg:w-12 bg-slate-700 mb-1 md:mb-2"></div>
            <div className="text-slate-500 text-[10px] md:text-xs lg:text-sm font-light tracking-wider uppercase whitespace-nowrap">{stat.label}</div>
          </div>
          {index < stats.length - 1 && <div className="w-[1px] h-10 md:h-12 lg:h-16 bg-slate-700 flex-shrink-0"></div>}
        </React.Fragment>
      ))}
    </div>
  );
});

StatsGrid.displayName = 'StatsGrid';

const ScrollIndicator = memo(() => (
  <div className="absolute bottom-3 md:bottom-4 lg:bottom-6 left-1/2 transform -translate-x-1/2 z-20">
    <div className="flex flex-col items-center gap-1.5 md:gap-2 lg:gap-3 group cursor-pointer">
      <span className="text-[9px] md:text-[10px] lg:text-xs text-slate-500 font-light tracking-[0.15em] md:tracking-[0.2em] lg:tracking-[0.3em] uppercase">Scroll</span>
      <div className="w-[1px] h-10 md:h-12 lg:h-16 bg-gradient-to-b from-slate-600 to-transparent"></div>
      <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-slate-600 animate-bounce" />
    </div>
  </div>
));

ScrollIndicator.displayName = 'ScrollIndicator';

export default memo(HeroSection);
