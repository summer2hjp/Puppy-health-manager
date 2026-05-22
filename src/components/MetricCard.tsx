type MetricCardProps = {
  title: string;
  value: string;
  trend: string;
  link?: string;
};

export function MetricCard({ title, value, trend, link }: MetricCardProps) {
  // 不再处理点击跳转
  return (
    <article 
      className="card glassmorphism-enhanced p-4"
    >
      <p className="text-sm text-readable-muted">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-readable-title">{value}</p>
      <p className="mt-1 text-xs text-readable-muted">{trend}</p>
    </article>
  );
}
