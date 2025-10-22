import React from 'react';

const LoadingState = ({ message = "Loading..." }) => (
  <div className="text-center py-16">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
    <p className="mt-4 text-gray-600">{message}</p>
  </div>
);

export default LoadingState;