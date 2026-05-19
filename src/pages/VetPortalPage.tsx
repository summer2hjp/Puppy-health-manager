import { StatusBanner } from '../components/StatusBanner';

const queue = [
  { caseId: 'CASE-1024', owner: '王女士', symptom: '连续呕吐', level: '高' },
  { caseId: 'CASE-1025', owner: '张先生', symptom: '术后食欲差', level: '中' },
  { caseId: 'CASE-1026', owner: '刘女士', symptom: '皮肤红疹', level: '中' }
];

export function VetPortalPage() {
  return (
    <section className="space-y-4">
      <header>
        <h3 className="section-title">兽医端原型</h3>
        <p className="section-desc">覆盖分诊队列、病历授权查看、处方开立与复诊追踪。</p>
      </header>
      <StatusBanner state="default" message="当前在线问诊队列 3 条，平均响应 4 分钟。" />

      <article className="card overflow-hidden">
        <table className="min-w-full divide-y divide-brand-border text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">病例号</th>
              <th className="px-4 py-3 text-left">宠物主</th>
              <th className="px-4 py-3 text-left">主诉</th>
              <th className="px-4 py-3 text-left">紧急度</th>
              <th className="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border bg-white">
            {queue.map((row) => (
              <tr key={row.caseId}>
                <td className="px-4 py-3">{row.caseId}</td>
                <td className="px-4 py-3">{row.owner}</td>
                <td className="px-4 py-3">{row.symptom}</td>
                <td className="px-4 py-3">{row.level}</td>
                <td className="px-4 py-3">
                  <button className="focus-ring rounded-md bg-brand-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-primaryHover">
                    开始接诊
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
}
