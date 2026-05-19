type MetricCardProps = {
  title: string;
  value: string;
  trend: string;
};

export function MetricCard({ title, value, trend }: MetricCardProps) {
  return (
    <article className="card p-4">
      <p className="text-sm text-brand-muted">{title}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-brand-muted">{trend}</p>
    </article>
  );
}
