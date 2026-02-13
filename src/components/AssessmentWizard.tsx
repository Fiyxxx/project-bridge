'use client';

import React, { useState } from 'react';
import type { GapAnalysis, DomainObservations, DevelopmentalDomain } from '@/types/assessment';
import Step1_ObservationInput from './Step1_ObservationInput';
import Step2_GapAnalysis from './Step2_GapAnalysis';
import Step3_GuidedCompletion from './Step3_GuidedCompletion';
import Step4_NoteGeneration from './Step4_NoteGeneration';
import Step5_EditExport from './Step5_EditExport';

type Step = 1 | 2 | 3 | 4 | 5;

export default function AssessmentWizard() {
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // Step 1 state
  const [initialObservations, setInitialObservations] = useState('');

  // Step 2 state
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [additionalObservations, setAdditionalObservations] = useState<Record<DevelopmentalDomain, string>>({
    gross_motor: '',
    fine_motor: '',
    speech_language: '',
    social_emotional: '',
    cognitive: '',
  });

  // Step 3 state
  const [allObservations, setAllObservations] = useState<Partial<DomainObservations>>({});

  // Step 4/5 state
  const [caseNoteText, setCaseNoteText] = useState('');
  const [generationLoading, setGenerationLoading] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [metadata] = useState({
    childId: 'Child A',
    sessionDate: new Date().toISOString().split('T')[0],
    assessorName: '',
  });

  // Step 1 -> Step 2: Analyze observations
  const handleStep1Next = async () => {
    setAnalysisLoading(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/analyze-observations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ observations: initialObservations }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze observations');
      }

      const data = await response.json();
      setGapAnalysis(data.analysis);

      // Initialize allObservations with initial observations mapped to covered domains
      const initial: Partial<DomainObservations> = {};
      data.analysis.coveredDomains.forEach((domain: DevelopmentalDomain) => {
        initial[domain] = initialObservations; // Simplified - in production would parse better
      });
      setAllObservations(initial);

      setCurrentStep(2);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Step 2 -> Step 3: Merge additional observations
  const handleStep2Next = () => {
    const merged = { ...allObservations };
    Object.entries(additionalObservations).forEach(([domain, text]) => {
      if (text.trim()) {
        merged[domain as DevelopmentalDomain] = text;
      }
    });
    setAllObservations(merged);
    setCurrentStep(3);
  };

  // Step 3 -> Step 4: Generate case note
  const handleStep3Next = async () => {
    setCurrentStep(4);
    setGenerationLoading(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/generate-case-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          observations: allObservations,
          metadata,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate case note');
      }

      const data = await response.json();
      setCaseNoteText(data.caseNote.summary); // Using summary field which contains full text

      // Auto-advance to Step 5 after generation
      setTimeout(() => {
        setCurrentStep(5);
      }, 1000);
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setGenerationLoading(false);
    }
  };

  // Reset wizard
  const handleStartNew = () => {
    setCurrentStep(1);
    setInitialObservations('');
    setGapAnalysis(null);
    setAdditionalObservations({
      gross_motor: '',
      fine_motor: '',
      speech_language: '',
      social_emotional: '',
      cognitive: '',
    });
    setAllObservations({});
    setCaseNoteText('');
    setAnalysisError(null);
    setGenerationError(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                step === currentStep
                  ? 'bg-blue-600 text-white'
                  : step < currentStep
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step < currentStep ? '✓' : step}
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-gray-600">
          Step {currentStep} of 5
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {currentStep === 1 && (
          <Step1_ObservationInput
            observations={initialObservations}
            onObservationsChange={setInitialObservations}
            onNext={handleStep1Next}
          />
        )}

        {currentStep === 2 && (
          <Step2_GapAnalysis
            analysis={gapAnalysis}
            loading={analysisLoading}
            error={analysisError}
            additionalObservations={additionalObservations}
            onAdditionalObservationChange={(domain, value) => {
              setAdditionalObservations(prev => ({ ...prev, [domain]: value }));
            }}
            onNext={handleStep2Next}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3_GuidedCompletion
            allObservations={allObservations}
            onObservationsChange={setAllObservations}
            onNext={handleStep3Next}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <Step4_NoteGeneration
            loading={generationLoading}
            error={generationError}
            onRetry={handleStep3Next}
          />
        )}

        {currentStep === 5 && (
          <Step5_EditExport
            caseNoteText={caseNoteText}
            metadata={metadata}
            onStartNew={handleStartNew}
            onBack={() => setCurrentStep(3)}
          />
        )}
      </div>
    </div>
  );
}
