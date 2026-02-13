import React from 'react';

export default function PrivacyBanner() {
  return (
    <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-b border-indigo-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
              Privacy-First Design
            </h3>
            <p className="text-xs text-gray-600">
              Production uses 100% local deployment • No cloud storage • PDPA compliant architecture
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-medium text-indigo-700 border border-indigo-200">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              POC Mode
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
