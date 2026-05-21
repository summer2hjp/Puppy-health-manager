import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useState, useEffect } from 'react';

// 支持的图片格式列表（按优先级排序）
const SUPPORTED_FORMATS = ['png', 'jpg', 'jpeg'];

// 通用图片预加载函数：尝试多种格式直到成功
const preloadImageWithFormats = (
  basePath: string,
  onLoad: (src: string) => void,
  onError?: () => void
) => {
  let loaded = false;
  
  // 尝试每种格式
  for (const format of SUPPORTED_FORMATS) {
    const img = new Image();
    const src = `${basePath}.${format}`;
    
    img.onload = () => {
      if (!loaded) {
        loaded = true;
        console.log(`Successfully loaded: ${src}`);
        onLoad(src);
      }
    };
    
    img.onerror = () => {
      // 如果是最后一个格式才报错
      if (format === SUPPORTED_FORMATS[SUPPORTED_FORMATS.length - 1] && !loaded) {
        console.error(`Failed to load image with any format: ${basePath}`);
        onError?.();
      }
      // 继续尝试下一个格式
    };
    
    img.src = src;
  }
};

export function LoginPage() {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [bgSrc, setBgSrc] = useState<string>('');
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoSrc, setLogoSrc] = useState<string>('');
  
  useEffect(() => {
    // 预加载背景图（支持 png/jpg）
    preloadImageWithFormats(
      '/images/login/login-bg',
      (src) => {
        setBgSrc(src);
        setBgLoaded(true);
      },
      () => console.error('Login background image failed to load')
    );
    
    // 预加载 Logo（支持 png/jpg）
    preloadImageWithFormats(
      '/images/login/logo',
      (src) => {
        setLogoSrc(src);
        setLogoLoaded(true);
      },
      () => console.error('Login logo image failed to load')
    );
  }, []);

  return (
    <main id="main-content" className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 global-bg">
      {/* 背景图片层 - 使用磨玻璃效果遮罩 */}
      <div 
        className={`absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-500 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundImage: `url('${bgSrc}')` }}
        aria-hidden="true"
      />
      
      {/* 磨玻璃效果遮罩层 */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-0" aria-hidden="true" />
      
      <section className="relative z-10 w-full max-w-md rounded-lg border border-white/30 glassmorphism p-6 shadow-popup">
        <header className="mb-5 flex flex-col items-center">
          {logoLoaded && logoSrc && (
            <img 
              src={logoSrc} 
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
