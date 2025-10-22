import React from 'react';
import { Shield, CheckCircle, Zap } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';

const AboutSection = ({ aboutRef }) => (
  <section ref={aboutRef} className="py-32 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
    {/* Subtle Grid Pattern */}
    <div className="absolute inset-0 opacity-[0.03]">
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }}></div>
    </div>

    {/* Diagonal Light Effect */}
    <div className="absolute top-0 left-0 w-full h-full opacity-10">
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500 blur-[120px]"></div>
    </div>
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="text-center mb-24">
        <span className="text-blue-400 text-xs font-bold tracking-[0.4em] uppercase mb-6 block">About</span>
        <h2 className="text-6xl md:text-7xl font-extralight text-white mb-6 tracking-tight">
          Excellence In <span className="font-normal">Every Part</span>
        </h2>
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-16 bg-gray-700"></div>
          <div className="w-1 h-1 bg-blue-500 rotate-45"></div>
          <div className="h-px w-16 bg-gray-700"></div>
        </div>
        <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto tracking-wide">
          Quality parts, expert service, unbeatable prices
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-px max-w-7xl mx-auto bg-gradient-to-r from-gray-800/30 via-blue-500/30 to-gray-800/30 p-px">
        <div className="group relative bg-gray-900 hover:bg-gray-800 p-12 transition-all duration-700 overflow-hidden">
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-700"></div>
          
          {/* Hover Glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
          </div>

          <div className="relative z-10 text-center">
            <div className="w-20 h-20 border-2 border-gray-700 group-hover:border-blue-500 transition-all duration-700 flex items-center justify-center mx-auto mb-8 group-hover:rotate-90">
              <CheckCircle className="w-9 h-9 text-gray-500 group-hover:text-blue-500 transition-all duration-700 group-hover:-rotate-90" />
            </div>
            <h3 className="text-2xl font-extralight text-white mb-6 tracking-[0.15em] uppercase">100% Original</h3>
            <div className="h-px w-16 bg-gray-800 group-hover:w-24 group-hover:bg-blue-500 transition-all duration-700 mx-auto mb-6"></div>
            <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-700 leading-relaxed font-light">
              All our parts are authentic and come with manufacturer warranty
            </p>
          </div>
        </div>
        
        <div className="group relative bg-gray-900 hover:bg-gray-800 p-12 transition-all duration-700 overflow-hidden">
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-700"></div>
          
          {/* Hover Glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
          </div>

          <div className="relative z-10 text-center">
            <div className="w-20 h-20 border-2 border-gray-700 group-hover:border-blue-500 transition-all duration-700 flex items-center justify-center mx-auto mb-8 group-hover:rotate-90">
              <Zap className="w-9 h-9 text-gray-500 group-hover:text-blue-500 transition-all duration-700 group-hover:-rotate-90" />
            </div>
            <h3 className="text-2xl font-extralight text-white mb-6 tracking-[0.15em] uppercase">Fast Delivery</h3>
            <div className="h-px w-16 bg-gray-800 group-hover:w-24 group-hover:bg-blue-500 transition-all duration-700 mx-auto mb-6"></div>
            <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-700 leading-relaxed font-light">
              Express shipping available nationwide for urgent orders
            </p>
          </div>
        </div>
        
        <div className="group relative bg-gray-900 hover:bg-gray-800 p-12 transition-all duration-700 overflow-hidden">
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-700"></div>
          
          {/* Hover Glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
          </div>

          <div className="relative z-10 text-center">
            <div className="w-20 h-20 border-2 border-gray-700 group-hover:border-blue-500 transition-all duration-700 flex items-center justify-center mx-auto mb-8 group-hover:rotate-90">
              <Shield className="w-9 h-9 text-gray-500 group-hover:text-blue-500 transition-all duration-700 group-hover:-rotate-90" />
            </div>
            <h3 className="text-2xl font-extralight text-white mb-6 tracking-[0.15em] uppercase">Expert Support</h3>
            <div className="h-px w-16 bg-gray-800 group-hover:w-24 group-hover:bg-blue-500 transition-all duration-700 mx-auto mb-6"></div>
            <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-700 leading-relaxed font-light">
              Professional assistance available 24/7 for all your needs
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Decorative Element */}
      <div className="mt-24 flex items-center justify-center gap-4">
        <div className="h-px w-32 bg-gradient-to-r from-transparent to-gray-800"></div>
        <div className="w-2 h-2 bg-blue-500 rotate-45"></div>
        <div className="h-px w-32 bg-gradient-to-l from-transparent to-gray-800"></div>
      </div>
    </div>
  </section>
);

export default AboutSection;