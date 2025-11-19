import React, { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from 'react';
import { useParams, useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

// ✅ Eager imports للأساسيات فقط
import useApi from './hooks/useApi';
import useCart from './hooks/useCart';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import BackButton from './components/common/BackButton';

// ✅ Lazy load باقي المكونات
const HeroSection = lazy(() => import('./components/sections/HeroSection'));
const BrandsSection = lazy(() => import('./components/sections/BrandsSection'));
const ModelsView = lazy(() => import('./components/sections/ModelsView'));
const PartsView = lazy(() => import('./components/sections/PartsView'));
const ProductDetailsView = lazy(() => import('./components/sections/ProductDetailsView'));
const AboutSection = lazy(() => import('./components/sections/AboutSection'));
const ContactSection = lazy(() => import('./components/sections/ContactSection'));
const CartModal = lazy(() => import('./components/common/CartModal'));
const CheckoutModal = lazy(() => import('./components/CheckoutModal'));
const SuccessNotification = lazy(() => import('./components/common/SuccessNotification'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));

// ✅ Loading Component محسّن
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-400 text-sm">Loading...</p>
    </div>
  </div>
);

// Detect mobile device
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Enhanced Cache utility
const cache = {
  data: new Map(),
  timestamps: new Map(),
  maxSize: isMobile ? 20 : 40,
  
  set(key, value, ttl = 600000) {
    if (this.data.size >= this.maxSize) {
      const first = this.timestamps.keys().next().value;
      this.delete(first);
    }
    this.data.set(key, value);
    this.timestamps.set(key, Date.now() + ttl);
  },
  
  get(key) {
    const exp = this.timestamps.get(key);
    if (exp && Date.now() < exp) return this.data.get(key);
    this.delete(key);
    return null;
  },
  
  delete(key) {
    this.data.delete(key);
    this.timestamps.delete(key);
  }
};

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
    name: '', email: '', phone: '', address: ''
  });
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const brandsRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const isFetchingRef = useRef(false);
  
  const { fetchData } = useApi();
  const cart = useCart();

  // ✅ Optimized fetch with better caching
  const fetchWithCache = useCallback(async (url, cacheKey, ttl = 600000) => {
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    
    while (isFetchingRef.current) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    isFetchingRef.current = true;
    try {
      const data = await fetchData(url);
      if (data) cache.set(cacheKey, data, ttl);
      return data;
    } catch (error) {
      console.error(`Fetch error ${cacheKey}:`, error);
      return null;
    } finally {
      isFetchingRef.current = false;
    }
  }, [fetchData]);

  // Fetch functions
  const fetchBrands = useCallback(async () => {
    const data = await fetchWithCache('/brands', 'brands', 3600000);
    if (data) setBrands(data);
  }, [fetchWithCache]);

  const fetchCategories = useCallback(async () => {
    const data = await fetchWithCache('/categories', 'categories', 3600000);
    if (data) setCategories(data);
  }, [fetchWithCache]);

  const fetchModelsForBrand = useCallback(async (brandId) => {
    setModelsLoading(true);
    const data = await fetchWithCache(`/brands/${brandId}/models`, `models_${brandId}`, 1800000);
    setModels(Array.isArray(data) ? data : []);
    setModelsLoading(false);
  }, [fetchWithCache]);

  const fetchProducts = useCallback(async () => {
    if (!selectedBrand || !selectedModel) return;
    
    setLoading(true);
    let url = '/products';
    const params = [];
    
    if (selectedBrand) params.push(`brand_id=${selectedBrand.id}`);
    if (selectedModel?.id !== 'all') params.push(`model_id=${selectedModel.id}`);
    
    if (params.length) url += `?${params.join('&')}`;
    
    const data = await fetchWithCache(url, `products_${params.join('_')}`, 300000);
    if (data) setProducts(data);
    setLoading(false);
  }, [selectedBrand, selectedModel, fetchWithCache]);

  const fetchProductDetails = useCallback(async (id) => {
    setLoading(true);
    const data = await fetchWithCache(`/products/${id}`, `product_${id}`, 900000);
    if (data) setSelectedProduct(data);
    setLoading(false);
  }, [fetchWithCache]);

  // Initial fetch
  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedBrand && selectedModel && currentView === 'parts') {
      fetchProducts();
    }
  }, [selectedBrand, selectedModel, currentView]);

  // URL sync
  useEffect(() => {
    if (brandId && brands.length) {
      const brand = brands.find(b => b.id === parseInt(brandId));
      if (brand && selectedBrand?.id !== brand.id) {
        setSelectedBrand(brand);
        fetchModelsForBrand(brandId);
      }
    } else if (!brandId && selectedBrand) {
      setSelectedBrand(null);
      setSelectedModel(null);
    }
  }, [brandId, brands]);
  
  useEffect(() => {
    if (modelId && models.length) {
      const model = models.find(m => m.id === parseInt(modelId));
      if (model && selectedModel?.id !== model.id) {
        setSelectedModel(model);
      }
    } else if (!modelId && selectedModel) {
      setSelectedModel(null);
    }
  }, [modelId, models]);

  useEffect(() => {
    if (productId) fetchProductDetails(productId);
  }, [productId]);

  // Search
  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    searchTimeoutRef.current = setTimeout(async () => {
      const data = await fetchWithCache(
        `/products?search=${encodeURIComponent(query)}`, 
        `search_${query.toLowerCase()}`, 
        300000
      );
      if (data) setSearchResults(data);
    }, 400);
  }, [fetchWithCache]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  // ✅ OPTIMIZED Navigation - Faster
  const smoothNavigate = useCallback((path, setup) => {
    if (setup) setup();
    setIsTransitioning(true);
    
    requestAnimationFrame(() => {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'instant' });
      
      setTimeout(() => setIsTransitioning(false), 150);
    });
  }, [navigate]);

  const handleBrandClick = useCallback((brand) => {
    smoothNavigate(`/brand/${brand.id}`, () => {
      setSelectedBrand(brand);
      setSelectedModel(null);
      fetchModelsForBrand(brand.id);
    });
  }, [smoothNavigate, fetchModelsForBrand]);

  const handleModelClick = useCallback((model) => {
    smoothNavigate(`/brand/${selectedBrand.id}/model/${model.id}`, () => {
      setSelectedModel(model);
    });
  }, [smoothNavigate, selectedBrand]);

  const handleBackToHome = useCallback(() => {
    smoothNavigate('/', () => {
      setSelectedBrand(null);
      setSelectedModel(null);
    });
  }, [smoothNavigate]);

  const handleBackToModels = useCallback(() => {
    smoothNavigate(`/brand/${selectedBrand.id}`, () => {
      setSelectedModel(null);
    });
  }, [smoothNavigate, selectedBrand]);

  const handleViewDetails = useCallback((product) => {
    const path = product.brand_id && product.model_id 
      ? `/brand/${product.brand_id}/model/${product.model_id}/product/${product.id}`
      : product.brand_id 
      ? `/brand/${product.brand_id}/product/${product.id}`
      : `/product/${product.id}`;
    smoothNavigate(path);
  }, [smoothNavigate]);

  const handleProductClick = useCallback((product) => {
    if (product.brand_id) {
      const brand = brands.find(b => b.id === product.brand_id);
      if (brand) {
        if (product.model_id) {
          setSelectedBrand(brand);
          fetchModelsForBrand(product.brand_id);
          setTimeout(() => {
            setSelectedModel({ id: product.model_id, name: product.model_name });
            smoothNavigate(`/brand/${product.brand_id}/model/${product.model_id}`);
          }, 100);
        } else {
          smoothNavigate(`/brand/${product.brand_id}`, () => {
            setSelectedBrand(brand);
          });
        }
      }
    }
  }, [brands, smoothNavigate, fetchModelsForBrand]);

  // Scroll handlers
  const smoothScroll = useCallback((ref) => {
    ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const scrollToAbout = useCallback(() => smoothScroll(aboutRef), []);
  const scrollToContact = useCallback(() => smoothScroll(contactRef), []);
  
  const scrollToBrands = useCallback(() => {
    if (currentView !== 'home') {
      handleBackToHome();
      setTimeout(() => smoothScroll(brandsRef), 300);
    } else {
      smoothScroll(brandsRef);
    }
  }, [currentView, handleBackToHome]);

  // Checkout
  const handleProceedToCheckout = useCallback(() => {
    setShowCart(false);
    setShowCheckout(true);
  }, []);

  const handleCheckoutComplete = useCallback(async () => {
    try {
      await fetchData('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        })
      });

      setShowCheckout(false);
      setOrderSuccess(true);
      cart.setCart([]);
      setCustomerInfo({ name: '', email: '', phone: '', address: '' });
      
      setTimeout(() => setOrderSuccess(false), 5000);
    } catch (error) {
      console.error('Order error:', error);
      throw error;
    }
  }, [customerInfo, cart, fetchData]);

  const handleWhatsAppClick = useCallback(() => {
    window.open(
      `https://wa.me/201119890713?text=${encodeURIComponent('مرحباً، أريد الاستفسار عن المنتجات')}`,
      '_blank'
    );
  }, []);

  const productsByCategory = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.name] = products.filter(p => p.category_id === cat.id);
      return acc;
    }, {});
  }, [categories, products]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      {isTransitioning && (
        <div className="fixed inset-0 bg-white/20 z-[60] pointer-events-none transition-opacity duration-150" />
      )}
      
      {orderSuccess && (
        <Suspense fallback={null}>
          <SuccessNotification onClose={() => setOrderSuccess(false)} />
        </Suspense>
      )}
      
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

      <Suspense fallback={<PageLoader />}>
        <div 
          key={location.pathname} 
          className="min-h-screen transition-opacity duration-200"
          style={{ opacity: isTransitioning ? 0.7 : 1 }}
        >
          {currentView !== 'home' && (
            <BackButton 
              onClick={
                currentView === 'productDetails' ? () => navigate(-1) : 
                currentView === 'parts' ? handleBackToModels : 
                handleBackToHome
              } 
              currentView={currentView}
              selectedBrand={selectedBrand}
              selectedModel={selectedModel}
            />
          )}

          {currentView === 'home' && (
            <>
              <HeroSection onScrollToBrands={scrollToBrands} brandsCount={brands.length} />
              <BrandsSection 
                brands={brands}
                brandsRef={brandsRef}
                onBrandClick={handleBrandClick}
                productsCount={products.length}
              />
              <AboutSection aboutRef={aboutRef} />
              <ContactSection contactRef={contactRef} />
            </>
          )}

          {currentView === 'models' && selectedBrand && (
            <ModelsView
              selectedBrand={selectedBrand}
              models={models}
              loading={modelsLoading}
              onModelClick={handleModelClick}
            />
          )}

          {currentView === 'productDetails' && selectedProduct && (
            <ProductDetailsView 
              product={selectedProduct}
              loading={loading}
              onAddToCart={cart.addToCart}
              onOpenCart={() => setShowCart(true)}
              onBack={() => navigate(-1)}
            />
          )}

          {currentView === 'parts' && selectedBrand && selectedModel && (
            <PartsView
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
        </div>
      </Suspense>

      <Footer />

      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 left-6 z-50 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full p-4 shadow-2xl transform hover:scale-110 active:scale-95 transition-transform duration-200"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {showCart && (
        <Suspense fallback={null}>
          <CartModal
            cart={cart.cart}
            updateQuantity={cart.updateQuantity}
            removeFromCart={cart.removeFromCart}
            getTotalPrice={cart.getTotalPrice}
            onClose={() => setShowCart(false)}
            onCheckout={handleProceedToCheckout}
          />
        </Suspense>
      )}

      {showCheckout && (
        <Suspense fallback={null}>
          <CheckoutModal
            customerInfo={customerInfo}
            setCustomerInfo={setCustomerInfo}
            cart={cart.cart}
            getTotalPrice={cart.getTotalPrice}
            onClose={() => setShowCheckout(false)}
            onSubmit={handleCheckoutComplete}
          />
        </Suspense>
      )}
    </div>
  );
};

const App = () => (
  <Routes>
    <Route path="/" element={<MainApp />} />
    <Route path="/brand/:brandId" element={<MainApp />} />
    <Route path="/brand/:brandId/model/:modelId" element={<MainApp />} />
    <Route path="/brand/:brandId/model/:modelId/product/:productId" element={<MainApp />} />
    <Route path="/brand/:brandId/product/:productId" element={<MainApp />} />
    <Route path="/product/:productId" element={<MainApp />} />
    <Route path="/admin" element={
      <Suspense fallback={<PageLoader />}>
        <AdminPanel />
      </Suspense>
    } />
  </Routes>
);

export default App;
