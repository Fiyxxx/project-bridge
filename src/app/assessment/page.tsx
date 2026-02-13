import AssessmentWizard from '@/components/AssessmentWizard';

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">AssessMate</h1>
        <p className="text-gray-600">
          AI-powered case note assistant for early intervention assessors
        </p>
      </div>
      <AssessmentWizard />
    </div>
  );
}
