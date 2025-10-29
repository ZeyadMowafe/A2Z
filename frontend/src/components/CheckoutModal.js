import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, ShoppingBag, User, Mail, Phone, MapPin, CreditCard, Package, ArrowRight } from 'lucide-react';

const CheckoutModal = ({ customerInfo = {}, setCustomerInfo, cart, getTotalPrice, onClose, onSubmit }) => {
  const [showResult, setShowResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setShowResult(null);

    try {
      const result = await onSubmit();

      if (result && (result.id || result.success === true)) {
        setShowResult('success');
      } else {
        throw new Error('Order confirmation failed');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      
      let userFriendlyMessage = '';

      if (!navigator.onLine) {
        userFriendlyMessage = '⚠️ لا يوجد اتصال بالإنترنت\n\nالرجاء التأكد من:\n• تشغيل الواي فاي أو البيانات\n• وجود إشارة إنترنت قوية\n• ثم المحاولة مرة أخرى';
      } else if (error && error.message) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          userFriendlyMessage = '⚠️ مشكلة في الاتصال بالخادم\n\nالرجاء:\n• التأكد من اتصال الإنترنت\n• إعادة المحاولة بعد قليل\n• إذا استمرت المشكلة، تواصل معنا';
        } else if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
          userFriendlyMessage = '⚠️ الخادم مشغول حالياً\n\nالرجاء:\n• الانتظار دقيقة واحدة\n• إعادة المحاولة\n• إذا لم تنجح، تواصل معنا على 01016887251';
        } else if (error.message.includes('timeout')) {
          userFriendlyMessage = '⚠️ انتهت مهلة الاتصال\n\nالرجاء:\n• التأكد من سرعة الإنترنت\n• المحاولة مرة أخرى\n• استخدام شبكة إنترنت أقوى';
        } else if (error.message.includes('validation') || error.message.includes('invalid')) {
          userFriendlyMessage = '⚠️ خطأ في البيانات المدخلة\n\nالرجاء التأكد من:\n• صحة رقم الهاتف\n• صحة البريد الإلكتروني\n• اكتمال جميع الحقول المطلوبة';
        } else if (error.message.includes('Order confirmation failed')) {
          userFriendlyMessage = '⚠️ لم يتم تأكيد الطلب\n\nالمشكلة:\n• لم نستلم تأكيد من النظام\n\nالحل:\n• حاول مرة أخرى\n• أو تواصل معنا على 01016887251';
        } else {
          userFriendlyMessage = `⚠️ حدث خطأ غير متوقع\n\nتفاصيل المشكلة:\n${error.message}\n\nالرجاء:\n• المحاولة مرة أخرى\n• أو التواصل معنا على 01016887251`;
        }
      } else {
        userFriendlyMessage = '⚠️ حدث خطأ غير معروف\n\nالرجاء:\n• المحاولة مرة أخرى\n• إذا استمرت المشكلة\n• تواصل معنا على 01016887251';
      }

      setErrorMessage(userFriendlyMessage);
      setShowResult('failure');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndTryAgain = () => {
    setShowResult(null);
    setErrorMessage('');
    setIsLoading(false);
  };

  const closeModal = () => {
    setShowResult(null);
    setErrorMessage('');
    setIsLoading(false);
    onClose();
  };

  // ✅ Success Screen - BMW Style
  if (showResult === 'success') {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-slate-50 to-white max-w-lg w-full rounded-sm shadow-2xl overflow-hidden animate-scale-up border border-slate-200">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-sm flex items-center justify-center mx-auto mb-4 border border-white/20">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-light text-white mb-2 tracking-wide">ORDER CONFIRMED</h3>
              <p className="text-slate-300 text-sm font-light tracking-wider">Thank you for your purchase</p>
            </div>
          </div>

          {/* Success Body */}
          <div className="p-8">
            <div className="bg-slate-50 rounded-sm p-6 mb-6 border border-slate-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-slate-800 text-white rounded-sm p-2 mt-1">
                  <Package className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-light text-slate-900 text-base mb-4 tracking-wide">NEXT STEPS</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 bg-white rounded-sm p-4 border border-slate-200">
                      <span className="flex-shrink-0 w-6 h-6 bg-slate-800 text-white rounded-sm flex items-center justify-center text-xs font-light">1</span>
                      <p className="text-slate-700 text-sm leading-relaxed font-light">
                        Transfer <span className="font-medium">50% deposit (EGP {(getTotalPrice() * 0.5).toFixed(2)})</span> to 
                        <span className="font-medium"> 01016887251</span> via Vodafone Cash
                      </p>
                    </div>
                    <div className="flex items-start gap-3 bg-white rounded-sm p-4 border border-slate-200">
                      <span className="flex-shrink-0 w-6 h-6 bg-slate-800 text-white rounded-sm flex items-center justify-center text-xs font-light">2</span>
                      <p className="text-slate-700 text-sm leading-relaxed font-light">
                        Send payment screenshot via WhatsApp or Instagram to <span className="font-medium">01016887251</span>
                      </p>
                    </div>
                    <div className="flex items-start gap-3 bg-white rounded-sm p-4 border border-slate-200">
                      <span className="flex-shrink-0 w-6 h-6 bg-slate-800 text-white rounded-sm flex items-center justify-center text-xs font-light">3</span>
                      <p className="text-slate-700 text-sm leading-relaxed font-light">
                        We'll contact you within 24 hours to confirm and arrange delivery
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={closeModal}
              className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white py-4 font-light text-base rounded-sm hover:from-slate-700 hover:to-slate-800 transition-all duration-500 tracking-wider shadow-lg"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ❌ Failure Screen - BMW Style
  if (showResult === 'failure') {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-slate-50 to-white max-w-lg w-full rounded-sm shadow-2xl overflow-hidden animate-scale-up border border-slate-200">
          {/* Error Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-sm flex items-center justify-center mx-auto mb-4 border border-white/20">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-light text-white mb-2 tracking-wide">ORDER FAILED</h3>
              <p className="text-slate-300 text-sm font-light tracking-wider">Something went wrong</p>
            </div>
          </div>

          {/* Error Body */}
          <div className="p-8">
            <div className="bg-red-50 rounded-sm p-6 mb-6 border border-red-200">
              <p className="text-slate-900 text-center mb-3 font-light tracking-wide text-lg">ما هي المشكلة؟</p>
              <p className="text-slate-700 text-sm text-right leading-relaxed font-light whitespace-pre-wrap" dir="rtl">{errorMessage || 'حدث خطأ غير معروف'}</p>
            </div>

            <div className="bg-slate-50 rounded-sm p-5 mb-6 border border-slate-200">
              <p className="text-slate-700 text-sm text-center font-light">
                Need help? Contact us at <span className="font-medium">01016887251</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetAndTryAgain}
                className="flex-1 bg-gradient-to-r from-slate-800 to-slate-900 text-white py-4 font-light rounded-sm hover:from-slate-700 hover:to-slate-800 transition-all duration-500 tracking-wider"
              >
                TRY AGAIN
              </button>
              <button
                onClick={closeModal}
                className="flex-1 bg-slate-300 text-slate-700 py-4 font-light rounded-sm hover:bg-slate-400 transition-all duration-300 tracking-wider"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ⏳ Loading Screen - BMW Style
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-gradient-to-b from-slate-50 to-white p-10 rounded-sm shadow-2xl text-center border border-slate-200">
          <div className="w-16 h-16 border-2 border-slate-200 border-t-slate-800 rounded-sm animate-spin mx-auto mb-6"></div>
          <p className="text-slate-900 text-lg font-light mb-2 tracking-wide">PROCESSING ORDER</p>
          <p className="text-slate-500 text-sm font-light tracking-wider">Please wait a moment</p>
        </div>
      </div>
    );
  }

  // 📝 Main Checkout Form - BMW Style
  const depositAmount = (getTotalPrice() * 0.5).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-slate-50 to-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-sm shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-sm backdrop-blur-sm border border-white/20">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-light text-white tracking-widest">CHECKOUT</h2>
                <p className="text-slate-300 text-xs font-light tracking-wider">Complete your order</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-sm transition-all duration-300"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Left Column - Form */}
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-slate-800 rounded-sm flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-light text-slate-900 tracking-wide">CUSTOMER INFORMATION</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-sm focus:outline-none focus:border-slate-800 transition-all duration-300 text-slate-900 font-light"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-sm focus:outline-none focus:border-slate-800 transition-all duration-300 text-slate-900 font-light"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-sm focus:outline-none focus:border-slate-800 transition-all duration-300 text-slate-900 font-light"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Address */}
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-slate-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <textarea
                      placeholder="Delivery Address (Street, Area, City)"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-sm focus:outline-none focus:border-slate-800 transition-all duration-300 text-slate-900 font-light h-28 resize-none"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Submit Button - Mobile */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="md:hidden w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white py-4 font-light text-base rounded-sm hover:from-slate-700 hover:to-slate-800 transition-all duration-500 tracking-wider shadow-lg flex items-center justify-center gap-2 group"
                  >
                    <span>PLACE ORDER</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <div className="bg-slate-50 rounded-sm p-6 border border-slate-200 sticky top-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-slate-800 rounded-sm flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-light text-slate-900 tracking-wide">ORDER SUMMARY</h3>
                </div>

                {/* Items */}
                <div className="bg-white rounded-sm p-4 mb-4 max-h-48 overflow-y-auto border border-slate-200">
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
                        <div className="flex-1">
                          <p className="font-light text-slate-900 text-sm tracking-wide">{item.name}</p>
                          <p className="text-slate-500 text-xs font-light">Quantity: {item.quantity}</p>
                        </div>
                        <span className="font-medium text-slate-800 ml-2">
                          EGP {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-slate-600 font-light">
                    <span>Subtotal</span>
                    <span className="font-medium">EGP {getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-light">
                    <span>Shipping</span>
                    <span className="text-slate-800 font-medium">Free</span>
                  </div>
                  <div className="h-px bg-slate-300"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-light text-slate-900 tracking-wide">TOTAL</span>
                    <span className="text-2xl font-light text-slate-900">EGP {getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                {/* Deposit Info */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-sm p-4 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <CreditCard className="w-5 h-5 text-white" />
                    <span className="text-white font-light tracking-wide">DEPOSIT REQUIRED</span>
                  </div>
                  <p className="text-3xl font-light text-white">EGP {depositAmount}</p>
                  <p className="text-slate-300 text-sm mt-1 font-light">50% upfront payment</p>
                </div>

                {/* Submit Button - Desktop */}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="hidden md:flex w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white py-4 font-light text-base rounded-sm hover:from-slate-700 hover:to-slate-800 transition-all duration-500 tracking-wider shadow-lg items-center justify-center gap-2 group"
                >
                  <span>PLACE ORDER</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 mt-4 text-slate-500 text-xs font-light tracking-wide">
                  <div className="w-4 h-4 bg-slate-800 rounded-sm flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span>SECURE PAYMENT PROCESS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-up {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-up {
          animation: scale-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CheckoutModal;
