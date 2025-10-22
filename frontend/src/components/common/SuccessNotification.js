import React, { useEffect } from 'react';
import { X, CheckCircle, Clock } from 'lucide-react';

const SuccessNotification = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-24 right-6 z-50 animate-slide-in-right">
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-2xl border-2 border-green-300 max-w-sm">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Order Successful! 🎉</h3>
            <p className="text-green-100 text-sm leading-relaxed">
              Your order has been placed successfully. Our team will contact you within 24 hours to confirm delivery details.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-4 flex items-center gap-2 text-green-100 text-sm">
          <Clock className="w-4 h-4" />
          <span>You'll be contacted within 24 hours</span>
        </div>
        
        <div className="mt-3 h-1 bg-green-400/30 rounded-full overflow-hidden">
          <div className="h-full bg-white animate-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default SuccessNotification;