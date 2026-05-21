import { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
};

export function Input({ label, hint, className = '', ...props }: Props) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-readable-muted">{label}</span>
      <input
        {...props}
        className={`focus-ring w-full rounded-md border border-brand-border px-3 py-2 glassmorphism-enhanced text-readable-dark placeholder-gray-500 ${className}`}
      />
      {hint ? <span className="mt-1 block text-xs text-readable-muted">{hint}</span> : null}
    </label>
  );
}
