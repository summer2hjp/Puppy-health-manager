type MetricCardProps = {
  title: string;
  value: string;
  trend: string;
  link?: string;
};

export function MetricCard({ title, value, trend, link }: MetricCardProps) {
  const handleClick = () => {
    if (link) {
      // 实际项目中可以使用 react-router 的 useNavigate
      console.log('跳转到:', link);
      // navigate(link);
    }
  };

  return (
    <article 
      className={`card glassmorphism-enhanced p-4 ${link ? 'cursor-pointer hover-lift' : ''}`}
      onClick={handleClick}
      role={link ? 'button' : undefined}
      tabIndex={link ? 0 : undefined}
      onKeyDown={(e) => {
        if (link && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <p className="text-sm text-readable-muted">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-readable-title">{value}</p>
      <p className="mt-1 text-xs text-readable-muted">{trend}</p>
    </article>
  );
}
