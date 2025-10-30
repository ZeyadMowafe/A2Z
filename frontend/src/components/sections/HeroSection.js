import React from 'react';
import { Car, Shield, Zap, CheckCircle, MessageCircle, ArrowRight, ChevronDown } from 'lucide-react';

const HeroSection = ({ onScrollToBrands, brandsCount }) => (
  <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-900">
    {/* Premium Background */}
    <div className="absolute inset-0">
      <img 
        src="https://i.pinimg.com/1200x/ae/fe/00/aefe00cf3ece9f7e0d0366a340463945.jpg" 
        alt="Car Background"
        className="w-full h-full object-cover opacity-30 md:opacity-40 scale-110 animate-slow-zoom"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/60"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/80"></div>
    </div>

    {/* Sophisticated Grid Pattern */}
    <div className="absolute inset-0 opacity-[0.03]">
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }}></div>
    </div>

    {/* Ambient Lighting */}
    <div className="absolute inset-0">
      <div className="absolute top-1/4 right-1/4 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-blue-600/10 rounded-full blur-[120px] md:blur-[200px] animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-indigo-600/10 rounded-full blur-[100px] md:blur-[180px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
    </div>

    {/* Diagonal Accent Lines - Hidden on mobile */}
    <div className="hidden md:block absolute inset-0 overflow-hidden opacity-10">
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-blue-400 via-blue-300 to-transparent transform rotate-12 animate-line-glow"></div>
      <div className="absolute top-0 right-1/3 w-[1px] h-3/4 bg-gradient-to-b from-blue-500 to-transparent transform rotate-12 animate-line-glow" style={{ animationDelay: '0.5s' }}></div>
    </div>

    {/* Floating Particles - Reduced on mobile */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-1.5 md:w-2 h-1.5 md:h-2 bg-blue-400 rounded-full animate-float"></div>
      <div className="hidden md:block absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-blue-300 rounded-full animate-float" style={{ animationDelay: '1s', animationDuration: '8s' }}></div>
      <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white/50 rounded-full animate-float" style={{ animationDelay: '2s', animationDuration: '10s' }}></div>
      <div className="hidden md:block absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-float" style={{ animationDelay: '1.5s', animationDuration: '9s' }}></div>
    </div>

    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20">
      <div className="max-w-7xl mx-auto">
        <HeroContent onScrollToBrands={onScrollToBrands} brandsCount={brandsCount} />
      </div>
    </div>

    <ScrollIndicator />

    {/* Custom Animations */}
    <style jsx>{`
      @keyframes slow-zoom {
        0%, 100% { transform: scale(1.1); }
        50% { transform: scale(1.15); }
      }
      
      @keyframes pulse-slow {
        0%, 100% { opacity: 0.1; transform: scale(1); }
        50% { opacity: 0.15; transform: scale(1.1); }
      }
      
      @keyframes line-glow {
        0%, 100% { opacity: 0.1; }
        50% { opacity: 0.3; }
      }
      
      @keyframes float {
        0%, 100% { 
          transform: translateY(0) translateX(0);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        50% { 
          transform: translateY(-100px) translateX(50px);
          opacity: 0.8;
        }
      }
      
      .animate-slow-zoom {
        animation: slow-zoom 20s ease-in-out infinite;
      }
      
      .animate-pulse-slow {
        animation: pulse-slow 8s ease-in-out infinite;
      }
      
      .animate-line-glow {
        animation: line-glow 4s ease-in-out infinite;
      }
      
      .animate-float {
        animation: float 12s ease-in-out infinite;
      }
    `}</style>
  </section>
);

const HeroContent = ({ onScrollToBrands, brandsCount }) => (
  <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-24 items-center">
    <div>
      {/* Premium Badge */}
      <div className="inline-flex items-center gap-2 md:gap-3 lg:gap-4 mb-6 md:mb-8 lg:mb-12 group animate-fade-in-up">
        <div className="h-[1px] w-6 md:w-8 lg:w-12 bg-gradient-to-r from-transparent to-slate-600 group-hover:to-blue-400 transition-colors duration-700"></div>
        <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 border border-slate-700 group-hover:border-blue-900 px-2.5 md:px-3 lg:px-5 py-1.5 md:py-2 lg:py-2.5 transition-all duration-700">
          <Shield className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-blue-400" />
          <span className="text-slate-400 text-[9px] md:text-[10px] lg:text-xs font-semibold tracking-[0.15em] md:tracking-[0.2em] lg:tracking-[0.3em] uppercase">Premium Quality</span>
        </div>
        <div className="h-[1px] w-6 md:w-8 lg:w-12 bg-gradient-to-l from-transparent to-slate-600 group-hover:to-blue-400 transition-colors duration-700"></div>
      </div>

      {/* Main Headline */}
      <div className="mb-4 md:mb-6 lg:mb-10">
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-thin text-white mb-2 md:mb-3 lg:mb-4 tracking-tighter leading-[0.85] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          DRIVE
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-light mb-2 md:mb-3 lg:mb-4 tracking-wide animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-400">
            EXCELLENCE
          </span>
        </h2>
        <div className="flex items-center gap-2 md:gap-3 lg:gap-4 mt-3 md:mt-4 lg:mt-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="h-[1.5px] md:h-[2px] w-10 md:w-12 lg:w-20 bg-gradient-to-r from-blue-400 to-transparent"></div>
          <div className="w-1 h-1 md:w-1.5 md:h-1.5 lg:w-2 lg:h-2 border border-blue-400 rotate-45"></div>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm sm:text-base md:text-lg lg:text-xl font-light leading-relaxed max-w-xl mb-6 md:mb-8 lg:mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        Original automotive parts from world-class manufacturers. Uncompromising quality, precision engineering, and certified authenticity.
      </p>

      {/* Premium Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8 lg:mb-12">
        {[
          { icon: CheckCircle, title: '100% Authentic', subtitle: 'Certified original parts', delay: '0.5s' },
          { icon: Zap, title: 'Express Delivery', subtitle: 'Nationwide shipping', delay: '0.6s' }
        ].map(({ icon: Icon, title, subtitle, delay }) => (
          <div key={title} className="group animate-fade-in-up" style={{ animationDelay: delay }}>
            <div className="flex items-start gap-2.5 md:gap-3 lg:gap-4">
              <div className="w-9 h-9 md:w-10 md:h-10 lg:w-14 lg:h-14 border border-slate-700 group-hover:border-blue-500 flex items-center justify-center transition-all duration-500 group-hover:rotate-90 flex-shrink-0">
                <Icon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-slate-600 group-hover:text-blue-400 transition-all duration-500 group-hover:-rotate-90" />
              </div>
              <div>
                <div className="text-white font-light text-sm md:text-base lg:text-lg mb-0.5 md:mb-1">{title}</div>
                <div className="text-slate-500 text-xs md:text-sm font-light">{subtitle}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
        <ActionButtons onScrollToBrands={onScrollToBrands} />
      </div>
      
      {/* Stats */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
        <StatsGrid brandsCount={brandsCount} />
      </div>
    </div>

    {/* Right Side - Visual Element */}
    <div className="hidden lg:block relative animate-fade-in-right">
      <div className="relative">
        {/* Decorative Frame with Animation */}
        <div className="absolute -inset-4 border border-slate-700 opacity-50 animate-border-pulse"></div>
        <div className="absolute -inset-8 border border-slate-800 opacity-30 animate-border-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Rotating Glow Effect */}
        <div className="absolute -inset-12 bg-gradient-to-r from-blue-600/0 via-blue-500/10 to-blue-600/0 blur-3xl animate-rotate-glow"></div>
        
        {/* Image Container */}
        <div className="relative overflow-hidden group">
          <img 
            src="https://i.pinimg.com/1200x/e7/7c/31/e77c311521d62f64f17429d2302dfa81.jpg" 
            alt="Premium Automobile"
            className="w-full h-auto transform group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
          />
          
          {/* Gradient Overlay with Animation */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-1000"></div>
          
          {/* Shine Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1500ms]"></div>
          </div>
        </div>

        {/* Floating Stats Card with Enhanced Animation */}
        <div className="absolute -bottom-8 -left-8 bg-slate-800/95 backdrop-blur-xl border border-slate-700 p-8 group hover:border-blue-900 transition-all duration-700 animate-float-card hover:-translate-y-2">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 border-2 border-slate-600 group-hover:border-blue-500 flex items-center justify-center transition-all duration-700 group-hover:rotate-90 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 group-hover:from-blue-500/10 to-transparent transition-all duration-700"></div>
              <Car className="w-10 h-10 text-slate-500 group-hover:text-blue-400 transition-all duration-700 group-hover:-rotate-90 relative z-10" />
            </div>
            <div>
              <div className="text-5xl font-thin text-white mb-2 tracking-tight group-hover:text-blue-400 transition-colors duration-700">{brandsCount}+</div>
              <div className="h-[1px] w-16 bg-slate-600 group-hover:w-24 group-hover:bg-blue-500 transition-all duration-700 mb-2"></div>
              <div className="text-slate-400 text-sm font-light tracking-wider uppercase">Premium Brands</div>
            </div>
          </div>
        </div>

        {/* Corner Accents with Animation */}
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-blue-500/30 animate-corner-glow"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-blue-500/30 animate-corner-glow" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>

    {/* Additional Custom Animations */}
    <style jsx>{`
      @keyframes fade-in-up {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fade-in-right {
        from {
          opacity: 0;
          transform: translateX(50px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes border-pulse {
        0%, 100% { 
          opacity: 0.5;
          transform: scale(1);
        }
        50% { 
          opacity: 0.8;
          transform: scale(1.02);
        }
      }
      
      @keyframes rotate-glow {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes float-card {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes corner-glow {
        0%, 100% { 
          opacity: 0.3;
          border-color: rgba(59, 130, 246, 0.3);
        }
        50% { 
          opacity: 0.7;
          border-color: rgba(59, 130, 246, 0.7);
        }
      }
      
      .animate-fade-in-up {
        animation: fade-in-up 1s ease-out forwards;
        opacity: 0;
      }
      
      .animate-fade-in-right {
        animation: fade-in-right 1.2s ease-out forwards;
        opacity: 0;
      }
      
      .animate-border-pulse {
        animation: border-pulse 3s ease-in-out infinite;
      }
      
      .animate-rotate-glow {
        animation: rotate-glow 20s linear infinite;
      }
      
      .animate-float-card {
        animation: float-card 4s ease-in-out infinite;
      }
      
      .animate-corner-glow {
        animation: corner-glow 2s ease-in-out infinite;
      }
    `}</style>
  </div>
);

const ActionButtons = ({ onScrollToBrands }) => (
  <div className="flex flex-col sm:flex-row gap-2.5 md:gap-3 lg:gap-4 mb-8 md:mb-10 lg:mb-16">
    <button
      onClick={onScrollToBrands}
      className="group relative bg-white hover:bg-slate-100 text-black px-5 md:px-6 lg:px-10 py-3 md:py-4 lg:py-5 font-light text-sm md:text-base lg:text-lg transition-all duration-500 overflow-hidden"
    >
      <span className="relative z-10 flex items-center justify-center gap-2 md:gap-2.5 lg:gap-3 tracking-wide">
        EXPLORE PARTS
        <ArrowRight className="w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 group-hover:translate-x-2 transition-transform duration-500" />
      </span>
      <div className="absolute top-0 left-0 w-0 h-[2px] bg-blue-500 group-hover:w-full transition-all duration-700"></div>
    </button>
    
    <a 
      href="https://wa.me/201119890713" 
      target="_blank" 
      rel="noopener noreferrer"
      className="group relative border border-slate-600 hover:border-slate-500 text-white px-5 md:px-6 lg:px-10 py-3 md:py-4 lg:py-5 font-light text-sm md:text-base lg:text-lg transition-all duration-500 overflow-hidden"
    >
      <span className="relative z-10 flex items-center justify-center gap-2 md:gap-2.5 lg:gap-3 tracking-wide">
        <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        CONTACT US
      </span>
      <div className="absolute inset-0 bg-slate-800/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </a>
  </div>
);

const StatsGrid = ({ brandsCount }) => {
  const stats = [
    { value: '10K+', label: 'Customers' },
    { value: '100+', label: 'Products' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <div className="flex items-center gap-4 md:gap-6 lg:gap-12 overflow-x-auto pb-2 scrollbar-hide">
      {stats.map((stat, index) => (
        <React.Fragment key={stat.label}>
          <div className="group flex-shrink-0">
            <div className="text-xl sm:text-2xl md:text-4xl font-thin text-white mb-1 md:mb-2 group-hover:text-blue-400 transition-colors duration-500 tracking-tight">
              {stat.value}
            </div>
            <div className="h-[1px] w-6 md:w-8 lg:w-12 bg-slate-700 group-hover:w-8 md:group-hover:w-12 lg:group-hover:w-16 group-hover:bg-blue-500 transition-all duration-500 mb-1 md:mb-2"></div>
            <div className="text-slate-500 text-[10px] md:text-xs lg:text-sm font-light tracking-wider uppercase whitespace-nowrap">{stat.label}</div>
          </div>
          {index < stats.length - 1 && <div className="w-[1px] h-10 md:h-12 lg:h-16 bg-slate-700 flex-shrink-0"></div>}
        </React.Fragment>
      ))}
    </div>
  );
};

const ScrollIndicator = () => (
  <div className="absolute bottom-3 md:bottom-4 lg:bottom-6 left-1/2 transform -translate-x-1/2 z-20 animate-fade-in-up" style={{ animationDelay: '1s' }}>
    <div className="flex flex-col items-center gap-1.5 md:gap-2 lg:gap-3 group cursor-pointer">
      <span className="text-[9px] md:text-[10px] lg:text-xs text-slate-500 font-light tracking-[0.15em] md:tracking-[0.2em] lg:tracking-[0.3em] uppercase">Scroll</span>
      <div className="w-[1px] h-10 md:h-12 lg:h-16 bg-gradient-to-b from-slate-600 to-transparent group-hover:from-blue-500 transition-colors duration-700"></div>
      <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-slate-600 group-hover:text-blue-400 animate-bounce transition-colors duration-700" />
    </div>
  </div>
);

export default HeroSection;
