import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import { ThemeStyles, FloatingPreviewSettings, FloatingPreviewProps } from '../../types/floating-preview';

// 优化的Header组件 - 使用React.memo避免不必要的重渲染
const MemoizedHeader = React.memo(Header);
const MemoizedContent = React.memo(Content);
const MemoizedFooter = React.memo(Footer);

// 悬浮窗组件 - 性能优化版本
const FloatingPreview: React.FC<FloatingPreviewProps> = ({
  url,
  settings,
  mousePosition,
  onClose
}) => {
  
  // 悬浮窗状态管理
  const [position, setPosition] = useState(() => {
    // 弹窗在容器中居中显示，由于容器已经通过CSS居中，这里设置为0
    return { x: 0, y: 0 }
  });
  const [size, setSize] = useState({ width: settings.width, height: settings.height });
  const [isPinned, setIsPinned] = useState(false); // 是否固定窗口
  const [isDragging, setIsDragging] = useState(false); // 是否正在拖拽
  const [isResizing, setIsResizing] = useState(false); // 是否正在调整大小
  const [isFollowingMouse, setIsFollowingMouse] = useState(true); // 是否跟随鼠标
  const [showOverlay, setShowOverlay] = useState(false); // 是否显示遮罩层
  
  // 高性能拖拽实现 - 使用ref避免setState触发重渲染
  const currentTransformRef = useRef({ x: 0, y: 0 }); // 当前transform位置
  const animationFrameRef = useRef<number | null>(null); // RAF引用
  
  // 防抖定时器引用
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // DOM引用
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  
  // 计算弹窗位置（跟随鼠标或拖拽位置）- 使用useCallback稳定引用
  const calculatePosition = useCallback(() => {
    if (!isFollowingMouse || isDragging) {
      // 如果不跟随鼠标或正在拖拽，使用当前position
      return position;
    }
    
    if (mousePosition) {
      // 跟随鼠标，添加偏移避免遮挡鼠标
      const offset = 20;
      let x = mousePosition.x + offset;
      let y = mousePosition.y + offset;
      
      return { x, y };
    }
    
    return position;
  }, [isFollowingMouse, isDragging, position, mousePosition]);

  // 根据主题获取样式类名 - 使用useCallback避免重复计算
  const getThemeStyles = useCallback((theme: 'light' | 'dark'): ThemeStyles => {
    if (theme === 'dark') {
      return {
        backgroundColor: 'bg-gray-900',
        borderColor: 'border-gray-700',
        textColor: 'text-white',
        headerBg: 'bg-gray-800',
        border: 'border-gray-700',
        bg: 'bg-gray-900'
      };
    }
    return {
      backgroundColor: 'bg-white',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-900',
      headerBg: 'bg-gray-50',
      border: 'border-gray-300',
      bg: 'bg-white'
    };
  }, []);
  
  const themeStyles = useMemo(() => getThemeStyles(settings.theme), [getThemeStyles, settings.theme]);
  
  // 高性能位置更新函数 - 直接操作DOM transform，避免React重渲染
  const updateTransformPosition = useCallback((x: number, y: number) => {
    if (containerRef.current) {
      // 使用transform: translate3d实现硬件加速的位置更新
      containerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      currentTransformRef.current = { x, y };
    }
  }, []);
  
  // 处理拖拽开始 - 优化版本
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (isResizing) return;
    
    setIsDragging(true);
    setIsFollowingMouse(false); // 开始拖拽时停止跟随鼠标
    setShowOverlay(true); // 拖拽开始时确保遮罩显示
    
    // 获取当前实际位置（考虑transform）
    const currentPos = currentTransformRef.current.x !== 0 || currentTransformRef.current.y !== 0 
      ? currentTransformRef.current 
      : calculatePosition();
    
    dragStartRef.current = {
      x: e.clientX - currentPos.x,
      y: e.clientY - currentPos.y
    };
    
    // 拖拽时禁用iframe的pointer-events，提升性能
    const iframe = containerRef.current?.querySelector('iframe');
    if (iframe) {
      (iframe as HTMLElement).style.pointerEvents = 'none';
    }
  }, [isResizing, calculatePosition]);
  
  // 处理拖拽结束 - 优化版本
  const handleDragEnd = useCallback((e?: MouseEvent) => {
    setIsDragging(false);
    dragStartRef.current = null;
    
    // 恢复iframe的pointer-events
    const iframe = containerRef.current?.querySelector('iframe');
    if (iframe) {
      (iframe as HTMLElement).style.pointerEvents = 'auto';
    }
    
    // 同步transform位置到React state（为了其他逻辑的一致性）
    setPosition({ 
      x: currentTransformRef.current.x, 
      y: currentTransformRef.current.y 
    });
    
    // 清除可能存在的防抖定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    // 添加短暂延迟，确保拖拽状态完全结束后再处理遮罩
    debounceTimerRef.current = setTimeout(() => {
      // 拖拽结束后，检查鼠标是否仍在悬浮窗上
      if (e && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isMouseOverWindow = (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        );
        
        // 只有确认鼠标不在悬浮窗上时才隐藏遮罩
        if (!isMouseOverWindow) {
          setShowOverlay(false);
        }
      }
      debounceTimerRef.current = null;
    }, 150); // 150ms延迟，确保状态稳定
  }, []);
  
  // 处理尺寸变化 - 优化响应性能，直接更新状态
  const handleResize = useCallback((newSize: { width?: number; height?: number }, positionChange?: { x?: number; y?: number }) => {
    // 直接更新尺寸
    setSize(prev => ({
      width: newSize.width ?? prev.width,
      height: newSize.height ?? prev.height
    }));
    
    // 如果有位置变化，使用高性能更新
    if (positionChange) {
      const newX = positionChange.x ?? currentTransformRef.current.x;
      const newY = positionChange.y ?? currentTransformRef.current.y;
      updateTransformPosition(newX, newY);
      setPosition({ x: newX, y: newY });
    }
  }, [updateTransformPosition]);
  
  // 处理固定状态切换
  const handleTogglePin = useCallback(() => {
    const newPinned = !isPinned;
    setIsPinned(newPinned);
    if (newPinned) {
      // 固定时停止跟随鼠标，保存当前transform位置
      setIsFollowingMouse(false);
      setPosition({ 
        x: currentTransformRef.current.x, 
        y: currentTransformRef.current.y 
      });
    } else {
      // 取消固定时恢复跟随鼠标
      setIsFollowingMouse(true);
    }
  }, [isPinned]);
  
  // 处理在新标签页打开
  const handleOpenInNewTab = useCallback(() => {
    window.open(url, '_blank');
  }, [url]);
  
  // 处理刷新
  const handleRefresh = useCallback(() => {
    // 通过重新设置iframe的src来刷新
    const iframe = containerRef.current?.querySelector('iframe');
    if (iframe) {
      const currentSrc = iframe.src;
      iframe.src = '';
      setTimeout(() => {
        iframe.src = currentSrc;
      }, 100);
    }
  }, []);
  
  // 高性能拖拽移动处理 - 使用RAF批量更新
  useEffect(() => {
    if (isDragging) {
      const handleHighPerformanceMouseMove = (e: MouseEvent) => {
        // 取消之前的RAF
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        
        // 使用RAF批量处理位置更新
        animationFrameRef.current = requestAnimationFrame(() => {
          if (dragStartRef.current) {
            const newX = e.clientX - dragStartRef.current.x;
            const newY = e.clientY - dragStartRef.current.y;
            
            // 直接更新transform，不触发React重渲染
            updateTransformPosition(newX, newY);
          }
        });
      };
      
      const handleDragEndWithEvent = (e: MouseEvent) => {
        // 清理RAF
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        handleDragEnd(e);
      };
      
      // 使用passive监听器提升性能
      document.addEventListener('mousemove', handleHighPerformanceMouseMove, { passive: true });
      document.addEventListener('mouseup', handleDragEndWithEvent);
      
      return () => {
        document.removeEventListener('mousemove', handleHighPerformanceMouseMove);
        document.removeEventListener('mouseup', handleDragEndWithEvent);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isDragging, updateTransformPosition, handleDragEnd]);
  
  // 清理资源
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // 处理点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isPinned) return;
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPinned, onClose]);
  
  // 使用useMemo缓存位置计算，减少重复计算
  const currentPosition = useMemo(() => calculatePosition(), [calculatePosition]);

  // 初始化transform位置
  useEffect(() => {
    if (!isDragging && (currentTransformRef.current.x !== currentPosition.x || currentTransformRef.current.y !== currentPosition.y)) {
      updateTransformPosition(currentPosition.x, currentPosition.y);
    }
  }, [currentPosition, isDragging, updateTransformPosition]);

  // 处理鼠标进入悬浮窗 - 添加防抖机制
  const handleMouseEnter = useCallback(() => {
    // 清除之前的延迟隐藏定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setShowOverlay(true);
  }, []);

  // 处理鼠标离开悬浮窗 - 优化拖拽时的遮罩状态，添加防抖机制
  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    // 如果正在拖拽，强制保持遮罩显示，避免闪烁
    if (isDragging) {
      return;
    }
    
    // 清除之前的定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // 使用防抖机制，避免快速移动时的意外隐藏
    debounceTimerRef.current = setTimeout(() => {
      // 再次检查是否仍在拖拽状态
      if (!isDragging) {
        setShowOverlay(false);
      }
      debounceTimerRef.current = null;
    }, 100); // 100ms延迟，提供稳定性
  }, [isDragging]);

  // 渲染遮罩层 - 拖拽时移除blur效果，显著提升性能
  const overlayElement = showOverlay ? (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 999998, // 小于悬浮窗的z-index
        backgroundColor: `rgba(0, 0, 0, ${settings.backgroundOpacity / 100})`, // 根据设置调整透明度
        // 拖拽时移除blur效果，避免GPU合成压力
        backdropFilter: isDragging ? 'none' : 'blur(8px)',
        WebkitBackdropFilter: isDragging ? 'none' : 'blur(8px)',
        // 拖拽时禁用过渡效果，避免闪烁
        transition: isDragging ? 'none' : 'all 0.3s ease-in-out'
      }}
    />
  ) : null;

  // 渲染悬浮窗 - 使用transform定位，优化性能
  const floatingWindow = (
    <>
      {overlayElement}
      <div
        ref={containerRef}
        className={`fixed overflow-hidden z-[10000] ${themeStyles.backgroundColor} ${themeStyles.borderColor} border-2 flex flex-col`}
        style={{
          width: size.width,
          height: size.height,
          // 使用transform定位，初始位置为(0,0)，实际位置由transform控制
          top: 0,
          left: 0,
          transform: `translate3d(${currentPosition.x}px, ${currentPosition.y}px, 0)`,
          cursor: isDragging ? 'grabbing' : 'default',
          opacity: settings.opacity,
          pointerEvents: 'auto',
          zIndex: 999999,
          // 拖拽时移除阴影和圆角，减少重绘成本
          boxShadow: isDragging ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          borderRadius: isDragging ? '0' : '0.5rem',
          // 优化过渡效果：拖拽时完全禁用过渡
          transition: isDragging ? 'none' : 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          // 硬件加速优化
          willChange: isDragging ? 'transform' : 'auto',
          // 强制创建合成层
          backfaceVisibility: 'hidden',
          perspective: '1000px'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header组件 - 固定高度40px */}
        <div className="flex-shrink-0">
          <MemoizedHeader
            url={url}
            isPinned={isPinned}
            themeStyles={themeStyles}
            onTogglePin={handleTogglePin}
            onRefresh={handleRefresh}
            onOpenInNewTab={handleOpenInNewTab}
            onClose={onClose}
            onDragStart={handleDragStart}
          />
        </div>
        
        {/* Content组件 - 占据剩余空间，减去Header(40px)的高度 */}
        <div className="flex-1 overflow-hidden">
          <MemoizedContent
            url={url}
            width={size.width}
            height={size.height - 40} // 减去Header(40px)的高度
            themeStyles={themeStyles}
          />
        </div>
      </div>
    </>
  );

  // 使用Portal渲染到body
  return createPortal(floatingWindow, document.body);
};

export default FloatingPreview;