import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { Pin, RotateCcw, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeStyles, HeaderProps } from '../../types/floating-preview';
import './styles.css';

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
      className={`floating-preview-header ${themeStyles.headerBg}`}
      onPointerDown={onDragStart}
      style={{
        cursor: isDragHover ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {/* 网址显示区 - 允许被压缩：外层flex-1 + min-w-0，内部使用 max-w-full + 溢出省略，最大宽度55% */}
      <div 
        ref={urlContainerRef} 
        className="floating-preview-url-container" 
        style={{ flex: '1', minWidth: '0', marginRight: '0.75rem', maxWidth: '55%' }}
        // 阻止在网址区域内触发拖拽 
        onMouseDown={(e) => e.stopPropagation()} 
      > 
        <div 
          className="floating-preview-url-display"
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
            className={`floating-preview-url-text ${themeStyles.textColor}`}
            title={url}
            style={{
              background: "transparent",
            }}
          > 
            {getDisplayUrl(url)} 
          </div> 
        </div>
      </div>
      
      {/* 操作按钮区 - 固定尺寸，始终可见 */} 
      <div 
        ref={actionsRef} 
        className="floating-preview-actions" 
        style={{ marginLeft: '0.25rem', flexShrink: '0' }}
        // 阻止按钮区域触发拖拽 
        onMouseDown={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onTogglePin}
          className={`floating-preview-button ${themeStyles.buttonHover} ${
            isPinned ? "floating-preview-button-pinned" : ""
          }`}
          title={isPinned ? "取消固定" : "固定窗口"}
          aria-label={isPinned ? "取消固定" : "固定窗口"}
        >
          <Pin
            size={14}
            className={`${themeStyles.textColor} ${
              isPinned ? "fill-current" : ""
              }`}
            style={{
              background: "transparent",
              fill: isPinned ? "currentColor" : "",
            }}
          />
        </button>
        
        <button
          onClick={onRefresh}
          className={`floating-preview-button ${themeStyles.buttonHover}`}
          title="刷新页面"
          aria-label="刷新页面"
        >
          <RotateCcw size={14} className={themeStyles.textColor} style={{
            background: "transparent",
          }} />
        </button>
         
        <button
          onClick={onOpenInNewTab}
          className={`floating-preview-button ${themeStyles.buttonHover}`}
          title="在新标签页中打开"
          aria-label="在新标签页中打开"
        >
          <ExternalLink size={14} className={themeStyles.textColor} style={{
            background: "transparent",
          }} /> 
        </button>
         
        <button
          onClick={onClose}
          className={`floating-preview-button floating-preview-close-button ${themeStyles.buttonHover}`}
          title="关闭"
          aria-label="关闭"
        >
          <X size={14} className={themeStyles.textColor} style={{
            background: "transparent",
          }} />
        </button>
      </div>
    </div>
  );
};

export default Header;