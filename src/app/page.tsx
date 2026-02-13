import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          AssessMate
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AI-powered documentation assistant for early intervention assessors working with
          children aged 1–6 with developmental delays.
        </p>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            What AssessMate Does
          </h2>
          <ul className="text-left space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">1.</span>
              <span>You enter brief bullet-point observations from your session</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">2.</span>
              <span>AI analyzes which ECDA developmental domains you've covered</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">3.</span>
              <span>System prompts for any missing observations</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">4.</span>
              <span>Generates a structured, professional case note draft</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">5.</span>
              <span>You review, edit, and export to DOCX</span>
            </li>
          </ul>
        </div>

        <Link
          href="/assessment"
          className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start New Assessment →
        </Link>

        <p className="mt-6 text-sm text-gray-500">
          POC for CCSGP Fellowship Application • February 2026
        </p>
      </div>
    </div>
  );
}
