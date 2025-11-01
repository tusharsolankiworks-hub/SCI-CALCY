
import React from 'react';

interface DisplayProps {
  expression: string;
  result: string;
}

const Display: React.FC<DisplayProps> = ({ expression, result }) => {
  return (
    <div className="bg-gray-900/50 rounded-lg p-4 text-right mb-4 w-full break-words">
      <div className="text-gray-400 text-xl h-8 mb-1 overflow-x-auto overflow-y-hidden whitespace-nowrap">
        {expression || ' '}
      </div>
      <div className="text-white text-5xl font-light h-14">
        {result}
      </div>
    </div>
  );
};

export default Display;
