import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { Pin, RotateCcw, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeStyles, HeaderProps } from '../../types/floating-preview';

// Header组件 - 悬浮窗顶部，使用TailwindCSS和shadcn/ui重写
const Header: React.FC<HeaderProps> = ({
  url,
  isPinned,
  themeStyles,
  onTogglePin,
  onRefresh,
  onOpenInNewTab,
  onClose,
  onDragStart,
  onHeaderMinWidthChange,
}) => {
  // 拖拽状态管理（用于光标与轻微视觉反馈）
  const [isDragHover, setIsDragHover] = useState(false);

  // 记录按钮区域节点引用，用于测量其当前宽度
  const actionsRef = useRef<HTMLDivElement | null>(null);

  // 记录地址条外层容器引用，确保其可以被压缩（min-w-0 生效场景）
  const urlContainerRef = useRef<HTMLDivElement | null>(null);

  // 处理URL点击 - 在新标签页打开
  const handleUrlClick = () => {
    window.open(url, '_blank');
  };
  
  // 截取显示的URL（如果太长则显示省略号）
  const getDisplayUrl = (url: string) => {
    if (url.length <= 50) return url;
    return url.substring(0, 47) + '...';
  };

  // 测量按钮区域宽度，并把建议的最小窗口宽度通过回调告知父组件
  useLayoutEffect(() => {
    // 如果父组件未传入回调，直接跳过
    if (!onHeaderMinWidthChange) return;

    // 定义测量函数
    const measure = () => {
      // 若按钮区域不存在，跳过
      if (!actionsRef.current) return;
      // 读取按钮区域实际占用宽度
      const actionsWidth = actionsRef.current.getBoundingClientRect().width;
      // 两侧内边距 + 地址条最小展示宽度（依产品需要可调整）
      const PADDING = 12 /* 左右padding合计约为 px-3+间距保守估算 */ * 2;
      const MIN_URL_AREA = 160; // 地址栏最小宽度，保证可点击识别
      const SAFETY_GAP = 16; // 预留安全间距，避免布局抖动
      // 建议的最小窗口宽度 = 按钮区 + 地址区最小值 + 内边距 + 安全间距
      const minWidth = Math.ceil(actionsWidth + MIN_URL_AREA + PADDING + SAFETY_GAP);
      onHeaderMinWidthChange(minWidth);
    };

    // 先测一次
    measure();

    // 使用 ResizeObserver 监听按钮区变化（图标、语言、字体缩放变化等）
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && actionsRef.current) {
      ro = new ResizeObserver(() => measure());
      ro.observe(actionsRef.current);
    }

    // 监听窗口尺寸变化（缩放、DPR变化等）
    const onWinResize = () => measure();
    window.addEventListener('resize', onWinResize);

    return () => {
      window.removeEventListener('resize', onWinResize);
      if (ro && actionsRef.current) ro.unobserve(actionsRef.current);
    };
  }, [onHeaderMinWidthChange]);
  
  return (
    <div 
      className={`flex items-center justify-between px-3 py-2 ${themeStyles.headerBg} border-b ${themeStyles.border} select-none ${themeStyles.textColor} ${isDragHover ? 'cursor-grabbing' : 'cursor-grab'}`}
      // 顶层容器作为通用拖拽区域（除按钮区与网址显示区外）
      onMouseDown={(e) => {
        setIsDragHover(true);
        onDragStart(e);
      }}
      onMouseUp={() => setIsDragHover(false)}
      onMouseLeave={() => setIsDragHover(false)}
      style={{
        // 硬件加速，确保拖拽更顺滑
        transform: 'translateZ(0)',
        willChange: isDragHover ? 'transform' : 'auto'
      }}
    >
      {/* 网址显示区 - 允许被压缩：外层flex-1 + min-w-0，内部使用 max-w-full + 溢出省略，最大宽度55% */}
      <div 
        ref={urlContainerRef}
        className="flex-1 min-w-0 mr-3 max-w-[55%]"
        // 阻止在网址区域内触发拖拽
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1 border ${themeStyles.border} bg-white/70 dark:bg-neutral-800/70 shadow-inner hover:bg-white/80 dark:hover:bg-neutral-800/80 transition-colors duration-150 w-full max-w-full`}
          title={url}
          // 网址区域采用浏览器地址栏视觉效果，不参与拖拽
          // 点击打开新标签页
          onClick={handleUrlClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleUrlClick();
          }}
          style={{ cursor: 'pointer' }}
          aria-label="打开当前网址"
        >
          <div 
            className={`text-sm ${themeStyles.textColor} opacity-80 overflow-hidden text-ellipsis whitespace-nowrap w-full hover:opacity-100 transition-opacity`}
          >
            {getDisplayUrl(url)}
          </div>
        </div>
      </div>
      
      {/* 操作按钮区 - 固定尺寸，始终可见 */}
      <div 
        ref={actionsRef}
        className="flex items-center space-x-1 ml-1 flex-none"
        // 阻止按钮区域触发拖拽
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* 固定按钮 - 使用shadcn/ui Button组件 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onTogglePin}
          title={isPinned ? '取消固定' : '固定窗口'}
          className={`h-8 w-8 p-0 hover:bg-opacity-20 ${themeStyles.textColor}`}
        >
          <Pin 
            size={16} 
            className={`${isPinned ? 'fill-current' : ''} transition-all`} 
          />
        </Button>
        
        {/* 刷新按钮 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          title="刷新页面"
          className={`h-8 w-8 p-0 hover:bg-opacity-20 ${themeStyles.textColor}`}
        >
          <RotateCcw size={16} className="transition-transform hover:rotate-180 duration-300" />
        </Button>
         
        {/* 新标签页打开按钮 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenInNewTab}
          title="在新标签页打开"
          className={`h-8 w-8 p-0 hover:bg-opacity-20 ${themeStyles.textColor}`}
        >
          <ExternalLink size={16} className="transition-transform hover:scale-110" />
        </Button>
         
        {/* 关闭按钮 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          title="关闭"
          className={`h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 ${themeStyles.textColor} transition-colors`}
        >
          <X size={16} className="transition-transform hover:scale-110" />
        </Button>
      </div>
    </div>
  );
};

export default Header;