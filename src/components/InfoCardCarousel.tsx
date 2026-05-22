import { useState, useEffect, useRef } from 'react';

export type ReminderType = 'user' | 'vet' | 'cms';

export interface ReminderItem {
  id: string;
  type: ReminderType;
  title: string;
  description: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  avatar?: string;
}

interface InfoCardCarouselProps {
  items: ReminderItem[];
  autoScroll?: boolean;
  scrollInterval?: number;
}

const priorityColors = {
  low: 'bg-success/10 text-success',
  medium: 'bg-warning/10 text-warning',
  high: 'bg-error/10 text-error',
};

const typeLabels = {
  user: '用户提醒',
  vet: '病例信息',
  cms: '待处理稿件',
};

const typeIcons = {
  user: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  vet: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  cms: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
};

export function InfoCardCarousel({ items, autoScroll = true, scrollInterval = 4000 }: InfoCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // 自动滚动
  useEffect(() => {
    if (!autoScroll || isPaused || items.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, scrollInterval);

    return () => clearInterval(timer);
  }, [autoScroll, isPaused, items.length, scrollInterval]);

  // 触摸滑动支持
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const threshold = 50; // 最小滑动距离

    if (swipeDistance > threshold) {
      // 向左滑动 - 下一张
      setCurrentIndex((prev) => (prev + 1) % items.length);
    } else if (swipeDistance < -threshold) {
      // 向右滑动 - 上一张
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }

    setIsPaused(false);
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 5000);
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 5000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items.length]);

  if (items.length === 0) {
    return (
      <div className="card glassmorphism-enhanced p-8 text-center">
        <p className="text-readable-muted">暂无提醒信息</p>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <div
      ref={containerRef}
      className="relative card glassmorphism-enhanced overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 卡片内容 */}
      <div className="p-6 transition-all duration-500 ease-in-out">
        {/* 类型标签和优先级 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`p-2 rounded-lg ${priorityColors[currentItem.priority || 'medium']}`}>
              {typeIcons[currentItem.type]}
            </span>
            <span className="text-sm font-medium text-readable-muted">
              {typeLabels[currentItem.type]}
            </span>
          </div>
          {currentItem.priority && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[currentItem.priority]}`}>
              {currentItem.priority === 'low' && '低'}
              {currentItem.priority === 'medium' && '中'}
              {currentItem.priority === 'high' && '高'}
            </span>
          )}
        </div>

        {/* 标题和描述 */}
        <h3 className="text-lg font-semibold text-readable-title mb-2 apple-style-heading">
          {currentItem.title}
        </h3>
        <p className="text-sm text-readable-muted mb-4 apple-style-subheading">
          {currentItem.description}
        </p>

        {/* 到期时间 */}
        {currentItem.dueDate && (
          <div className="flex items-center gap-2 text-xs text-readable-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>截止日期：{currentItem.dueDate}</span>
          </div>
        )}
      </div>

      {/* 进度指示器 */}
      {items.length > 1 && (
        <>
          {/* 底部圆点指示器 */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${
                  index === currentIndex
                    ? 'w-6 bg-brand-primary'
                    : 'bg-readable-muted/30 hover:bg-readable-muted/50'
                }`}
                aria-label={`跳转到第 ${index + 1} 条`}
                aria-current={index === currentIndex ? 'true' : undefined}
              />
            ))}
          </div>

          {/* 左右箭头按钮（桌面端） */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand-primary hidden md:block"
            aria-label="上一条"
          >
            <svg className="w-5 h-5 text-readable-title" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand-primary hidden md:block"
            aria-label="下一条"
          >
            <svg className="w-5 h-5 text-readable-title" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* 进度条 */}
      {items.length > 1 && autoScroll && (
        <div className="absolute bottom-0 left-0 h-1 bg-brand-primary/20 w-full">
          <div
            className="h-full bg-brand-primary transition-all duration-300 ease-linear"
            style={{
              width: `${((currentIndex + 1) / items.length) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
