import React, { useState } from 'react';
import type { DevelopmentalDomain, DomainObservations } from '@/types/assessment';
import { DOMAIN_INFO } from '@/types/assessment';

interface Step3Props {
  allObservations: Partial<DomainObservations>;
  onObservationsChange: (observations: Partial<DomainObservations>) => void;
  onNext: () => void;
  onBack: () => void;
}

const DOMAINS: DevelopmentalDomain[] = [
  'gross_motor',
  'fine_motor',
  'speech_language',
  'social_emotional',
  'cognitive',
];

export default function Step3_GuidedCompletion({
  allObservations,
  onObservationsChange,
  onNext,
  onBack,
}: Step3Props) {
  const [activeTab, setActiveTab] = useState<DevelopmentalDomain>('gross_motor');

  const handleObservationChange = (domain: DevelopmentalDomain, value: string) => {
    onObservationsChange({
      ...allObservations,
      [domain]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 3: Review & Complete Observations
        </h2>
        <p className="text-gray-600">
          Review and refine your observations for each developmental domain before generating the case note.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          {DOMAINS.map((domain) => {
            const hasContent = allObservations[domain] && allObservations[domain]!.trim().length > 0;
            return (
              <button
                key={domain}
                onClick={() => setActiveTab(domain)}
                className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                  activeTab === domain
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {DOMAIN_INFO[domain].name}
                {hasContent && <span className="ml-2">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {DOMAIN_INFO[activeTab].name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {DOMAIN_INFO[activeTab].description}
          </p>
        </div>

        <textarea
          value={allObservations[activeTab] || ''}
          onChange={(e) => handleObservationChange(activeTab, e.target.value)}
          placeholder={`Enter observations for ${DOMAIN_INFO[activeTab].name.toLowerCase()}...`}
          className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          style={{ resize: 'vertical' }}
        />

        <div className="mt-2 text-sm text-gray-500">
          {allObservations[activeTab]?.length || 0} characters
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Completeness Check:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {DOMAINS.map((domain) => {
            const hasContent = allObservations[domain] && allObservations[domain]!.trim().length > 0;
            return (
              <div key={domain} className="flex items-center gap-2">
                <span>{hasContent ? '✅' : '⚪'}</span>
                <span className={hasContent ? 'text-blue-900' : 'text-blue-700'}>
                  {DOMAIN_INFO[domain].name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Generate Case Note →
        </button>
      </div>
    </div>
  );
}
