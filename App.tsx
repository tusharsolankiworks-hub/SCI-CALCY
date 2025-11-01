
import React, { useState, useCallback } from 'react';
import Display from './components/Display';
import Keypad from './components/Keypad';
import { ButtonCategory, ButtonConfig } from './types';
import { getExplanation } from './services/geminiService';
import GeminiExplanationModal from './components/GeminiExplanationModal';

const App: React.FC = () => {
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [isRadians, setIsRadians] = useState<boolean>(true);
  const [lastResult, setLastResult] = useState<string>('');
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState<boolean>(false);
  const [geminiExplanation, setGeminiExplanation] = useState<string>('');
  const [isLoadingGemini, setIsLoadingGemini] = useState<boolean>(false);
  const [expressionForGemini, setExpressionForGemini] = useState<string>('');


  const factorial = (n: number): number => {
    if (n < 0 || n % 1 !== 0) return NaN;
    if (n === 0) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };

  const calculate = useCallback(() => {
    if (!expression) return;
    try {
      let evalExpr = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/\^/g, '**')
        .replace(/ans/g, lastResult || '0')
        .replace(/(\d+(?:\.\d+)?)%/g, '($1/100)')
        .replace(/(\d+(?:\.\d+)?)!/g, `factorial($1)`)
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(');

      const trigFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan'];
      trigFunctions.forEach(func => {
        const regex = new RegExp(`${func}\\(`, 'g');
        evalExpr = evalExpr.replace(regex, `Math.${func}(`);
      });

      if (!isRadians) {
        evalExpr = evalExpr.replace(/(Math\.(?:sin|cos|tan))\(([^)]+)\)/g, (match, func, content) => `${func}((${content}) * Math.PI / 180)`);
        evalExpr = evalExpr.replace(/(Math\.(?:asin|acos|atan))\(([^)]+)\)/g, (match, func, content) => `((${func}(${content})) * 180 / Math.PI)`);
      }

      const calculator = new Function('factorial', `return ${evalExpr}`);
      const res = calculator(factorial);
      const finalResult = String(parseFloat(res.toPrecision(15)));
      setResult(finalResult);
      setLastResult(finalResult);
    } catch (error) {
      setResult('Error');
    }
  }, [expression, isRadians, lastResult]);

  const handleGeminiExplain = async () => {
    if (!expression) return;
    setExpressionForGemini(expression);
    setIsGeminiModalOpen(true);
    setIsLoadingGemini(true);
    const explanation = await getExplanation(expression);
    setGeminiExplanation(explanation);
    setIsLoadingGemini(false);
  };
  
  const handleButtonClick = (value: string) => {
    if (result === 'Error') {
      setResult('0');
      setExpression('');
    }
    switch (value) {
      case '=':
        calculate();
        break;
      case 'C':
        setExpression('');
        setResult('0');
        break;
      case 'DEL':
        setExpression(prev => prev.slice(0, -1));
        break;
      case 'deg':
      case 'rad':
        setIsRadians(!isRadians);
        break;
      case '+/-':
        setExpression(prev => {
           if (result !== '0' && prev === ''){
              return `-${result}`
           }
           return prev.endsWith(')') ? prev.replace(/\(-([^)]+)\)$/, '$1') : prev + '(-'
        });
        break;
      case 'explain':
        handleGeminiExplain();
        break;
      default:
        if (result !== '0' && expression === '' && !'*/+-^'.includes(value)) {
            setExpression(value);
        } else {
            setExpression(prev => prev + value);
        }
        break;
    }
  };

  const buttons: ButtonConfig[][] = [
    [
      { label: isRadians ? 'rad' : 'deg', value: 'rad', category: ButtonCategory.FUNCTION },
      { label: '(', value: '(', category: ButtonCategory.FUNCTION },
      { label: ')', value: ')', category: ButtonCategory.FUNCTION },
      { label: '%', value: '%', category: ButtonCategory.FUNCTION },
      { label: 'C', value: 'C', category: ButtonCategory.SPECIAL },
    ],
    [
      { label: 'sin', value: 'sin(', category: ButtonCategory.FUNCTION },
      { label: 'cos', value: 'cos(', category: ButtonCategory.FUNCTION },
      { label: 'tan', value: 'tan(', category: ButtonCategory.FUNCTION },
      { label: 'ln', value: 'ln(', category: ButtonCategory.FUNCTION },
      { label: 'log', value: 'log(', category: ButtonCategory.FUNCTION },
    ],
    [
      { label: 'xʸ', value: '^', category: ButtonCategory.FUNCTION },
      { label: '√', value: '√(', category: ButtonCategory.FUNCTION },
      { label: 'x!', value: '!', category: ButtonCategory.FUNCTION },
      { label: '+/-', value: '+/-', category: ButtonCategory.FUNCTION },
      { label: 'DEL', value: 'DEL', category: ButtonCategory.SPECIAL },
    ],
    [
      { label: '7', value: '7', category: ButtonCategory.NUMBER },
      { label: '8', value: '8', category: ButtonCategory.NUMBER },
      { label: '9', value: '9', category: ButtonCategory.NUMBER },
      { label: '÷', value: '÷', category: ButtonCategory.OPERATOR },
      { label: 'π', value: 'π', category: ButtonCategory.NUMBER },
    ],
    [
      { label: '4', value: '4', category: ButtonCategory.NUMBER },
      { label: '5', value: '5', category: ButtonCategory.NUMBER },
      { label: '6', value: '6', category: ButtonCategory.NUMBER },
      { label: '×', value: '×', category: ButtonCategory.OPERATOR },
      { label: 'e', value: 'e', category: ButtonCategory.NUMBER },
    ],
    [
      { label: '1', value: '1', category: ButtonCategory.NUMBER },
      { label: '2', value: '2', category: ButtonCategory.NUMBER },
      { label: '3', value: '3', category: ButtonCategory.NUMBER },
      { label: '−', value: '-', category: ButtonCategory.OPERATOR },
      { label: 'ans', value: 'ans', category: ButtonCategory.FUNCTION },
    ],
    [
      { label: '0', value: '0', category: ButtonCategory.NUMBER, span: "2" },
      { label: '.', value: '.', category: ButtonCategory.NUMBER },
      { label: '+', value: '+', category: ButtonCategory.OPERATOR },
      { label: '=', value: '=', category: ButtonCategory.OPERATOR },
    ],
    [
      { label: 'Explain with Gemini', value: 'explain', category: ButtonCategory.GEMINI, span: "5"},
    ],
  ];

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-2 sm:p-4 font-sans">
      <div className="w-full max-w-md mx-auto bg-gray-800 rounded-2xl shadow-2xl p-4 space-y-4">
        <h1 className="text-xl font-bold text-center text-gray-300">Gemini Scientific Calculator</h1>
        <Display expression={expression} result={result} />
        <Keypad buttons={buttons} onButtonClick={handleButtonClick} />
      </div>
      <GeminiExplanationModal
        isOpen={isGeminiModalOpen}
        onClose={() => setIsGeminiModalOpen(false)}
        explanation={geminiExplanation}
        isLoading={isLoadingGemini}
        expression={expressionForGemini}
      />
    </div>
  );
};

export default App;
