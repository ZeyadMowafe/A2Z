import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag, CheckCircle, Shield, Minus, Plus, ArrowLeft, Package, Truck, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { pageVariants, pageTransition } from '../../constants/animations';
import LoadingState from '../common/LoadingState';

const ProductDetailsView = ({ product, loading, onAddToCart, onOpenCart, onBack }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  if (loading) {
    return <LoadingState message="Loading product details..." />;
  }

  const handleBack = () => {
    if (product.model_id) {
      navigate(`/brand/${product.brand_id}/model/${product.model_id}`);
    } else if (product.brand_id) {
      navigate(`/brand/${product.brand_id}`);
    } else {
      navigate('/');
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
  };

  const handleOrderNow = () => {
    // Add to cart first
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    // فتح الـ cart
    if (onOpenCart) {
      onOpenCart();
    }
  };

  const productImages = product.images && product.images.length > 0 
    ? [product.image_url, ...product.images]
    : [product.image_url];

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextImage();
    }
    if (touchStart - touchEnd < -50) {
      prevImage();
    }
  };

  return (
    <motion.section 
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="relative min-h-screen py-16 lg:py-24 overflow-hidden"
    >
      {/* Premium Dark Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
      
      {/* Sophisticated Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Ambient Lighting */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-[800px] h-[800px] bg-blue-600/8 rounded-full blur-[200px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-purple-700/8 rounded-full blur-[180px]"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            {/* Main Image with Smooth Transition */}
            <div 
              className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-800 group"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}></div>
              </div>

              {/* Animated Image with Framer Motion */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex}
                  src={productImages[selectedImageIndex]}
                  alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-contain p-8 z-10"
                />
              </AnimatePresence>
              
              {/* Radial Glow */}
              <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              {productImages.length > 1 && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={prevImage}
                    className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 bg-slate-800/95 hover:bg-slate-700 border-2 border-slate-600 hover:border-blue-500 p-2 lg:p-3 transition-all duration-300 group/btn z-20"
                  >
                    <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-slate-300 group-hover/btn:text-blue-400 transition-colors" />
                  </button>
                  
                  {/* Next Button */}
                  <button
                    onClick={nextImage}
                    className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 bg-slate-800/95 hover:bg-slate-700 border-2 border-slate-600 hover:border-blue-500 p-2 lg:p-3 transition-all duration-300 group/btn z-20"
                  >
                    <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-slate-300 group-hover/btn:text-blue-400 transition-colors" />
                  </button>
                  
                  {/* Image Counter */}
                  <motion.div 
                    key={selectedImageIndex}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-800/95 backdrop-blur-sm border border-blue-500/30 px-4 py-2 text-blue-100 text-sm font-bold tracking-wider z-20"
                  >
                    {selectedImageIndex + 1} / {productImages.length}
                  </motion.div>

                  {/* Swipe Indicator on Mobile */}
                  <div className="lg:hidden absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800/90 border border-slate-600 px-3 py-1 text-slate-400 text-xs font-semibold z-20">
                    ← Swipe to browse →
                  </div>
                </>
              )}

              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Thumbnails with Smooth Scroll */}
            {productImages.length > 1 && (
              <div className="relative">
                <div className="grid grid-cols-4 gap-3 overflow-x-auto scrollbar-hide">
                  {productImages.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`aspect-square overflow-hidden bg-slate-800 border-2 transition-all duration-300 ${
                        selectedImageIndex === index 
                          ? 'border-blue-500 ring-2 ring-blue-500/30' 
                          : 'border-slate-700 hover:border-blue-400'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedImageIndex === index && (
                        <motion.div
                          layoutId="activeThumb"
                          className="absolute inset-0 bg-blue-500/10"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-2"
            >
              {product.brand_name && (
                <span className="bg-slate-800 border border-slate-700 text-blue-400 px-3 py-1.5 text-xs font-bold tracking-wider uppercase">
                  {product.brand_name}
                </span>
              )}
              {product.model_name && (
                <span className="bg-slate-800 border border-slate-700 text-emerald-400 px-3 py-1.5 text-xs font-bold tracking-wider uppercase">
                  {product.model_name}
                </span>
              )}
              {product.category_name && (
                <span className="bg-slate-800 border border-slate-700 text-purple-400 px-3 py-1.5 text-xs font-bold tracking-wider uppercase">
                  {product.category_name}
                </span>
              )}
            </motion.div>
            
            {/* Product Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl lg:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                {product.name}
              </h1>
              
              {/* Decorative Line */}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-[2px] bg-gradient-to-r from-blue-500 to-transparent mb-6"
              ></motion.div>
            </motion.div>

            {/* Price & Stock */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-slate-800 to-slate-900 border-2 border-slate-700 p-6"
            >
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-sm text-slate-400 font-semibold tracking-wider uppercase block mb-2">Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base text-blue-400 font-bold">EGP</span>
                    <span className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
                      {product.price}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 border border-emerald-500/30 px-4 py-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-emerald-100 text-sm tracking-wide">IN STOCK</span>
                </div>
              </div>
              
              {/* Bottom Accent */}
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mt-4 h-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-transparent origin-left"
              ></motion.div>
            </motion.div>

            {/* Description */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-800/50 border border-slate-700 p-6"
            >
              <p className="text-slate-300 text-sm lg:text-base leading-relaxed">
                {product.description || 'Premium quality auto part designed for optimal performance and durability. Engineered to meet the highest standards of excellence.'}
              </p>
            </motion.div>

            {/* Quantity Control */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-white text-lg tracking-wide">Quantity</span>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-blue-500 text-white flex items-center justify-center transition-all duration-300"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <motion.span 
                    key={quantity}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="w-16 text-center text-2xl font-black text-white"
                  >
                    {quantity}
                  </motion.span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-blue-500 text-white flex items-center justify-center transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              
              <div className="h-[1px] bg-slate-700 my-4"></div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold">Total Price</span>
                <motion.div 
                  key={quantity}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="flex items-baseline gap-2"
                >
                  <span className="text-sm text-blue-400 font-bold">EGP</span>
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
                    {(product.price * quantity).toFixed(2)}
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Action Buttons - Add to Cart & Order Now */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 gap-3"
            >
              {/* Add to Cart Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="group/btn relative bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 hover:border-blue-500 text-white py-4 font-bold text-base tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
              >
                <ShoppingBag className="w-5 h-5 relative z-10" />
                <span className="relative z-10 hidden sm:inline">Add to Cart</span>
                <span className="relative z-10 sm:hidden">Add</span>
                
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
              </motion.button>

              {/* Order Now Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOrderNow}
                className="group/btn relative bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white py-4 font-black text-base tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-2xl shadow-emerald-600/50 hover:shadow-emerald-500/60 overflow-hidden"
              >
                <Zap className="w-5 h-5 relative z-10" />
                <span className="relative z-10 hidden sm:inline">Order Now</span>
                <span className="relative z-10 sm:hidden">Order</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                
                {/* Metallic Shine */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
                
                {/* Bottom Glow */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
              </motion.button>
            </motion.div>

            {/* Features */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-slate-800/50 border border-slate-700 p-6"
            >
              <h3 className="font-black text-white text-xl mb-5 tracking-wide">Premium Features</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: CheckCircle, text: '100% Original', color: 'emerald' },
                  { icon: Shield, text: '1 Year Warranty', color: 'blue' },
                  { icon: Truck, text: 'Fast Delivery', color: 'purple' },
                  { icon: Package, text: 'Easy Install', color: 'amber' }
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-10 h-10 bg-${feature.color}-500/10 border border-${feature.color}-500/30 flex items-center justify-center`}>
                      <feature.icon className={`w-5 h-5 text-${feature.color}-400`} />
                    </div>
                    <span className="text-slate-300 font-semibold text-sm">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Product Details Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 p-8 lg:p-12"
        >
          <h3 className="text-3xl font-black text-white mb-8 tracking-wide">Product Details</h3>
          
          <div className="h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-transparent mb-8"></div>
          
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p className="text-base lg:text-lg">
              This premium auto part is manufactured to the highest standards of quality and performance. 
              Designed to meet or exceed OEM specifications, it ensures perfect fit and reliable operation for your vehicle.
            </p>
            
            <h4 className="text-2xl font-bold text-white mt-8 mb-5">Key Benefits</h4>
            <ul className="space-y-4">
              {[
                'Premium quality materials for enhanced durability',
                'Precision engineering for perfect fit',
                'Meets or exceeds OEM standards',
                'Comprehensive warranty coverage'
              ].map((benefit, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-6 h-6 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-slate-300">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ProductDetailsView;