import { StatusBanner } from '../components/StatusBanner';

const submissions = [
  { title: '犬猫过敏季护理指南', author: '内容团队A', status: '待审核' },
  { title: '如何判断宠物应激反应', author: '执业兽医 刘医生', status: '复审中' },
  { title: '驱虫频率说明', author: '内容团队B', status: '已驳回' }
];

export function CmsPage() {
  return (
    <section className="space-y-4 text-readable-title">
      <header>
        <h3 className="section-title text-readable-title">CMS 原型</h3>
        <p className="section-desc text-readable-muted">包含内容审核流、定时发布、SEO 与运营位管理。</p>
      </header>
      <StatusBanner state="error" message="发现 1 条内容命中医疗敏感词，需要人工复审。" />

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="card glassmorphism-enhanced p-4 lg:col-span-2">
          <h4 className="font-medium text-readable-title">待处理稿件</h4>
          <ul className="mt-3 space-y-3">
            {submissions.map((item) => (
              <li key={item.title} className="rounded-md border border-brand-border p-3 text-sm glassmorphism-enhanced">
                <p className="font-medium text-readable-title">{item.title}</p>
                <p className="text-readable-muted">作者：{item.author} · 状态：{item.status}</p>
              </li>
            ))}
          </ul>
        </article>
        <article className="card glassmorphism-enhanced p-4">
          <h4 className="font-medium text-readable-title">发布设置</h4>
          <div className="mt-3 space-y-2 text-sm">
            <label className="block">
              <span className="mb-1 block text-readable-muted">发布时间</span>
              <input className="focus-ring w-full rounded-md border border-brand-border px-3 py-2 glassmorphism-enhanced text-readable-dark placeholder-gray-500" type="datetime-local" />
            </label>
            <label className="block">
              <span className="mb-1 block text-readable-muted">SEO 标题</span>
              <input className="focus-ring w-full rounded-md border border-brand-border px-3 py-2 glassmorphism-enhanced text-readable-dark placeholder-gray-500" type="text" placeholder="输入页面 SEO 标题" />
            </label>
            <button className="focus-ring mt-2 w-full rounded-md bg-brand-primary/90 px-3 py-2 text-sm font-medium text-white hover:bg-brand-primaryHover backdrop-blur-sm">
              保存并提交审核
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
