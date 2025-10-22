import React from 'react';

const EmptyState = ({ message, submessage }) => (
  <div className="text-center py-16">
    <div className="text-gray-500 text-lg mb-2">{message}</div>
    {submessage && <p className="text-gray-400 text-sm">{submessage}</p>}
  </div>
);

export default EmptyState;