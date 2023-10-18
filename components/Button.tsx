// components/Button.tsx

import React from 'react';

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ type = 'button', onClick, className, disabled = false, children }) => {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`w-full bg-gray-700 text-gray-300 p-2 rounded-xl hover:bg-gray-600 focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
