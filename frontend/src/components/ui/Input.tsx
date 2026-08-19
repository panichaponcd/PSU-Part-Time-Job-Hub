import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label htmlFor={inputId} className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-4 py-2.5 rounded-xl border bg-white/70 backdrop-blur-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-psu-blue/50 transition-all ${
            error ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500 font-semibold">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
