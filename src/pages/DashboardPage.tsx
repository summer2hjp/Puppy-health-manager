import { MetricCard } from '../components/MetricCard';
import { StatusBanner } from '../components/StatusBanner';
import { InfoCardCarousel, ReminderItem } from '../components/InfoCardCarousel';

// 模拟数据：用户即将到期提醒
const userReminders: ReminderItem[] = [
  {
    id: 'u1',
    type: 'user',
    title: '宠物疫苗即将到期',
    description: '您的宠物"豆豆"的狂犬疫苗将在 7 天后到期，请及时预约接种。',
    dueDate: '2024-06-15',
    priority: 'high',
    onClick: () => window.location.href = '/user/vaccine',
  },
  {
    id: 'u2',
    type: 'user',
    title: '会员订阅即将过期',
    description: '您的 VIP 会员服务将在 3 天后过期，续费可享受 8 折优惠。',
    dueDate: '2024-06-11',
    priority: 'medium',
    onClick: () => window.location.href = '/user/membership',
  },
  {
    id: 'u3',
    type: 'user',
    title: '健康记录待完善',
    description: '您还有 2 条宠物健康记录未填写，完善后可获得积分奖励。',
    dueDate: '2024-06-20',
    priority: 'low',
    onClick: () => window.location.href = '/user/health-records',
  },
];

// 模拟数据：兽医病例号信息
const vetCases: ReminderItem[] = [
  {
    id: 'v1',
    type: 'vet',
    title: '病例号 #2024060801',
    description: '金毛犬，3 岁，消化不良症状，待复诊检查。',
    dueDate: '2024-06-10',
    priority: 'high',
    onClick: () => window.location.href = '/vet/case/2024060801',
  },
  {
    id: 'v2',
    type: 'vet',
    title: '病例号 #2024060802',
    description: '英短猫，2 岁，疫苗接种后观察，状态良好。',
    dueDate: '2024-06-12',
    priority: 'medium',
    onClick: () => window.location.href = '/vet/case/2024060802',
  },
  {
    id: 'v3',
    type: 'vet',
    title: '病例号 #2024060803',
    description: '边境牧羊犬，5 岁，皮肤过敏治疗中，需持续用药。',
    dueDate: '2024-06-18',
    priority: 'low',
    onClick: () => window.location.href = '/vet/case/2024060803',
  },
  {
    id: 'v4',
    type: 'vet',
    title: '病例号 #2024060804',
    description: '波斯猫，4 岁，眼部感染，需每日滴眼药水。',
    dueDate: '2024-06-09',
    priority: 'high',
    onClick: () => window.location.href = '/vet/case/2024060804',
  },
];

// 模拟数据：CMS 待处理稿件
const cmsArticles: ReminderItem[] = [
  {
    id: 'c1',
    type: 'cms',
    title: '《夏季宠物防暑指南》',
    description: '作者：王医生，待审核。文章介绍夏季宠物防暑降温的实用方法。',
    dueDate: '2024-06-09',
    priority: 'high',
    onClick: () => window.location.href = '/cms/review/c1',
  },
  {
    id: 'c2',
    type: 'cms',
    title: '《幼犬喂养注意事项》',
    description: '作者：李营养师，待编辑。详解幼犬各阶段喂养要点。',
    dueDate: '2024-06-11',
    priority: 'medium',
    onClick: () => window.location.href = '/cms/edit/c2',
  },
  {
    id: 'c3',
    type: 'cms',
    title: '《宠物行为训练入门》',
    description: '作者：张训练师，待发布。基础服从训练技巧分享。',
    dueDate: '2024-06-15',
    priority: 'low',
    onClick: () => window.location.href = '/cms/publish/c3',
  },
];

const metrics = [
  { title: '日活用户', value: '12,480', trend: '较昨日 +8.2%' },
  { title: '问诊转化率', value: '17.3%', trend: '目标值 15%' },
  { title: '档案创建率', value: '31.6%', trend: '较上周 +2.1%' }
];

export function DashboardPage() {
  return (
    <div className="min-h-screen apple-style-body text-readable-title relative">
      {/* Dashboard 虚化背景层 */}
      <div className="dashboard-blur-overlay"></div>
      
      <section className="space-y-4 p-4 relative z-10">
        {/* Hero Banner - 卡片式标题区域（移除图片） */}
        <div className="relative overflow-hidden rounded-lg shadow-md glassmorphism-enhanced bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 p-8">
          <div className="text-readable-title">
            <h2 className="text-2xl font-semibold apple-style-heading">运营数据仪表盘</h2>
            <p className="text-base opacity-90 apple-style-subheading mt-1">实时监控核心业务指标</p>
          </div>
        </div>

      <header>
        <h3 className="section-title text-readable-title apple-style-heading">待办事项提醒</h3>
        <p className="section-desc text-readable-muted apple-style-subheading">聚合用户到期提醒、兽医病例信息和 CMS 待处理稿件。</p>
      </header>
      
      {/* 三个卡片式滚动预览组件 */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* 用户即将到期提醒 */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="font-medium text-readable-title">用户到期提醒</h4>
            <span className="text-xs text-readable-muted">{userReminders.length} 条</span>
          </div>
          <InfoCardCarousel items={userReminders} autoScroll={true} scrollInterval={5000} />
        </div>
        
        {/* 兽医病例号信息 */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="font-medium text-readable-title">兽医病例信息</h4>
            <span className="text-xs text-readable-muted">{vetCases.length} 条</span>
          </div>
          <InfoCardCarousel items={vetCases} autoScroll={true} scrollInterval={4000} />
        </div>
        
        {/* CMS 待处理稿件 */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="font-medium text-readable-title">CMS 待处理稿件</h4>
            <span className="text-xs text-readable-muted">{cmsArticles.length} 条</span>
          </div>
          <InfoCardCarousel items={cmsArticles} autoScroll={true} scrollInterval={6000} />
        </div>
      </div>
      
      <StatusBanner state="empty" message="今日尚无新的投诉工单。" />
      
      {/* 运营数据指标 */}
      <header className="mt-6">
        <h3 className="section-title text-readable-title apple-style-heading">运营总览原型</h3>
        <p className="section-desc text-readable-muted apple-style-subheading">聚合用户、问诊、内容、预约四类核心指标。</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.title}>
            <MetricCard {...metric} />
          </div>
        ))}
      </div>
      
      {/* 关键路径 - 磨玻璃效果卡片 */}
      <article className="card glassmorphism-enhanced p-4">
        <h4 className="font-medium text-readable-title apple-style-heading">关键路径</h4>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-readable-muted apple-style-subheading">
          <li className="cursor-pointer hover:text-brand-primary transition-colors" onClick={() => window.location.href = '/user/pet-profile'}>
            用户登录后创建宠物档案并完成首条健康记录。
          </li>
          <li className="cursor-pointer hover:text-brand-primary transition-colors" onClick={() => window.location.href = '/vet/consultation'}>
            通过症状自查进入在线问诊，医生 5 分钟内首次响应。
          </li>
          <li className="cursor-pointer hover:text-brand-primary transition-colors" onClick={() => window.location.href = '/user/followup'}>
            问诊完成后进入复诊提醒并推荐知识库内容。
          </li>
        </ol>
      </article>
    </section>
    </div>
  );
}
