import React from 'react';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';

const ContactSection = ({ contactRef }) => (
  <section ref={contactRef} className="py-32 bg-black relative overflow-hidden">
    {/* Background Grid Effect */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>
    </div>

    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent"></div>
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="text-center mb-20">
        <div className="inline-block">
          <span className="text-blue-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4 block">Contact</span>
          <h2 className="text-5xl md:text-6xl font-light text-white mb-6 tracking-tight">
            Get In <span className="font-semibold">Touch</span>
          </h2>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto"></div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-px max-w-7xl mx-auto bg-gradient-to-r from-blue-500/20 via-blue-400/20 to-blue-500/20 p-px">
        <a 
          href="tel:+201119890713"
          className="group relative bg-black p-12 overflow-hidden transition-all duration-500 hover:bg-gradient-to-br hover:from-gray-900 hover:to-black"
        >
          {/* Hover Glow Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
          </div>

          <div className="relative z-10">
            <div className="mb-8">
              <div className="w-14 h-14 border border-gray-700 group-hover:border-blue-400 transition-colors duration-500 flex items-center justify-center mb-6">
                <Phone className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors duration-500" />
              </div>
              <h3 className="text-white text-xl font-light tracking-wider mb-4">PHONE</h3>
              <div className="h-px w-12 bg-gray-800 group-hover:bg-blue-500 transition-colors duration-500 mb-6"></div>
            </div>
            <p className="text-gray-400 group-hover:text-white transition-colors duration-500 text-lg mb-2">+20 111 989 0713</p>
            <p className="text-gray-600 text-sm tracking-wide">Available 24/7</p>
          </div>
        </a>
        
        <a 
          href="https://wa.me/201119890713"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative bg-black p-12 overflow-hidden transition-all duration-500 hover:bg-gradient-to-br hover:from-gray-900 hover:to-black"
        >
          {/* Hover Glow Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
          </div>

          <div className="relative z-10">
            <div className="mb-8">
              <div className="w-14 h-14 border border-gray-700 group-hover:border-blue-400 transition-colors duration-500 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors duration-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <h3 className="text-white text-xl font-light tracking-wider mb-4">WHATSAPP</h3>
              <div className="h-px w-12 bg-gray-800 group-hover:bg-blue-500 transition-colors duration-500 mb-6"></div>
            </div>
            <p className="text-gray-400 group-hover:text-white transition-colors duration-500 text-lg mb-2">Send Message</p>
            <p className="text-gray-600 text-sm tracking-wide">Instant Response</p>
          </div>
        </a>
        
        <div className="group relative bg-black p-12 overflow-hidden transition-all duration-500 hover:bg-gradient-to-br hover:from-gray-900 hover:to-black">
          {/* Hover Glow Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
          </div>

          <div className="relative z-10">
            <div className="mb-8">
              <div className="w-14 h-14 border border-gray-700 group-hover:border-blue-400 transition-colors duration-500 flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors duration-500" />
              </div>
              <h3 className="text-white text-xl font-light tracking-wider mb-4">LOCATION</h3>
              <div className="h-px w-12 bg-gray-800 group-hover:bg-blue-500 transition-colors duration-500 mb-6"></div>
            </div>
            <p className="text-gray-400 group-hover:text-white transition-colors duration-500 text-lg mb-2">El Mahala el Kobra, Egypt</p>
            <p className="text-gray-600 text-sm tracking-wide">Visit Our Showroom</p>
          </div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="mt-20 max-w-7xl mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
      </div>
    </div>
  </section>
);

export default ContactSection;