import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2 tracking-tight">
            {label}
            {props.required && <span className="text-blue-400 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-white/30 focus:outline-none focus:bg-white/[0.05] focus:border-blue-500/50 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200 text-[0.9375rem] ${
            error ? 'border-red-500/50 focus:border-red-500/50 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="text-red-400 text-sm mt-1.5 font-medium">{error}</p>}
        {helperText && !error && <p className="text-gray-500 text-sm mt-1.5">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
