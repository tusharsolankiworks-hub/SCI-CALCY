
import React from 'react';
import { ButtonConfig } from '../types';
import Button from './Button';

interface KeypadProps {
  buttons: ButtonConfig[][];
  onButtonClick: (value: string) => void;
}

const Keypad: React.FC<KeypadProps> = ({ buttons, onButtonClick }) => {
  return (
    <div className="w-full grid grid-cols-5 gap-2">
      {buttons.flat().map((btn) => (
        <Button
          key={btn.label}
          label={btn.label}
          onClick={() => onButtonClick(btn.value)}
          category={btn.category}
          span={btn.span}
        />
      ))}
    </div>
  );
};

export default Keypad;
