import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { pageVariants, pageTransition } from './constants/animations';
import useApi from './hooks/useApi';
import useCart from './hooks/useCart';
import useLazyLoad from './hooks/useLazyLoad'; 
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import CartModal from './components/common/CartModal';
import SuccessNotification from './components/common/SuccessNotification';
import BackButton from './components/common/BackButton';
import CheckoutModal from './components/CheckoutModal';
import HeroSection from './components/sections/HeroSection';
import BrandsSection from './components/sections/BrandsSection';
import ModelsView from './components/sections/ModelsView';
import PartsView from './components/sections/PartsView';
import ProductDetailsView from './components/sections/ProductDetailsView';
import AboutSection from './components/sections/AboutSection';
import ContactSection from './components/sections/ContactSection';
import AdminPanel from './components/AdminPanel';

// Detect mobile device
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Enhanced Cache utility - محسّن جداً للموبايل
const cache = {
  data: new Map(),
  timestamps: new Map(),
  maxSize: isMobile ? 25 : 50,
  
  set(key, value, ttl = 600000) {
    if (this.data.size >= this.maxSize) {
      const oldestKey = [...this.timestamps.entries()]
        .sort((a, b) => a[1] - b[1])[0][0];
      this.delete(oldestKey);
    }
    
    this.data.set(key, value);
    this.timestamps.set(key, Date.now() + ttl);
  },
  
  get(key) {
    const timestamp = this.timestamps.get(key);
    if (timestamp && Date.now() < timestamp) {
      return this.data.get(key);
    }
    this.delete(key);
    return null;
  },
  
  delete(key) {
    this.data.delete(key);
    this.timestamps.delete(key);
  },
  
  clear() {
    this.data.clear();
    this.timestamps.clear();
  }
};

// Lazy components محسّنة
const LazyHomeView = React.memo(({ brands, products, brandsRef, onBrandClick, onScrollToBrands }) => {
  const [heroRef, heroVisible] = useLazyLoad({ threshold: 0.01, rootMargin: '50px' });
  const [brandsRefLazy, brandsVisible] = useLazyLoad({ threshold: 0.01, rootMargin: '100px' });

  return (
    <>
      <div ref={heroRef} className="min-h-[50vh]">
        {heroVisible && (
          <HeroSection onScrollToBrands={onScrollToBrands} brandsCount={brands.length} />
        )}
      </div>
      
      <div ref={brandsRefLazy} className="min-h-[30vh]">
        {brandsVisible && (
          <BrandsSection 
            brands={brands} 
            brandsRef={brandsRef} 
            onBrandClick={onBrandClick} 
            productsCount={products.length} 
          />
        )}
      </div>
    </>
  );
});

const LazyModelsView = React.memo(({ selectedBrand, models, loading, onModelClick }) => {
  const [modelsRef, modelsVisible] = useLazyLoad({ threshold: 0.01, rootMargin: '100px' });

  return (
    <div ref={modelsRef} className="min-h-[40vh]">
      {modelsVisible && (
        <ModelsView
          selectedBrand={selectedBrand}
          models={models}
          loading={loading}
          onModelClick={onModelClick}
        />
      )}
    </div>
  );
});

const LazyPartsView = React.memo(({ 
  selectedBrand, 
  selectedModel, 
  products, 
  categories, 
  productsByCategory, 
  loading, 
  onAddToCart, 
  onViewDetails 
}) => {
  const [partsRef, partsVisible] = useLazyLoad({ threshold: 0.01, rootMargin: '150px' });

  return (
    <div ref={partsRef} className="min-h-[40vh]">
      {partsVisible && (
        <PartsView
          selectedBrand={selectedBrand}
          selectedModel={selectedModel}
          products={products}
          categories={categories}
          productsByCategory={productsByCategory}
          loading={loading}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
        />
      )}
    </div>
  );
});

const LazyProductDetailsView = React.memo(({ product, loading, onAddToCart, onOpenCart, onBack }) => {
  const [productRef, productVisible] = useLazyLoad({ threshold: 0.01, rootMargin: '100px' });

  return (
    <div ref={productRef} className="min-h-[50vh]">
      {productVisible && (
        <ProductDetailsView 
          product={product}
          loading={loading}
          onAddToCart={onAddToCart}
          onOpenCart={onOpenCart}
          onBack={onBack}
        />
      )}
    </div>
  );
});

const LazyAboutSection = React.memo(({ aboutRef }) => {
  const [aboutLazyRef, aboutVisible] = useLazyLoad({ threshold: 0.01, rootMargin: '200px' });

  return (
    <div ref={aboutLazyRef} className="min-h-[30vh]">
      {aboutVisible && (
        <AboutSection aboutRef={aboutRef} />
      )}
    </div>
  );
});

const LazyContactSection = React.memo(({ contactRef }) => {
  const [contactLazyRef, contactVisible] = useLazyLoad({ threshold: 0.01, rootMargin: '200px' });

  return (
    <div ref={contactLazyRef} className="min-h-[30vh]">
      {contactVisible && (
        <ContactSection contactRef={contactRef} />
      )}
    </div>
  );
});

const MainApp = () => {
  const { brandId, modelId, productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const currentView = useMemo(() => 
    productId ? 'productDetails' 
    : brandId && modelId ? 'parts' 
    : brandId ? 'models' 
    : 'home'
  , [productId, brandId, modelId]);
    
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const brandsRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const navigationTimeoutRef = useRef(null);
  
  const { fetchData } = useApi();
  const cart = useCart();

  // Enhanced cached fetch
  const fetchWithCache = useCallback(async (url, cacheKey, ttl = 600000) => {
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    
    try {
      const data = await fetchData(url);
      if (data) cache.set(cacheKey, data, ttl);
      return data;
    } catch (error) {
      console.error(`Error fetching ${cacheKey}:`, error);
      return null;
    }
  }, [fetchData]);

  // Fetch functions
  const fetchBrands = useCallback(async () => {
    try {
      const data = await fetchWithCache('/brands', 'brands', 1800000);
      if (data) setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  }, [fetchWithCache]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await fetchWithCache('/categories', 'categories', 1800000);
      if (data) setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [fetchWithCache]);

  const fetchModelsForBrand = useCallback(async (brandId) => {
    setLoading(true);
    try {
      const data = await fetchWithCache(`/brands/${brandId}/models`, `models_${brandId}`, 900000);
      setModels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching models:', error);
      setModels([]);
    } finally {
      setLoading(false);
    }
  }, [fetchWithCache]);

  const fetchProducts = useCallback(async () => {
    if (!selectedBrand) return;
    
    setLoading(true);
    try {
      let url = '/products';
      const params = [];
      
      if (selectedBrand) params.push(`brand_id=${selectedBrand.id}`);
      if (selectedModel && selectedModel.id !== 'all') params.push(`model_id=${selectedModel.id}`);
      
      if (params.length > 0) url += `?${params.join('&')}`;
      
      const cacheKey = `products_${params.join('_') || 'all'}`;
      const data = await fetchWithCache(url, cacheKey, 300000);
      if (data) setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedBrand, selectedModel, fetchWithCache]);

  const fetchProductDetails = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await fetchWithCache(`/products/${id}`, `product_${id}`, 600000);
      if (data) setSelectedProduct(data);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchWithCache]);

  // Initial data fetch
  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, [fetchBrands, fetchCategories]);

  useEffect(() => {
    if (selectedBrand) {
      fetchProducts();
    }
  }, [selectedBrand, selectedModel, fetchProducts]);

  // URL params sync
  useEffect(() => {
    if (brandId && brands.length > 0) {
      const brand = brands.find(b => b.id === parseInt(brandId));
      if (brand && (!selectedBrand || selectedBrand.id !== brand.id)) {
        setSelectedBrand(brand);
        fetchModelsForBrand(brandId);
      }
    } else if (!brandId && selectedBrand) {
      setSelectedBrand(null);
      setSelectedModel(null);
    }
  }, [brandId, brands, selectedBrand, fetchModelsForBrand]);
  
  useEffect(() => {
    if (modelId && models.length > 0) {
      const model = models.find(m => m.id === parseInt(modelId));
      if (model && (!selectedModel || selectedModel.id !== model.id)) {
        setSelectedModel(model);
      }
    } else if (!modelId && selectedModel) {
      setSelectedModel(null);
    }
  }, [modelId, models, selectedModel]);

  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId);
    }
  }, [productId, fetchProductDetails]);

  // Search handler
  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchWithCache(
          `/products?search=${encodeURIComponent(query)}`, 
          `search_${query.toLowerCase()}`, 
          180000
        );
        if (data) setSearchResults(data);
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [fetchWithCache]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  // Navigation handlers - محسّنة للموبايل
  const smoothNavigate = useCallback((path, callback) => {
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    
    // instant navigation على الموبايل
    if (callback) callback();
    navigate(path);
    
    // Smooth scroll بعد render
    navigationTimeoutRef.current = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: isMobile ? 'auto' : 'smooth' });
    }, 50);
  }, [navigate]);

  const handleBrandClick = useCallback((brand) => {
    setSelectedBrand(brand);
    setSelectedModel(null);
    
    // Prefetch models
    fetchModelsForBrand(brand.id);
    
    smoothNavigate(`/brand/${brand.id}`);
  }, [smoothNavigate, fetchModelsForBrand]);

  const handleModelClick = useCallback((model) => {
    setSelectedModel(model);
    smoothNavigate(`/brand/${selectedBrand.id}/model/${model.id}`);
  }, [smoothNavigate, selectedBrand]);

  const handleBackToHome = useCallback(() => {
    setSelectedBrand(null);
    setSelectedModel(null);
    smoothNavigate('/');
  }, [smoothNavigate]);

  const handleBackToModels = useCallback(() => {
    setSelectedModel(null);
    smoothNavigate(`/brand/${selectedBrand.id}`);
  }, [smoothNavigate, selectedBrand]);

  const handleViewDetails = useCallback((product) => {
    if (product.brand_id && product.model_id) {
      smoothNavigate(`/brand/${product.brand_id}/model/${product.model_id}/product/${product.id}`);
    } else if (product.brand_id) {
      smoothNavigate(`/brand/${product.brand_id}/product/${product.id}`);
    } else {
      smoothNavigate(`/product/${product.id}`);
    }
  }, [smoothNavigate]);

  const handleProductClick = useCallback((product) => {
    if (product.brand_id && product.model_id) {
      const brand = brands.find(b => b.id === product.brand_id);
      if (brand) {
        setSelectedBrand(brand);
        fetchModelsForBrand(product.brand_id);
        
        setTimeout(() => {
          setSelectedModel({ id: product.model_id, name: product.model_name });
          smoothNavigate(`/brand/${product.brand_id}/model/${product.model_id}`);
        }, 100);
      }
    } else if (product.brand_id) {
      const brand = brands.find(b => b.id === product.brand_id);
      if (brand) {
        setSelectedBrand(brand);
        smoothNavigate(`/brand/${product.brand_id}`);
      }
    }
  }, [brands, smoothNavigate, fetchModelsForBrand]);

  // Scroll handlers
  const scrollToAbout = useCallback(() => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const scrollToContact = useCallback(() => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const scrollToBrands = useCallback(() => {
    if (currentView !== 'home') {
      handleBackToHome();
      setTimeout(() => {
        brandsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } else {
      brandsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentView, handleBackToHome]);

  // Checkout handlers
  const handleProceedToCheckout = useCallback(() => {
    setShowCart(false);
    setShowCheckout(true);
  }, []);

  const handleCheckoutComplete = useCallback(async () => {
    try {
      const orderData = {
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        items: cart.cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: cart.getTotalPrice()
      };

      const result = await fetchData('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      setShowCheckout(false);
      setOrderSuccess(true);
      cart.setCart([]);
      setCustomerInfo({ name: '', email: '', phone: '', address: '' });
      
      setTimeout(() => setOrderSuccess(false), 5000);
      
      return result;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }, [customerInfo, cart, fetchData]);

  const handleWhatsAppClick = useCallback(() => {
    const phoneNumber = '201119890713';
    const message = 'مرحباً، أريد الاستفسار عن المنتجات';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }, []);

  // Memoize products by category
  const productsByCategory = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.name] = products.filter(p => p.category_id === category.id);
      return acc;
    }, {});
  }, [categories, products]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50" />
      
      <div className="min-h-screen relative">
        {orderSuccess && <SuccessNotification onClose={() => setOrderSuccess(false)} />}
        
        <Header
          cartCount={cart.cartCount}
          toggleCart={() => setShowCart(true)}
          scrollToProducts={scrollToBrands}
          scrollToAbout={scrollToAbout}
          scrollToContact={scrollToContact}
          onScrollToHome={handleBackToHome}
          onSearch={handleSearch}
          searchResults={searchResults}
          loading={loading}
          onAddToCart={cart.addToCart}
          onProductClick={handleProductClick}
          onCloseSearch={clearSearch}
          onViewDetails={handleViewDetails}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="min-h-screen"
          >
            {currentView !== 'home' && (
              <BackButton 
                onClick={currentView === 'productDetails' ? () => navigate(-1) : 
                         currentView === 'parts' ? handleBackToModels : 
                         handleBackToHome} 
                currentView={currentView}
                selectedBrand={selectedBrand}
                selectedModel={selectedModel}
              />
            )}

            {currentView === 'home' && (
              <LazyHomeView 
                brands={brands}
                products={products}
                brandsRef={brandsRef}
                onBrandClick={handleBrandClick}
                onScrollToBrands={scrollToBrands}
              />
            )}

            {currentView === 'models' && selectedBrand && (
              <LazyModelsView
                selectedBrand={selectedBrand}
                models={models}
                loading={loading}
                onModelClick={handleModelClick}
              />
            )}

            {currentView === 'productDetails' && selectedProduct && (
              <LazyProductDetailsView 
                product={selectedProduct}
                loading={loading}
                onAddToCart={cart.addToCart}
                onOpenCart={() => setShowCart(true)}
                onBack={() => navigate(-1)}
              />
            )}

            {currentView === 'parts' && selectedBrand && selectedModel && (
              <LazyPartsView
                selectedBrand={selectedBrand}
                selectedModel={selectedModel}
                products={products}
                categories={categories}
                productsByCategory={productsByCategory}
                loading={loading}
                onAddToCart={cart.addToCart}
                onViewDetails={handleViewDetails}
              />
            )}

            {currentView === 'home' && (
              <>
                <LazyAboutSection aboutRef={aboutRef} />
                <LazyContactSection contactRef={contactRef} />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <Footer />

        <motion.button
          onClick={handleWhatsAppClick}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 left-6 z-50 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full p-4 shadow-2xl shadow-green-500/50 hover:shadow-green-600/60 transition-all duration-300 group"
          aria-label="Contact us on WhatsApp"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></span>
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            تواصل معنا
          </span>
        </motion.button>

        {showCart && (
          <CartModal
            cart={cart.cart}
            updateQuantity={cart.updateQuantity}
            removeFromCart={cart.removeFromCart}
            getTotalPrice={cart.getTotalPrice}
            onClose={() => setShowCart(false)}
            onCheckout={handleProceedToCheckout}
          />
        )}

        {showCheckout && (
          <CheckoutModal
            customerInfo={customerInfo}
            setCustomerInfo={setCustomerInfo}
            cart={cart.cart}
            getTotalPrice={cart.getTotalPrice}
            onClose={() => setShowCheckout(false)}
            onSubmit={handleCheckoutComplete}
          />
        )}
      </div>
    </>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="/brand/:brandId" element={<MainApp />} />
      <Route path="/brand/:brandId/model/:modelId" element={<MainApp />} />
      <Route path="/brand/:brandId/model/:modelId/product/:productId" element={<MainApp />} />
      <Route path="/brand/:brandId/product/:productId" element={<MainApp />} />
      <Route path="/product/:productId" element={<MainApp />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
};

export default App;
