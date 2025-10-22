import React from 'react';
import { Search } from 'lucide-react';

const SearchButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="relative p-3 hover:bg-blue-50 rounded-full transition-all duration-300 group"
  >
    <Search className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
  </button>
);

export default SearchButton;