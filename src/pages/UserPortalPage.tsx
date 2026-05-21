import { StatusBanner } from '../components/StatusBanner';

const records = [
  { pet: 'Milo', vaccine: '狂犬疫苗', due: '2026-06-20', owner: '李女士' },
  { pet: 'Luna', vaccine: '三联疫苗', due: '2026-06-22', owner: '王先生' },
  { pet: '豆包', vaccine: '驱虫', due: '2026-06-24', owner: '陈女士' }
];

export function UserPortalPage() {
  return (
    <section className="space-y-4">
      <header>
        <h3 className="section-title text-readable-title">用户端原型</h3>
        <p className="section-desc text-readable-muted">聚焦宠物档案、提醒中心、问诊入口与社区快捷入口。</p>
      </header>
      <StatusBanner state="loading" message="正在同步宠物健康数据，请稍候。" />

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="card glassmorphism-enhanced p-4 lg:col-span-2">
          <h4 className="font-medium text-readable-title">即将到期提醒</h4>
          <ul className="mt-3 space-y-3">
            {records.map((item) => (
              <li key={item.pet} className="rounded-md border border-brand-border p-3 text-sm glassmorphism-enhanced">
                <p className="font-medium text-readable-title">{item.pet} · {item.vaccine}</p>
                <p className="text-readable-muted">主人：{item.owner} · 到期：{item.due}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="card glassmorphism-enhanced p-4">
          <h4 className="font-medium text-readable-title">快捷操作</h4>
          <div className="mt-3 grid gap-2">
            {['新建问诊', '上传体检报告', '体重记录', '进入社区'].map((action) => (
              <button key={action} className="focus-ring rounded-md border border-brand-border px-3 py-2 text-left text-sm hover:bg-white/80 backdrop-blur-sm glassmorphism-enhanced text-readable-dark">
                {action}
              </button>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
