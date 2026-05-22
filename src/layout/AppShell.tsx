import { NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', label: '总览' },
  { to: '/user', label: '用户端' },
  { to: '/vet', label: '兽医端' },
  { to: '/cms', label: 'CMS' }
];

export function AppShell() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text global-bg">
      {/* 移动端汉堡菜单按钮 */}
      <button
        type="button"
        className="mobile-menu-button fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? '关闭导航菜单' : '打开导航菜单'}
        aria-expanded={isMobileMenuOpen}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* 移动端导航抽屉 */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer" role="dialog" aria-modal="true">
          <div 
            className="mobile-nav-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <nav className={`mobile-nav-panel ${isMobileMenuOpen ? 'mobile-nav-panel-open' : 'mobile-nav-panel-closed'}`}>
            <div className="p-4">
              <h1 className="mb-4 text-base font-semibold text-readable-title">PetCare 控制台</h1>
              <div className="space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `focus-ring block rounded-md px-3 py-2 text-sm transition text-readable-title ${
                        isActive
                          ? 'bg-brand-primary text-white'
                          : 'text-brand-text hover:bg-white/50'
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-8">
        {/* 桌面端侧边栏 - 隐藏于移动端 */}
        <aside className="hidden w-56 flex-shrink-0 rounded-lg border border-brand-border bg-white/30 backdrop-blur-xl p-4 shadow-card md:block glassmorphism-enhanced">
          <h1 className="mb-4 text-base font-semibold text-readable-title">PetCare 控制台</h1>
          <nav className="space-y-2" aria-label="主导航">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `focus-ring block rounded-md px-3 py-2 text-sm transition text-readable-title ${
                    isActive
                      ? 'bg-brand-primary text-white'
                      : 'text-brand-text hover:bg-white/50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main id="main-content" className="min-w-0 flex-1 space-y-6">
          <header className="card glassmorphism flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-brand-muted text-readable-muted">Prototype</p>
              <h2 className="text-lg font-semibold text-readable-title">宠物健康管理平台</h2>
            </div>
            <button className="focus-ring rounded-md border border-brand-border bg-white/80 px-3 py-2 text-sm hover:bg-slate-50 backdrop-blur-sm text-readable-title btn-press">
              导出报告
            </button>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
