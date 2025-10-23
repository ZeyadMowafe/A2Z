import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, Minus, Plus, Trash2, CheckCircle, Phone, MessageCircle, Clock } from 'lucide-react';

const CartModal = ({ cart, updateQuantity, removeFromCart, getTotalPrice, onClose, onCheckout }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const depositAmount = (getTotalPrice() * 0.5).toFixed(2);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.97, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.97, opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white w-full max-w-3xl max-h-[95vh] sm:max-h-[92vh] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.4)]"
          onClick={(e) => e.stopPropagation()}
        >
          <CartHeader 
            showInstructions={showInstructions} 
            onClose={onClose} 
          />
          
          <AnimatePresence mode="wait">
            {!showInstructions ? (
              <motion.div
                key="cart-content"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <CartContent
                  cart={cart}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                  getTotalPrice={getTotalPrice}
                  onShowInstructions={() => setShowInstructions(true)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="checkout-instructions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <CheckoutInstructions
                  depositAmount={depositAmount}
                  totalAmount={getTotalPrice()}
                  onBack={() => setShowInstructions(false)}
                  onCheckout={onCheckout}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const CartHeader = ({ showInstructions, onClose }) => (
  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 sm:px-6 py-4 sm:py-5 relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-shimmer"></div>
    </div>
    <div className="flex justify-between items-center relative z-10">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="bg-white/5 p-2 sm:p-2.5 backdrop-blur-sm border border-white/20">
          <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-extralight text-white tracking-[0.2em] sm:tracking-[0.25em] uppercase">
            {showInstructions ? 'Confirmation' : 'Cart'}
          </h2>
          <p className="text-gray-300 text-[10px] sm:text-xs font-light tracking-[0.15em] sm:tracking-[0.2em] uppercase mt-0.5">
            {showInstructions ? 'Order Details' : 'Your Selection'}
          </p>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 sm:p-2 transition-all duration-500"
      >
        <X size={20} className="sm:hidden" strokeWidth={1.5} />
        <X size={24} className="hidden sm:block" strokeWidth={1.5} />
      </motion.button>
    </div>
    
    <style jsx>{`
      @keyframes shimmer {
        0% {
          background-position: -250% 0;
        }
        100% {
          background-position: 250% 0;
        }
      }
      .animate-shimmer {
        animation: shimmer 8s ease-in-out infinite;
      }
    `}</style>
  </div>
);

const CartContent = ({ cart, updateQuantity, removeFromCart, getTotalPrice, onShowInstructions }) => (
  <>
    <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(95vh-180px)] sm:max-h-[450px] bg-gray-50">
      {cart.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="space-y-3 sm:space-y-4">    
          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>  
      )}
    </div>
    
    {cart.length > 0 && (
      <CartFooter 
        totalPrice={getTotalPrice()} 
        onCheckout={onShowInstructions} 
      />
    )}
  </>
);

const EmptyCart = () => (
  <div className="text-center py-16 sm:py-20">
    <div className="bg-gray-100 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mx-auto mb-5 sm:mb-6 border border-gray-200">
      <ShoppingBag className="w-12 h-12 sm:w-14 sm:h-14 text-gray-400" strokeWidth={1} />
    </div>
    <h3 className="text-gray-900 text-xl sm:text-2xl font-extralight mb-2 sm:mb-3 tracking-[0.1em] sm:tracking-[0.15em] uppercase">Empty Cart</h3>
    <p className="text-gray-500 text-sm sm:text-base font-light tracking-wide">Add items to get started</p>
  </div>
);

const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.4 }}
    className="bg-white p-3 sm:p-5 shadow-md hover:shadow-lg transition-all duration-500 border-l-2 sm:border-l-4 border-gray-900"
  >
    <div className="flex items-center gap-3 sm:gap-5">
      <div className="bg-gray-50 p-1.5 sm:p-2 border border-gray-200">
        <img 
          src={item.image_url} 
          alt={item.name}
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-light text-gray-900 text-base sm:text-lg mb-1 sm:mb-2 tracking-wide truncate">{item.name}</h3>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-gray-500 text-xs sm:text-sm font-light">Unit Price:</span>
          <span className="font-semibold text-gray-900 text-sm sm:text-base">EGP {item.price}</span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-5">
        <QuantityControl
          quantity={item.quantity}
          onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1)}
          onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
        />
        
        <div className="text-right">
          <motion.p 
            key={item.quantity}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="font-light text-gray-900 text-lg sm:text-xl mb-1 sm:mb-2"
          >
            EGP {(item.price * item.quantity).toFixed(2)}
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onRemove(item.id)}
            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 sm:p-2 transition-all duration-300"
          >
            <Trash2 size={16} className="sm:hidden" strokeWidth={1.5} />
            <Trash2 size={18} className="hidden sm:block" strokeWidth={1.5} />
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
);

const QuantityControl = ({ quantity, onDecrease, onIncrease }) => (
  <div className="flex items-center bg-white border border-gray-300">
    <button
      onClick={onDecrease}
      className="w-8 h-8 sm:w-10 sm:h-10 hover:bg-gray-100 transition-all duration-300 flex items-center justify-center"
    >
      <Minus size={14} className="sm:hidden text-gray-700" strokeWidth={1.5} />
      <Minus size={16} className="hidden sm:block text-gray-700" strokeWidth={1.5} />
    </button>
    <span className="w-10 sm:w-12 text-center font-light text-gray-900 text-sm sm:text-base">
      {quantity}
    </span>
    <button
      onClick={onIncrease}
      className="w-8 h-8 sm:w-10 sm:h-10 hover:bg-gray-100 transition-all duration-300 flex items-center justify-center"
    >
      <Plus size={14} className="sm:hidden text-gray-700" strokeWidth={1.5} />
      <Plus size={16} className="hidden sm:block text-gray-700" strokeWidth={1.5} />
    </button>
  </div>
);

const CartFooter = ({ totalPrice, onCheckout }) => (
  <div className="px-4 sm:px-6 py-4 sm:py-6 bg-white border-t border-gray-200">
    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
      <div className="flex justify-between text-gray-600 text-sm sm:text-base font-light">
        <span>Subtotal</span>
        <span className="font-semibold text-gray-900">EGP {totalPrice.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-gray-600 text-sm sm:text-base font-light">
        <span>Shipping</span>
        <span className="font-semibold text-gray-900">Free</span>
      </div>
      <div className="h-px bg-gray-300"></div>
      <div className="flex justify-between items-center pt-1 sm:pt-2">
        <span className="text-lg sm:text-xl font-extralight text-gray-900 tracking-[0.1em] sm:tracking-[0.15em] uppercase">Total</span>
        <span className="text-xl sm:text-2xl font-light text-gray-900">EGP {totalPrice.toFixed(2)}</span>
      </div>
    </div>
    
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onCheckout}
      className="w-full bg-gray-900 hover:bg-black text-white py-3 sm:py-4 text-sm sm:text-base font-light tracking-[0.2em] sm:tracking-[0.25em] uppercase transition-all duration-700 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group"
    >
      <span>Proceed to Checkout</span>
      <ArrowRight size={18} className="sm:hidden" strokeWidth={1.5} />
      <ArrowRight size={20} className="hidden sm:block group-hover:translate-x-2 transition-transform duration-500" strokeWidth={1.5} />
    </motion.button>
  </div>
);

const CheckoutInstructions = ({ depositAmount, totalAmount, onBack, onCheckout }) => (
  <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[550px] bg-gray-50">
    <div className="space-y-4 sm:space-y-5">
      <OrderSummary totalAmount={totalAmount} depositAmount={depositAmount} />
      <PaymentInstructions depositAmount={depositAmount} />
      <ConfirmationInstructions />
      <NextSteps />
    </div>

    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-5 sm:mt-6">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onBack}
        className="w-full sm:flex-1 bg-white border-2 border-gray-900 text-gray-900 py-3 sm:py-4 text-sm sm:text-base font-light tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all duration-700 hover:bg-gray-50"
      >
        Back to Cart
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCheckout}
        className="w-full sm:flex-1 bg-gray-900 hover:bg-black text-white py-3 sm:py-4 text-sm sm:text-base font-light tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all duration-700 shadow-xl"
      >
        Continue
      </motion.button>
    </div>
  </div>
);

const OrderSummary = ({ totalAmount, depositAmount }) => (
  <div className="bg-white p-4 sm:p-6 shadow-md border-l-2 sm:border-l-4 border-gray-900">
    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 pb-3 border-b border-gray-200">
      <div className="bg-gray-900 p-2 sm:p-2.5">
        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={1.5} />
      </div>
      <h4 className="font-extralight text-gray-900 text-base sm:text-lg tracking-[0.1em] sm:tracking-[0.15em] uppercase">Summary</h4>
    </div>
    
    <div className="space-y-3 sm:space-y-4 bg-gray-50 p-4 sm:p-5 border border-gray-200">
      <div className="flex justify-between text-gray-600 text-sm sm:text-base font-light">
        <span>Total Amount</span>
        <span className="font-semibold text-gray-900">EGP {totalAmount.toFixed(2)}</span>
      </div>
      <div className="h-px bg-gray-300"></div>
      <div className="flex justify-between items-center">
        <span className="text-gray-700 text-sm sm:text-base font-light">Deposit (50%)</span>
        <span className="text-lg sm:text-xl font-light text-gray-900">EGP {depositAmount}</span>
      </div>
    </div>
  </div>
);

const PaymentInstructions = ({ depositAmount }) => (
  <div className="bg-white p-4 sm:p-6 shadow-md border-l-2 sm:border-l-4 border-gray-900">
    <div className="flex items-start gap-3 sm:gap-4">
      <div className="bg-gray-100 p-2 sm:p-3 mt-1 border border-gray-200">
        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" strokeWidth={1.5} />
      </div>
      <div className="flex-1">
        <h4 className="font-extralight text-gray-900 text-base sm:text-lg mb-3 sm:mb-4 tracking-[0.08em] sm:tracking-[0.1em] uppercase">Step 1: Payment</h4>
        <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 font-light leading-relaxed">
          Transfer <span className="font-semibold text-gray-900">EGP {depositAmount}</span> via payment method to:
        </p>
        <div className="bg-gray-900 text-white p-3 sm:p-4 text-center">
          <span className="text-lg sm:text-xl font-light tracking-wide">+20 01119890713</span>
        </div>
      </div>
    </div>
  </div>
);

const ConfirmationInstructions = () => (
  <div className="bg-white p-4 sm:p-6 shadow-md border-l-2 sm:border-l-4 border-gray-900">
    <div className="flex items-start gap-3 sm:gap-4">
      <div className="bg-gray-100 p-2 sm:p-3 mt-1 border border-gray-200">
        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" strokeWidth={1.5} />
      </div>
      <div className="flex-1">
        <h4 className="font-extralight text-gray-900 text-base sm:text-lg mb-3 sm:mb-4 tracking-[0.08em] sm:tracking-[0.1em] uppercase">Step 2: Confirmation</h4>
        <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 font-light">Send payment screenshot via:</p>
        
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="bg-gray-50 border border-gray-300 p-2.5 sm:p-3 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" strokeWidth={1.5} />
              <span className="font-light text-gray-900 text-sm sm:text-base">WhatsApp</span>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-300 p-2.5 sm:p-3 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" strokeWidth={1.5} />
              <span className="font-light text-gray-900 text-sm sm:text-base">Instagram</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-100 p-3 sm:p-4 text-center border border-gray-300">
          <span className="text-base sm:text-lg font-light text-gray-900 tracking-wide">+20 01119890713</span>
        </div>
      </div>
    </div>
  </div>
);

const NextSteps = () => (
  <div className="bg-gray-100 p-4 sm:p-5 border-l-2 sm:border-l-4 border-gray-400">
    <div className="flex items-start gap-2.5 sm:gap-3">
      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0" strokeWidth={1.5} />
      <div>
        <h5 className="font-light text-gray-900 text-sm sm:text-base mb-1.5 sm:mb-2 tracking-wide uppercase">What's Next?</h5>
        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed font-light">
          Our team will contact you within 24 hours to confirm your order and arrange delivery details.
        </p>
      </div>
    </div>
  </div>
);

export default CartModal;