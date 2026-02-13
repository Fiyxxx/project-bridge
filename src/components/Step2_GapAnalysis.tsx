import React from 'react';
import type { GapAnalysis, DevelopmentalDomain } from '@/types/assessment';
import { DOMAIN_INFO } from '@/types/assessment';

interface Step2Props {
  analysis: GapAnalysis | null;
  loading: boolean;
  error: string | null;
  additionalObservations: Record<DevelopmentalDomain, string>;
  onAdditionalObservationChange: (domain: DevelopmentalDomain, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2_GapAnalysis({
  analysis,
  loading,
  error,
  additionalObservations,
  onAdditionalObservationChange,
  onNext,
  onBack,
}: Step2Props) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Analyzing your observations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-900 font-semibold mb-2">Error</h3>
        <p className="text-red-700">{error}</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const hasAllDomains = analysis.missingDomains.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 2: Gap Analysis
        </h2>
        <p className="text-gray-600">
          We've analyzed your observations against the ECDA developmental domains.
        </p>
      </div>

      {/* Covered Domains */}
      {analysis.coveredDomains.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-green-900 font-semibold mb-3 flex items-center gap-2">
            <span className="text-xl">✅</span>
            Domains Covered
          </h3>
          <ul className="space-y-2">
            {analysis.coveredDomains.map((domain) => (
              <li key={domain} className="text-green-800">
                • {DOMAIN_INFO[domain].name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Missing Domains */}
      {analysis.missingDomains.length > 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="text-amber-900 font-semibold mb-3 flex items-center gap-2">
            <span className="text-xl">❓</span>
            Missing Domains
          </h3>
          <p className="text-amber-800 text-sm mb-4">
            The following domains weren't addressed in your initial observations. Consider adding observations if applicable.
          </p>

          <div className="space-y-4">
            {analysis.suggestedPrompts.map((prompt, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-amber-200">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-amber-600">⚠️</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-amber-900">
                      {DOMAIN_INFO[prompt.domain].name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {DOMAIN_INFO[prompt.domain].description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm text-blue-900 mb-2">
                    💡 <span className="font-medium">Suggested:</span> {prompt.prompt}
                  </p>
                </div>

                <textarea
                  value={additionalObservations[prompt.domain] || ''}
                  onChange={(e) => onAdditionalObservationChange(prompt.domain, e.target.value)}
                  placeholder="Add observations (or leave blank if not applicable)"
                  className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            ✅ Great! Your observations cover all five ECDA developmental domains.
          </p>
        </div>
      )}

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
          Continue to Review →
        </button>
      </div>
    </div>
  );
}
