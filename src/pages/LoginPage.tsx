import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useState, useEffect } from 'react';

export function LoginPage() {
  const [imagesLoaded, setImagesLoaded] = useState({
    bg: false,
    logo: false
  });

  useEffect(() => {
    // 预加载图片
    const preloadImage = (src: string, key: keyof typeof imagesLoaded) => {
      const img = new Image();
      img.src = src;
      img.onload = () => setImagesLoaded(prev => ({ ...prev, [key]: true }));
      img.onerror = () => console.error(`Failed to load image: ${src}`);
    };

    preloadImage('/docs/images/login/login-bg.png', 'bg');
    preloadImage('/docs/images/login/logo.png', 'logo');
  }, []);

  return (
    <main id="main-content" className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* 背景图片 */}
      <div 
        className={`absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-500 ${imagesLoaded.bg ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundImage: "url('/docs/images/login/login-bg.png')" }}
        aria-hidden="true"
      />
      
      <section className="relative z-10 w-full max-w-md rounded-lg border border-brand-border bg-white/95 backdrop-blur-sm p-6 shadow-popup">
        <header className="mb-5 flex flex-col items-center">
          {imagesLoaded.logo && (
            <img 
              src="/docs/images/login/logo.png" 
              alt="PetCare Logo" 
              className="mb-3 h-12 w-auto"
              loading="eager"
            />
          )}
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
