import React, { useState, useRef, useEffect } from 'react';
import { ThemeStyles, ContentProps } from '../../types/floating-preview';

// Content组件 - 悬浮窗中部内容区
const Content: React.FC<ContentProps> = ({
  url,
  width,
  height,
  themeStyles,
  onWidthResize
}) => {
  // 调整状态管理
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // 调整起始位置记录
  const resizeStartRef = useRef<{ startX: number; startWidth: number } | null>(null);
  
  // 处理左侧宽度调整开始
  const handleLeftResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingLeft(true);
    resizeStartRef.current = {
      startX: e.clientX,
      startWidth: width
    };
  };
  
  // 处理右侧宽度调整开始
  const handleRightResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingRight(true);
    resizeStartRef.current = {
      startX: e.clientX,
      startWidth: width
    };
  };
  
  // 处理宽度调整移动
  const handleResizeMove = (e: MouseEvent) => {
    if (!resizeStartRef.current) return;
    
    const deltaX = e.clientX - resizeStartRef.current.startX;
    let newWidth;
    
    if (isResizingLeft) {
      // 左侧调整：向左拖拽增加宽度，向右拖拽减少宽度
      newWidth = resizeStartRef.current.startWidth - deltaX;
    } else if (isResizingRight) {
      // 右侧调整：向右拖拽增加宽度，向左拖拽减少宽度
      newWidth = resizeStartRef.current.startWidth + deltaX;
    } else {
      return;
    }
    
    // 限制最小和最大宽度
    newWidth = Math.max(300, Math.min(newWidth, window.innerWidth - 100));
    
    onWidthResize({ width: newWidth });
  };
  
  // 处理调整结束
  const handleResizeEnd = () => {
    setIsResizingLeft(false);
    setIsResizingRight(false);
    resizeStartRef.current = null;
  };
  
  // 处理iframe加载完成
  const handleIframeLoad = () => {
    setLoading(false);
    setError(false);
  };
  
  // 处理iframe加载错误
  const handleIframeError = () => {
    setLoading(false);
    setError(true);
  };
  
  // 监听全局鼠标事件
  useEffect(() => {
    if (isResizingLeft || isResizingRight) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizingLeft, isResizingRight]);
  
  // 计算内容区高度（总高度减去Header和Footer）
  const contentHeight = height - 50; // Header约40px，Footer约8px
  
  return (
    <div
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: themeStyles.backgroundColor,
        display: 'flex'
      }}
    >
      {/* 左侧宽度调整把手 */}
      <div
        style={{
          position: 'absolute',
          left: '0',
          top: '0',
          width: '4px',
          height: '100%',
          backgroundColor: 'transparent',
          cursor: 'ew-resize',
          zIndex: 10,
          borderLeft: `2px solid ${themeStyles.borderColor}`,
          opacity: 0.3
        }}
        onMouseDown={handleLeftResizeStart}
        title="拖拽调整宽度"
      />
      
      {/* 主要内容区域 - iframe容器 */}
      <div className="flex-1 relative mx-2">
        {/* 加载状态 */}
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '16px',
              color: themeStyles.textColor,
              opacity: 0.6
            }}
          >
            正在加载...
          </div>
        )}
        
        {/* 错误状态 */}
        {error && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '14px',
              color: '#dc3545',
              textAlign: 'center',
              padding: '20px'
            }}
          >
            <div>无法加载此页面</div>
            <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8 }}>
              可能由于X-Frame-Options限制或网络问题
            </div>
            <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.6 }}>
              请点击Header中的"在新标签页打开"按钮访问
            </div>
          </div>
        )}
        
        {/* iframe内容 */}
        <iframe
          src={url}
          className="w-full h-full border-0 rounded"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          title="预览内容"
        />
      </div>
      
      {/* 右侧宽度调整把手 */}
      <div
        style={{
          position: 'absolute',
          right: '0',
          top: '0',
          width: '4px',
          height: '100%',
          backgroundColor: 'transparent',
          cursor: 'ew-resize',
          zIndex: 10,
          borderRight: `2px solid ${themeStyles.borderColor}`,
          opacity: 0.3
        }}
        onMouseDown={handleRightResizeStart}
        title="拖拽调整宽度"
      />
    </div>
  );
};

export default Content;