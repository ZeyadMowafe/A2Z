import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
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

// Detect mobile
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Super optimized cache
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

// Optimized lazy components - بدون wrapper divs زيادة
const LazyHomeView = React.memo(({ brands, products, brandsRef, onBrandClick, onScrollToBrands }) => {
  const [heroRef, heroVisible] = useLazyLoad({ threshold: 0, rootMargin: '100px' });
  const [brandsRefLazy, brandsVisible] = useLazyLoad({ threshold: 0, rootMargin: '150px' });

  return (
    <>
      <div ref={heroRef}>
        {heroVisible ? (
          <HeroSection onScrollToBrands={onScrollToBrands} brandsCount={brands.length} />
        ) : (
          <div className="h-[60vh]" />
        )}
      </div>
      
      <div ref={brandsRefLazy}>
        {brandsVisible ? (
          <BrandsSection 
            brands={brands} 
            brandsRef={brandsRef} 
            onBrandClick={onBrandClick} 
            productsCount={products.length} 
          />
        ) : (
          <div className="h-[40vh]" />
        )}
      </div>
    </>
  );
});

const LazyModelsView = React.memo(({ selectedBrand, models, loading, onModelClick }) => {
  const [ref, visible] = useLazyLoad({ threshold: 0, rootMargin: '100px' });

  if (!visible) return <div ref={ref} className="h-[50vh]" />;
  
  return (
    <div ref={ref}>
      <ModelsView
        selectedBrand={selectedBrand}
        models={models}
        loading={loading}
        onModelClick={onModelClick}
      />
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
  const [ref, visible] = useLazyLoad({ threshold: 0, rootMargin: '100px' });

  if (!visible) return <div ref={ref} className="h-[50vh]" />;

  return (
    <div ref={ref}>
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
    </div>
  );
});

const LazyProductDetailsView = React.memo(({ product, loading, onAddToCart, onOpenCart, onBack }) => {
  const [ref, visible] = useLazyLoad({ threshold: 0, rootMargin: '100px' });

  if (!visible) return <div ref={ref} className="h-[60vh]" />;

  return (
    <div ref={ref}>
      <ProductDetailsView 
        product={product}
        loading={loading}
        onAddToCart={onAddToCart}
        onOpenCart={onOpenCart}
        onBack={onBack}
      />
    </div>
  );
});

const LazyAboutSection = React.memo(({ aboutRef }) => {
  const [ref, visible] = useLazyLoad({ threshold: 0, rootMargin: '200px' });

  if (!visible) return <div ref={ref} className="h-[40vh]" />;

  return (
    <div ref={ref}>
      <AboutSection aboutRef={aboutRef} />
    </div>
  );
});

const LazyContactSection = React.memo(({ contactRef }) => {
  const [ref, visible] = useLazyLoad({ threshold: 0, rootMargin: '200px' });

  if (!visible) return <div ref={ref} className="h-[40vh]" />;

  return (
    <div ref={ref}>
      <ContactSection contactRef={contactRef} />
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
    name: '', email: '', phone: '', address: ''
  });
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const brandsRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const navTimeoutRef = useRef(null);
  const isFetchingRef = useRef(false);
  
  const { fetchData } = useApi();
  const cart = useCart();

  // Optimized fetch with queue
  const fetchWithCache = useCallback(async (url, cacheKey, ttl = 600000) => {
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    
    // Prevent duplicate requests
    if (isFetchingRef.current) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return cache.get(cacheKey) || null;
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
    setLoading(true);
    const data = await fetchWithCache(`/brands/${brandId}/models`, `models_${brandId}`, 1800000);
    setModels(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [fetchWithCache]);

  const fetchProducts = useCallback(async () => {
    if (!selectedBrand) return;
    
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
    if (selectedBrand) fetchProducts();
  }, [selectedBrand, selectedModel]);

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
    }, 500);
  }, [fetchWithCache]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  // Ultra fast navigation - بدون delays
  const fastNavigate = useCallback((path, setup) => {
    if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    if (setup) setup();
    navigate(path);
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [navigate]);

  const handleBrandClick = useCallback((brand) => {
    fastNavigate(`/brand/${brand.id}`, () => {
      setSelectedBrand(brand);
      setSelectedModel(null);
      fetchModelsForBrand(brand.id);
    });
  }, [fastNavigate, fetchModelsForBrand]);

  const handleModelClick = useCallback((model) => {
    fastNavigate(`/brand/${selectedBrand.id}/model/${model.id}`, () => {
      setSelectedModel(model);
    });
  }, [fastNavigate, selectedBrand]);

  const handleBackToHome = useCallback(() => {
    fastNavigate('/', () => {
      setSelectedBrand(null);
      setSelectedModel(null);
    });
  }, [fastNavigate]);

  const handleBackToModels = useCallback(() => {
    fastNavigate(`/brand/${selectedBrand.id}`, () => {
      setSelectedModel(null);
    });
  }, [fastNavigate, selectedBrand]);

  const handleViewDetails = useCallback((product) => {
    const path = product.brand_id && product.model_id 
      ? `/brand/${product.brand_id}/model/${product.model_id}/product/${product.id}`
      : product.brand_id 
      ? `/brand/${product.brand_id}/product/${product.id}`
      : `/product/${product.id}`;
    fastNavigate(path);
  }, [fastNavigate]);

  const handleProductClick = useCallback((product) => {
    if (product.brand_id) {
      const brand = brands.find(b => b.id === product.brand_id);
      if (brand) {
        setSelectedBrand(brand);
        if (product.model_id) {
          fetchModelsForBrand(product.brand_id);
          setTimeout(() => {
            setSelectedModel({ id: product.model_id, name: product.model_name });
            fastNavigate(`/brand/${product.brand_id}/model/${product.model_id}`);
          }, 100);
        } else {
          fastNavigate(`/brand/${product.brand_id}`);
        }
      }
    }
  }, [brands, fastNavigate, fetchModelsForBrand]);

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

  // Cleanup
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
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

      <div key={location.pathname} className="min-h-screen">
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
      </div>

      <Footer />

      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 left-6 z-50 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full p-4 shadow-2xl transform hover:scale-110 active:scale-95 transition-transform duration-200"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

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
    <Route path="/admin" element={<AdminPanel />} />
  </Routes>
);

export default App;
