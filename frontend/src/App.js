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

// Enhanced Cache utility محسّن للموبايل
const cache = {
  data: {},
  timestamps: {},
  maxSize: isMobile ? 30 : 50, // حد أقل للموبايل
  
  set(key, value, ttl = 600000) {
    // لو الكاش ممتلئ، نحذف أقدم عنصر
    if (Object.keys(this.data).length >= this.maxSize) {
      const oldestKey = Object.keys(this.timestamps).reduce((a, b) => 
        this.timestamps[a] < this.timestamps[b] ? a : b
      );
      this.delete(oldestKey);
    }
    
    this.data[key] = value;
    this.timestamps[key] = Date.now() + ttl;
  },
  
  get(key) {
    if (this.timestamps[key] && Date.now() < this.timestamps[key]) {
      return this.data[key];
    }
    this.delete(key);
    return null;
  },
  
  delete(key) {
    delete this.data[key];
    delete this.timestamps[key];
  },
  
  clear() {
    this.data = {};
    this.timestamps = {};
  },
  
  cleanup() {
    const now = Date.now();
    Object.keys(this.timestamps).forEach(key => {
      if (now >= this.timestamps[key]) {
        this.delete(key);
      }
    });
  }
};

// تنظيف أقل على الموبايل
if (!isMobile) {
  setInterval(() => cache.cleanup(), 300000);
}

// Lazy Loaded HomeView component
const LazyHomeView = ({ brands, products, brandsRef, onBrandClick, onScrollToBrands }) => {
  const [heroRef, heroVisible] = useLazyLoad({ threshold: 0.1 });
  const [brandsRefLazy, brandsVisible] = useLazyLoad({ threshold: 0.1 });

  return (
    <>
      <div ref={heroRef}>
        {heroVisible && (
          <HeroSection onScrollToBrands={onScrollToBrands} brandsCount={brands.length} />
        )}
      </div>
      
      <div ref={brandsRefLazy}>
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
};

// Lazy Loaded ModelsView component
const LazyModelsView = ({ selectedBrand, models, loading, onModelClick }) => {
  const [modelsRef, modelsVisible] = useLazyLoad({ threshold: 0.1 });

  return (
    <div ref={modelsRef}>
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
};

// Lazy Loaded PartsView component
const LazyPartsView = ({ 
  selectedBrand, 
  selectedModel, 
  products, 
  categories, 
  productsByCategory, 
  loading, 
  onAddToCart, 
  onViewDetails 
}) => {
  const [partsRef, partsVisible] = useLazyLoad({ threshold: 0.05 });

  return (
    <div ref={partsRef}>
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
};

// Lazy Loaded ProductDetailsView component
const LazyProductDetailsView = ({ product, loading, onAddToCart, onOpenCart, onBack }) => {
  const [productRef, productVisible] = useLazyLoad({ threshold: 0.1 });

  return (
    <div ref={productRef}>
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
};

// Lazy Loaded AboutSection component
const LazyAboutSection = ({ aboutRef }) => {
  const [aboutLazyRef, aboutVisible] = useLazyLoad({ threshold: 0.1 });

  return (
    <div ref={aboutLazyRef}>
      {aboutVisible && (
        <AboutSection aboutRef={aboutRef} />
      )}
    </div>
  );
};

// Lazy Loaded ContactSection component
const LazyContactSection = ({ contactRef }) => {
  const [contactLazyRef, contactVisible] = useLazyLoad({ threshold: 0.1 });

  return (
    <div ref={contactLazyRef}>
      {contactVisible && (
        <ContactSection contactRef={contactRef} />
      )}
    </div>
  );
};

const MainApp = () => {
  const { brandId, modelId, productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const currentView = productId ? 'productDetails' 
    : brandId && modelId ? 'parts' 
    : brandId ? 'models' 
    : 'home';
    
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
  const [isNavigating, setIsNavigating] = useState(false);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const brandsRef = useRef(null);
  const { fetchData } = useApi();
  const cart = useCart();

  // Enhanced cached fetch مع error handling أفضل
  const fetchWithCache = useCallback(async (url, cacheKey, ttl = 600000) => {
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log(`✅ [CACHE HIT] ${cacheKey}`);
      return cached;
    }
    
    console.log(`⬇️ [FETCHING] ${cacheKey}`);
    try {
      const data = await fetchData(url);
      if (data) {
        cache.set(cacheKey, data, ttl);
        console.log(`💾 [CACHED] ${cacheKey}`);
      }
      return data;
    } catch (error) {
      console.error(`❌ [ERROR] ${cacheKey}:`, error);
      throw error;
    }
  }, [fetchData]);

  // Fetch brands with longer cache
  const fetchBrands = useCallback(async () => {
    try {
      const data = await fetchWithCache('/brands', 'brands', 1800000); // 30 دقيقة
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  }, [fetchWithCache]);

  // Fetch categories with longer cache
  const fetchCategories = useCallback(async () => {
    try {
      const data = await fetchWithCache('/categories', 'categories', 1800000); // 30 دقيقة
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [fetchWithCache]);

  // Fetch models with cache
  const fetchModelsForBrand = useCallback(async (brandId) => {
    setLoading(true);
    try {
      const cacheKey = `models_${brandId}`;
      const data = await fetchWithCache(`/brands/${brandId}/models`, cacheKey, 900000); // 15 دقيقة
      setModels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching models:', error);
      setModels([]);
    } finally {
      setLoading(false);
    }
  }, [fetchWithCache]);

  // Fetch products with cache
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/products';
      const params = [];
      
      if (selectedBrand) {
        params.push(`brand_id=${selectedBrand.id}`);
      }
      
      if (selectedModel && selectedModel.id !== 'all') {
        params.push(`model_id=${selectedModel.id}`);
      }
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      
      const cacheKey = `products_${params.join('_') || 'all'}`;
      const data = await fetchWithCache(url, cacheKey, 300000); // 5 دقايق
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedBrand, selectedModel, fetchWithCache]);

  // Fetch product details with cache
  const fetchProductDetails = useCallback(async (id) => {
    setLoading(true);
    try {
      const cacheKey = `product_${id}`;
      const data = await fetchWithCache(`/products/${id}`, cacheKey, 600000); // 10 دقايق
      setSelectedProduct(data);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchWithCache]);

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, [fetchBrands, fetchCategories]);

  useEffect(() => {
    if (selectedBrand) {
      fetchProducts();
    }
  }, [selectedBrand, selectedModel, fetchProducts]);

  useEffect(() => {
    if (brandId && brands.length > 0) {
      const brand = brands.find(b => b.id === parseInt(brandId));
      if (brand) {
        setSelectedBrand(brand);
        fetchModelsForBrand(brandId);
      }
    } else if (!brandId) {
      setSelectedBrand(null);
      setSelectedModel(null);
    }
  }, [brandId, brands, fetchModelsForBrand]);
  
  useEffect(() => {
    if (modelId && models.length > 0 && selectedBrand) {
      const model = models.find(m => m.id === parseInt(modelId));
      if (model) {
        setSelectedModel(model);
      }
    } else if (!modelId) {
      setSelectedModel(null);
    }
  }, [modelId, models, selectedBrand]);

  useEffect(() => {
    if (productId && selectedProduct) {
      if (selectedProduct.brand_id && brands.length > 0) {
        const brand = brands.find(b => b.id === selectedProduct.brand_id);
        if (brand && (!selectedBrand || selectedBrand.id !== brand.id)) {
          setSelectedBrand(brand);
          fetchModelsForBrand(selectedProduct.brand_id);
        }
      }
      
      if (selectedProduct.model_id && models.length > 0) {
        const model = models.find(m => m.id === selectedProduct.model_id);
        if (model && (!selectedModel || selectedModel.id !== model.id)) {
          setSelectedModel(model);
        }
      }
    }
  }, [selectedProduct, brands, models, selectedBrand, selectedModel, fetchModelsForBrand]);

  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId);
    }
  }, [productId, fetchProductDetails]);

  const searchTimeoutRef = useRef(null);

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
        const cacheKey = `search_${query.toLowerCase()}`;
        const data = await fetchWithCache(`/products?search=${encodeURIComponent(query)}`, cacheKey, 180000); // 3 دقايق
        setSearchResults(data);
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [fetchWithCache]);

  const handleProductClick = useCallback((product) => {
    if (product.brand_id && product.model_id) {
      const brand = brands.find(b => b.id === product.brand_id);
      if (brand) {
        setSelectedBrand(brand);
        fetchModelsForBrand(product.brand_id);
        
        setTimeout(() => {
          setSelectedModel({ id: product.model_id, name: product.model_name });
          navigate(`/brand/${product.brand_id}/model/${product.model_id}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
    } else if (product.brand_id) {
      const brand = brands.find(b => b.id === product.brand_id);
      if (brand) {
        setSelectedBrand(brand);
        navigate(`/brand/${product.brand_id}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [brands, navigate, fetchModelsForBrand]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  const handleViewDetails = useCallback((product) => {
    setIsNavigating(true);
    
    const delay = isMobile ? 100 : 150;
    setTimeout(() => {
      if (product.brand_id && product.model_id) {
        navigate(`/brand/${product.brand_id}/model/${product.model_id}/product/${product.id}`);
      } else if (product.brand_id) {
        navigate(`/brand/${product.brand_id}/product/${product.id}`);
      } else {
        navigate(`/product/${product.id}`);
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
      setIsNavigating(false);
    }, delay);
  }, [navigate]);

  const scrollToAbout = useCallback(() => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToContact = useCallback(() => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToBrands = useCallback(() => {
    if (currentView !== 'home') {
      setIsNavigating(true);
      
      const delay = isMobile ? 100 : 150;
      setTimeout(() => {
        navigate('/');
        setSelectedBrand(null);
        setSelectedModel(null);
        
        setTimeout(() => {
          brandsRef.current?.scrollIntoView({ behavior: 'smooth' });
          setIsNavigating(false);
        }, 200);
      }, delay);
    } else {
      brandsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentView, navigate]);

  const handleBrandClick = useCallback((brand) => {
    setIsNavigating(true);
    setSelectedBrand(brand);
    setSelectedModel(null);
    fetchModelsForBrand(brand.id);
    
    const delay = isMobile ? 100 : 150; // أسرع على الموبايل
    setTimeout(() => {
      navigate(`/brand/${brand.id}`);
      window.scrollTo({ top: 0, behavior: 'auto' });
      setIsNavigating(false);
    }, delay);
  }, [navigate, fetchModelsForBrand]);

  const handleModelClick = useCallback((model) => {
    setIsNavigating(true);
    setSelectedModel(model);
    
    const delay = isMobile ? 100 : 150;
    setTimeout(() => {
      navigate(`/brand/${selectedBrand.id}/model/${model.id}`);
      window.scrollTo({ top: 0, behavior: 'auto' });
      setIsNavigating(false);
    }, delay);
  }, [navigate, selectedBrand]);

  const handleBackToHome = useCallback(() => {
    setIsNavigating(true);
    setSelectedBrand(null);
    setSelectedModel(null);
    
    const delay = isMobile ? 100 : 150;
    setTimeout(() => {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'auto' });
      setIsNavigating(false);
    }, delay);
  }, [navigate]);

  const handleBackToModels = useCallback(() => {
    setIsNavigating(true);
    setSelectedModel(null);
    
    const delay = isMobile ? 100 : 150;
    setTimeout(() => {
      navigate(`/brand/${selectedBrand.id}`);
      window.scrollTo({ top: 0, behavior: 'auto' });
      setIsNavigating(false);
    }, delay);
  }, [navigate, selectedBrand]);

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

      console.log('[DEBUG] Sending order data:', orderData);

      const result = await fetchData('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      setShowCheckout(false);
      setOrderSuccess(true);
      cart.setCart([]);
      setCustomerInfo({ name: '', email: '', phone: '', address: '' });
      
      setTimeout(() => {
        setOrderSuccess(false);
      }, 5000);
      
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

  return (
    <>
      {/* Fixed Background - مش هتتعمل re-render تاني */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50" />
      
      {/* Navigation Overlay - أخف على الموبايل */}
      {isNavigating && (
        <div className={`fixed inset-0 z-[9999] pointer-events-none transition-opacity duration-150 ${
          isMobile ? 'bg-black/5 backdrop-blur-[1px]' : 'bg-black/10 backdrop-blur-[2px]'
        }`} />
      )}
      
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
            key={location.pathname + currentView}
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
