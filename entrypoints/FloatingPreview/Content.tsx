import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ThemeStyles, ContentProps } from '../../types/floating-preview';

// Content组件 - 悬浮窗内容区域，包含iframe和左右拖拽把手
const Content: React.FC<ContentProps> = ({ url, width, height, themeStyles, currentPosition, onWidthResize }) => {
  // 调整状态管理
  const [isResizingLeft, setIsResizingLeft] = useState(false); // 左侧宽度调整状态
  const [isResizingRight, setIsResizingRight] = useState(false); // 右侧宽度调整状态
  const [loading, setLoading] = useState(true); // 加载状态
  const [error, setError] = useState(false); // 错误状态
  
  // 调整起始位置记录和性能优化refs
  const resizeStartRef = useRef<{ startX: number; startWidth: number; startY?: number } | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  
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
  
  // 处理宽度调整移动 - 优化流畅性和响应性能，添加节流机制
  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizeStartRef.current) return;
    
    // 节流机制：限制更新频率到60fps
    const now = performance.now();
    if (now - lastUpdateTimeRef.current < 16) return;
    
    // 取消之前的动画帧
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // 使用requestAnimationFrame确保流畅的调整动画
    animationFrameRef.current = requestAnimationFrame(() => {
      if (!resizeStartRef.current) return;
      
      const deltaX = e.clientX - resizeStartRef.current.startX;
      let newWidth;
      let positionChange: { x?: number; y?: number } | undefined;
      
      if (isResizingLeft) {
        // 左侧调整：向左拖拽增加宽度，向右拖拽减少宽度
        newWidth = resizeStartRef.current.startWidth - deltaX;
        // 左侧拖拽时，需要同时调整位置以保持右边界不动
        // 当向左拖拽时(deltaX < 0)，宽度增加，位置需要向左移动相同距离
        // 当向右拖拽时(deltaX > 0)，宽度减少，位置需要向右移动相同距离
        const actualWidthChange = newWidth - resizeStartRef.current.startWidth;
        positionChange = { x: currentPosition.x - actualWidthChange };
      } else if (isResizingRight) {
        // 右侧调整：向右拖拽增加宽度，向左拖拽减少宽度
        newWidth = resizeStartRef.current.startWidth + deltaX;
      } else {
        return;
      }
      
      // 限制最小和最大宽度，添加更合理的边界
      const minWidth = 280;
      const maxWidth = window.innerWidth - 80;
      newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
      
      // 只有宽度真正改变时才触发更新
      if (Math.abs(newWidth - width) > 1) {
        onWidthResize({ width: newWidth }, positionChange);
        lastUpdateTimeRef.current = now;
      }
    });
  }, [isResizingLeft, isResizingRight, width, onWidthResize]);
  
  // 处理调整结束
  const handleResizeEnd = useCallback(() => {
    // 清理动画帧
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    setIsResizingLeft(false);
    setIsResizingRight(false);
    resizeStartRef.current = null;
    lastUpdateTimeRef.current = 0;
  }, []);
  
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
  
  return (
    <div
      className={`relative ${themeStyles.bg} flex`}
      style={{
        width: `${width}px`,
        height: `${height}px`
      }}
    >
      {/* 左侧容器 - 包含左侧调整把手，优化交互体验 */}
      <div
        className={`w-3 h-full cursor-ew-resize flex-shrink-0 flex items-center justify-center group hover:bg-blue-400 hover:bg-opacity-20 transition-all duration-200 ease-out ${isResizingLeft ? 'bg-blue-500 bg-opacity-30 shadow-lg' : ''}`}
        onMouseDown={handleLeftResizeStart}
        title="向左拖拽扩展宽度"
        style={{
          // 添加硬件加速和3D变换
          transform: isResizingLeft ? 'translateZ(0) scale(1.1)' : 'translateZ(0)',
          willChange: 'transform, background-color',
          backfaceVisibility: 'hidden',
          perspective: '1000px'
        }}
      >
        {/* 左侧调整指示器 - 增强视觉反馈和方向提示 */}
        <div className={`relative flex flex-col items-center space-y-1`}>
          <div className={`w-1 h-8 ${themeStyles.border.replace('border-', 'bg-')} opacity-50 group-hover:opacity-90 rounded-full transition-all duration-200 ${isResizingLeft ? 'opacity-100 bg-blue-500 shadow-md' : ''}`} />
          {/* 方向箭头指示器 */}
          <div className={`w-0 h-0 border-t-2 border-r-2 border-transparent ${isResizingLeft ? 'border-r-blue-500' : themeStyles.border.replace('border-', 'border-r-')} opacity-60 group-hover:opacity-90 transition-all duration-200 transform rotate-180`} style={{ borderLeftWidth: '4px' }} />
        </div>
      </div>
      
      {/* 中间容器 - 主要内容区域iframe容器 */}
      <div className="flex-1 relative">
        {/* 加载状态 */}
        {loading && (
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-base ${themeStyles.textColor} opacity-60`}>
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              <span>正在加载...</span>
            </div>
          </div>
        )}
        
        {/* 错误状态 */}
        {error && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-5">
            <div className="text-red-500 text-sm mb-2">
              <div className="mb-2">⚠️ 无法加载此页面</div>
              <div className="text-xs opacity-80 mb-1">
                可能由于X-Frame-Options限制或网络问题
              </div>
              <div className="text-xs opacity-60">
                请点击Header中的"在新标签页打开"按钮访问
              </div>
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
      
      {/* 右侧容器 - 包含右侧调整把手，优化交互体验 */}
      <div
        className={`w-3 h-full cursor-ew-resize flex-shrink-0 flex items-center justify-center group hover:bg-blue-400 hover:bg-opacity-20 transition-all duration-200 ease-out ${isResizingRight ? 'bg-blue-500 bg-opacity-30 shadow-lg' : ''}`}
        onMouseDown={handleRightResizeStart}
        title="向右拖拽扩展宽度"
        style={{
          // 添加硬件加速和3D变换
          transform: isResizingRight ? 'translateZ(0) scale(1.1)' : 'translateZ(0)',
          willChange: 'transform, background-color',
          backfaceVisibility: 'hidden',
          perspective: '1000px'
        }}
      >
        {/* 右侧调整指示器 - 增强视觉反馈和方向提示 */}
        <div className={`relative flex flex-col items-center space-y-1`}>
          <div className={`w-1 h-8 ${themeStyles.border.replace('border-', 'bg-')} opacity-50 group-hover:opacity-90 rounded-full transition-all duration-200 ${isResizingRight ? 'opacity-100 bg-blue-500 shadow-md' : ''}`} />
          {/* 方向箭头指示器 */}
          <div className={`w-0 h-0 border-t-2 border-l-2 border-transparent ${isResizingRight ? 'border-l-blue-500' : themeStyles.border.replace('border-', 'border-l-')} opacity-60 group-hover:opacity-90 transition-all duration-200`} style={{ borderRightWidth: '4px' }} />
        </div>
      </div>
    </div>
  );
};

export default Content;