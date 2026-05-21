import { HealthState } from '../types';

type Props = {
  state: HealthState;
  message?: string;
};

const stateStyles: Record<HealthState, string> = {
  default: 'border-brand-border bg-white/70 backdrop-blur-sm text-readable-dark',
  loading: 'border-blue-200 bg-blue-50/80 backdrop-blur-sm text-blue-900',
  empty: 'border-emerald-200 bg-emerald-50/80 backdrop-blur-sm text-emerald-900',
  error: 'border-rose-200 bg-rose-50/80 backdrop-blur-sm text-rose-900'
};

const stateLabel: Record<HealthState, string> = {
  default: '默认状态',
  loading: '加载中',
  empty: '空状态',
  error: '异常状态'
};

export function StatusBanner({ state, message }: Props) {
  return (
    <div className={`rounded-md border px-4 py-3 text-sm glassmorphism-enhanced ${stateStyles[state]}`} role="status" aria-live="polite">
      <span className="font-medium">{stateLabel[state]}：</span>
      <span>{message ?? '系统运行正常。'}</span>
    </div>
  );
}
