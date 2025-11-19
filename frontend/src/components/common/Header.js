import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag } from 'lucide-react';
import useScrollEffect from '../../hooks/useScrollEffect';
import NavButton from '../ui/NavButton';
import SearchButton from '../ui/SearchButton';
import CartButton from '../ui/CartButton';
import SearchModal from './SearchModal';

const Header = ({ 
  cartCount, 
  toggleCart, 
  scrollToProducts, 
  scrollToAbout, 
  scrollToContact, 
  onScrollToHome, 
  onSearch,
  searchResults = [],
  loading = false,
  onAddToCart,   
  onProductClick,
  onCloseSearch,
  onViewDetails
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isScrolled = useScrollEffect();

  const scrollToHome = useCallback(() => {
    if (onScrollToHome) {
      onScrollToHome();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [onScrollToHome]);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
    }
  }, [searchQuery, onSearch]);

  const handleSearchKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const toggleSearch = useCallback(() => {
    if (searchOpen) {
      if (onCloseSearch) {
        onCloseSearch();
      }
    }
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => document.getElementById('search-input')?.focus(), 100);
    }
  }, [searchOpen, onCloseSearch]);

  const navItems = [
    { label: 'Home', action: scrollToHome },
    { label: 'Products', action: scrollToProducts },
    { label: 'About', action: scrollToAbout },
    { label: 'Contact', action: scrollToContact }
  ];

  const popularSearches = ['Brake Pads', 'Oil Filters', 'Spark Plugs', 'Air Filters', 'Batteries', 'Tires'];

  return (
    <>
      <header className={`fixed w-full z-50 transition-all duration-700 ${
        isScrolled 
          ? 'bg-zinc-900/98 backdrop-blur-xl border-b border-zinc-800 py-4' 
          : 'bg-black/80 backdrop-blur-sm border-b border-zinc-900/50 py-6'
      }`}>
        {/* Top Accent Line */}
        <div className={`absolute top-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent transition-opacity duration-700 ${
          isScrolled ? 'opacity-100 w-full' : 'opacity-0 w-0'
        }`}></div>

        <nav className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          {/* Logo */}
          <button 
            onClick={scrollToHome}
            className="relative group transition-all duration-500 hover:scale-105 cursor-pointer z-10"
          >
            <Link
              to="/"
              className="flex items-center"
            >
              {/* Logo Container with Border Effect */}
              <div className="relative">
                <div className="absolute inset-0 border border-zinc-800 group-hover:border-blue-500/50 transition-all duration-500 -m-2"></div>
                <div className="w-24 h-14 flex items-center justify-center overflow-hidden relative">
                  <img
                    src="/logo.png"
                    alt="AtoZ Logo"
                    className="h-20 w-auto transform scale-[1.7] transition-all duration-500 group-hover:scale-[1.8] brightness-0 invert group-hover:brightness-100 group-hover:invert-0"
                  />
                </div>
              </div>
            </Link>
          </button>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-12 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item, index) => (
              <button
                key={item.label}
                onClick={item.action}
                className="group relative text-zinc-400 hover:text-white font-light text-sm tracking-[0.2em] uppercase transition-all duration-500"
              >
                <span className="relative z-10">{item.label}</span>
                {/* Underline Effect */}
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-500"></div>
                {/* Side Dots */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {/* Search Button */}
            <button
              onClick={toggleSearch}
              className="group relative w-11 h-11 border border-zinc-800 hover:border-blue-500 flex items-center justify-center transition-all duration-500 hover:rotate-90"
            >
              <Search className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-all duration-500 group-hover:-rotate-90" />
              <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-all duration-500"></div>
            </button>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="group relative w-11 h-11 border border-zinc-800 hover:border-blue-500 flex items-center justify-center transition-all duration-500 hover:rotate-90"
            >
              <ShoppingBag className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-all duration-500 group-hover:-rotate-90" />
              
              {/* Cart Count Badge */}
              {cartCount > 0 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 border-2 border-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xs font-bold">{cartCount}</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-all duration-500"></div>
            </button>

            {/* Decorative Line */}
            <div className={`hidden lg:block w-[1px] h-8 bg-zinc-800 ml-2 transition-all duration-700 ${
              isScrolled ? 'opacity-100' : 'opacity-50'
            }`}></div>
          </div>
        </nav>

        {/* Bottom Decorative Line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent opacity-50"></div>
      </header>

      <SearchModal
        isOpen={searchOpen}
        searchQuery={searchQuery}
        onQueryChange={setSearchQuery}
        onSearch={handleSearch}
        onKeyPress={handleSearchKeyPress}
        onClose={toggleSearch}
        popularSearches={popularSearches}
        onSearchClick={onSearch}
        searchResults={searchResults}
        loading={loading}
        onAddToCart={onAddToCart}
        onProductClick={onProductClick}
        onCloseSearch={onCloseSearch}
        onViewDetails={onViewDetails}
      />
    </>
  );
};

export default Header;