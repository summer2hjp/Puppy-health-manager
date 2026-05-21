import { ReactNode } from 'react';

type Props = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Card({ title, description, children, className = '' }: Props) {
  return (
    <article className={`card glassmorphism-enhanced p-4 ${className}`}>
      {title ? <h4 className="font-medium text-readable-title">{title}</h4> : null}
      {description ? <p className="mt-1 text-sm text-readable-muted">{description}</p> : null}
      <div className={title || description ? 'mt-3' : ''}>{children}</div>
    </article>
  );
}
