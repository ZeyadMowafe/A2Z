import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react'; // استيراد أيقونة الواتساب
import { pageVariants, pageTransition } from './constants/animations';
import useApi from './hooks/useApi';
import useCart from './hooks/useCart';
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


const HomeView = ({ brands, products, brandsRef, onBrandClick, onScrollToBrands }) => (
  <>
    <HeroSection onScrollToBrands={onScrollToBrands} brandsCount={brands.length} />
    <BrandsSection 
      brands={brands} 
      brandsRef={brandsRef} 
      onBrandClick={onBrandClick} 
      productsCount={products.length} 
      
      
    />
  </>
);

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
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const brandsRef = useRef(null);
  const { fetchData } = useApi();
  const cart = useCart();

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      fetchProducts();
    }
  }, [selectedBrand, selectedModel]);

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
  }, [brandId, brands]);
  
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
  }, [selectedProduct, brands, models]);

  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId);
    }
  }, [productId]);

  const searchTimeoutRef = useRef(null);

  const handleSearch = async (query) => {
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
        const data = await fetchData(`/products?search=${encodeURIComponent(query)}`);
        setSearchResults(data);
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleProductClick = (product) => {
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
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleViewDetails = (product) => {
    if (product.brand_id && product.model_id) {
      navigate(`/brand/${product.brand_id}/model/${product.model_id}/product/${product.id}`);
    } else if (product.brand_id) {
      navigate(`/brand/${product.brand_id}/product/${product.id}`);
    } else {
      navigate(`/product/${product.id}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchBrands = async () => {
    try {
      const data = await fetchData('/brands');
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchCategories = async () => {
    try {
      const data = await fetchData('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchModelsForBrand = async (brandId) => {
    setLoading(true);
    try {
      const data = await fetchData(`/brands/${brandId}/models`);
      setModels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching models:', error);
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
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
      
      const data = await fetchData(url);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async (id) => {
    setLoading(true);
    try {
      const data = await fetchData(`/products/${id}`);
      setSelectedProduct(data);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBrands = () => {
    if (currentView !== 'home') {
      navigate('/');
      setSelectedBrand(null);
      setSelectedModel(null);
      
      setTimeout(() => {
        brandsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      brandsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    setSelectedModel(null);
    navigate(`/brand/${brand.id}`);
    fetchModelsForBrand(brand.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModelClick = (model) => {
    setSelectedModel(model);
    navigate(`/brand/${selectedBrand.id}/model/${model.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    navigate('/');
    setSelectedBrand(null);
    setSelectedModel(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToModels = () => {
    navigate(`/brand/${selectedBrand.id}`);
    setSelectedModel(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  const handleCheckoutComplete = async () => {
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
  };

  // فانكشن فتح الواتساب
  const handleWhatsAppClick = () => {
    // غير الرقم ده برقمك (بدون علامة + أو 00)
    const phoneNumber = '201119890713'; // مثال: 201234567890
    const message = 'مرحباً، أريد الاستفسار عن المنتجات'; // الرسالة الافتراضية
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const productsByCategory = categories.reduce((acc, category) => {
    acc[category.name] = products.filter(p => p.category_id === category.id);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
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
            <HomeView 
              brands={brands}
              products={products}
              brandsRef={brandsRef}
              onBrandClick={handleBrandClick}
              onScrollToBrands={scrollToBrands}
            />
          )}

          {currentView === 'models' && selectedBrand && (
            <ModelsView
              selectedBrand={selectedBrand}
              models={models}
              loading={loading}
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

          {currentView === 'home' && (
            <>
              <AboutSection aboutRef={aboutRef} />
              <ContactSection contactRef={contactRef} />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <Footer />

      {/* زر الواتساب الثابت */}
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
        
        {/* دائرة النبض */}
        <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></span>
        
        {/* تلميحة عند التمرير */}
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
  );
};

// App component that wraps everything with Router
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