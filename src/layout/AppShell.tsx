import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: '总览' },
  { to: '/user', label: '用户端' },
  { to: '/vet', label: '兽医端' },
  { to: '/cms', label: 'CMS' }
];

export function AppShell() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <aside className="hidden w-56 flex-shrink-0 rounded-lg border border-brand-border bg-white p-4 shadow-card md:block">
          <h1 className="mb-4 text-base font-semibold">PetCare 控制台</h1>
          <nav className="space-y-2" aria-label="主导航">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `focus-ring block rounded-md px-3 py-2 text-sm transition ${
                    isActive
                      ? 'bg-brand-primary text-white'
                      : 'text-brand-text hover:bg-slate-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main id="main-content" className="min-w-0 flex-1 space-y-6">
          <header className="card flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-brand-muted">Prototype</p>
              <h2 className="text-lg font-semibold">宠物健康管理平台</h2>
            </div>
            <button className="focus-ring rounded-md border border-brand-border bg-white px-3 py-2 text-sm hover:bg-slate-50">
              导出报告
            </button>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
