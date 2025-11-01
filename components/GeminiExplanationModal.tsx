
import React from 'react';

interface GeminiExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  explanation: string;
  isLoading: boolean;
  expression: string;
}

const GeminiExplanationModal: React.FC<GeminiExplanationModalProps> = ({ isOpen, onClose, explanation, isLoading, expression }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Explanation for: <span className="font-mono text-amber-400">{expression}</span></h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400"></div>
              <p className="mt-4 text-gray-300">Gemini is thinking...</p>
            </div>
          ) : (
            <div
              className="prose prose-invert prose-sm md:prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, '<br />') }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GeminiExplanationModal;
