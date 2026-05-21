import { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const variantClass: Record<Variant, string> = {
  primary: 'bg-brand-primary text-white hover:bg-brand-primaryHover border-transparent',
  secondary: 'bg-white text-brand-text border-brand-border hover:bg-slate-50',
  ghost: 'bg-transparent text-brand-text border-transparent hover:bg-slate-100',
  danger: 'bg-rose-600 text-white border-transparent hover:bg-rose-700'
};

const sizeClass: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-3 py-2 text-sm'
};

export function Button({ variant = 'secondary', size = 'md', className = '', ...props }: Props) {
  return (
    <button
      {...props}
      className={`focus-ring rounded-md border font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variantClass[variant]} ${sizeClass[size]} ${className}`}
    />
  );
}
