import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`border rounded p-2 w-full focus:outline-none focus:ring focus:ring-blue-300 ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
