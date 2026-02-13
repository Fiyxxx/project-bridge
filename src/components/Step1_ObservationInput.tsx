import React from 'react';

interface Step1Props {
  observations: string;
  onObservationsChange: (value: string) => void;
  onNext: () => void;
}

export default function Step1_ObservationInput({
  observations,
  onObservationsChange,
  onNext,
}: Step1Props) {
  const canProceed = observations.trim().length > 20;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 1: Enter Your Observations
        </h2>
        <p className="text-gray-600">
          Enter your observations from the assessment session. You can use bullet points or
          free-form text. Don't worry about structure yet — we'll help organize it.
        </p>
      </div>

      <div>
        <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-2">
          Session Observations
        </label>
        <textarea
          id="observations"
          value={observations}
          onChange={(e) => onObservationsChange(e.target.value)}
          placeholder="Example:&#10;• Child walked independently for 3 meters&#10;• Struggled with stacking 3 blocks&#10;• Made eye contact during play&#10;• Vocalized 'mama' and 'ball'&#10;• Showed interest in cause-effect toys"
          className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
          style={{ resize: 'vertical' }}
        />
        <div className="mt-2 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {observations.length} characters
          </p>
          {!canProceed && observations.length > 0 && (
            <p className="text-sm text-amber-600">
              Please enter at least 20 characters
            </p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Quick Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use bullet points for clarity</li>
          <li>• Include specific behaviors you observed</li>
          <li>• Note what the child did, not what they couldn't do</li>
          <li>• Don't worry about covering all domains yet</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Analyze Observations →
        </button>
      </div>
    </div>
  );
}
