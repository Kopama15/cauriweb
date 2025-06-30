import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className = '', ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`border px-3 py-2 rounded text-sm bg-white text-black w-full ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
