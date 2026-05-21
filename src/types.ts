export type HealthState = 'default' | 'loading' | 'empty' | 'error';

export type AppRoute = {
  label: string;
  path: string;
  description: string;
};