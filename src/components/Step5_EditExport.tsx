import React, { useState } from 'react';
import { exportCaseNoteToDocx } from '@/lib/export';

interface Step5Props {
  caseNoteText: string;
  metadata: {
    childId: string;
    sessionDate: string;
  };
  onStartNew: () => void;
  onBack: () => void;
}

export default function Step5_EditExport({
  caseNoteText,
  metadata,
  onStartNew,
  onBack,
}: Step5Props) {
  const [editedText, setEditedText] = useState(caseNoteText);
  const [exporting, setExporting] = useState(false);

  const handleExportDocx = async () => {
    setExporting(true);
    try {
      const filename = `case-note-${metadata.childId}-${metadata.sessionDate}.docx`;
      await exportCaseNoteToDocx(editedText, filename);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export document. Please try copying the text instead.');
    } finally {
      setExporting(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(editedText);
    alert('Case note copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 5: Review & Export
        </h2>
        <p className="text-gray-600">
          Review the generated case note. You can edit any section before exporting.
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-purple-900 font-semibold mb-1">
          <span>🔒</span>
          <span>Privacy Notice</span>
        </div>
        <p className="text-sm text-purple-700">
          Session data will be cleared when you start a new assessment or close this page.
          No data is stored on our servers.
        </p>
      </div>

      {/* Editable Text Area */}
      <div>
        <label htmlFor="caseNote" className="block text-sm font-medium text-gray-700 mb-2">
          Case Note (Editable)
        </label>
        <textarea
          id="caseNote"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-mono text-sm"
          style={{ resize: 'vertical' }}
        />
        <div className="mt-2 text-sm text-gray-500">
          {editedText.length} characters
        </div>
      </div>

      {/* Export Options */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCopyToClipboard}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          📋 Copy to Clipboard
        </button>

        <button
          onClick={handleExportDocx}
          disabled={exporting}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {exporting ? 'Exporting...' : '📄 Download DOCX'}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onStartNew}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Start New Assessment
        </button>
      </div>
    </div>
  );
}
