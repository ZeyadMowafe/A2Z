import React from 'react';

const NavButton = ({ onClick, children }) => (
  <button 
    onClick={onClick}
    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium tracking-wide uppercase text-sm relative group"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

export default NavButton;