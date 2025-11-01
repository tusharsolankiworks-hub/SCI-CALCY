
import React from 'react';
import { ButtonCategory } from '../types';

interface ButtonProps {
  label: string;
  onClick: () => void;
  category: ButtonCategory;
  span?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, category, span }) => {
  const getCategoryClasses = (): string => {
    switch (category) {
      case ButtonCategory.NUMBER:
        return 'bg-gray-700 hover:bg-gray-600';
      case ButtonCategory.OPERATOR:
        return 'bg-amber-500 hover:bg-amber-400 text-white';
      case ButtonCategory.FUNCTION:
        return 'bg-gray-500 hover:bg-gray-400';
      case ButtonCategory.SPECIAL:
        return 'bg-rose-600 hover:bg-rose-500 text-white';
      case ButtonCategory.GEMINI:
        return 'bg-blue-600 hover:bg-blue-500 text-white';
      default:
        return 'bg-gray-700 hover:bg-gray-600';
    }
  };

  const spanClass = span ? `col-span-${span}` : 'col-span-1';

  return (
    <button
      onClick={onClick}
      className={`rounded-lg text-2xl font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-amber-500 h-16 ${getCategoryClasses()} ${spanClass}`}
    >
      {label}
    </button>
  );
};

export default Button;
