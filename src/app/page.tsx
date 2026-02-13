import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-medium text-blue-700 mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            NUS CCSGP Fellowship POC
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            AssessMate
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            AI-powered documentation assistant for early intervention assessors working with children aged 1–6 with developmental delays
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/assessment"
              className="btn btn-primary text-lg px-8 py-4 shadow-xl shadow-blue-500/20"
            >
              Start New Assessment
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            <Link
              href="/api/health"
              className="btn btn-secondary"
            >
              System Status
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div className="card p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How AssessMate Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: '1', title: 'Enter Observations', desc: 'Quick bullet-point notes' },
              { step: '2', title: 'AI Analysis', desc: 'Gap detection across ECDA domains' },
              { step: '3', title: 'Guided Review', desc: 'Complete missing observations' },
              { step: '4', title: 'Generate Note', desc: 'Professional case note draft' },
              { step: '5', title: 'Edit & Export', desc: 'Download as DOCX' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: '🎯', title: 'ECDA Frameworks', desc: 'Aligned with Singapore's early childhood standards' },
            { icon: '🔒', title: 'Privacy First', desc: 'Local deployment, zero data persistence' },
            { icon: '⚡', title: 'Save Time', desc: '30-50% reduction in documentation time' },
          ].map((feature) => (
            <div key={feature.title} className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-200">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>POC for CCSGP Fellowship Application • February 2026</p>
        </div>
      </div>
    </div>
  );
}
