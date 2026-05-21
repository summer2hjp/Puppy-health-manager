import { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const variantClass: Record<Variant, string> = {
  primary: 'bg-brand-primary/90 text-white hover:bg-brand-primaryHover border-transparent backdrop-blur-sm',
  secondary: 'bg-white/80 text-readable-dark border-brand-border hover:bg-white/90 backdrop-blur-sm glassmorphism-enhanced',
  ghost: 'bg-transparent text-readable-dark border-transparent hover:bg-white/40 backdrop-blur-sm',
  danger: 'bg-rose-600/90 text-white border-transparent hover:bg-rose-700/90 backdrop-blur-sm'
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
