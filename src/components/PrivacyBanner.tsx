import React from 'react';

export default function PrivacyBanner() {
  return (
    <div className="bg-purple-50 border-b border-purple-200 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-start gap-3">
        <div className="text-purple-600 text-xl mt-0.5">🔒</div>
        <div className="flex-1">
          <h3 className="text-purple-900 font-semibold text-sm mb-1">
            Privacy-First Design
          </h3>
          <ul className="text-purple-700 text-xs space-y-0.5">
            <li>• All processing on secure server (POC architecture)</li>
            <li>• Production: 100% local deployment with no cloud connectivity</li>
            <li>• No data stored after session ends</li>
            <li>• PDPA compliant architecture</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
