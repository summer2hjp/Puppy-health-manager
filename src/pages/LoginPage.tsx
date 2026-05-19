import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function LoginPage() {
  return (
    <main id="main-content" className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 px-4">
      <section className="w-full max-w-md rounded-lg border border-brand-border bg-white p-6 shadow-popup">
        <header className="mb-5">
          <h1 className="text-2xl font-semibold">欢迎登录 PetCare</h1>
          <p className="mt-1 text-sm text-brand-muted">支持宠物主、兽医与运营管理员统一登录。</p>
        </header>

        <form className="space-y-3" aria-label="登录表单">
          <Input label="手机号 / 邮箱" type="text" placeholder="请输入账号" />
          <Input label="密码" type="password" placeholder="请输入密码" />

          <Button type="button" variant="primary" className="mt-2 w-full py-2.5">
            登录
          </Button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm">
          <a href="#" className="focus-ring text-brand-primary hover:underline">忘记密码</a>
          <Link to="/dashboard" className="focus-ring text-brand-primary hover:underline">查看原型（跳过登录）</Link>
        </div>
      </section>
    </main>
  );
}
