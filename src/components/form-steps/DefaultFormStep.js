'use client';

import { FileText, AlertCircle } from 'lucide-react';

export default function DefaultFormStep({ currentStep, stepTitle }) {
  return (
    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-8">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        
        <div>
          <p className="text-xl text-gray-600 mb-2 font-medium">
            📝 Form Step {currentStep}: {stepTitle}
          </p>
          <p className="text-gray-500 text-sm max-w-md">
            This form component for "{stepTitle}" will be implemented next.
            Steps 1-3 are now complete with real questions!
          </p>
        </div>
        
        <div className="inline-flex items-center gap-2 px-3 py-2 bg-amber-100 border border-amber-200 rounded-lg text-xs text-amber-800">
          <AlertCircle className="w-4 h-4" />
          <span>Component coming soon</span>
        </div>
      </div>
    </div>
  );
}