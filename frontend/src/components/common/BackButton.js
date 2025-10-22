import React from 'react';
import { ArrowRight } from 'lucide-react';

const BackButton = ({ onClick, currentView, selectedBrand, selectedModel }) => (
  <div className="fixed top-32 left-6 z-40">
    <button
      onClick={onClick}
      className="bg-white/95 backdrop-blur-md shadow-lg px-6 py-3 rounded-full text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm hover:shadow-xl transform hover:-translate-x-1 flex items-center gap-2"
    >
      <ArrowRight className="w-4 h-4 rotate-180" />
      {currentView === 'productDetails' ? 'Back' : 
       selectedModel ? `Back to ${selectedModel.name}` :
       selectedBrand ? `Back to ${selectedBrand.name}` :
       'Back to Home'}
    </button>
  </div>
);

export default BackButton;