import React, { useState, useRef, useEffect } from 'react';
import { ThemeStyles, FooterProps } from '../../types/floating-preview';
import './styles.css';

// Footer组件 - 悬浮窗底部，使用TailwindCSS重写
const Footer: React.FC<FooterProps> = ({
  width,
  height,
  themeStyles,
  onHeightResize,
  onCornerResize
}) => {
  // 调整状态管理
  const [isResizingHeight, setIsResizingHeight] = useState(false); // 高度调整状态
  const [isResizingCorner, setIsResizingCorner] = useState(false); // 角落调整状态
  
  // 调整起始位置记录
  const resizeStartRef = useRef<{ 
    startX: number; 
    startY: number; 
    startWidth: number; 
    startHeight: number; 
  } | null>(null);
  
  // 处理高度调整开始
  const handleHeightResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingHeight(true);
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: width,
      startHeight: height
    };
  };
  
  // 处理角落调整开始
  const handleCornerResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingCorner(true);
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: width,
      startHeight: height
    };
  };
  
  // 处理调整移动 - 优化响应灵敏度和流畅性
  const handleResizeMove = (e: MouseEvent) => {
    if (!resizeStartRef.current) return;
    
    // 使用requestAnimationFrame确保流畅的缩放动画
    requestAnimationFrame(() => {
      if (!resizeStartRef.current) return;
      
      const deltaX = e.clientX - resizeStartRef.current.startX;
      const deltaY = e.clientY - resizeStartRef.current.startY;
      
      if (isResizingHeight) {
        // 高度调整：向下拖拽增加高度，向上拖拽减少高度
        const newHeight = resizeStartRef.current.startHeight + deltaY;
        const minHeight = 180;
        const maxHeight = window.innerHeight - 80;
        const clampedHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));
        
        onHeightResize({ height: clampedHeight });
      } else if (isResizingCorner) {
        // 角落调整：同时调整宽度和高度
        const newWidth = resizeStartRef.current.startWidth + deltaX;
        const newHeight = resizeStartRef.current.startHeight + deltaY;
        
        const minWidth = 280;
        const maxWidth = window.innerWidth - 80;
        const minHeight = 180;
        const maxHeight = window.innerHeight - 80;
        
        const clampedWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
        const clampedHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));
        
        onCornerResize({ width: clampedWidth, height: clampedHeight });
      }
    });
  };
  
  // 处理调整结束
  const handleResizeEnd = () => {
    setIsResizingHeight(false);
    setIsResizingCorner(false);
    resizeStartRef.current = null;
  };
  
  // 监听全局鼠标事件
  useEffect(() => {
    if (isResizingHeight || isResizingCorner) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizingHeight, isResizingCorner]);
  
  return (
    <div
      className={`floating-preview-footer ${themeStyles.headerBg}`}
      style={{
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      {/* 左侧区域 - 占位 */}
      <div className="flex-1" />
      
      {/* 中间区域 - 高度调整把手 */}
      <div
        className="floating-preview-height-handle"
        onMouseDown={handleHeightResizeStart}
        style={{
          userSelect: 'none',
          touchAction: 'none',
        }}
        title="拖拽调整高度"
        aria-label="拖拽调整高度"
      >
        <div className={`floating-preview-height-handle-bar ${themeStyles.textColor}`} />
      </div>
      
      {/* 右侧区域 - 角落调整把手 */}
      <div className="flex-1 flex justify-end">
        <div
          className="floating-preview-corner-handle"
          onMouseDown={handleCornerResizeStart}
          style={{
            userSelect: 'none',
            touchAction: 'none',
          }}
          title="拖拽调整尺寸"
          aria-label="拖拽调整尺寸"
        >
          <div className={`floating-preview-corner-handle-icon ${themeStyles.borderColor}`} />
        </div>
      </div>
    </div>
  );
};

export default Footer;