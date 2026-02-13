import React from 'react';

interface Step4Props {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export default function Step4_NoteGeneration({ loading, error, onRetry }: Step4Props) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-900 font-semibold mb-2 text-center">
            Generation Failed
          </h3>
          <p className="text-red-700 text-center mb-4">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>

          <div className="space-y-2">
            <p className="text-gray-900 font-semibold text-lg">
              Generating Your Case Note
            </p>
            <p className="text-gray-600 text-sm">
              This may take 10-30 seconds...
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-center gap-2">
              <span>🤖</span>
              <span>Analyzing observations...</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✍️</span>
              <span>Drafting case note sections...</span>
            </li>
            <li className="flex items-center gap-2">
              <span>📋</span>
              <span>Formatting to ECDA standards...</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md text-center">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-green-900 font-semibold mb-2">
          Case Note Ready!
        </h3>
        <p className="text-green-700">
          Your case note has been generated and is ready for review.
        </p>
      </div>
    </div>
  );
}
