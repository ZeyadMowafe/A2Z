import React from 'react';
import { Instagram, Facebook, Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-slate-700/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Top Premium Border */}
      <div className="relative h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-8 lg:px-20 py-16">
        <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
          
          {/* Brand Section - Premium */}
          <div>
            <div className="mb-10">
              {/* Logo with Glow Effect - BIGGER */}
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-110"></div>
                <img
                  src="/logo.png"
                  alt="AtoZ Logo"
                  className="h-24 w-auto relative z-10 brightness-0 invert"
                />
              </div>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-md">
                Delivering automotive excellence through premium parts and unmatched service. 
                Your journey to perfection starts here.
              </p>
              
              {/* Premium Divider */}
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[2px] w-16 bg-gradient-to-r from-blue-500 to-transparent"></div>
                <div className="w-2 h-2 border border-blue-500 rotate-45"></div>
              </div>
              
              {/* Social Media - Luxury Style */}
              <div className="space-y-4">
                <div className="text-slate-500 text-xs tracking-[0.2em] uppercase font-semibold mb-4">Follow Our Journey</div>
                <div className="flex gap-3">
                  {socialLinks.map(({ icon: Icon, label, href }) => (
                    <a 
                      key={label}
                      href={href}
                      className="group relative w-11 h-11 border-2 border-slate-800 hover:border-blue-500 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center transition-all duration-500 overflow-hidden"
                      aria-label={label}
                    >
                      {/* Hover Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:to-blue-500/5 transition-all duration-500"></div>
                      
                      <Icon className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-all duration-500 relative z-10 group-hover:scale-110" />
                      
                      {/* Corner Accents */}
                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-500/0 group-hover:border-blue-500/50 transition-all duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blue-500/0 group-hover:border-blue-500/50 transition-all duration-500"></div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info - Premium */}
          <div>
            <div className="mb-8">
              <h3 className="text-white font-bold text-sm tracking-[0.15em] uppercase mb-8 relative inline-block">
                Connect With Us
                <div className="absolute -bottom-3 left-0 flex items-center gap-2">
                  <div className="h-[2px] w-12 bg-blue-500"></div>
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                </div>
              </h3>
            </div>
            <ul className="space-y-6">
              <li className="group">
                <div className="flex items-start gap-4">
                  <div className="relative w-11 h-11 border-2 border-slate-800 group-hover:border-blue-500 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center flex-shrink-0 transition-all duration-500">
                    <Phone className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-all duration-500" />
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-all duration-500"></div>
                  </div>
                  <div className="pt-2">
                    <div className="text-slate-500 text-xs mb-1 tracking-wider uppercase">Phone</div>
                    <div className="text-slate-300 group-hover:text-white transition-colors duration-300 text-sm font-light">+20 111 989 0713</div>
                  </div>
                </div>
              </li>
              
              <li className="group">
                <div className="flex items-start gap-4">
                  <div className="relative w-11 h-11 border-2 border-slate-800 group-hover:border-blue-500 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center flex-shrink-0 transition-all duration-500">
                    <Mail className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-all duration-500" />
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-all duration-500"></div>
                  </div>
                  <div className="pt-2">
                    <div className="text-slate-500 text-xs mb-1 tracking-wider uppercase">Email</div>
                    <div className="text-slate-300 group-hover:text-white transition-colors duration-300 text-sm font-light">info@atozautoparts.com</div>
                  </div>
                </div>
              </li>
              
              <li className="group">
                <div className="flex items-start gap-4">
                  <div className="relative w-11 h-11 border-2 border-slate-800 group-hover:border-blue-500 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center flex-shrink-0 transition-all duration-500">
                    <MapPin className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-all duration-500" />
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-all duration-500"></div>
                  </div>
                  <div className="pt-2">
                    <div className="text-slate-500 text-xs mb-1 tracking-wider uppercase">Location</div>
                    <div className="text-slate-300 group-hover:text-white transition-colors duration-300 text-sm font-light">Cairo, Egypt</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Ultra Premium */}
      <div className="relative border-t border-slate-800/50">
        <div className="container mx-auto px-8 lg:px-20 py-6">
          <div className="text-center">
            <p className="text-slate-500 text-sm font-light">
              © 2025 <span className="text-slate-400 font-normal"> AtoZ Auto Parts by Zeyad Mowafe
</span>. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Premium Bottom Accent */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
    </footer>
  );
};

export default Footer;