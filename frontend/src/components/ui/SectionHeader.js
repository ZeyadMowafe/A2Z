import React from 'react';

const SectionHeader = ({ icon: Icon, title, subtitle, description }) => (
  <div className="text-center mb-16">
    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-6 py-2 rounded-full mb-6">
      <Icon className="w-5 h-5 text-blue-600" />
      <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">{title}</span>
    </div>
    <h2 className="text-4xl md:text-6xl font-black mb-6 text-gray-900">
      {subtitle}
    </h2>
    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
      {description}
    </p>
  </div>
);

export default SectionHeader;