import { MetricCard } from '../components/MetricCard';
import { StatusBanner } from '../components/StatusBanner';
import { useState, useEffect } from 'react';

const metrics = [
  { title: '日活用户', value: '12,480', trend: '较昨日 +8.2%' },
  { title: '问诊转化率', value: '17.3%', trend: '目标值 15%' },
  { title: '档案创建率', value: '31.6%', trend: '较上周 +2.1%' }
];

export function DashboardPage() {
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  useEffect(() => {
    // 预加载 Dashboard Hero 图片
    const img = new Image();
    img.src = '/docs/images/dashboard/dashboard-hero.png';
    img.onload = () => setHeroImageLoaded(true);
    img.onerror = () => console.error('Failed to load dashboard hero image');
  }, []);

  return (
    <section className="space-y-4">
      {/* Hero Banner with Image */}
      <div className="relative overflow-hidden rounded-lg shadow-md">
        {heroImageLoaded && (
          <img 
            src="/docs/images/dashboard/dashboard-hero.png" 
            alt="Dashboard Hero" 
            className="h-48 w-full object-cover"
            loading="eager"
          />
        )}
        {!heroImageLoaded && (
          <div className="h-48 w-full bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 animate-pulse" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-xl font-semibold">运营数据仪表盘</h2>
          <p className="text-sm opacity-90">实时监控核心业务指标</p>
        </div>
      </div>

      <header>
        <h3 className="section-title">运营总览原型</h3>
        <p className="section-desc">聚合用户、问诊、内容、预约四类核心指标。</p>
      </header>
      <StatusBanner state="empty" message="今日尚无新的投诉工单。" />
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>
      <article className="card p-4">
        <h4 className="font-medium">关键路径</h4>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-brand-muted">
          <li>用户登录后创建宠物档案并完成首条健康记录。</li>
          <li>通过症状自查进入在线问诊，医生 5 分钟内首次响应。</li>
          <li>问诊完成后进入复诊提醒并推荐知识库内容。</li>
        </ol>
      </article>
    </section>
  );
}
