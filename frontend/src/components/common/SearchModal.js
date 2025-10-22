import React, { useState, useEffect } from 'react';
import { Search, X, ShoppingBag, TrendingUp } from 'lucide-react';

const SearchModal = ({ 
  isOpen, 
  onClose, 
  onAddToCart,
  onViewDetails
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  // Load popular searches عند فتح الـ modal
  useEffect(() => {
    if (isOpen) {
      loadPopularSearches();
    }
  }, [isOpen]);

  // Load popular searches from API
  const loadPopularSearches = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/search/popular');
      const data = await response.json();
      setPopularSearches(data);
    } catch (error) {
      console.error('Failed to load popular searches:', error);
      // Default popular searches لو فشل
      setPopularSearches(['BMW', 'Mercedes', 'Audi', 'Brake Pads', 'Engine Oil']);
    }
  };

  // Get suggestions while typing
  const getSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/search/suggestions?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      setSuggestions([]);
    }
  };

  // Search products
  const searchProducts = async (query, sort = sortBy) => {
    if (!query || query.trim() === '') {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const url = `http://localhost:8000/api/products?search=${encodeURIComponent(query)}&sort_by=${sort}`;
      const response = await fetch(url);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (value) => {
    setSearchQuery(value);
    getSuggestions(value);
    
    // Auto search after typing stops (debounce)
    const timeoutId = setTimeout(() => {
      if (value) {
        searchProducts(value);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  // Handle search submit
  const handleSearch = () => {
    if (searchQuery) {
      searchProducts(searchQuery);
      setSuggestions([]); // Hide suggestions
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (text) => {
    setSearchQuery(text);
    setSuggestions([]);
    searchProducts(text);
  };

  // Handle popular search click
  const handlePopularClick = (term) => {
    setSearchQuery(term);
    searchProducts(term);
  };

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    if (searchQuery) {
      searchProducts(searchQuery, newSort);
    }
  };

  // Handle view details
  const handleViewDetails = (product) => {
    onClose();
    onViewDetails(product);
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    onAddToCart(product);
    onClose();
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 transition-all duration-700">
      <div 
        className="absolute inset-0 bg-black/95"
        onClick={onClose}
      ></div>
      
      <div className="relative h-full flex items-start justify-center pt-12 sm:pt-20 overflow-y-auto">
        <div className="w-full max-w-7xl px-4 sm:px-6 pb-20">
          {/* Search Input */}
          <div className="relative bg-white shadow-[0_20px_80px_rgba(0,0,0,0.4)] p-1 sm:p-2 mb-4">
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search auto parts, brands, models..."
              className="w-full bg-transparent text-gray-900 text-xl sm:text-2xl md:text-3xl font-extralight px-4 sm:px-6 py-4 sm:py-6 pr-16 sm:pr-20 focus:outline-none placeholder-gray-400 tracking-wide"
              autoFocus
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-gray-900 hover:bg-black transition-all duration-500"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={1.5} />
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && searchQuery && (
            <div className="bg-white shadow-xl mb-4 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="w-full px-4 sm:px-6 py-3 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                    <span className="text-gray-900 font-light text-sm sm:text-base">{suggestion.text}</span>
                    <span className="ml-auto text-xs text-gray-400 uppercase tracking-wider">{suggestion.type}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Sort Options */}
          {searchResults.length > 0 && (
            <div className="flex items-center gap-2 sm:gap-3 mb-6 flex-wrap">
              <span className="text-white text-xs sm:text-sm font-light tracking-wide uppercase">Sort By:</span>
              {[
                { value: 'relevance', label: 'Relevance' },
                { value: 'price_asc', label: 'Price: Low to High' },
                { value: 'price_desc', label: 'Price: High to Low' },
                { value: 'name', label: 'Name' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-light tracking-wide transition-all duration-500 border ${
                    sortBy === option.value
                      ? 'bg-white text-gray-900 border-white'
                      : 'bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12 sm:py-16">
              <div className="inline-block animate-spin border-2 border-gray-300 border-t-gray-900 h-16 w-16 sm:h-20 sm:w-20 mb-6"></div>
              <p className="text-white text-lg sm:text-xl font-light tracking-[0.2em] uppercase">Searching</p>
            </div>
          )}

          {/* Search Results */}
          {!loading && searchQuery && searchResults.length > 0 ? (
            <div className="space-y-6 sm:space-y-8">
              <div className="text-white text-lg sm:text-xl font-extralight tracking-[0.15em] uppercase border-b border-white/20 pb-4">
                Found {searchResults.length} Results
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {searchResults.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border-l-4 border-gray-900"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-4 sm:p-5">
                      <h4 className="text-base sm:text-lg font-light mb-2 sm:mb-3 text-gray-900 tracking-wide truncate">{product.name}</h4>
                      
                      <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                        {product.brand_name && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 font-light tracking-wide border border-gray-200">
                            {product.brand_name}
                          </span>
                        )}
                        {product.model_name && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 font-light tracking-wide border border-gray-200">
                            {product.model_name}
                          </span>
                        )}
                        {product.category_name && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 font-light tracking-wide border border-gray-200">
                            {product.category_name}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xl sm:text-2xl font-light text-gray-900 mb-4 sm:mb-5">EGP {product.price}</p>
                      
                      <div className="flex gap-2 sm:gap-3">
                        <button
                          onClick={() => handleViewDetails(product)}
                          className="flex-1 bg-gray-900 text-white py-2.5 sm:py-3 font-light tracking-[0.15em] uppercase hover:bg-black transition-all duration-500 text-xs sm:text-sm"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="px-3 sm:px-4 bg-gray-900 hover:bg-black text-white transition-all duration-500"
                        >
                          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : !loading && searchQuery ? (
            <div className="text-center py-16 sm:py-24 text-white">
              <div className="bg-white/5 w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center mx-auto mb-6 sm:mb-8 border border-white/10">
                <Search className="w-12 h-12 sm:w-16 sm:h-16" strokeWidth={1} />
              </div>
              <p className="text-xl sm:text-2xl font-extralight mb-3 sm:mb-4 tracking-[0.2em] uppercase">No Products Found</p>
              <p className="text-gray-400 font-light tracking-wide text-sm sm:text-base">Try different keywords</p>
            </div>
          ) : !searchQuery ? (
            <div className="mt-8 sm:mt-16 text-white/90">
              <div className="flex items-center gap-2 mb-5 sm:mb-6">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" strokeWidth={1.5} />
                <p className="text-xs sm:text-sm uppercase tracking-[0.25em] font-light text-gray-400">Popular Searches</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handlePopularClick(term)}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white/5 hover:bg-white/10 text-sm font-light tracking-wide transition-all duration-500 border border-white/10 hover:border-white/20"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="fixed top-4 sm:top-6 right-4 sm:right-8 p-2 sm:p-3 text-white hover:bg-white/10 transition-all duration-500 border border-white/20 z-10"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;