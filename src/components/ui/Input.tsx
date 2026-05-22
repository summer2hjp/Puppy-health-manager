import { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export function Input({ label, hint, error, className = '', ...props }: Props) {
  return (
    <label className="block text-sm">
      <span className={`mb-1 block ${error ? 'text-brand-error' : 'text-readable-muted'}`}>{label}</span>
      <input
        {...props}
        className={`focus-ring w-full rounded-md border px-3 py-2 glassmorphism-enhanced text-readable-dark placeholder-gray-500 transition-colors duration-150 ${
          error ? 'input-error' : 'border-brand-border'
        } ${className}`}
      />
      {error ? <span className="error-message">{error}</span> : null}
      {hint && !error ? <span className="mt-1 block text-xs text-readable-muted">{hint}</span> : null}
    </label>
  );
}
